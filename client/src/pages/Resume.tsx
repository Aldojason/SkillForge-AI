import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, FileText, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayButton } from "../components/ui/ClayButton";
import { ClayBadge } from "../components/ui/ClayBadge";

interface ResumeReview {
  atsScore: number;
  suggestions?: string[];
  missingSkills?: string[];
}

function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "sprout" : score >= 50 ? "ember" : "violet";
  const label = score >= 80 ? "Strong" : score >= 50 ? "Needs work" : "Weak";
  return (
    <ClayBadge tone={tone}>{label}</ClayBadge>
  );
}

export default function Resume() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [review, setReview] = useState<ResumeReview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Choose a resume file first");
    setUploading(true);
    setFileName(file.name);
    try {
      const form = new FormData();
      form.append("resume", file);
      const { data: uploadRes } = await api.post("/resume/upload", form);
      const { data: reviewRes } = await api.post("/resume/review", { resumeId: uploadRes.data.id });
      setReview(reviewRes.data);
      toast.success("Review ready");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Upload failed"
          : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 page-enter">
      <div className="flex items-center gap-3">
        <div className="clay-inset rounded-clay-sm p-2.5 text-primary">
          <FileText size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">AI Resume Review</h1>
          <p className="text-sm text-muted">Get an ATS score, grammar check, and missing-skill gaps.</p>
        </div>
      </div>

      <ClayCard className="flex flex-col items-center text-center gap-5 py-10 animate-fade-in-up">
        <div className="clay-inset rounded-full p-6 text-primary">
          <UploadCloud size={32} />
        </div>
        <div>
          <p className="font-semibold text-ink">Upload your resume</p>
          <p className="text-sm text-muted max-w-sm mt-1">
            PDF or DOCX format. The AI will analyze ATS compatibility, grammar, and skill gaps.
          </p>
        </div>

        <label className="clay-btn rounded-clay-sm px-5 py-2.5 text-sm font-semibold cursor-pointer hover:scale-[1.02] transition-transform">
          {fileName || "Choose file"}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>

        {fileName && (
          <p className="text-xs text-muted font-mono">{fileName}</p>
        )}

        <ClayButton variant="primary" onClick={handleUpload} disabled={uploading} className="flex items-center gap-2">
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#F2ECDF]/30 border-t-[#F2ECDF] rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles size={16} /> Upload & Review
            </>
          )}
        </ClayButton>
      </ClayCard>

      {review && (
        <div className="flex flex-col gap-5 animate-fade-in-up">
          {/* Score */}
          <ClayCard className="flex items-center gap-5">
            <div className="clay-coin w-20 h-20 rounded-full grid place-items-center text-white font-mono font-bold text-2xl shrink-0">
              {review.atsScore}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display text-xl font-semibold">ATS Score</p>
                <ScoreBadge score={review.atsScore} />
              </div>
              <p className="text-sm text-muted">out of 100</p>
              <div className="clay-inset rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    review.atsScore >= 80
                      ? "bg-gradient-to-r from-sprout to-sprout-light"
                      : review.atsScore >= 50
                      ? "bg-gradient-to-r from-ember to-ember-light"
                      : "bg-gradient-to-r from-primary to-primary-light"
                  }`}
                  style={{ width: `${review.atsScore}%` }}
                />
              </div>
            </div>
          </ClayCard>

          {/* Suggestions */}
          {review.suggestions && review.suggestions.length > 0 && (
            <ClayCard>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-sprout" /> Suggestions
              </h3>
              <ul className="space-y-2">
                {review.suggestions.map((s: string, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-sprout mt-0.5 shrink-0">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </ClayCard>
          )}

          {/* Missing skills */}
          {review.missingSkills && review.missingSkills.length > 0 && (
            <ClayCard>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-ember" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {review.missingSkills.map((s: string) => (
                  <span key={s} className="clay-inset rounded-full px-3 py-1.5 text-xs font-mono font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </ClayCard>
          )}
        </div>
      )}
    </div>
  );
}
