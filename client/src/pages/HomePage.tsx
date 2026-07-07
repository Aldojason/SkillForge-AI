import MainLayout from "../components/layout/MainLayout";

function HomePage() {
  return (
    <MainLayout>
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-bold text-cyan-400">
          SkillForge AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Your AI-powered placement preparation platform.
          Track DSA, plan your studies, build resumes,
          practice interviews, and land your dream software job.
        </p>
      </section>
    </MainLayout>
  );
}

export default HomePage;