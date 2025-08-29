import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import {jwtDecode} from "jwt-decode"; 

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

          const res = await fetch("https://localhost:7225/api/User/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            console.error("Non-JSON response from server:", text);
            throw new Error("Unexpected server response");
          }

          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }
          let role = undefined;
          if(data.token){
            const decode = jwtDecode(data.token);
             role= decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          }
          // role = data.role || "user";
          

          return {
            id: data.username,
            name: credentials?.username || "",
            accessToken: data.token,
            role: role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string ;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
