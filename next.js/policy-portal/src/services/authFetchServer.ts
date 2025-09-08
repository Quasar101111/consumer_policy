
// utils/authFetchServer.ts
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

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
