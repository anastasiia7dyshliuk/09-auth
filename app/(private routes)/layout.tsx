'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  modal?: React.ReactNode;
};

export default function PrivateLayout({ children, modal }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return (
    <>
      {loading ? <div>Loading...</div> : children}
      {modal}
    </>
  );
}
