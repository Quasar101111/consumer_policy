// export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  
//   if (typeof window === "undefined") {
//     return fetch(input, init);
//   }


//   const token = localStorage.getItem("token");


//   const headers = new Headers(init.headers || {});
//   if (token) {
//     headers.set("Authorization", `Bearer ${token}`);
//   }


//   const response = await fetch(input, {
//     ...init,
//     headers,
//     credentials: "include", // send cookies cross-origin if needed
//   });


//   let urlPath = "";
//   if (typeof input === "string") {
//     try {
//       urlPath = new URL(input, window.location.origin).pathname;
//     } catch {
//       // fallback if input is relative path
//       urlPath = input;
//     }
//   } else if ("url" in input) {
//     try {
//       urlPath = new URL(input.url, window.location.origin).pathname;
//     } catch {
//       urlPath = input.url;
//     }
//   }


//   if (
//     response.status === 401 &&
//     urlPath !== "/api/auth/login" &&
//     urlPath !== "/api/auth/register"
//   ) {
 
//     localStorage.removeItem("token");
   

   
//     const currentPath = window.location.pathname;
//     window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;

//     return Promise.reject(new Error("Unauthorized: redirecting to login"));
//   }

//   return response;
// }
// utils/authFetch.ts
import { getSession } from "next-auth/react";

export async function authFetch(url: string, options: RequestInit = {}) {
  const session = await getSession();
  console.log("Session in authFetch:", session);

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

   if (response.status === 401) {
    const error = new Error("Unauthorized");
    error.name = "AuthError";
    throw error;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}