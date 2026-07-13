import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";
import { generateInterviewQuestions, evaluateInterview } from "../../services/ai.service";

const router = Router();
router.use(requireAuth);

// Start an interview session
router.post("/start", asyncHandler(async (req, res) => {
  const { company, role } = req.body;
  if (!company || !role) {
    return res.status(400).json({ success: false, message: "Company and role are required" });
  }

  // Generate questions using AI service
  const questions = await generateInterviewQuestions(company, role);

  const session = await prisma.interviewSession.create({
    data: {
      userId: req.user!.userId,
      company,
      role,
      questions: questions,
    },
  });

  return ok(res, session, 201);
}));

// Submit interview transcript for evaluation
router.post("/:id/submit", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { transcript } = req.body; // array of { question, answer }

  if (!transcript || !Array.isArray(transcript)) {
    return res.status(400).json({ success: false, message: "Transcript must be an array of answers" });
  }

  const session = await prisma.interviewSession.findUnique({
    where: { id },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Interview session not found" });
  }

  if (session.userId !== req.user!.userId) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  // Evaluate the transcript using AI service
  const questionsList = session.questions as string[];
  const evaluation = await evaluateInterview(session.company, session.role, questionsList, transcript);

  const updatedSession = await prisma.interviewSession.update({
    where: { id },
    data: {
      transcript: transcript,
      feedback: evaluation.feedback,
      score: evaluation.score,
    },
  });

  return ok(res, updatedSession);
}));

// Get interview history
router.get("/history", asyncHandler(async (req, res) => {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, sessions);
}));

// Get a specific session details
router.get("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await prisma.interviewSession.findUnique({
    where: { id },
  });

  if (!session) {
    return res.status(404).json({ success: false, message: "Interview session not found" });
  }

  if (session.userId !== req.user!.userId) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  return ok(res, session);
}));

export default router;
