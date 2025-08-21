// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { NextAuthOptions } from "next-auth";

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//      async authorize (credentials) {
//         try {
//             process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
//           const res = await fetch("https://localhost:7225/api/User/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               username: credentials?.username,
//               password: credentials?.password,
//             }),
//           });

//           // Get response data
//           const text = await res.text();
// let data;

// try {
//   data = JSON.parse(text);
// } catch {
//   console.error("Non-JSON response from server:", text);
//   throw new Error("Unexpected server response");
// }

// if (!res.ok) {
//   throw new Error(data.message || "Authentication failed");
// }
          
//           return {
//            id: data.username,
//             name: credentials?.username || "",
//             accessToken: data.token
//           };
//         } catch (error) {
//           console.error("Authorization error:", error);
//           return null;
//         }
//       }
//     }),
//   ],
//    pages: {
//     signIn: '/login',
//     error: '/login',
//   },
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // Add accessToken to the token on login
//       if (user?.accessToken) {
//         token.accessToken = user.accessToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Attach accessToken to session object
//       if (token?.accessToken) {
//         session.accessToken = token.accessToken as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST, authOptions };
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};
