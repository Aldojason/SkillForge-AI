import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";

const router = Router();
router.use(requireAuth);

router.get("/profile", asyncHandler(async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { userId: req.user!.userId } });
  return ok(res, profile);
}));

router.patch("/profile", asyncHandler(async (req, res) => {
  const profile = await prisma.profile.update({
    where: { userId: req.user!.userId },
    data: req.body,
  });
  return ok(res, profile);
}));

export default router;
