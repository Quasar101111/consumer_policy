// utils/getAuthenticatedUsername.ts

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
// utils/getAuthenticatedUsernameServer.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";


export async function getAuthenticatedUsername1(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.name) {
    redirect("/login"); 
  }

  return session.user.name;
}

export  function getAuthenticatedRole(): string| null{
  const { data: session } =  useSession();
 

  return session?.user?.role ?? null ;

}
export async function getAuthenticatedRole1(): Promise<string| null>{
const session= await getServerSession(authOptions);

  return session?.user.role || null ;

}

