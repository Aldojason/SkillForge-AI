import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Bookmark, Search, ExternalLink } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayInput } from "../components/ui/ClayInput";
import { ClayBadge } from "../components/ui/ClayBadge";

const DIFFICULTY_TONE: Record<string, "sprout" | "ember" | "violet"> = {
  EASY: "sprout",
  MEDIUM: "ember",
  HARD: "violet",
};

const STATUS_OPTIONS = ["TODO", "ATTEMPTED", "SOLVED", "REVISE"];

interface DsaProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  companies?: string[];
  url?: string;
  bookmarked?: boolean;
  myStatus?: string;
}

function ProblemSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="skeleton w-4 h-4 rounded" />
      <div className="flex-1 space-y-2">
        <div className="skeleton skeleton-text w-48" />
        <div className="skeleton skeleton-text-sm w-32" />
      </div>
      <div className="skeleton w-16 h-6 rounded-full" />
      <div className="skeleton w-24 h-8 rounded-clay-sm" />
    </div>
  );
}

export default function DsaTracker() {
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: problems, isLoading, error } = useQuery<DsaProblem[]>({
    queryKey: ["problems", search, filterDifficulty],
    queryFn: async () =>
      (await api.get("/dsa/problems", { params: { search, difficulty: filterDifficulty || undefined } })).data.data,
  });

  const updateProgress = useMutation({
    mutationFn: async ({ id, ...body }: { id: string; status?: string; bookmarked?: boolean }) =>
      api.patch(`/dsa/problems/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
      toast.success("Progress updated");
    },
    onError: () => toast.error("Failed to update progress"),
  });

  const solved = problems?.filter((p) => p.myStatus === "SOLVED").length ?? 0;
  const total = problems?.length ?? 0;
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 page-enter">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">DSA Tracker</h1>
          <p className="text-sm text-muted mt-1">
            {solved} of {total} solved ({pct}%)
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-3 text-muted pointer-events-none" />
            <ClayInput
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!pl-8"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="clay-inset rounded-clay-sm text-sm px-3 py-2.5 outline-none"
          >
            <option value="">All</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Progress bar */}
      <div className="clay-inset rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sprout to-sprout-light rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Problem list */}
      <ClayCard className="!p-0 overflow-hidden">
        {isLoading && (
          <div className="divide-y divide-surfaceDeep">
            {[...Array(5)].map((_, i) => <ProblemSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-ember font-medium">Failed to load problems.</p>
            <p className="text-sm text-muted mt-1">Check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !error && problems?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted font-medium">No problems found.</p>
            <p className="text-sm text-muted mt-1">
              {search ? "Try a different search term." : "Ask an admin to seed problems, or create one."}
            </p>
          </div>
        )}

        <ul className="divide-y divide-surfaceDeep">
          {problems?.map((p, idx) => (
            <li
              key={p.id}
              className={`flex items-center justify-between gap-4 px-4 sm:px-6 py-4 hover:bg-surfaceDeep/20 transition-colors animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => updateProgress.mutate({ id: p.id, bookmarked: !p.bookmarked })}
                  className="shrink-0 transition-colors"
                  aria-label={p.bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark
                    size={16}
                    className={p.bookmarked ? "text-ember fill-ember" : "text-muted hover:text-ember"}
                  />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.title}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary shrink-0">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted">{p.topic} · {p.companies?.join(", ") || "General"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <ClayBadge tone={DIFFICULTY_TONE[p.difficulty] ?? "violet"}>
                  {p.difficulty}
                </ClayBadge>
                <select
                  value={p.myStatus}
                  onChange={(e) => updateProgress.mutate({ id: p.id, status: e.target.value })}
                  className={`clay-inset rounded-clay-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 outline-none font-medium ${
                    p.myStatus === "SOLVED" ? "text-sprout" : p.myStatus === "REVISE" ? "text-ember" : ""
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      </ClayCard>
    </div>
  );
}
