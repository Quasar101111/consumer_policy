
// utils/authFetch.ts
import { getSession, signOut } from "next-auth/react";


export async function authFetch(url: string, options: RequestInit = {}) {
  const session = await getSession();


  if (!session?.accessToken) {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    throw new Error("No access token available, redirecting to login");
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${session.accessToken}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

   if (response.status === 401 || response.status === 403) {
     if (typeof window !== "undefined") {
     console.warn("401 Forbidden logging out");
     
    const currentPath = window.location.pathname;
    console.log("Redirecting to login:", currentPath);
    signOut({callbackUrl: `/login?redirect=${encodeURIComponent(currentPath)}`});
      
     throw new Error("Unauthorized or Forbidden"); 
    
  }
    
  }

  return response;
}

