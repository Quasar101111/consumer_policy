
// utils/authFetch.ts
import { getSession, signOut } from "next-auth/react";
import { notFound } from "next/navigation";

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


// utils/authFetchServer.ts
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export async function authFetch1(url: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  
  // Skip SSL certificate validation in development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

  if (!session?.accessToken) {
    
    redirect("/login");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
    
  });

      if (response.status === 401 || response.status === 403) {
    console.warn(`Unauthorized (${response.status}). Redirecting to login.`);
    redirect("/login");
  }
    else if(response.status === 500){
    notFound();
  }
  if (!response.ok) {
    throw new Error(`Failed with status ${response.status},${response.statusText}`);
  }
  return response;
}
