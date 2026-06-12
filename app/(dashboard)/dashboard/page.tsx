"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SkeletonBlock } from "@/app/components/ui/Loader";
import { ToastStack, useToast } from "@/app/components/ui/Toast";

type TransactionRow = {
  date: string;
  time: string;
  cardCode: string;
  amount: string;
  employee: string;
  nationalId: string;
};

const formatDate = (value: Date) =>
  value.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
const formatTime = (value: Date) =>
  value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const toDate = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
};

const formatAmount = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "number") {
    return `${value} EGP`;
  }
  const text = String(value);
  return /egp/i.test(text) ? text : `${text} EGP`;
};

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const formatName = (value: Record<string, unknown>) =>
  [value.firstName, value.lastName]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" ");

const parseAmountValue = (value: string) => {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const parseRowDateTime = (row: TransactionRow) => {
  if (!row.date || row.date === "-") return null;
  const dateTime = row.time && row.time !== "-" ? `${row.date} ${row.time}` : row.date;
  const parsed = new Date(dateTime);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(row.date);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const normalizeTransactions = (payload: unknown): TransactionRow[] => {
  const extractArray = (value: unknown) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      for (const key of ["data", "transactions", "items", "result"]) {
        if (Array.isArray(record[key])) {
          return record[key] as unknown[];
        }
      }
    }
    return [];
  };

  const list = extractArray(payload);
  return list.map((item) => {
    const record = item as Record<string, unknown>;
    const recipient = asRecord(record.toRecipient);
    const recipientName = formatName(recipient);
    const dateValue =
      record.date ??
      record.createdAt ??
      record.createdOn ??
      record.transactionDate ??
      record.timestamp ??
      record.time;
    const parsedDate = toDate(dateValue);
    const dateLabel = parsedDate ? formatDate(parsedDate) : String(dateValue ?? "-");
    const timeLabel = parsedDate ? formatTime(parsedDate) : String(record.time ?? "-");

    return {
      date: dateLabel,
      time: timeLabel,
      cardCode: String(
        record.cardCode ??
          record.virtualCardCode ??
          recipient.virtualCardCode ??
          record.cardNumber ??
          record.card ??
          "-"
      ),
      amount: formatAmount(
        record.amount ?? record.points ?? record.value ?? record.totalAmount
      ),
      employee: String(
        (record.employee ??
          record.employeeName ??
          record.cardHolderName ??
          record.userName ??
          recipientName) ||
          "-"
      ),
      nationalId: String(
        record.nationalId ??
          record.nationalID ??
          record.national_id ??
          record.idNumber ??
          recipient.nationalId ??
          recipient.nationalID ??
          recipient.address ??
          recipient.recipientId ??
          "-"
      ),
    };
  });
};

const loadRecentRedeems = (): TransactionRow[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("recent_redeems");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as {
      virtualCardCode: string;
      nationalId: string;
      employeeName: string;
      amount: number;
      timestamp: string;
    }[];
    return parsed.map((entry) => {
      const date = new Date(entry.timestamp);
      return {
        date: formatDate(date),
        time: formatTime(date),
        cardCode: entry.virtualCardCode || "-",
        amount: `${entry.amount} EGP`,
        employee: entry.employeeName || "-",
        nationalId: entry.nationalId || "-",
      };
    });
  } catch {
    return [];
  }
};

const isMissing = (value: string) => !value || value === "-";

const mergeTransactions = (
  apiRows: TransactionRow[],
  localRows: TransactionRow[]
) => {
  const remainingLocals = [...localRows];
  const enriched = apiRows.map((row) => {
    const matchIndex = remainingLocals.findIndex(
      (local) => local.amount === row.amount && local.date === row.date
    );
    if (matchIndex === -1) return row;
    const match = remainingLocals[matchIndex];
    remainingLocals.splice(matchIndex, 1);
    return {
      ...row,
      cardCode: isMissing(row.cardCode) ? match.cardCode : row.cardCode,
      employee: isMissing(row.employee) ? match.employee : row.employee,
      nationalId: isMissing(row.nationalId) ? match.nationalId : row.nationalId,
    };
  });

  const seen = new Set(
    enriched.map(
      (item) =>
        `${item.cardCode}-${item.amount}-${item.nationalId}-${item.date}-${item.time}`
    )
  );
  remainingLocals.forEach((item) => {
    const key = `${item.cardCode}-${item.amount}-${item.nationalId}-${item.date}-${item.time}`;
    if (!seen.has(key)) {
      enriched.unshift(item);
    }
  });
  return enriched;
};

export default function DashboardPage() {
  const { toasts, showToast, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [partnerName, setPartnerName] = useState("partner team");
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("partner_name")?.trim();
    if (savedName) {
      setPartnerName(savedName);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      const token = localStorage.getItem("partner_token");
      if (!token) {
        if (active) {
          const message = "Please sign in to view dashboard data.";
          setErrorMessage(message);
          showToast({
            title: "Sign in required",
            message,
            variant: "error",
          });
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch("/api/transactions/my-transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseText = await response.text();
        let payload: unknown = null;
        try {
          payload = responseText ? JSON.parse(responseText) : null;
        } catch {
          payload = responseText;
        }

        if (!response.ok) {
          const message =
            typeof payload === "object" && payload !== null && "message" in payload
              ? String((payload as { message?: string }).message)
              : responseText || "Failed to load dashboard data.";
          throw new Error(message);
        }

        if (active) {
          const normalized = normalizeTransactions(payload);
          const locals = loadRecentRedeems();
          setTransactions(mergeTransactions(normalized, locals));
        }
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : "Failed to load dashboard data.";
          setErrorMessage(message);
          showToast({
            title: "Could not load dashboard",
            message,
            variant: "error",
          });
          const locals = loadRecentRedeems();
          if (locals.length) {
            setTransactions(locals);
          }
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();
    return () => {
      active = false;
    };
  }, []);

  const now = new Date();
  const todayKey = formatDate(now);
  const month = now.getMonth();
  const year = now.getFullYear();

  const todayTotal = transactions.reduce((sum, item) => {
    const parsed = parseRowDateTime(item);
    if (!parsed) return sum;
    return formatDate(parsed) === todayKey ? sum + parseAmountValue(item.amount) : sum;
  }, 0);
  const monthTotal = transactions.reduce((sum, item) => {
    const parsed = parseRowDateTime(item);
    if (!parsed) return sum;
    return parsed.getMonth() === month && parsed.getFullYear() === year
      ? sum + parseAmountValue(item.amount)
      : sum;
  }, 0);
  const monthCount = transactions.filter((item) => {
    const parsed = parseRowDateTime(item);
    if (!parsed) return false;
    return parsed.getMonth() === month && parsed.getFullYear() === year;
  }).length;

  const stats = [
    {
      label: "Today's points",
      value: todayTotal.toLocaleString(),
      currency: "EGP",
      subtext: `As of ${todayKey}`,
      color: "from-[#006B68] to-[#19BBB6]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    },
    {
      label: "Month Total",
      value: monthTotal.toLocaleString(),
      currency: "EGP",
      subtext: `${monthCount} transactions`,
      color: "from-[#19BBB6] to-[#FFC012]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    },
    {
      label: "Transactions Number",
      value: transactions.length.toLocaleString(),
      currency: "EGP",
      subtext: "Total transactions",
      color: "from-[#FFC012] to-[#006B68]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      )
    },
  ];

  const recentTransactions = transactions.slice(0, 4).map((item) => ({
    name: item.employee !== "-" ? item.employee : item.cardCode,
    amount: item.amount,
    date: `${item.date} ${item.time}`,
    status: "completed",
  }));

  return (
    <section className="space-y-8">
      <ToastStack toasts={toasts} onClose={removeToast} />
      {/* Welcome Header with Animation */}
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"></p>
        <div className="rounded-[32px] border border-[#006B6A]/20 bg-[linear-gradient(120deg,#0d5f5a,#19BBB6)] px-5 py-7 text-white shadow-[0_28px_70px_-45px_rgba(0,107,106,0.6)] sm:px-8 sm:py-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Welcome back, {partnerName}.
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Keep an eye on redemptions, balances, and branch activity.
          </p>
        </div>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white p-5 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,107,104,0.3)] sm:p-8 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`} />

            {/* Glow Effect */}
            <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`} />

            <div className="relative">
              {/* Icon with Gradient */}
              <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${stat.color} p-4 shadow-lg`}>
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  {stat.label}
                </p>
                {isLoading ? (
                  <div className="mt-4 space-y-3">
                    <SkeletonBlock className="h-10 w-32" />
                    <SkeletonBlock className="h-7 w-40 rounded-full" />
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900 sm:text-4xl">{stat.value}</p>
                      <span className="text-lg font-semibold text-gray-500">{stat.currency}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="rounded-full bg-[#19BBB6]/10 px-3 py-1">
                        <p className="text-xs font-semibold text-[#19BBB6]">{stat.subtext}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-full" />
          </div>
        ))}
      </div>

      {/* Recent Transactions - Enhanced */}
      <div className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white p-5 shadow-2xl transition-all duration-700 sm:p-8 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ transitionDelay: '300ms' }}>
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
            <p className="mt-2 text-sm text-gray-600">Latest redemption activity</p>
          </div>
          <Link href="/transactions" className="group/btn relative overflow-hidden rounded-xl border-2 border-[#006B68] bg-white px-6 py-3 text-sm font-bold text-[#006B68] shadow-lg transition-all hover:scale-105 hover:border-[#19BBB6] hover:shadow-xl">
            <span className="relative z-10 transition-colors group-hover/btn:text-white">View All</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#006B68] to-[#19BBB6] transition-transform duration-300 group-hover/btn:translate-x-0" />
          </Link>
        </div>

        {/* Transactions List */}
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <SkeletonBlock className="h-14 w-14 rounded-full" />
                      <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="h-3 w-44" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <SkeletonBlock className="h-6 w-24" />
                      <SkeletonBlock className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))
            : null}
          {recentTransactions.length === 0 && !isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No recent transactions yet.
            </div>
          ) : null}
          {recentTransactions.map((transaction, index) => (
            <div
              key={index}
              className={`group/item relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5 transition-all duration-300 hover:-translate-x-2 hover:border-[#19BBB6] hover:shadow-lg ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              {/* Gradient Bar */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#006B68] to-[#19BBB6] opacity-0 transition-opacity group-hover/item:opacity-100" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar with Gradient Ring */}
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#006B68] to-[#19BBB6] opacity-0 blur transition-opacity group-hover/item:opacity-75" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#006B68] to-[#19BBB6] shadow-lg">
                      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">{transaction.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">{transaction.date}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-[#FFC012] sm:text-2xl">{transaction.amount}</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">Completed</p>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="pointer-events-none absolute -right-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover/item:right-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
