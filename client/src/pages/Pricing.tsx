import { Link } from "react-router-dom";
import { Check, Sparkles, Zap } from "lucide-react";
import { ClayCard } from "../components/ui/ClayCard";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Everything you need to get started with placement prep.",
    features: [
      "DSA problem tracker",
      "Study planner & task calendar",
      "Basic resume builder",
      "1 AI resume review / month",
      "Analytics dashboard",
    ],
    cta: "Start free",
    ctaLink: "/register",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/month",
    description: "Supercharge your prep with AI-powered coaching and unlimited reviews.",
    features: [
      "Everything in Free",
      "Unlimited AI resume reviews",
      "AI mock interviews (any company)",
      "Company-specific prep roadmaps",
      "AI study coach & daily guidelines",
      "Advanced analytics & insights",
      "Priority support",
    ],
    cta: "Go Premium",
    ctaLink: "/register",
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Simple, honest pricing
        </h1>
        <p className="text-muted mt-3 max-w-md mx-auto">
          Start free, upgrade when you're ready. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-start">
        {plans.map((p, idx) => (
          <ClayCard
            key={p.name}
            className={`flex flex-col gap-5 relative overflow-hidden animate-fade-in-up stagger-${idx + 1} ${
              p.highlight ? "border-2 border-primary/30 ring-1 ring-primary/10" : ""
            }`}
          >
            {p.highlight && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-ember to-sprout" />
            )}

            <div className="flex items-center gap-2">
              {p.highlight ? (
                <Sparkles size={20} className="text-primary" />
              ) : (
                <Zap size={20} className="text-sprout" />
              )}
              <h2 className="font-display text-2xl font-semibold">{p.name}</h2>
              {p.highlight && (
                <span className="text-[10px] font-mono font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full ml-auto">
                  POPULAR
                </span>
              )}
            </div>

            <div>
              <p className="text-4xl font-mono font-bold">
                {p.price}
                <span className="text-base text-muted font-normal">{p.period}</span>
              </p>
              <p className="text-sm text-muted mt-1">{p.description}</p>
            </div>

            <ul className="flex flex-col gap-2.5 text-sm flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-muted">
                  <Check size={16} className="text-sprout shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to={p.ctaLink}
              className={`text-center rounded-clay-sm px-5 py-3 font-semibold mt-2 transition-transform hover:scale-[1.02] ${
                p.highlight
                  ? "clay-btn-primary text-[#F2ECDF]"
                  : "clay-btn"
              }`}
            >
              {p.cta}
            </Link>
          </ClayCard>
        ))}
      </div>
    </main>
  );
}
