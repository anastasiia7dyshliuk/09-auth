'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. Перевіряємо, чи сесія валідна
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          // 2. Сесія валідна — отримуємо дані користувача і кладемо в стор
          const user = await getMe();
          setUser(user);
        } else {
          // 3. Сесія невалідна — очищаємо стор
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
