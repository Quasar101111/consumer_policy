import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://localhost:7225/api/User/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (res.ok && data?.token) {
          return {
            id: data.id,
            name: data.username,
            accessToken: data.token,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add accessToken to the token on login
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach accessToken to session object
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
