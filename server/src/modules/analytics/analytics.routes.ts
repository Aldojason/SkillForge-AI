import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";

const router = Router();
router.use(requireAuth);

router.get("/overview", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const [solved, totalProblems, tasksDone, tasksTotal, profile] = await Promise.all([
    prisma.problemProgress.count({ where: { userId, status: "SOLVED" } }),
    prisma.problem.count(),
    prisma.task.count({ where: { userId, status: "DONE" } }),
    prisma.task.count({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  return ok(res, {
    dsa: { solved, total: totalProblems },
    tasks: { done: tasksDone, total: tasksTotal },
    streak: { current: profile?.currentStreak ?? 0, longest: profile?.longestStreak ?? 0 },
  });
}));

export default router;
