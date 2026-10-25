import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'NoteHub — simple and efficient application for managing notes.',
  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub — simple and efficient application for managing notes.',
    url: process.env.NEXT_PUBLIC_API_URL,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider всередині TanStackProvider і обгортає весь контент */}
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
