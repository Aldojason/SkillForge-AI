import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-5">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          placeholder="Search..."
          className="w-80 rounded-xl border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="rounded-full bg-slate-800 p-3 transition hover:bg-slate-700">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=Jason"
            alt="avatar"
            className="h-10 w-10 rounded-full"
          />

          <div>
            <p className="font-semibold">Jason</p>

            <p className="text-sm text-slate-400">
              Software Engineer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}