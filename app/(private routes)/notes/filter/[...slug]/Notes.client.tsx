'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import css from '@/components/NotesPage/NotesPage.module.css';
import tagsCss from './NotesTags.module.css';

const TAGS = ['all', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Debounce: оновлюємо search лише через 400 мс після останнього символу
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: () => fetchNotes({ page, search, tag }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={setSearchInput} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      <nav className={tagsCss.tags} aria-label="Tags">
        {TAGS.map((item) => (
          <Link
            key={item}
            href={`/notes/filter/${item}`}
            className={tagsCss.tagLink}
          >
            {item === 'all' ? 'All notes' : item}
          </Link>
        ))}
      </nav>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.notes.length === 0 && <p>No notes found.</p>}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
