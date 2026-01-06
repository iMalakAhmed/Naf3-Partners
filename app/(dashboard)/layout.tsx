"use client";

import { useState } from "react";
import Sidenav from "../components/ui/Sidenav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <Sidenav isOpen={isOpen} toggleSidebar={() => setIsOpen((o) => !o)} />
      <div
        className={`min-h-screen transition-[padding] duration-300 ease-in-out ${
          isOpen ? "pl-64" : "pl-20"
        }`}
      >
        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <header className="rounded-[28px] border border-[#19BBB6]/15 bg-white px-6 py-5 shadow-[0_20px_50px_-40px_rgba(0,107,106,0.35)]">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Charity Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
              Welcome back, partner team.
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Keep an eye on redemptions, balances, and branch activity.
            </p>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
