"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [partnerName, setPartnerName] = useState("partner team");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("partner_name")?.trim();
    if (savedName) {
      setPartnerName(savedName);
    }
  }, []);

  const stats = [
    {
      label: "Today's points",
      value: "2,350",
      currency: "EGP",
      subtext: "+15% from last week",
      color: "from-[#006B68] to-[#19BBB6]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    },
    {
      label: "Month Total",
      value: "45,530",
      currency: "EGP",
      subtext: "30 transactions",
      color: "from-[#19BBB6] to-[#FFC012]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    },
    {
      label: "Transactions Number",
      value: "127",
      currency: "EGP",
      subtext: "This month",
      color: "from-[#FFC012] to-[#006B68]",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      )
    },
  ];

  const recentTransactions = [
    {
      name: "Haya Osama",
      amount: "500 EGP",
      date: "02/01 AM",
      status: "completed"
    },
    {
      name: "Farida Ashraf",
      amount: "300 EGP",
      date: "02/01 AM",
      status: "completed"
    },
    {
      name: "Farida Hazeem",
      amount: "500 EGP",
      date: "02/01 AM",
      status: "completed"
    },
    {
      name: "Doaa Mahdy",
      amount: "500 EGP",
      date: "02/01 AM",
      status: "completed"
    },
  ];

  return (
    <section className="space-y-8">
      {/* Welcome Header with Animation */}
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"></p>
        <h1 className="mt-2 bg-gradient-to-r from-[#006B68] to-[#19BBB6] bg-clip-text text-4xl font-bold text-transparent">
          Welcome back, {partnerName}.
        </h1>
        <p className="mt-2 text-gray-600">
          Keep an eye on redemptions, balances, and branch activity.
        </p>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,107,104,0.3)] ${
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
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                  <span className="text-lg font-semibold text-gray-500">{stat.currency}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="rounded-full bg-[#19BBB6]/10 px-3 py-1">
                    <p className="text-xs font-semibold text-[#19BBB6]">{stat.subtext}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-full" />
          </div>
        ))}
      </div>

      {/* Recent Transactions - Enhanced */}
      <div className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white p-8 shadow-2xl transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ transitionDelay: '300ms' }}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
            <p className="mt-2 text-sm text-gray-600">Latest redemption activity</p>
          </div>
          <button className="group/btn relative overflow-hidden rounded-xl border-2 border-[#006B68] bg-white px-6 py-3 text-sm font-bold text-[#006B68] shadow-lg transition-all hover:scale-105 hover:border-[#19BBB6] hover:shadow-xl">
            <span className="relative z-10 transition-colors group-hover/btn:text-white">View All</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#006B68] to-[#19BBB6] transition-transform duration-300 group-hover/btn:translate-x-0" />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
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
                  <p className="text-2xl font-bold text-[#FFC012]">{transaction.amount}</p>
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
