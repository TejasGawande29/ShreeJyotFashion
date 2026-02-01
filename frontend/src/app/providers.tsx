'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ThemeProvider } from 'next-themes';
import { loadUserFromStorage } from '@/lib/redux/slices/authSlice';

// Component to load user from storage on app startup
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user and token from localStorage on app startup
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}
