import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { BarChart3, Flame, TrendingUp } from "lucide-react";

function ProgressBar({ label, value, total, colorFrom, colorTo }: {
  label: string; value: number; total: number; colorFrom: string; colorTo: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs font-mono text-muted">{value}/{total} ({pct}%)</p>
      </div>
      <div className="clay-inset rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${colorFrom} ${colorTo}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <ClayCard>
      <div className="skeleton skeleton-text w-24 mb-3" />
      <div className="skeleton h-4 rounded-full mb-2" />
      <div className="skeleton skeleton-text-sm w-32" />
    </ClayCard>
  );
}

export default function Analytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await api.get("/analytics/overview")).data.data,
  });

  if (error) {
    return (
      <div className="max-w-3xl mx-auto page-enter">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">Analytics</h1>
        <ClayCard className="text-center py-8">
          <p className="text-ember font-medium">Failed to load analytics.</p>
          <p className="text-sm text-muted mt-1">Check your connection and refresh the page.</p>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 page-enter">
      <div className="flex items-center gap-3">
        <div className="clay-inset rounded-clay-sm p-2.5 text-primary">
          <BarChart3 size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted">Track your preparation progress over time.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-5">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : (
        <>
          <ClayCard className="animate-fade-in-up">
            <ProgressBar
              label="DSA Progress"
              value={data?.dsa.solved ?? 0}
              total={data?.dsa.total ?? 0}
              colorFrom="from-primary"
              colorTo="to-primary-light"
            />
          </ClayCard>

          <ClayCard className="animate-fade-in-up stagger-1">
            <ProgressBar
              label="Task Completion"
              value={data?.tasks.done ?? 0}
              total={data?.tasks.total ?? 0}
              colorFrom="from-sprout"
              colorTo="to-sprout-light"
            />
          </ClayCard>

          <div className="grid sm:grid-cols-2 gap-5">
            <ClayCard className="flex items-center gap-4 animate-fade-in-up stagger-2">
              <div className="clay-coin w-16 h-16 rounded-full grid place-items-center text-white">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-3xl font-mono font-bold">{data?.streak.current ?? 0}</p>
                <p className="text-sm text-muted">Current streak</p>
              </div>
            </ClayCard>

            <ClayCard className="flex items-center gap-4 animate-fade-in-up stagger-3">
              <div className="clay-inset rounded-clay-sm p-3.5 text-ember">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-3xl font-mono font-bold">{data?.streak.longest ?? 0}</p>
                <p className="text-sm text-muted">Longest streak</p>
              </div>
            </ClayCard>
          </div>
        </>
      )}
    </div>
  );
}
