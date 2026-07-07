import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  );
}

export default MainLayout;