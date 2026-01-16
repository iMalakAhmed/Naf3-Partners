"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function RedeemPointsPage() {
  const [virtualCardCode, setVirtualCardCode] = useState("");
  const [pin, setPin] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Coupon verified! Balance deducted successfully. Amount: 500 EGP");
      setVirtualCardCode("");
      setPin("");
      setNationalId("");
      setEmployeeName("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 py-10 px-4">
      <section className="mx-auto max-w-6xl space-y-10">
        {/* Header with gradient text */}
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Point Redemption Portal
            </p>
          </div>
          <h1 className="mt-4 text-4xl font-bold bg-gradient-to-r from-[#006B68] to-[#19BBB6] bg-clip-text text-transparent">
            Redeem Partner Points
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-md mx-auto">
            Validate and redeem virtual card points seamlessly
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Main Card with enhanced styling */}
          <div className="relative rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/20 to-transparent rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-100/20 to-transparent rounded-full blur-3xl -z-0"></div>

            <div className="relative z-10 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#006B68] to-[#19BBB6] rounded-2xl blur-xl opacity-40"></div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006B68] to-[#19BBB6] shadow-xl">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Validation</p>
                    <h2 className="text-2xl font-bold text-slate-900">Card Redemption</h2>
                    <p className="mt-1 text-sm text-slate-500">Enter the details below to process the redemption</p>
                  </div>
                </div>
                <div className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Secure verification
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Card Details</h3>
                    <span className="text-xs text-slate-400">* Required fields</span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-[2fr,1fr]">
                    {/* Virtual Card Code */}
                    <div className="group md:col-span-1">
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Virtual Card Code *
                      </label>
                      <input
                        type="text"
                        value={virtualCardCode}
                        onChange={(e) => setVirtualCardCode(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 group-hover:border-slate-300"
                        placeholder="e.g 00-00-0000-Code"
                      />
                    </div>

                    {/* PIN */}
                    <div className="group md:col-span-1">
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        PIN *
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 group-hover:border-slate-300"
                        placeholder="4-digit PIN"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* National ID */}
                  <div className="group">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      National ID *
                    </label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 group-hover:border-slate-300"
                      placeholder="e.g 29806112501614"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Employee Details</h3>
                  {/* Employee Name */}
                  <div className="group">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Employee Name
                    </label>
                    <input
                      type="text"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 group-hover:border-slate-300"
                      placeholder="e.g Hossam Mustang"
                    />
                    <p className="mt-2 text-xs text-slate-500">Optional but recommended for branch tracking.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 rounded-full bg-emerald-100 p-1">
                          <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">Success!</p>
                          <p className="text-sm text-emerald-700 mt-0.5">{successMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 rounded-full bg-red-100 p-1">
                          <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-900">Error</p>
                          <p className="text-sm text-red-700 mt-0.5">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#006B68] to-[#19BBB6] py-4 font-bold text-white shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#19BBB6] to-[#006B68] opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Validating...
                      </>
                    ) : (
                      <>
                        <span>Validate & Redeem</span>
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900">Redemption Flow</h3>
              <p className="mt-2 text-sm text-slate-500">Follow these steps to complete a secure redemption.</p>
              <div className="mt-6 space-y-4">
                {[
                  "Confirm the virtual card code and PIN.",
                  "Enter the national ID exactly as shown.",
                  "Review the employee name for auditing.",
                  "Submit and wait for the confirmation banner.",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-amber-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200">
                    <svg className="h-5 w-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Important Notes
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 group-hover:bg-amber-300 transition-colors">
                      <svg className="h-3 w-3 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="leading-relaxed">Ensure the virtual card code is entered correctly before submission.</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 group-hover:bg-amber-300 transition-colors">
                      <svg className="h-3 w-3 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="leading-relaxed">Verify card code and PIN accuracy to avoid processing errors.</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 group-hover:bg-amber-300 transition-colors">
                      <svg className="h-3 w-3 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="leading-relaxed">Record employee names for branch transparency and auditability.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Need a second pair of eyes?</h3>
              <p className="mt-2 text-sm text-slate-600">Double-check the card code and ID before submitting. It saves time on retries.</p>
              <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-teal-700">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                Secure audit trail enabled
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
