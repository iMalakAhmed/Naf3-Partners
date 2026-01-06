"use client";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    router.push("/auth/login");
  };

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-[#19BBB6]/15 bg-white shadow-[0_24px_60px_-45px_rgba(0,107,106,0.5)]">
        <div className="relative bg-[linear-gradient(120deg,#006B6A_0%,#19BBB6_55%,#FFC012_120%)] px-6 py-8 text-white sm:px-8">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
          </div>
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-semibold">
              AC
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                Profile
              </p>
              <h2 className="text-2xl font-semibold">Ahmed Corp</h2>
              <p className="text-sm text-white/80">Cairo Branch • Partner</p>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25">
                Edit profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-[22px] border border-[#19BBB6]/15 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Branch details
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                    Organization information
                  </h3>
                </div>
                <span className="rounded-full bg-[#006B6A]/10 px-3 py-1 text-xs font-semibold text-[#006B6A]">
                  Active
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Branch name
                  <input
                    defaultValue="Cairo Branch"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#f7fbfb] px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Partner name
                  <input
                    defaultValue="Ahmed Corp"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#f7fbfb] px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Branch email
                  <input
                    defaultValue="cairo.branch@naf3.org"
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#f7fbfb] px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Phone number
                  <input
                    defaultValue="+20 10 1234 5678"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#f7fbfb] px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-5">
                <button className="rounded-2xl bg-[#006B6A] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/30 transition hover:bg-[#19BBB6]">
                  Save changes
                </button>
                <button className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition hover:border-[#006B6A] hover:text-[#006B6A]">
                  Cancel
                </button>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#19BBB6]/15 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Contact person
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Primary branch contact
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Name
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    Amina Soliman
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Role
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    Branch manager
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Hours
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[22px] border border-[#19BBB6]/15 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Account overview
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Performance snapshot
              </h3>
              <div className="mt-5 space-y-4 text-sm text-zinc-600">
                <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <span>Active staff</span>
                  <span className="font-semibold text-zinc-900">12</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <span>Monthly approvals</span>
                  <span className="font-semibold text-zinc-900">38</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <span>Average approval time</span>
                  <span className="font-semibold text-zinc-900">2h 10m</span>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#19BBB6]/15 bg-[#FFF8E5] p-5 text-sm text-[#6B4A00]">
              Keep your contact info current so the Naf3 team can reach you
              quickly about approvals.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
