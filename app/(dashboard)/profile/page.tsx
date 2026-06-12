"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RecentRedemption = {
  virtualCardCode: string;
  nationalId: string;
  employeeName: string;
  amount: number;
  timestamp: string;
};

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState("Partner");
  const [branchName, setBranchName] = useState("Branch");
  const [recentRedemptions, setRecentRedemptions] = useState<RecentRedemption[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    router.push("/auth/login");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("partner_name")?.trim();
    const storedBranch = localStorage.getItem("partner_branch")?.trim();
    if (storedName) setPartnerName(storedName);
    if (storedBranch) setBranchName(storedBranch);

    const storedRedemptions = localStorage.getItem("recent_redeems");
    if (!storedRedemptions) return;
    try {
      const parsed = JSON.parse(storedRedemptions) as RecentRedemption[];
      if (Array.isArray(parsed)) {
        setRecentRedemptions(parsed.slice(0, 4));
      }
    } catch {
      setRecentRedemptions([]);
    }
  }, []);

  const totalRecentAmount = recentRedemptions.reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0
  );
  const lastRedemption = recentRedemptions[0]?.timestamp
    ? formatDateTime(recentRedemptions[0].timestamp)
    : "-";

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-[#006B6A]/20 bg-[linear-gradient(120deg,#0d5f5a,#19BBB6)] px-5 py-7 text-white shadow-[0_28px_70px_-45px_rgba(0,107,106,0.6)] sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Profile
            </p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              {partnerName}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {branchName} - Partner
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-200 bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-900/15 transition hover:bg-red-600"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-35px_rgba(0,107,106,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Branch
          </p>
          <p className="mt-3 text-xl font-semibold text-zinc-900">{branchName}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-35px_rgba(0,107,106,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Recent redemptions
          </p>
          <p className="mt-3 text-xl font-semibold text-zinc-900">
            {recentRedemptions.length}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-35px_rgba(0,107,106,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Recent total
          </p>
          <p className="mt-3 text-xl font-semibold text-zinc-900">
            {totalRecentAmount.toLocaleString()} EGP
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_-38px_rgba(0,107,106,0.35)] sm:p-8">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Branch details
            </p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">
              Organization information
            </h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Partner name
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                {partnerName}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Branch name
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                {branchName}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-[#19BBB6]/20 bg-[#f4fbfa] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#006B6A]">
              Last redemption
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">{lastRedemption}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_-38px_rgba(0,107,106,0.35)] sm:p-8">
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Quick actions
            </p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">
              Partner tools
            </h3>
          </div>
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => router.push("/redeem-points")}
              className="rounded-2xl bg-[#006B6A] px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/20 transition hover:bg-[#19BBB6]"
            >
              Redeem points
            </button>
            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition hover:border-[#19BBB6] hover:text-[#006B6A]"
            >
              View transactions
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_-38px_rgba(0,107,106,0.35)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Recent activity
            </p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">
              Latest local redemptions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => router.push("/transactions")}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-[#19BBB6] hover:text-[#006B6A]"
          >
            View all
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {recentRedemptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No recent redemptions on this device.
            </div>
          ) : (
            recentRedemptions.map((item) => (
              <div
                key={`${item.virtualCardCode}-${item.timestamp}`}
                className="grid gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4 sm:grid-cols-[1fr,auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {item.employeeName || item.virtualCardCode || "Redemption"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDateTime(item.timestamp)}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#006B6A]">
                  {item.amount.toLocaleString()} EGP
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
