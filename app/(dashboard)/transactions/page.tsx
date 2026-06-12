"use client";

import { useEffect, useState } from "react";
import { SkeletonBlock, Spinner } from "@/app/components/ui/Loader";
import { ToastStack, useToast } from "@/app/components/ui/Toast";

type TransactionRow = {
  date: string;
  time: string;
  cardCode: string;
  amount: string;
  recipient: string;
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
      recipient: String(
        (record.employee ??
          record.employeeName ??
          record.cardHolderName ??
          record.userName ??
          recipientName) ||
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
        recipient: entry.employeeName || "-",
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
      recipient: isMissing(row.recipient) ? match.recipient : row.recipient,
    };
  });

  const seen = new Set(
    enriched.map(
      (item) =>
        `${item.cardCode}-${item.amount}-${item.recipient}-${item.date}-${item.time}`
    )
  );
  remainingLocals.forEach((item) => {
    const key = `${item.cardCode}-${item.amount}-${item.recipient}-${item.date}-${item.time}`;
    if (!seen.has(key)) {
      enriched.unshift(item);
    }
  });
  return enriched;
};

export default function TransactionsPage() {
  const { toasts, showToast, removeToast } = useToast();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const totalAmount = transactions.reduce((sum, item) => {
    const numeric = Number(item.amount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? sum + numeric : sum;
  }, 0);
  const transactionCount = transactions.length;
  const latestTransaction = transactions[0]?.date ?? "-";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTransactions = normalizedQuery
    ? transactions.filter((item) => {
        const haystack = [
          item.date,
          item.time,
          item.cardCode,
          item.amount,
          item.recipient,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : transactions;

  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      const token = localStorage.getItem("partner_token");
      if (!token) {
        if (active) {
          const message = "Please sign in to view transactions.";
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
              : responseText || "Failed to load transactions.";
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
            error instanceof Error ? error.message : "Failed to load transactions.";
          setErrorMessage(message);
          showToast({
            title: "Could not load transactions",
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

  return (
    <section className="space-y-6">
      <ToastStack toasts={toasts} onClose={removeToast} />
      <header className="relative overflow-hidden rounded-[32px] border border-[#006B6A]/20 bg-[linear-gradient(120deg,#0d5f5a,#19BBB6)] px-5 py-7 text-white shadow-[0_28px_70px_-45px_rgba(0,107,106,0.6)] sm:px-8 sm:py-10">
        <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
        <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Transactions
            </p>
            <h2 className="mt-4 text-3xl font-semibold">Branch Activity</h2>
            <p className="mt-2 text-sm text-white/80">
              Track redemptions, totals, and volume trends.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Total Amount
              </p>
              {isLoading ? (
                <SkeletonBlock className="mt-3 h-6 w-24 bg-white/25" />
              ) : (
                <p className="mt-2 text-lg font-semibold">{totalAmount} EGP</p>
              )}
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Transactions
              </p>
              {isLoading ? (
                <SkeletonBlock className="mt-3 h-6 w-14 bg-white/25" />
              ) : (
                <p className="mt-2 text-lg font-semibold">{transactionCount}</p>
              )}
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                Latest Date
              </p>
              {isLoading ? (
                <SkeletonBlock className="mt-3 h-6 w-28 bg-white/25" />
              ) : (
                <p className="mt-2 text-lg font-semibold">{latestTransaction}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-4 shadow-[0_16px_45px_-35px_rgba(0,107,106,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#006B6A]">
              Search
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Filter by card code, recipient, date, or amount.
            </p>
          </div>
          <div className="relative w-full sm:w-96">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-[0_20px_50px_-38px_rgba(0,107,106,0.35)] sm:px-8">
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-[0.18em] text-zinc-400">
                <th className="px-2 pb-3 pt-1 font-semibold">Date</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Time</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Card Code</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Amount</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Recipient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td className="px-2 py-14 text-center" colSpan={5}>
                    <div className="inline-flex items-center gap-3 rounded-2xl border border-[#19BBB6]/20 bg-[#f4fbfa] px-5 py-3 text-sm font-semibold text-[#006B6A]">
                      <Spinner />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td className="px-2 py-10 text-center text-sm text-zinc-500" colSpan={5}>
                    No matching transactions.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr
                    key={`${item.date}-${item.time}-${item.cardCode}`}
                    className="transition hover:bg-[#f4fbfa]"
                  >
                    <td className="px-2 py-3">{item.date}</td>
                    <td className="px-2 py-3">{item.time}</td>
                    <td className="px-2 py-3 font-semibold text-[#006B6A]">
                      {item.cardCode}
                    </td>
                    <td className="px-2 py-3 font-semibold text-[#006B6A]">
                      {item.amount}
                    </td>
                    <td className="px-2 py-3">{item.recipient}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
