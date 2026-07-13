import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { reviewResume } from "../../services/ai.service";

const router = Router();
router.use(requireAuth);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Upload resume to Cloudinary and create record
router.post("/upload", upload.single("resume"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

  // Upload file buffer to Cloudinary
  const fileUrl = await uploadToCloudinary(req.file.buffer, "resumes");

  const resume = await prisma.resume.create({
    data: {
      userId: req.user!.userId,
      title: req.file.originalname,
      content: {
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      fileUrl,
    },
  });
  return ok(res, resume, 201);
}));

// AI Resume Review
router.post("/review", asyncHandler(async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: "resumeId is required" });
  }

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }

  // Generate review report using AI service
  const resumeText = `Resume Title: ${resume.title}\nMetadata: ${JSON.stringify(resume.content)}`;
  const reviewResult = await reviewResume(resumeText);

  const review = await prisma.resumeReview.create({
    data: {
      userId: req.user!.userId,
      resumeId,
      atsScore: reviewResult.atsScore,
      grammarIssues: reviewResult.grammarIssues,
      suggestions: reviewResult.suggestions,
      missingSkills: reviewResult.missingSkills,
    },
  });

  return ok(res, review, 201);
}));

router.get("/reviews", asyncHandler(async (req, res) => {
  const reviews = await prisma.resumeReview.findMany({ where: { userId: req.user!.userId } });
  return ok(res, reviews);
}));

export default router;
