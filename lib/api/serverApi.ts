import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

// На сервері браузер не додає куки автоматично, тому передаємо їх у headers вручну
const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search, tag } = params;
  const headers = await getCookieHeader();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getCookieHeader();
  const { data } = await api.get<User>('/users/me', { headers });
  return data;
};

// Повертаємо повну відповідь (не лише data), бо proxy потрібні заголовки set-cookie
export const checkSession = async () => {
  const headers = await getCookieHeader();
  return api.get<{ success: boolean }>('/auth/session', { headers });
};
