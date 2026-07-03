import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Single-admin credentials auth. The admin account is defined by env vars:
//   ADMIN_USERNAME        — chosen username
//   ADMIN_PASSWORD_HASH   — bcrypt hash (generate: npm run hash:password "pw")
//   NEXTAUTH_SECRET       — 32+ char random string
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8h
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const username = process.env.ADMIN_USERNAME;
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!username || !hash) return null;
        if (!credentials?.username || !credentials.password) return null;
        if (credentials.username !== username) return null;
        if (!bcrypt.compareSync(credentials.password, hash)) return null;
        return { id: "admin", name: username, role: "admin" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token.role as string) ?? "admin";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
