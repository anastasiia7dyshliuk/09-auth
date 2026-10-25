import css from './Home.module.css';

export default function Home() {
  return (
    <main className={css.main}>
      <h1 className={css.title}>Welcome to NoteHub</h1>
      <p className={css.description}>
        NoteHub is a simple and efficient application designed for managing
        personal notes. Sign in to start organizing your thoughts.
      </p>
    </main>
  );
}
