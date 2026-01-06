"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOGIN_ENDPOINT =
  "https://nafaa-frfve0gyfyatgzh0.uaenorth-01.azurewebsites.net/api/auth/partner/login";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          branch,
          password,
        }),
      });

      if (!response.ok) {
        const message =
          (await response.text()) || "Login failed. Please try again.";
        throw new Error(message);
      }

      const data = await response.json();
      if (data?.token) {
        localStorage.setItem("partner_token", data.token);
      }
      const trimmedName = name.trim();
      const trimmedBranch = branch.trim();
      if (trimmedName) {
        localStorage.setItem("partner_name", trimmedName);
      }
      if (trimmedBranch) {
        localStorage.setItem("partner_branch", trimmedBranch);
      }

      router.push("/dashboard");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7f5] px-4 py-10 text-zinc-900 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob rounded-full bg-[#006B6A]/20 blur-3xl" />
        <div className="animation-delay-2000 absolute -right-28 -top-20 h-96 w-96 animate-blob rounded-full bg-[#19BBB6]/25 blur-3xl" />
        <div className="animation-delay-4000 absolute -bottom-24 left-12 h-96 w-96 animate-blob rounded-full bg-[#FFC012]/20 blur-3xl" />
        <div className="animation-delay-6000 absolute -bottom-24 -right-24 h-96 w-96 animate-blob rounded-full bg-[#006B6A]/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#19BBB6]/20 bg-white shadow-[0_30px_90px_-50px_rgba(0,107,106,0.5)] lg:flex-row">
        <section className="relative flex-1 bg-[linear-gradient(135deg,#006B6A_0%,#19BBB6_55%,#FFC012_120%)] p-8 text-white sm:p-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-6 top-10 h-36 w-36 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-10 right-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/80">
              Naf3 Partners
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Welcome back.
              <span className="block text-[#FFC012]">
                Manage requests, rewards, and impact.
              </span>
            </h1>
            <p className="text-sm text-white/85">
              Access your partner dashboard to review redemptions, monitor
              points, and coordinate with your branch team.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/85">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs">
                  01
                </span>
                Access rewards, requests, and daily partner operations.
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs">
                  02
                </span>
                Track rewards, requests, and performance.
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs">
                  03
                </span>
                Use the credentials provided by the Naf3 admin team.
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 px-6 py-10 sm:px-10 sm:py-12">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-[#006B6A]">
              Partner Login
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Sign in to your branch
            </h2>
            <p className="text-sm text-zinc-500">
              Use the credentials provided by the Naf3 admin team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-zinc-700">
              Name
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                placeholder="Partner name"
                required
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Branch
              <input
                type="text"
                autoComplete="organization"
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                placeholder="Branch name"
                required
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                placeholder="Enter your password"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#006B6A] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/30 transition hover:bg-[#19BBB6] disabled:cursor-not-allowed disabled:bg-[#19BBB6]/50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
