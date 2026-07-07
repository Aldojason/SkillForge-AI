import { Link } from "react-router-dom";
import Button from "../ui/Button";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-cyan-400"
        >
          SkillForge AI
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Pricing
          </a>

          <a
            href="#about"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-slate-300 transition hover:text-white"
          >
            Login
          </Link>

          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;