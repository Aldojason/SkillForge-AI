import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, users);
}));

router.get("/revenue", asyncHandler(async (req, res) => {
  const payments = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCEEDED" },
  });
  const premiumCount = await prisma.subscription.count({ where: { plan: "premium", status: "ACTIVE" } });
  return ok(res, { totalRevenue: payments._sum.amount ?? 0, activePremiumUsers: premiumCount });
}));

export default router;
