import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import * as plannerController from "./planner.controller";

const router = Router();
router.use(requireAuth);

router.get("/tasks", plannerController.getTasks);
router.post("/tasks", plannerController.createTask);
router.patch("/tasks/:id", plannerController.updateTask);
router.delete("/tasks/:id", plannerController.deleteTask);

export default router;
