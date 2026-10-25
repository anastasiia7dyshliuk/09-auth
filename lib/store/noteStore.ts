import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

export interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

type NoteStore = {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

// persist зберігає чернетку в localStorage, щоб вона не губилась при перезавантаженні
export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
