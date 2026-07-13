import { useState } from "react";
import toast from "react-hot-toast";
import { Settings as SettingsIcon, Bell, BellOff, Lock, AlertTriangle } from "lucide-react";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayButton } from "../components/ui/ClayButton";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 page-enter">
      <div className="flex items-center gap-3">
        <div className="clay-inset rounded-clay-sm p-2.5 text-primary">
          <SettingsIcon size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-muted">Manage your preferences and account.</p>
        </div>
      </div>

      <ClayCard className="flex items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-start gap-3">
          {notifications ? (
            <Bell size={18} className="text-sprout mt-0.5 shrink-0" />
          ) : (
            <BellOff size={18} className="text-muted mt-0.5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">Email notifications</p>
            <p className="text-sm text-muted">Daily reminders and weekly progress summaries.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setNotifications((v) => !v);
            toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
          }}
          className={`w-14 h-8 rounded-full clay-inset relative transition-colors shrink-0 ${notifications ? "bg-sprout/25" : ""}`}
          aria-label={notifications ? "Disable notifications" : "Enable notifications"}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full clay-btn transition-all ${notifications ? "left-7" : "left-1"}`}
          />
        </button>
      </ClayCard>

      <ClayCard className="flex flex-col gap-3 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} className="text-primary" />
          <p className="font-semibold">Security</p>
        </div>
        <ClayButton
          onClick={() => toast("Password reset flow is at /forgot-password")}
          className="w-full sm:w-auto"
        >
          Change password
        </ClayButton>
      </ClayCard>

      <ClayCard className="flex flex-col gap-3 animate-fade-in-up stagger-2 border border-ember/20">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-ember" />
          <p className="font-semibold text-ember">Danger zone</p>
        </div>
        <p className="text-sm text-muted">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <ClayButton
          onClick={() => toast.error("Account deletion is not yet wired — this is a safety scaffold.")}
          className="w-full sm:w-auto"
        >
          Delete account
        </ClayButton>
      </ClayCard>
    </div>
  );
}
