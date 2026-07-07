import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="flex min-h-[90vh] items-center justify-center bg-slate-950 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
          🚀 Launch Your Software Career
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white md:text-7xl">
          AI-Powered
          <br />
          Placement Preparation
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Track DSA progress, build ATS-friendly resumes,
          practice AI mock interviews,
          plan your studies,
          and land your dream software job —
          all in one platform.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-600">
            Get Started

            <ArrowRight size={20} />
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-white">
            Explore Features
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;