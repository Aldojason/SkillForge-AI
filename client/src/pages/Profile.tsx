import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Github, Linkedin, Globe, Target, Save } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayInput } from "../components/ui/ClayInput";
import { ClayButton } from "../components/ui/ClayButton";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ bio: "", targetCompany: "", github: "", linkedin: "", portfolio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/profile").then(({ data }) => {
      if (data.data) setForm((prev) => ({ ...prev, ...data.data }));
    }).catch(() => {
      toast.error("Could not load profile");
    }).finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/users/profile", form);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 page-enter">
      <div className="flex items-center gap-3">
        <div className="clay-inset rounded-clay-sm p-2.5 text-primary">
          <User size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">Profile</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
      </div>

      {loading ? (
        <ClayCard>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="skeleton skeleton-text-sm w-20 mb-2" />
                <div className="skeleton h-10 rounded-clay-sm" />
              </div>
            ))}
          </div>
        </ClayCard>
      ) : (
        <ClayCard className="animate-fade-in-up">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <ClayInput label="Bio" value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short intro about yourself" />
            <div className="relative">
              <ClayInput label="Target company" value={form.targetCompany ?? ""} onChange={(e) => setForm({ ...form, targetCompany: e.target.value })} placeholder="e.g. Google, Amazon" />
              <Target size={14} className="absolute right-3 bottom-3 text-muted" />
            </div>
            <div className="relative">
              <ClayInput label="GitHub" value={form.github ?? ""} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/you" />
              <Github size={14} className="absolute right-3 bottom-3 text-muted" />
            </div>
            <div className="relative">
              <ClayInput label="LinkedIn" value={form.linkedin ?? ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/you" />
              <Linkedin size={14} className="absolute right-3 bottom-3 text-muted" />
            </div>
            <div className="relative">
              <ClayInput label="Portfolio" value={form.portfolio ?? ""} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} placeholder="https://yoursite.dev" />
              <Globe size={14} className="absolute right-3 bottom-3 text-muted" />
            </div>
            <ClayButton variant="primary" type="submit" disabled={saving} className="mt-2 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#F2ECDF]/30 border-t-[#F2ECDF] rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <><Save size={16} /> Save changes</>
              )}
            </ClayButton>
          </form>
        </ClayCard>
      )}
    </div>
  );
}
