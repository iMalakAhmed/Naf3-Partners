"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  key: "dashboard" | "transactions" | "redeemPoints" | "profile";
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    label: "Transaction Dashboard",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M4 11h7V4H4v7Zm9 9h7v-7h-7v7ZM4 20h7v-7H4v7Zm9-9h7V4h-7v7Z"
        />
      </svg>
    ),
  },
  {
    key: "transactions",
    href: "/transactions",
    label: "Transactions",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M7 7h10V5H7v2Zm10 10H7v2h10v-2Zm2-6H5v2h14v-2Z"
        />
      </svg>
    ),
  },
  {
    key: "redeemPoints",
    href: "/redeem-points",
    label: "Redeem Points",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M12 4a8 8 0 1 0 8 8A8.01 8.01 0 0 0 12 4Zm.75 12.5h-1.5v-1.38a3.52 3.52 0 0 1-2.62-2.05l1.39-.8a2.02 2.02 0 0 0 1.92 1.23c.78 0 1.56-.39 1.56-1.09 0-.58-.43-.91-1.72-1.22-1.49-.37-3.04-.87-3.04-2.71a2.7 2.7 0 0 1 2.59-2.56V7.5h1.5v1.39a3.16 3.16 0 0 1 2.2 1.66l-1.33.86a1.78 1.78 0 0 0-1.61-.87c-.73 0-1.4.36-1.4.94 0 .6.62.84 1.9 1.17 1.37.36 2.86.9 2.86 2.77a2.8 2.8 0 0 1-2.71 2.68Z"
        />
      </svg>
    ),
  },
  {
    key: "profile",
    href: "/profile",
    label: "Profile",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.34 0-6 1.46-6 3.25V20h12v-2.75C18 15.46 15.34 14 12 14Z"
        />
      </svg>
    ),
  },
];

type SidenavProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidenav({ isOpen, toggleSidebar }: SidenavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 start-0 z-20 h-screen py-8 text-white
        bg-[#006B6A]
        transition-[width] duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      <div className="flex items-center justify-between px-8 py-7">
        {isOpen && (
          <div
            className={`overflow-hidden text-sm font-semibold tracking-[0.3em]
              transition-all duration-300
              ${isOpen ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}
            `}
          >
            NAF3
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          title="Toggle sidebar"
          className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="currentColor"
              d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-x-2 px-8 py-4 text-sm font-medium transition-colors ${
                active ? "bg-[#007D7B]" : "hover:bg-[#008E8B]"
              }`}
            >
              {active && (
                <span className="absolute start-0 top-0 h-full w-2.5 bg-[#FFC012]" />
              )}
              <Icon className="h-5 w-5" />
              {isOpen && (
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
