import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Good Morning, Jason 👋
        </h1>

        <p className="text-slate-400">
          Keep your placement streak alive.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="🔥 Streak"
          value="12 Days"
          subtitle="Current streak"
        />

        <StatCard
          title="📚 Problems"
          value="148"
          subtitle="Solved"
        />

        <StatCard
          title="⏱ Study Hours"
          value="84"
          subtitle="This month"
        />

        <StatCard
          title="⭐ ATS Score"
          value="91%"
          subtitle="Resume Score"
        />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          Weekly Progress
        </div>

        <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          Today's Tasks
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          Recent Activity
        </div>

        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          AI Recommendation
        </div>

      </div>

    </div>
  );
}