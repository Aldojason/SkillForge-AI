import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";
import { generateStudyCoachRecommendations, generateCompanyRoadmap } from "../../services/ai.service";

const router = Router();
router.use(requireAuth);

// Get daily study recommendations based on student's current progress
router.get("/recommendations", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // 1. Get user profile and target company
  const profile = await prisma.profile.findUnique({ where: { userId } });
  const targetCompany = profile?.targetCompany ?? null;

  // 2. Fetch completed DSA problems
  const solvedProgress = await prisma.problemProgress.findMany({
    where: { userId, status: "SOLVED" },
    include: { problem: true },
  });
  const solvedProblems = solvedProgress.map((sp) => sp.problem.title);

  // 3. Fetch pending tasks
  const pendingTasks = await prisma.task.findMany({
    where: { userId, status: "PENDING" },
    select: { title: true },
  });
  const pendingTitles = pendingTasks.map((t) => t.title);

  // 4. Generate recommendations using AI Service
  const recommendations = await generateStudyCoachRecommendations(solvedProblems, pendingTitles, targetCompany);

  return ok(res, recommendations);
}));

// Generate prep roadmap for a selected company
router.post("/roadmap", asyncHandler(async (req, res) => {
  const { company } = req.body;
  if (!company) {
    return res.status(400).json({ success: false, message: "Company name is required" });
  }

  const roadmap = await generateCompanyRoadmap(company);
  return ok(res, roadmap);
}));

// Apply a generated company prep roadmap (saving tasks to user's database study plan)
router.post("/roadmap/apply", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { company, roadmap } = req.body;

  if (!company || !roadmap || !roadmap.topics) {
    return res.status(400).json({ success: false, message: "Company and roadmap details are required" });
  }

  // 1. Create a study plan for the target company
  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      title: `${company} Preparation Plan`,
      targetCompany: company,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days plan
    },
  });

  // 2. Create tasks based on the roadmap's topics and problems
  const tasksToCreate = [];

  for (const topic of roadmap.topics) {
    // Add a general study task for this topic
    tasksToCreate.push({
      userId,
      studyPlanId: studyPlan.id,
      title: `Study Topic: ${topic.name} (Priority: ${topic.priority})`,
      description: `Focus Areas: ${roadmap.focusAreas.join(", ")}`,
      status: "PENDING" as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 1 week
    });

    // Add individual tasks for the recommended problems
    for (const prob of topic.problems) {
      tasksToCreate.push({
        userId,
        studyPlanId: studyPlan.id,
        title: `Solve DSA: ${prob.title} (${prob.difficulty})`,
        description: `Recommended practice problem for ${company} placement preparation. Slug: ${prob.slug}`,
        status: "PENDING" as const,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });
    }
  }

  // Insert tasks in database
  await prisma.task.createMany({
    data: tasksToCreate,
  });

  // 3. Update the student's profile target company
  await prisma.profile.update({
    where: { userId },
    data: { targetCompany: company },
  });

  return ok(res, { message: "Roadmap applied and tasks added to planner!", studyPlanId: studyPlan.id });
}));

export default router;
