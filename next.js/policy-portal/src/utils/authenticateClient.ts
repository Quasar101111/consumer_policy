import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
export async function getAuthenticatedUsername(
  status: string,
  session: any
): Promise<{username:string; role:string} | null> {
  
  if (status === "authenticated" && session?.user?.name) {
   return {
      username: session.user.name,
      role: session.user.role, 
    };
  }

  if (status === "unauthenticated") {
    console.warn("User is not authenticated, redirecting to login");

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  return null;
}



export  function getAuthenticatedRole(): string| null{
  const { data: session } =  useSession();
 

  return session?.user?.role ?? null ;

}