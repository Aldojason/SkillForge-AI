import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 grid place-items-center text-center px-6">
      <div className="animate-fade-in-up">
        <div className="clay-coin w-24 h-24 rounded-full grid place-items-center text-[#F2ECDF] font-display text-5xl font-bold mx-auto mb-6 animate-float">
          404
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Page not found</h1>
        <p className="text-muted max-w-sm mx-auto mb-8">
          This page hasn't been molded yet. It might have been moved, or the URL could be incorrect.
        </p>
        <Link
          to="/"
          className="clay-btn-primary inline-flex items-center gap-2 rounded-clay-sm px-6 py-2.5 font-semibold text-[#F2ECDF]"
        >
          <Home size={16} /> Back home
        </Link>
      </div>
    </main>
  );
}
