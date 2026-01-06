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
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Animated Blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-blob rounded-full bg-[#006B68]/20 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-2000 absolute -right-20 -top-20 h-96 w-96 animate-blob rounded-full bg-[#19BBB6]/20 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-4000 absolute -bottom-20 left-20 h-96 w-96 animate-blob rounded-full bg-[#FFC012]/20 mix-blend-multiply blur-3xl filter" />
        <div className="animation-delay-6000 absolute -bottom-20 -right-20 h-96 w-96 animate-blob rounded-full bg-[#006B68]/20 mix-blend-multiply blur-3xl filter" />
      </div>

      {/* Language Toggle */}
      <div className="absolute right-6 top-6 z-20 flex gap-2">
        <button className="rounded-lg bg-white/80 px-4 py-2 text-sm font-semibold text-[#006B68] shadow-lg backdrop-blur-sm transition-all hover:bg-white">
          EN
        </button>
        <button className="rounded-lg bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white/80">
          العربية
        </button>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-white/90 px-8 py-12 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006B68] to-[#19BBB6] shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Log In</h1>
            <p className="text-gray-600">Enter your personal details.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Name */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-[#006B68]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-4 pl-12 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#19BBB6]"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-[#006B68]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  autoComplete="organization"
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-4 pl-12 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#19BBB6]"
                  placeholder="Branch"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-[#006B68]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#19BBB6]"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#006B68] py-4 font-semibold text-white transition-all hover:bg-[#006B68]/90 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
