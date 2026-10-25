import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'Create a new note in NoteHub.',
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <h1 className={css.title}>Create note</h1>
      <NoteForm />
    </main>
  );
}
