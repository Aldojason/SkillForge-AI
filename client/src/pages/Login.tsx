import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayInput } from "../components/ui/ClayInput";
import { ClayButton } from "../components/ui/ClayButton";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Login failed"
          : "Login failed — check your connection and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 grid place-items-center px-4 py-16">
      <ClayCard className="w-full max-w-sm animate-fade-in-up">
        <div className="flex items-center gap-2 mb-1">
          <div className="clay-inset rounded-clay-sm p-2 text-primary">
            <LogIn size={18} />
          </div>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        </div>
        <p className="text-sm text-muted mb-6 ml-11">Log in to keep your streak alive.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-clay-sm px-4 py-3 text-sm text-red-700 mb-4 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <ClayInput
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="you@example.com"
          />
          <div className="relative">
            <ClayInput
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-muted hover:text-ink transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <ClayButton variant="primary" type="submit" disabled={submitting} className="mt-2 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-[#F2ECDF]/30 border-t-[#F2ECDF] rounded-full animate-spin" />
                Logging in…
              </>
            ) : (
              "Log in"
            )}
          </ClayButton>
        </form>
        <p className="text-sm text-muted mt-6 text-center">
          New here?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </ClayCard>
    </main>
  );
}
