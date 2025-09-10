'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';


export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Remove items from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');

signOut({ callbackUrl: '/login' });
  
    // Redirect after localStorage is cleared
    // router.push('/login');
  }, [router]); 

  return null; 
}
