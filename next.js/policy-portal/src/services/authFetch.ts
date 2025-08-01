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
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  let token: string | null = null;

  // Server-side token extraction
  if (typeof window === "undefined") {
    const jwt = await getToken({ req: { cookies }, secret: process.env.NEXTAUTH_SECRET });
    token = jwt?.accessToken ?? null;
  } else {
    // Optional client-side fallback
    token = localStorage.getItem("token");
  }

  // Append Authorization header
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include", // for cross-origin cookie use
  });

  // Optional: handle unauthorized on client
  if (typeof window !== "undefined" && response.status === 401) {
    localStorage.removeItem("token"); // optional cleanup
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    return Promise.reject(new Error("Unauthorized: redirecting to login"));
  }

  return response;
}
