import { Link } from "react-router-dom";
import { Code2, CalendarClock, FileText, Sparkles, BarChart3, Shield, ArrowRight, Star } from "lucide-react";
import { ClayCard } from "../components/ui/ClayCard";

const features = [
  { icon: Code2, title: "DSA Tracker", desc: "Log every problem, tag it by company, revisit with a heatmap of your grind.", color: "text-primary" },
  { icon: CalendarClock, title: "Study Planner", desc: "Weekly goals, task calendar, and an AI coach that builds your roadmap.", color: "text-sprout" },
  { icon: FileText, title: "AI Resume Review", desc: "ATS scoring, grammar checks, and the exact skills you're still missing.", color: "text-ember" },
  { icon: Sparkles, title: "AI Mock Interviews", desc: "Company-specific questions with real-time feedback on your answers.", color: "text-primary" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Visualise your streak, completion rates, and daily progress at a glance.", color: "text-sprout" },
  { icon: Shield, title: "Premium Roadmaps", desc: "AI-generated company prep paths that convert into actionable study plans.", color: "text-ember" },
];

const stats = [
  { value: "500+", label: "DSA Problems" },
  { value: "AI", label: "Powered Reviews" },
  { value: "6", label: "Prep Modules" },
  { value: "∞", label: "Mock Interviews" },
];

export default function Landing() {
  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
        {/* Decorative background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-ember/5 blur-3xl" />

        <span className="animate-fade-in-up inline-block clay-inset rounded-full px-5 py-2 text-xs font-mono font-semibold text-ember mb-8 tracking-wider">
          ONE DESK · EVERY PLACEMENT TOOL
        </span>

        <h1 className="animate-fade-in-up stagger-1 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-ink">
          Stop juggling six tabs to
          <br />
          <span className="text-primary relative">
            land one offer
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
              <path d="M0 6C50 2 100 2 200 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="text-primary">.</span>
        </h1>

        <p className="animate-fade-in-up stagger-2 mt-8 text-base md:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          SkillForge AI molds your DSA grind, study plan, resume, and mock interviews
          into a single, calm workspace — built for students prepping for placements.
        </p>

        <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="clay-btn-primary rounded-clay-sm px-8 py-3.5 font-semibold text-[#F2ECDF] flex items-center gap-2 group"
          >
            Start for free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/pricing" className="clay-btn rounded-clay-sm px-8 py-3.5 font-semibold">
            See pricing
          </Link>
        </div>

        {/* Quick stats */}
        <div className="animate-fade-in-up stagger-4 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map(({ value, label }) => (
            <div key={label} className="clay-inset rounded-clay-sm py-3 px-4">
              <p className="font-mono font-bold text-xl text-primary">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink animate-fade-in-up">
            Everything you need, <span className="text-primary">nothing you don't</span>
          </h2>
          <p className="text-muted mt-3 max-w-lg mx-auto animate-fade-in-up stagger-1">
            Six integrated modules, one calm workspace. No tab-hopping, no context-switching.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, idx) => (
            <ClayCard key={title} className={`flex gap-4 items-start group hover:scale-[1.01] transition-transform animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}>
              <div className={`clay-inset rounded-clay-sm p-3 ${color} shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            </ClayCard>
          ))}
        </div>
      </section>

      {/* Social proof / CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <ClayCard className="text-center py-12 px-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-ember to-sprout" />

          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-ember fill-ember" />
            ))}
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3">
            Ready to mold your career?
          </h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Join students who've streamlined their placement prep into one focused workspace.
          </p>
          <Link
            to="/register"
            className="clay-btn-primary inline-flex items-center gap-2 rounded-clay-sm px-8 py-3.5 font-semibold text-[#F2ECDF] group"
          >
            Get started — it's free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </ClayCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-surfaceDeep/50 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} SkillForge AI. Built with React + TypeScript + Prisma.
      </footer>
    </main>
  );
}
