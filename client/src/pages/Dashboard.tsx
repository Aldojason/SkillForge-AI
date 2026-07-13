import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ClayCard } from "../components/ui/ClayCard";
import { Flame, Code2, ListChecks, ArrowRight, Sparkles, FileText, CalendarClock } from "lucide-react";

function StatSkeleton() {
  return (
    <ClayCard className="flex items-center gap-4">
      <div className="skeleton skeleton-circle w-12 h-12" />
      <div className="flex-1">
        <div className="skeleton skeleton-text w-16" />
        <div className="skeleton skeleton-text-sm w-20 mt-1" />
      </div>
    </ClayCard>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await api.get("/analytics/overview")).data.data,
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 page-enter">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted mt-1">Here's where your prep stands today.</p>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-5">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : error ? (
        <ClayCard className="text-center py-8">
          <p className="text-ember font-medium">Failed to load stats.</p>
          <p className="text-sm text-muted mt-1">Check your connection and refresh the page.</p>
        </ClayCard>
      ) : (
        <div className="grid sm:grid-cols-3 gap-5">
          <ClayCard className="flex items-center gap-4 animate-fade-in-up">
            <div className="clay-coin w-12 h-12 rounded-full grid place-items-center text-white">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{data?.streak?.current ?? 0}</p>
              <p className="text-sm text-muted">day streak</p>
            </div>
          </ClayCard>

          <ClayCard className="flex items-center gap-4 animate-fade-in-up stagger-1">
            <div className="clay-inset rounded-clay-sm p-3 text-primary">
              <Code2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">
                {data?.dsa?.solved ?? 0}
                <span className="text-muted text-base">/{data?.dsa?.total ?? 0}</span>
              </p>
              <p className="text-sm text-muted">problems solved</p>
            </div>
          </ClayCard>

          <ClayCard className="flex items-center gap-4 animate-fade-in-up stagger-2">
            <div className="clay-inset rounded-clay-sm p-3 text-sprout">
              <ListChecks size={20} />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">
                {data?.tasks?.done ?? 0}
                <span className="text-muted text-base">/{data?.tasks?.total ?? 0}</span>
              </p>
              <p className="text-sm text-muted">tasks complete</p>
            </div>
          </ClayCard>
        </div>
      )}

      {/* Quick actions */}
      <ClayCard className="animate-fade-in-up stagger-3">
        <h2 className="font-display text-xl font-semibold mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { to: "/dsa", label: "Log a DSA problem", icon: Code2, color: "text-primary" },
            { to: "/planner", label: "Add a study task", icon: CalendarClock, color: "text-sprout" },
            { to: "/resume", label: "Review your resume", icon: FileText, color: "text-ember" },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="clay-btn rounded-clay-sm px-4 py-3 text-sm font-semibold flex items-center gap-3 group"
            >
              <Icon size={18} className={color} />
              <span className="flex-1">{label}</span>
              <ArrowRight size={14} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </ClayCard>

      {/* AI Coach teaser */}
      <ClayCard className="animate-fade-in-up stagger-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-ember to-sprout" />
        <div className="flex items-start gap-4 pt-2">
          <div className="clay-inset rounded-clay-sm p-3 text-primary shrink-0">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold mb-1">AI Study Coach</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Get personalised daily recommendations based on your progress. The AI analyses your solved problems and pending tasks to suggest what to focus on next.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group"
            >
              Open Study Planner
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
