import type { Metadata } from 'next';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? 'All' : slug[0];

  return {
    title: `${tag} notes | NoteHub`,
    description: `Browse notes filtered by: ${tag}.`,
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  // SSR: попередньо завантажуємо першу сторінку, щоб передати її клієнту
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', tag }],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
