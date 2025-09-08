// utils/getAuthenticatedUsername.ts

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

export async function getAuthenticatedRole1(): Promise<string| null>{
const session= await getServerSession(authOptions);

  return session?.user.role || null ;

}

