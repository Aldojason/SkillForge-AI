import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Sparkles, Mic, MicOff, MessageSquare, Play, HelpCircle, History, Award, CheckCircle } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayButton } from "../components/ui/ClayButton";
import { ClayInput } from "../components/ui/ClayInput";
import { useAuth } from "../context/AuthContext";

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface InterviewSession {
  id: string;
  company: string;
  role: string;
  score?: number | null;
  createdAt: string;
  feedback?: {
    strengths?: string[];
    improvements?: string[];
    tips?: string;
  };
  transcript?: Array<{ question: string; answer?: string }>;
}

const COMPANIES = ["Google", "Amazon", "Microsoft", "Zoho", "TCS", "Infosys"];

export default function MockInterview() {
  useAuth();
  const [step, setStep] = useState<"setup" | "active" | "history" | "feedback">("setup");
  
  // Setup state
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Frontend Engineer");

  // Active session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);

  // Selected session for viewing feedback
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event: SpeechRecognitionEventLike) => {
        const text = event.results[event.results.length - 1][0].transcript;
        setCurrentAnswer((prev) => prev + (prev ? " " : "") + text);
      };

      rec.onerror = (e: unknown) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Fetch Session History
  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ["interview-history"],
    queryFn: async () => (await api.get("/interview/history")).data.data,
    enabled: step === "history" || step === "setup",
  });

  // Start Session Mutation
  const startSession = useMutation({
    mutationFn: async () =>
      (await api.post("/interview/start", { company, role })).data.data,
    onSuccess: (data) => {
      setSessionId(data.id);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers(new Array(data.questions.length).fill(""));
      setCurrentAnswer("");
      setStep("active");
      toast.success("Interview started!");
    },
    onError: () => {
      toast.error("Failed to start interview session.");
    },
  });

  // Submit Session Mutation
  const submitSession = useMutation({
    mutationFn: async (transcript: { question: string; answer: string }[]) =>
      (await api.post(`/interview/${sessionId}/submit`, { transcript })).data.data,
    onSuccess: (data) => {
      setSelectedSession(data);
      setStep("feedback");
      refetchHistory();
      toast.success("Interview completed! Generating feedback.");
    },
    onError: () => {
      toast.error("Evaluation failed.");
    },
  });

  // Toggle Recording function
  function toggleRecording() {
    if (!recognition) {
      toast.error("Speech recognition not supported in this browser. Please type your answer.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      toast.success("Listening... Speak clearly into your mic.");
    }
  }

  // Next Question navigation
  function handleNext() {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer(answers[currentIndex + 1] || "");
    } else {
      // Final Submit
      const transcript = questions.map((q, idx) => ({
        question: q,
        answer: idx === currentIndex ? currentAnswer.trim() : updatedAnswers[idx],
      }));

      // Check if any answers are completely empty
      const emptyCount = transcript.filter((t) => !t.answer).length;
      if (emptyCount === transcript.length) {
        toast.error("You must answer at least one question.");
        return;
      }

      submitSession.mutate(transcript);
    }
  }

  // Back Question navigation
  function handleBack() {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCurrentAnswer(updatedAnswers[currentIndex - 1] || "");
    }
  }

  function viewSessionFeedback(sess: InterviewSession) {
    setSelectedSession(sess);
    setStep("feedback");
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-surfaceDeep pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Mock Interview
          </h1>
          <p className="text-sm text-muted">Prepare with real company standards and speech feedback.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep("setup")}
            className={`px-3.5 py-1.5 rounded-clay-sm text-xs font-semibold ${
              step === "setup" ? "clay-inset text-primary" : "clay-btn"
            }`}
          >
            New Interview
          </button>
          <button
            onClick={() => setStep("history")}
            className={`px-3.5 py-1.5 rounded-clay-sm text-xs font-semibold ${
              step === "history" ? "clay-inset text-primary" : "clay-btn"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {step === "setup" && (
        <div className="grid md:grid-cols-3 gap-6">
          <ClayCard className="md:col-span-2 flex flex-col gap-5">
            <h2 className="font-display text-xl font-semibold mb-2">Configure Practice Session</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink">Select Target Company</label>
              <div className="grid grid-cols-3 gap-2">
                {COMPANIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCompany(c)}
                    className={`px-3 py-2.5 rounded-clay-sm text-sm font-semibold transition-all ${
                      company === c ? "clay-inset text-primary border-primary" : "clay-btn text-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-ink">Select Target Role</label>
              <ClayInput
                placeholder="e.g. SDE-1, Frontend Developer, Backend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <ClayButton
              variant="primary"
              onClick={() => startSession.mutate()}
              disabled={startSession.isPending}
              className="mt-4 flex items-center justify-center gap-2"
            >
              {startSession.isPending ? (
                "Constructing questions..."
              ) : (
                <>
                  <Play size={16} /> Start Practice
                </>
              )}
            </ClayButton>
          </ClayCard>

          <div className="flex flex-col gap-4">
            <ClayCard className="flex-1">
              <h3 className="font-display font-semibold mb-2 flex items-center gap-1.5 text-md text-ink">
                <HelpCircle size={18} className="text-primary" /> How it works
              </h3>
              <ul className="text-xs text-muted space-y-2.5 list-disc list-inside">
                <li>AI analyzes company standards and constructs 5 tailored questions.</li>
                <li>Use standard typing or press the mic button for continuous speech-to-text.</li>
                <li>Submit answers to receive grading, grammar advice, and structural pointers.</li>
              </ul>
            </ClayCard>
            <ClayCard className="flex-1 bg-surfaceLight">
              <h3 className="font-display font-semibold mb-2 text-md text-ink">Premium Perks</h3>
              <p className="text-xs text-muted leading-relaxed">
                Premium accounts get unlimited mock interviews, customized AI coach queries, and ATS-integrated reviews.
              </p>
            </ClayCard>
          </div>
        </div>
      )}

      {step === "active" && (
        <ClayCard className="flex flex-col gap-6 relative">
          <div className="flex justify-between items-center text-sm font-mono text-muted border-b border-surfaceDeep pb-3">
            <span>Q{currentIndex + 1} of {questions.length}</span>
            <span>{company} · {role}</span>
          </div>

          <div className="py-2">
            <h3 className="text-lg font-semibold leading-relaxed text-ink flex items-start gap-2">
              <MessageSquare size={20} className="text-primary mt-1 shrink-0" />
              {questions[currentIndex]}
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted font-semibold">Your Answer</span>
              {recognition && (
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-clay-sm transition-all ${
                    isRecording
                      ? "bg-red-100 text-red-600 animate-pulse border border-red-300"
                      : "clay-btn hover:text-red-500"
                  }`}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? "Stop Recording" : "Record Answer"}
                </button>
              )}
            </div>
            <textarea
              className="clay-inset rounded-clay-sm p-4 text-sm min-h-[140px] resize-none outline-none focus-visible:outline-none"
              placeholder="Type your answer here, or click 'Record Answer' to dictate speech..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
          </div>

          <div className="flex justify-between mt-4">
            <ClayButton onClick={handleBack} disabled={currentIndex === 0}>
              Back
            </ClayButton>
            <ClayButton
              variant="primary"
              onClick={handleNext}
              disabled={submitSession.isPending}
            >
              {submitSession.isPending ? (
                "Evaluating transcript..."
              ) : currentIndex === questions.length - 1 ? (
                "Finish & Submit"
              ) : (
                "Next Question"
              )}
            </ClayButton>
          </div>
        </ClayCard>
      )}

      {step === "feedback" && selectedSession && (
        <div className="flex flex-col gap-6">
          <ClayCard className="flex items-center gap-5 justify-between flex-wrap">
            <div className="flex items-center gap-4">
              <div className="clay-coin w-20 h-20 rounded-full grid place-items-center text-[#F2ECDF] font-mono font-bold text-2xl">
                {selectedSession.score}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Interview Results</h2>
                <p className="text-sm text-muted">
                  Practice session for {selectedSession.company} ({selectedSession.role})
                </p>
              </div>
            </div>
            <ClayButton onClick={() => setStep("setup")}>Start Another</ClayButton>
          </ClayCard>

          <div className="grid md:grid-cols-2 gap-6">
            <ClayCard className="flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2 text-ink">
                <CheckCircle className="text-sprout" /> Strong Strengths
              </h3>
              <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
                {selectedSession.feedback?.strengths?.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                )) || <li>Solid core logic and technical articulation.</li>}
              </ul>
            </ClayCard>

            <ClayCard className="flex flex-col gap-4">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2 text-ink">
                <Award className="text-ember" /> Areas of Improvement
              </h3>
              <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
                {selectedSession.feedback?.improvements?.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                )) || <li>Expand on edge cases and caching optimizations.</li>}
              </ul>
            </ClayCard>
          </div>

          <ClayCard>
            <h3 className="font-display text-lg font-semibold mb-2 text-ink">AI Placement Tips</h3>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
              {selectedSession.feedback?.tips ?? "Prepare behavioral instances matching the STAR model."}
            </p>
          </ClayCard>

          <ClayCard className="!p-0 overflow-hidden">
            <h3 className="font-display text-md font-semibold px-6 py-4 border-b border-surfaceDeep">
              Session Transcript
            </h3>
            <ul className="divide-y divide-surfaceDeep">
              {selectedSession.transcript?.map((t, idx) => (
                <li key={idx} className="p-6 flex flex-col gap-2">
                  <p className="font-semibold text-sm text-primary">Q: {t.question}</p>
                  <p className="text-sm text-muted leading-relaxed italic bg-surfaceLight p-3 rounded-clay-sm clay-inset">
                    &ldquo;{t.answer || "(No response)"}&rdquo;
                  </p>
                </li>
              ))}
            </ul>
          </ClayCard>
        </div>
      )}

      {step === "history" && (
        <ClayCard className="!p-0 overflow-hidden">
          {history?.length === 0 ? (
            <p className="p-6 text-muted text-center">No practice sessions found. Start a new one above!</p>
          ) : (
            <ul className="divide-y divide-surfaceDeep">
              {history?.map((h: InterviewSession) => (
                <li key={h.id} className="flex items-center justify-between gap-4 px-6 py-5 flex-wrap">
                  <div className="flex items-center gap-3">
                    <History className="text-muted shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-ink">{h.company} · {h.role}</p>
                      <p className="text-xs text-muted">
                        {new Date(h.createdAt).toLocaleDateString()} at {new Date(h.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {h.score !== null && (
                      <span className="font-mono font-bold clay-inset rounded-clay-sm px-2.5 py-1 text-sm">
                        Score: {h.score}
                      </span>
                    )}
                    <button
                      onClick={() => viewSessionFeedback(h)}
                      className="clay-btn rounded-clay-sm px-3.5 py-1.5 text-xs font-semibold text-ink"
                    >
                      View Report
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ClayCard>
      )}
    </div>
  );
}
