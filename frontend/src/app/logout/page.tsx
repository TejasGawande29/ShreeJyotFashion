'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { logoutUser } from '@/lib/redux/slices/authSlice';
import { toast } from 'react-hot-toast';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Clear auth state
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    
    // Redirect to login after 1 second
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
