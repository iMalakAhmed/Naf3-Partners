"use client";

import { useState } from "react";
import Sidenav, { BottomNav } from "../components/ui/Sidenav";

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
        className={`min-h-screen transition-[padding] duration-300 ease-in-out pl-0 ${
          isOpen ? "md:pl-72" : "md:pl-24"
        }`}
      >
        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 pb-24 sm:px-6 md:pb-6 lg:px-8">
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
