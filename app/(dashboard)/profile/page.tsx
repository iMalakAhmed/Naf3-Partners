export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-[#19BBB6]/15 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,107,106,0.35)]">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Profile
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#006B6A]/10 text-2xl font-semibold text-[#006B6A]">
            AC
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-zinc-900">Ahmed Corp</h2>
            <p className="text-sm text-zinc-500">Cairo Branch • Partner</p>
          </div>
          <button className="ml-auto rounded-full border border-[#006B6A]/20 px-4 py-2 text-xs font-semibold text-[#006B6A] transition hover:bg-[#006B6A] hover:text-white">
            Edit profile
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#19BBB6]/15 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,107,106,0.35)]">
          <h3 className="text-sm font-semibold text-zinc-900">
            Branch details
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-zinc-600">
              Branch name
              <input
                defaultValue="Cairo Branch"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
              />
            </label>
            <label className="text-sm text-zinc-600">
              Partner name
              <input
                defaultValue="Ahmed Corp"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
              />
            </label>
            <label className="text-sm text-zinc-600">
              Branch email
              <input
                defaultValue="cairo.branch@naf3.org"
                type="email"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
              />
            </label>
            <label className="text-sm text-zinc-600">
              Phone number
              <input
                defaultValue="+20 10 1234 5678"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#19BBB6] focus:bg-white focus:ring-2 focus:ring-[#19BBB6]/20"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button className="rounded-2xl bg-[#006B6A] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006B6A]/30 transition hover:bg-[#19BBB6]">
              Save changes
            </button>
            <button className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition hover:border-[#006B6A] hover:text-[#006B6A]">
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#19BBB6]/15 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,107,106,0.35)]">
            <h3 className="text-sm font-semibold text-zinc-900">
              Contact person
            </h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Primary contact</span>
                <span className="font-semibold text-zinc-900">
                  Amina Soliman
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Role</span>
                <span className="font-semibold text-zinc-900">
                  Branch manager
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Working hours</span>
                <span className="font-semibold text-zinc-900">9:00 - 18:00</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#19BBB6]/15 bg-[#FFF8E5] p-6 text-sm text-[#6B4A00] shadow-[0_20px_50px_-40px_rgba(0,107,106,0.35)]">
            Keep your contact info current so the Naf3 team can reach you
            quickly about approvals.
          </div>
        </div>
      </div>
    </section>
  );
}
