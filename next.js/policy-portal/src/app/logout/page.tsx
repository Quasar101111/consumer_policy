'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Remove items from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    // Redirect after localStorage is cleared
    router.push('/login');
  }, [router]); 

  return null; 
}
