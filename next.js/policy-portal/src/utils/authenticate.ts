// utils/getAuthenticatedUsername.ts

export async function getAuthenticatedUsername(
  status: string,
  session: any
): Promise<string | null> {
  if (status === "authenticated" && session?.user?.name) {
    return session.user.name;
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


export async function getAuthenticatedUsername1(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.name) {
    redirect("/login"); 
  }

  return session.user.name;
}
