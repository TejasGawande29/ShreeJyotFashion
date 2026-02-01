'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Don't redirect while checking auth state
    if (isLoading) {
      return;
    }

    // Redirect to login if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const loginUrl = redirectTo || `/login?redirect=${encodeURIComponent(pathname || '/')}`;
      router.push(loginUrl);
      return;
    }

    // Redirect to home if admin access is required but user is not admin
    if (requireAdmin && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, isLoading, requireAuth, requireAdmin, router, pathname, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render admin content if not admin
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for easier usage
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
