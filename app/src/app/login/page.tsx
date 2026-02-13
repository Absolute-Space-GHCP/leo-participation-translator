/**
 * @file page.tsx
 * @description Login page with Google OAuth — JL branded, restricted access
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-13
 * @updated 2026-02-13
 */

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { ReactNode } from "react";
import { Sparkles, Shield, ArrowRight } from "lucide-react";

function LoginContent(): ReactNode {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  function handleSignIn(): void {
    setLoading(true);
    signIn("google", { callbackUrl });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111]">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#166AD8]/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#079176]/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Branding */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F1F1]/10 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-[#F1F1F1]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#F1F1F1]">
            The Participation Translator
          </h1>
          <p className="text-sm text-[#F1F1F1]/65">
            Johannes Leonardo &middot; Internal Tool
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#F1F1F1]/10 bg-[#F1F1F1]/5 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2 text-[#F1F1F1]/75">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Authorized Access Only
            </span>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-[#FF4133]/30 bg-[#FF4133]/10 px-4 py-3 text-sm text-[#FF4133]">
              {error === "AccessDenied"
                ? "Your account is not authorized. Contact Charley Scholz for access."
                : "An error occurred during sign-in. Please try again."}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#F1F1F1] px-6 py-4 text-base font-semibold text-[#111111] transition-all hover:bg-white hover:shadow-lg hover:shadow-white/10 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#111111]/20 border-t-[#111111]" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-[#F1F1F1]/40">
            Use your @johannesleonardo.com account
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#F1F1F1]/25">
          <p>&copy; {new Date().getFullYear()} Catchfire. All rights reserved.</p>
          <p className="mt-1">Built by Charley Scholz</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111111]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F1F1F1]/20 border-t-[#F1F1F1]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
