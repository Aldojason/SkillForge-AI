import {
  Brain,
  Code2,
  CalendarCheck,
  FileText,
} from "lucide-react";

import Card from "../ui/Card";

const features = [
  {
    icon: Code2,
    title: "DSA Tracker",
    description:
      "Track solved problems, revision status, and coding streaks.",
  },
  {
    icon: CalendarCheck,
    title: "Study Planner",
    description:
      "Plan your daily, weekly, and monthly preparation schedule.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create ATS-friendly resumes with beautiful templates.",
  },
  {
    icon: Brain,
    title: "AI Resume Review",
    description:
      "Get instant ATS scores and AI-powered resume suggestions.",
  },
];

function Features() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Everything You Need
          </h2>

          <p className="mt-4 text-slate-400">
            One platform to prepare for your dream software job.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon
                className="mb-6 text-cyan-400"
                size={36}
              />

              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;