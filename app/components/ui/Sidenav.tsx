"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  key: "dashboard" | "transactions" | "redeemPoints" | "profile";
  href: string;
  label: string;
  shortLabel: string;
  icon: (props: { className?: string }) => ReactNode;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Dashboard",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path fill="currentColor" d="M12 3 3 10.7V21h6v-6h6v6h6V10.7L12 3Z" />
      </svg>
    ),
  },
  {
    key: "transactions",
    href: "/transactions",
    label: "Transactions",
    shortLabel: "Transactions",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M7 4h10v2H7V4Zm12 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-1 8H6v-2h12v2Zm0-4H6v-2h12v2Z"
        />
      </svg>
    ),
  },
  {
    key: "redeemPoints",
    href: "/redeem-points",
    label: "Redeem Points",
    shortLabel: "Redeem",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15.75V19h-2v-1.21a4.05 4.05 0 0 1-2.82-1.65l1.46-1.38A2.44 2.44 0 0 0 11.78 16c.9 0 1.72-.36 1.72-1.1 0-.68-.54-.96-2.05-1.34-1.63-.42-3.02-1.04-3.02-2.82A2.9 2.9 0 0 1 11 7.88V6.75h2v1.18a3.7 3.7 0 0 1 2.39 1.36l-1.44 1.39a2.09 2.09 0 0 0-1.77-.86c-.99 0-1.48.43-1.48.95 0 .64.7.88 2.16 1.27 1.46.39 2.91 1.08 2.91 2.85A3.03 3.03 0 0 1 13 17.75Z"
        />
      </svg>
    ),
  },
  {
    key: "profile",
    href: "/profile",
    label: "Profile Settings",
    shortLabel: "Profile",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="currentColor"
          d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65-2-3.46-2.49 1a7.28 7.28 0 0 0-1.69-.98L15 3h-4l-.36 2.93c-.61.23-1.18.56-1.69.98l-2.49-1-2 3.46 2.11 1.65c-.05.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65 2 3.46 2.49-1c.51.42 1.08.75 1.69.98L11 21h4l.36-2.93c.61-.23 1.18-.56 1.69-.98l2.49 1 2-3.46-2.11-1.65ZM13 15.5A3.5 3.5 0 1 1 13 8a3.5 3.5 0 0 1 0 7.5Z"
        />
      </svg>
    ),
  },
];

const mainNavItems = navItems.filter((item) => item.key !== "profile");
const profileItem = navItems.find((item) => item.key === "profile")!;

type SidenavProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.34 0-6 1.46-6 3.25V20h12v-2.75C18 15.46 15.34 14 12 14Z"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="m15.41 7.41-1.42-1.42L8 12l5.99 6.01 1.42-1.42L10.83 12l4.58-4.59Z"
      />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M10 17v-2h4v-2h-4v-2l-4 3 4 3Zm-6 4h8a2 2 0 0 0 2-2v-3h-2v3H4V5h8v3h2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Zm13.59-5.59L22 11l-4.41-4.41L16.17 8l2 2H11v2h7.17l-2 2 1.42 1.41Z"
      />
    </svg>
  );
}

function NavLink({
  item,
  active,
  isOpen,
}: {
  item: NavItem;
  active: boolean;
  isOpen: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={item.label}
      className={`mx-3 flex h-14 items-center gap-4 rounded-2xl px-5 text-[15px] font-semibold transition-all ${
        active
          ? "bg-[linear-gradient(120deg,#18b9b2,#12a7a0)] text-white shadow-[0_18px_45px_-28px_rgba(25,187,182,0.9)]"
          : "text-white/88 hover:bg-white/10 hover:text-white"
      } ${isOpen ? "justify-start" : "justify-center px-0"}`}
    >
      <Icon className="h-6 w-6 shrink-0" />
      {isOpen ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

export default function Sidenav({ isOpen, toggleSidebar }: SidenavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [partnerName, setPartnerName] = useState("Partner");

  useEffect(() => {
    const savedName = localStorage.getItem("partner_name")?.trim();
    if (savedName) setPartnerName(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    router.push("/auth/login");
  };

  return (
    <aside
      className={`fixed top-0 start-0 z-20 hidden h-screen overflow-hidden text-white transition-[width] duration-300 ease-in-out md:block ${
        isOpen ? "w-72" : "w-24"
      } bg-[linear-gradient(180deg,#005a56_0%,#006B6A_48%,#00514e_100%)]`}
    >
      <div
        className={`flex items-center gap-4 border-b border-white/12 px-4 py-6 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen ? (
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-[#006B6A]">
              <UserIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/70">Welcome back!</p>
              <p className="truncate text-lg font-bold text-white">{partnerName}</p>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={toggleSidebar}
          title="Toggle sidebar"
          className="rounded-full p-2 text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronIcon
            className={`h-7 w-7 transition-transform ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      <nav className="mt-8 grid gap-3">
        {mainNavItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <NavLink key={item.key} item={item} active={active} isOpen={isOpen} />
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/12 py-5">
        <NavLink
          item={profileItem}
          active={pathname.startsWith(profileItem.href)}
          isOpen={isOpen}
        />
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className={`mx-3 mt-3 flex h-14 items-center gap-4 rounded-2xl px-5 text-[15px] font-semibold text-red-100 transition hover:bg-red-500/20 hover:text-white ${
            isOpen
              ? "w-[calc(100%-1.5rem)] justify-start"
              : "w-[calc(100%-1.5rem)] justify-center px-0"
          }`}
        >
          <LogoutIcon className="h-6 w-6 shrink-0" />
          {isOpen ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-100 bg-white shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.12)] md:hidden">
      {navItems.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
              active ? "text-[#006B6A]" : "text-slate-400"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
