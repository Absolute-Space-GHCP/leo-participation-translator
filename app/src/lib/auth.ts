/**
 * @file auth.ts
 * @description NextAuth configuration with Google OAuth + email allowlist
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-13
 * @updated 2026-02-13
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Allowlisted email addresses that can access the dashboard.
 * Add new users here as needed.
 */
const ALLOWED_EMAILS: string[] = [
  "charleys@johannesleonardo.com",
  "leop@johannesleonardo.com",
  "janj@johannesleonardo.com",
];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    /**
     * Control who can sign in. Only allowlisted emails are permitted.
     */
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = ALLOWED_EMAILS.includes(user.email.toLowerCase());
      if (!allowed) {
        console.warn(
          `[auth] Sign-in denied for ${user.email} — not in allowlist`
        );
      }
      return allowed;
    },

    /**
     * Attach email to the session so middleware and pages can access it.
     */
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
      }
      return session;
    },

    /**
     * Persist email in the JWT token.
     */
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
