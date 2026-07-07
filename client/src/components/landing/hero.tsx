import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";

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
                    <Button size="lg">
                        Get Started
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                    >
                        Explore Features
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default Hero;