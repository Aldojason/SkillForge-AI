import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";

function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Features />
    </MainLayout>
  );
}

export default HomePage;