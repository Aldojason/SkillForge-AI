import toast from "react-hot-toast";
import { Crown, Check, Sparkles } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayButton } from "../components/ui/ClayButton";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: { name: string; email: string };
  theme: { color: string };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const premiumPerks = [
  "Unlimited AI resume reviews",
  "AI mock interviews for any company",
  "Company-specific prep roadmaps",
  "AI study coach & daily guidelines",
  "Advanced analytics & insights",
  "Priority support",
];

export default function Premium() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Razorpay Checkout failed to load. Verify your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/payments/checkout");
      const order = data.data;

      const options: RazorpayOptions = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified — Welcome to Premium!");
            window.location.href = "/premium/success";
          } catch (err: unknown) {
            const message =
              typeof err === "object" && err !== null && "response" in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Payment verification failed."
                : "Payment verification failed.";
            toast.error(message);
          }
        },
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: {
          color: "#5B4B8A",
        },
      };

      const rzp = new (window as Window & typeof globalThis & { Razorpay: new (options: RazorpayOptions) => { open: () => void } }).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Razorpay is not configured on the server."
          : "Razorpay is not configured on the server.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (user?.role === "PREMIUM" || user?.role === "ADMIN") {
    return (
      <div className="max-w-md mx-auto page-enter">
        <ClayCard className="text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-ember to-sprout" />
          <div className="clay-coin w-16 h-16 rounded-full grid place-items-center text-[#F2ECDF] mx-auto mb-4 mt-2">
            <Crown size={28} />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-2">You're on Premium 🎉</h1>
          <p className="text-muted text-sm">All AI features are unlocked. Keep crushing it.</p>
          <div className="mt-6 text-left">
            <ul className="flex flex-col gap-2">
              {premiumPerks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm text-muted">
                  <Check size={14} className="text-sprout shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </ClayCard>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto page-enter">
      <ClayCard className="text-center flex flex-col gap-5 relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-ember to-sprout" />

        <div className="clay-coin w-16 h-16 rounded-full grid place-items-center text-[#F2ECDF] mx-auto mt-2 animate-pulse-glow">
          <Sparkles size={28} />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold">Upgrade to Premium</h1>
          <p className="text-muted text-sm mt-1">Unlock the full power of AI-assisted placement prep.</p>
        </div>

        <div className="text-left">
          <ul className="flex flex-col gap-2.5">
            {premiumPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm text-muted">
                <Check size={14} className="text-sprout shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <p className="text-3xl font-mono font-bold">
            ₹499<span className="text-base text-muted font-normal">/month</span>
          </p>
        </div>

        <ClayButton
          variant="primary"
          onClick={startCheckout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#F2ECDF]/30 border-t-[#F2ECDF] rounded-full animate-spin" />
              Loading checkout…
            </>
          ) : (
            <>
              <Crown size={16} /> Upgrade now
            </>
          )}
        </ClayButton>
      </ClayCard>
    </div>
  );
}
