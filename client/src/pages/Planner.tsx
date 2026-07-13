import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, Sparkles, BookOpen, Star, CheckSquare, Target, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayInput } from "../components/ui/ClayInput";
import { ClayButton } from "../components/ui/ClayButton";

const COMPANIES = ["Google", "Amazon", "Microsoft", "Zoho", "TCS", "Infosys"];

interface PlannerTask {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
}

interface RoadmapTopic {
  name: string;
  priority: string;
  problems?: Array<{ title: string; difficulty: string }>;
}

interface RoadmapData {
  title: string;
  focusAreas?: string[];
  topics?: RoadmapTopic[];
  studyPriorities?: string[];
}

export default function Planner() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"tasks" | "coach">("tasks");

  // Task creation states
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Company Roadmap states
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  // Queries
  const { data: tasks } = useQuery<PlannerTask[]>({
    queryKey: ["tasks"],
    queryFn: async () => (await api.get("/planner/tasks")).data.data,
  });

  const { data: coachSuggestions, isLoading: loadingSuggestions } = useQuery<string[]>({
    queryKey: ["coach-suggestions"],
    queryFn: async () => (await api.get("/coach/recommendations")).data.data,
    enabled: activeTab === "coach",
  });

  // Mutations
  const createTask = useMutation({
    mutationFn: async () => api.post("/planner/tasks", { title, dueDate: dueDate || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDueDate("");
      toast.success("Task added");
    },
  });

  const toggleDone = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      api.patch(`/planner/tasks/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => api.delete(`/planner/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
    },
  });

  const generateRoadmap = useMutation({
    mutationFn: async (company: string) =>
      (await api.post("/coach/roadmap", { company })).data.data,
    onSuccess: (data) => {
      setRoadmap(data);
      toast.success("AI Prep Roadmap generated!");
    },
    onError: () => {
      toast.error("Failed to generate preparation roadmap.");
    },
  });

  const applyRoadmap = useMutation({
    mutationFn: async () =>
      api.post("/coach/roadmap/apply", { company: selectedCompany, roadmap }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-overview"] });
      toast.success("Roadmap applied! Tasks loaded into your Planner.");
      setActiveTab("tasks");
    },
    onError: () => {
      toast.error("Failed to apply roadmap.");
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate();
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-surfaceDeep pb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Study Planner</h1>
          <p className="text-sm text-muted">Manage your task calendar and customize AI roadmaps.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3.5 py-1.5 rounded-clay-sm text-xs font-semibold ${
              activeTab === "tasks" ? "clay-inset text-primary" : "clay-btn"
            }`}
          >
            Tasks & Schedule
          </button>
          <button
            onClick={() => setActiveTab("coach")}
            className={`px-3.5 py-1.5 rounded-clay-sm text-xs font-semibold flex items-center gap-1.5 ${
              activeTab === "coach" ? "clay-inset text-primary" : "clay-btn"
            }`}
          >
            <Sparkles size={14} className="text-primary" /> AI Coach & Roadmaps
          </button>
        </div>
      </div>

      {activeTab === "tasks" && (
        <div className="flex flex-col gap-6">
          <ClayCard>
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <ClayInput
                  placeholder="e.g. Revise Binary Search"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <ClayInput
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="sm:w-44"
              />
              <ClayButton variant="primary" type="submit" className="flex items-center gap-2 justify-center">
                <Plus size={16} /> Add task
              </ClayButton>
            </form>
          </ClayCard>

          <ClayCard className="!p-0 overflow-hidden">
            {tasks?.length === 0 && <p className="p-6 text-muted text-center">No tasks yet — add your first one above.</p>}
            <ul className="divide-y divide-surfaceDeep">
              {tasks?.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <label className="flex items-center gap-3 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.status === "DONE"}
                      onChange={(e) =>
                        toggleDone.mutate({ id: t.id, status: e.target.checked ? "DONE" : "PENDING" })
                      }
                      className="w-5 h-5 accent-sprout"
                    />
                    <span className={`truncate ${t.status === "DONE" ? "line-through text-muted" : ""}`}>
                      {t.title}
                    </span>
                  </label>
                  <div className="flex items-center gap-3 shrink-0">
                    {t.dueDate && (
                      <span className="text-xs font-mono text-muted">
                        {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTask.mutate(t.id)}
                      className="text-muted hover:text-ember"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </ClayCard>
        </div>
      )}

      {activeTab === "coach" && (
        <div className="flex flex-col gap-6">
          {/* Daily Suggestions */}
          <ClayCard className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold flex items-center gap-2 text-ink">
              <Sparkles className="text-primary" /> Daily AI Study Guidelines
            </h2>
            {loadingSuggestions ? (
              <p className="text-sm text-muted">Calculating daily plan based on your progress...</p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {coachSuggestions?.map((s: string, idx: number) => (
                  <div key={idx} className="clay-inset rounded-clay-sm p-4 text-xs text-muted flex flex-col gap-2 relative border border-[#c7bea9]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-primary">TIP {idx + 1}</span>
                      <CheckCircle2 size={14} className="text-sprout" />
                    </div>
                    <p className="leading-relaxed font-medium text-ink">{s}</p>
                  </div>
                ))}
              </div>
            )}
          </ClayCard>

          {/* Company Roadmaps */}
          <div className="grid md:grid-cols-3 gap-6">
            <ClayCard className="md:col-span-1 flex flex-col gap-4 h-fit">
              <h3 className="font-display font-semibold text-md text-ink flex items-center gap-2">
                <Target size={18} className="text-primary" /> Target Prep Mode
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Select a target company to load specific DSA topics, interview questions, and priority lists.
              </p>
              
              <div className="flex flex-col gap-2">
                {COMPANIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCompany(c)}
                    className={`px-3.5 py-2.5 rounded-clay-sm text-xs font-semibold transition-all text-left ${
                      selectedCompany === c ? "clay-inset text-primary" : "clay-btn"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <ClayButton
                variant="primary"
                onClick={() => generateRoadmap.mutate(selectedCompany)}
                disabled={generateRoadmap.isPending}
                className="w-full mt-2"
              >
                {generateRoadmap.isPending ? "Generating..." : "Generate Roadmap"}
              </ClayButton>
            </ClayCard>

            <div className="md:col-span-2">
              {roadmap ? (
                <ClayCard className="flex flex-col gap-5 border border-primary-light">
                  <div className="flex justify-between items-center border-b border-surfaceDeep pb-3">
                    <h3 className="font-display font-bold text-lg text-ink">{roadmap.title}</h3>
                    <ClayButton
                      onClick={() => applyRoadmap.mutate()}
                      disabled={applyRoadmap.isPending}
                      className="!px-3.5 !py-1.5 text-xs text-primary"
                    >
                      {applyRoadmap.isPending ? "Applying..." : "Apply to Planner"}
                    </ClayButton>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-primary uppercase mb-2 flex items-center gap-1.5">
                      <BookOpen size={14} /> Core Focus Areas
                    </h4>
                    <ul className="list-disc list-inside text-xs text-muted space-y-1">
                      {roadmap.focusAreas?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-ember uppercase mb-2 flex items-center gap-1.5">
                      <Star size={14} /> DSA Focus Topics
                    </h4>
                    <div className="flex flex-col gap-3">
                      {roadmap.topics?.map((t, i) => (
                        <div key={i} className="clay-inset rounded-clay-sm p-3 flex flex-col gap-1.5 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{t.name}</span>
                            <span className={t.priority === "High" ? "text-ember" : "text-muted"}>
                              {t.priority} Priority
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {t.problems?.map((p, idx) => (
                              <span key={idx} className="bg-[#f2ecdf] text-ink px-2 py-0.5 rounded text-[10px] font-mono border border-surfaceDeep">
                                {p.title} ({p.difficulty})
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-primary uppercase mb-2 flex items-center gap-1.5">
                      <CheckSquare size={14} /> Study Priorities
                    </h4>
                    <ol className="list-decimal list-inside text-xs text-muted space-y-1.5">
                      {roadmap.studyPriorities?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ol>
                  </div>
                </ClayCard>
              ) : (
                <ClayCard className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2 border-surfaceDeep">
                  <Target size={32} className="text-muted mb-3" />
                  <p className="font-medium text-ink">No Roadmap Generated</p>
                  <p className="text-xs text-muted max-w-xs mt-1">
                    Select a target company on the left and click &ldquo;Generate Roadmap&rdquo; to analyze placement structures.
                  </p>
                </ClayCard>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

