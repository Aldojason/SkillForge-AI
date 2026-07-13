import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import * as dsaController from "./dsa.controller";

const router = Router();
router.use(requireAuth);

router.get("/problems", dsaController.getProblems);
router.post("/problems", requireRole("ADMIN"), dsaController.createProblem);
router.patch("/problems/:id", dsaController.updateProgress); // updates the caller's progress on a problem
router.delete("/problems/:id", requireRole("ADMIN"), dsaController.removeProblem);
router.get("/heatmap", dsaController.heatmap);

export default router;
