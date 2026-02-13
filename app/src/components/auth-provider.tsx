/**
 * @file auth-provider.tsx
 * @description Session provider wrapper for NextAuth
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-13
 * @updated 2026-02-13
 */

"use client";

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  return <SessionProvider>{children}</SessionProvider>;
}
