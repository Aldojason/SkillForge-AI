import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayButton } from "../components/ui/ClayButton";
import { useAuth } from "../context/AuthContext";

export default function PremiumSuccess() {
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Refetch the user profile to capture the PREMIUM role update
    refetchUser();
  }, [refetchUser]);

  return (
    <main className="flex-1 grid place-items-center px-4 py-16">
      <ClayCard className="w-full max-w-md text-center flex flex-col items-center gap-5">
        <div className="clay-coin w-20 h-20 rounded-full grid place-items-center text-[#F2ECDF]">
          <Sparkles size={36} className="animate-spin-slow" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-bold text-ink">Upgrade Successful!</h1>
          <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} /> Premium Access Unlocked
          </p>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Thank you for upgrading! You now have unlimited access to AI Resume Reviews, AI Mock Interviews, 
          customized placement prep roadmaps, and daily study coach guidelines.
        </p>

        <ClayButton
          variant="primary"
          onClick={() => navigate("/dashboard")}
          className="w-full mt-2 flex items-center justify-center gap-2"
        >
          Go to Dashboard <ArrowRight size={16} />
        </ClayButton>
      </ClayCard>
    </main>
  );
}
