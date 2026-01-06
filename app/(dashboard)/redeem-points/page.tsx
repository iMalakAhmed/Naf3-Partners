"use client";

import { useState } from "react";

export default function RedeemPointsPage() {
  const [virtualCardCode, setVirtualCardCode] = useState("");
  const [pin, setPin] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Simulate API call
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
    <section className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400">REDEEM POINTS</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Redeem partner points
        </h1>
        <p className="mt-1 text-gray-600">
          Validate and redeem virtual card points.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006B68] to-[#19BBB6] shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Point Redemption</h2>
          <p className="mt-1 text-sm text-gray-600">Enter card details to redeem points</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Virtual Card Code */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Virtual Card code *
            </label>
            <input
              type="text"
              value={virtualCardCode}
              onChange={(e) => setVirtualCardCode(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#19BBB6] focus:ring-2 focus:ring-[#19BBB6]/20"
              placeholder="e.g 00-00-0000-Code"
              required
            />
          </div>

          {/* PIN */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              PIN *
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#19BBB6] focus:ring-2 focus:ring-[#19BBB6]/20"
              placeholder="4-Digit PIN"
              maxLength={4}
              required
            />
          </div>

          {/* National ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              National ID *
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#19BBB6] focus:ring-2 focus:ring-[#19BBB6]/20"
              placeholder="e.g 29806112501614"
              required
            />
          </div>

          {/* Employee Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#19BBB6] focus:ring-2 focus:ring-[#19BBB6]/20"
              placeholder="e.g Hossam Mustang"
            />
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#006B68] py-4 font-semibold text-white shadow-lg transition-all hover:bg-[#006B68]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Validating...
              </span>
            ) : (
              "Validate & Redeem"
            )}
          </button>
        </form>
      </div>

      {/* Important Notes */}
      <div className="rounded-2xl border-2 border-[#FFC012]/30 bg-[#FFC012]/5 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-[#006B68]">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Important Notes:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-[#FFC012]">•</span>
            <span>Ensure the virtual card code is entered correctly before submission</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-[#FFC012]">•</span>
            <span>Ensure card code and PIN are correct before submission</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-[#FFC012]">•</span>
            <span>Record employee names for branch transparency and auditability</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
