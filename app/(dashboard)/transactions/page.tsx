const transactions = [
  {
    date: "2026-01-05",
    time: "5:00 PM",
    cardCode: "**** 5432",
    amount: "500 EGP",
    employee: "Ahmed Mohamed",
    nationalId: "***** 5343",
  },
  {
    date: "2026-01-05",
    time: "2:30 PM",
    cardCode: "**** 5392",
    amount: "200 EGP",
    employee: "Hasan Mohamed",
    nationalId: "***** 5343",
  },
  {
    date: "2026-01-05",
    time: "1:45 PM",
    cardCode: "**** 5392",
    amount: "200 EGP",
    employee: "Nour Mostafa",
    nationalId: "***** 5343",
  },
  {
    date: "2026-01-05",
    time: "12:00 PM",
    cardCode: "**** 5392",
    amount: "200 EGP",
    employee: "Sara Ali Ahmed",
    nationalId: "***** 5343",
  },
];

export default function TransactionsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[22px] border border-[#d6e7e7] bg-white px-6 py-5 shadow-[0_16px_40px_-34px_rgba(0,107,106,0.35)]">
        <h2 className="text-xl font-semibold text-zinc-900">Transactions</h2>
        <p className="mt-1 text-sm text-zinc-500">
          View all branch transactions
        </p>
      </div>

      <div className="rounded-[22px] border border-[#d6e7e7] bg-white px-6 py-5 shadow-[0_16px_40px_-34px_rgba(0,107,106,0.35)]">
        <p className="text-sm font-semibold text-zinc-900">Filters</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Search
            <input
              placeholder="Employee or Card ..."
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Date From
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Date To
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
            />
          </label>
        </div>
      </div>

      <div className="rounded-[22px] border border-dashed border-[#76c9c7] bg-[#dff0ef] px-6 py-5 text-[#006B6A] shadow-[0_16px_40px_-34px_rgba(0,107,106,0.35)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Total Amount</p>
          <p className="text-lg font-semibold">3456</p>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#d6e7e7] bg-white px-6 py-6 shadow-[0_18px_45px_-36px_rgba(0,107,106,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-[0.18em] text-zinc-400">
                <th className="px-2 pb-3 pt-1 font-semibold">Date</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Time</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Card Code</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Amount</th>
                <th className="px-2 pb-3 pt-1 font-semibold">Employee</th>
                <th className="px-2 pb-3 pt-1 font-semibold">National ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.map((item) => (
                <tr key={`${item.date}-${item.time}-${item.cardCode}`}>
                  <td className="px-2 py-3">{item.date}</td>
                  <td className="px-2 py-3">{item.time}</td>
                  <td className="px-2 py-3 text-[#006B6A]">
                    {item.cardCode}
                  </td>
                  <td className="px-2 py-3 font-semibold text-[#006B6A]">
                    {item.amount}
                  </td>
                  <td className="px-2 py-3">{item.employee}</td>
                  <td className="px-2 py-3">{item.nationalId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
