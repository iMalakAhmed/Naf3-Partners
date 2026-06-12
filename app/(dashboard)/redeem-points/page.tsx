"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Spinner } from "@/app/components/ui/Loader";
import { ToastStack, useToast } from "@/app/components/ui/Toast";

type FieldErrors = Partial<
  Record<"virtualCardCode" | "pin" | "nationalId" | "employeeName" | "amount", string>
>;

const API_FIELD_MAP: Record<string, keyof FieldErrors> = {
  CardHolderName: "employeeName",
  NationalId: "nationalId",
  VirtualCardCode: "virtualCardCode",
  Pin: "pin",
  Amount: "amount",
};

type FriendlyError = { message: string; field?: keyof FieldErrors };

function parseFriendlyError(raw: string): FriendlyError {
  const lower = raw.toLowerCase();

  // National ID
  if (lower.includes("recipient not found") || lower.includes("user not found") || lower.includes("national id"))
    return {
      field: "nationalId",
      message: "No account was found with this National ID. Please double-check the number.",
    };

  // Virtual card code
  if (
    lower.includes("card not found") ||
    lower.includes("virtual card not found") ||
    lower.includes("invalid card") ||
    lower.includes("card does not exist") ||
    lower.includes("card code")
  )
    return {
      field: "virtualCardCode",
      message: "This card code is invalid or doesn't exist. Please check and try again.",
    };

  // PIN
  if (
    lower.includes("invalid pin") ||
    lower.includes("incorrect pin") ||
    lower.includes("wrong pin") ||
    lower.includes("pin mismatch") ||
    lower.includes("pin is invalid") ||
    lower.includes("pin is incorrect")
  )
    return {
      field: "pin",
      message: "The PIN you entered is incorrect. Please try again.",
    };

  // Cardholder name
  if (
    lower.includes("name mismatch") ||
    lower.includes("name does not match") ||
    lower.includes("name doesn't match") ||
    lower.includes("invalid name") ||
    lower.includes("cardholder name") ||
    lower.includes("card holder name")
  )
    return {
      field: "employeeName",
      message: "The cardholder name doesn't match our records. Please check and try again.",
    };

  // Balance / card state
  if (lower.includes("insufficient balance") || lower.includes("not enough balance"))
    return { message: "This card doesn't have enough balance to cover the requested amount." };
  if (lower.includes("expired"))
    return { message: "This card has expired and can no longer be used." };
  if (lower.includes("blocked") || lower.includes("suspended"))
    return { message: "This card is blocked. Please contact support." };

  return { message: raw || "Redemption failed. Please try again." };
}

export default function RedeemPointsPage() {
  const { toasts, showToast, removeToast } = useToast();
  const [virtualCardCode, setVirtualCardCode] = useState("");
  const [pin, setPin] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState<{
    amount: number;
    virtualCardCode: string;
  } | null>(null);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function inputClass(field: keyof FieldErrors, extra = "") {
    const err = !!fieldErrors[field];
    return [
      "w-full rounded-2xl border py-3 text-sm text-slate-900 outline-none transition focus:ring-2",
      err
        ? "border-rose-400 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-300/30"
        : "border-slate-200 bg-white focus:border-[#19BBB6] focus:ring-[#19BBB6]/20",
      "shadow-[0_12px_30px_-24px_rgba(0,107,106,0.35)]",
      extra,
    ]
      .filter(Boolean)
      .join(" ");
  }

  function FieldError({ field }: { field: keyof FieldErrors }) {
    if (!fieldErrors[field]) return null;
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
        <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {fieldErrors[field]}
      </p>
    );
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!virtualCardCode.trim()) {
      errors.virtualCardCode = "Virtual card code is required.";
    } else if (!/^\d{16}$/.test(virtualCardCode.trim())) {
      errors.virtualCardCode = "Card code must be exactly 16 digits.";
    }

    if (!pin.trim()) {
      errors.pin = "PIN is required.";
    } else if (!/^\d{4}$/.test(pin.trim())) {
      errors.pin = "PIN must be exactly 4 digits.";
    }

    if (!nationalId.trim()) {
      errors.nationalId = "National ID is required.";
    } else if (!/^\d{14}$/.test(nationalId.trim())) {
      errors.nationalId = "National ID must be exactly 14 digits.";
    }

    if (!employeeName.trim()) errors.employeeName = "Cardholder name is required.";

    if (!amount.trim()) {
      errors.amount = "Amount is required.";
    } else {
      const parsed = Number(amount);
      if (!Number.isFinite(parsed) || parsed <= 0)
        errors.amount = "Enter a valid amount greater than 0.";
    }
    return errors;
  }

  const saveRecentRedemption = (payload: {
    virtualCardCode: string;
    nationalId: string;
    employeeName: string;
    amount: number;
    timestamp: string;
  }) => {
    const existing = localStorage.getItem("recent_redeems");
    const parsed = existing ? (JSON.parse(existing) as typeof payload[]) : [];
    const updated = [payload, ...parsed].slice(0, 10);
    localStorage.setItem("recent_redeems", JSON.stringify(updated));
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    const token = localStorage.getItem("partner_token");
    if (!token) {
      setIsSubmitting(false);
      const message = "Please sign in to redeem points.";
      setErrorMessage(message);
      showToast({ title: "Sign in required", message, variant: "error" });
      return;
    }

    const parsedAmount = Number(amount);

    try {
      const response = await fetch("/api/partners/redeem-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nationalId,
          virtualCardCode,
          cardHolderName: employeeName,
          amount: parsedAmount,
          pin,
        }),
      });

      const responseText = await response.text();
      let payload: unknown = null;
      try {
        payload = responseText ? JSON.parse(responseText) : null;
      } catch {
        payload = responseText;
      }

      if (!response.ok) {
        // Map API validation errors back to field highlights
        if (
          typeof payload === "object" &&
          payload !== null &&
          "errors" in payload &&
          typeof (payload as { errors?: unknown }).errors === "object" &&
          (payload as { errors?: unknown }).errors !== null
        ) {
          const apiErrors = (payload as { errors: Record<string, string[]> }).errors;
          const mapped: FieldErrors = {};
          for (const [key, msgs] of Object.entries(apiErrors)) {
            const localKey = API_FIELD_MAP[key];
            if (localKey) mapped[localKey] = msgs[0] ?? `${key} is invalid.`;
          }
          if (Object.keys(mapped).length > 0) {
            setFieldErrors(mapped);
            setIsSubmitting(false);
            return;
          }
        }

        const rawMessage =
          typeof payload === "object" && payload !== null && "message" in payload
            ? String((payload as { message?: string }).message)
            : responseText || "Redemption failed. Please try again.";
        const friendly = parseFriendlyError(rawMessage);
        if (friendly.field) {
          setFieldErrors({ [friendly.field]: friendly.message });
          setIsSubmitting(false);
          return;
        }
        throw new Error(friendly.message);
      }

      const successDetail =
        typeof payload === "object" && payload !== null && "message" in payload
          ? String((payload as { message?: string }).message)
          : `Amount: ${parsedAmount} EGP`;
      setSuccessMessage(
        `Coupon verified! Balance deducted successfully. ${successDetail}`
      );
      showToast({
        title: "Redemption successful",
        message: `${parsedAmount.toLocaleString()} EGP redeemed.`,
        variant: "success",
      });
      setSuccessModal({ amount: parsedAmount, virtualCardCode });
      saveRecentRedemption({
        virtualCardCode,
        nationalId,
        employeeName,
        amount: parsedAmount,
        timestamp: new Date().toISOString(),
      });
      setVirtualCardCode("");
      setPin("");
      setNationalId("");
      setEmployeeName("");
      setAmount("");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Redemption failed.";
      setErrorMessage(message);
      showToast({ title: "Redemption failed", message, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-slate-900">
      <ToastStack toasts={toasts} onClose={removeToast} />
      {successModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-[0_30px_90px_-40px_rgba(15,23,42,0.7)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">Transaction successful</h2>
            <p className="mt-2 text-sm text-slate-500">
              The redemption was completed and saved in recent activity.
            </p>
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">
                  {successModal.amount.toLocaleString()} EGP
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">Card code</span>
                <span className="font-semibold text-slate-900">{successModal.virtualCardCode}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSuccessModal(null)}
              className="mt-5 w-full rounded-2xl bg-[#006B6A] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/20 transition hover:bg-[#19BBB6]"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}

      <section className="mx-auto w-full max-w-6xl space-y-8">
        <header className="relative overflow-hidden rounded-[36px] border border-[#0f766e]/30 bg-[conic-gradient(from_180deg_at_50%_50%,#0d5f5a,#19BBB6,#FFC012,#0d5f5a)] p-[1px] shadow-[0_30px_80px_-50px_rgba(0,107,106,0.7)]">
          <div className="relative rounded-[35px] bg-[linear-gradient(120deg,#0d5f5a,#19BBB6)] px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#FFC012]/40 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                  Redeem Points
                </p>
                <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Redemption Command Center
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/80">
                  Submit a precise request and redeem points in seconds.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[30px] bg-[linear-gradient(135deg,#0d5f5a,#19BBB6,#FFC012)] p-[2px] shadow-[0_24px_70px_-45px_rgba(0,107,106,0.6)]">
            <div className="rounded-[28px] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Redeem a Virtual Card</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the card details and redemption amount.
                  </p>
                </div>
                <div className="rounded-full bg-[#006B6A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#006B6A]">
                  Required *
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#19BBB6]/20 bg-[#f4fbfa] px-4 py-3 text-sm text-[#006B6A]">
                <p className="font-semibold">Check the details before submitting.</p>
                <p className="mt-1 text-xs text-[#006B6A]/80">
                  Once confirmed, the amount is deducted from the card balance and saved in recent
                  activity.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Virtual Card Code *
                    </label>
                    <input
                      type="text"
                      value={virtualCardCode}
                      onChange={(e) => {
                        setVirtualCardCode(e.target.value);
                        clearFieldError("virtualCardCode");
                      }}
                      className={inputClass("virtualCardCode", "px-4")}
                      placeholder="e.g 1008167401131443"
                    />
                    <FieldError field="virtualCardCode" />
                    {!fieldErrors.virtualCardCode && (
                      <p className="text-xs font-normal text-slate-500">Use the virtual card code.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">PIN *</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        clearFieldError("pin");
                      }}
                      className={inputClass("pin", "px-4")}
                      placeholder="4-digit PIN"
                      maxLength={4}
                    />
                    <FieldError field="pin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">National ID *</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => {
                      setNationalId(e.target.value);
                      clearFieldError("nationalId");
                    }}
                    className={inputClass("nationalId", "px-4")}
                    placeholder="e.g 29806112501614"
                  />
                  <FieldError field="nationalId" />
                </div>

                <div className="grid gap-5 sm:grid-cols-[1.2fr,0.8fr]">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Card Holder Name *
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={employeeName}
                        onChange={(e) => {
                          setEmployeeName(e.target.value);
                          clearFieldError("employeeName");
                        }}
                        className={inputClass("employeeName", "pl-10 pr-4")}
                        placeholder="e.g Malak Shams"
                      />
                    </div>
                    <FieldError field="employeeName" />
                    {!fieldErrors.employeeName && (
                      <p className="text-xs font-normal text-slate-500">
                        Enter the name as it appears on the card.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Amount (EGP) *</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        clearFieldError("amount");
                      }}
                      className={inputClass("amount", "px-4")}
                      placeholder="e.g 500"
                    />
                    <FieldError field="amount" />
                  </div>
                </div>

                {successMessage ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Redemption successful</p>
                      <p className="mt-0.5 text-xs text-emerald-700">{successMessage}</p>
                    </div>
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-rose-800">Something went wrong</p>
                      <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-2xl bg-[#006B6A] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#19BBB6] disabled:cursor-not-allowed disabled:bg-[#19BBB6]/50"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    {isSubmitting ? <Spinner /> : null}
                    {isSubmitting ? "Submitting..." : "Redeem Points"}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#19BBB6] to-[#FFC012] opacity-80 transition-transform duration-700 ease-out group-hover:translate-x-0" />
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[#19BBB6]/20 bg-white p-6 shadow-[0_16px_45px_-35px_rgba(0,107,106,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006B6A]">
                Redemption Flow
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Quick guide</h3>
              <p className="mt-2 text-sm text-slate-500">
                A short checklist to keep redemptions clean and fast.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  "Confirm the virtual card code and PIN.",
                  "Make sure the national ID is correct.",
                  "Enter the cardholder name as it appears on the card.",
                  "Submit and wait for confirmation.",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B6A]/10 text-sm font-semibold text-[#006B6A]">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
