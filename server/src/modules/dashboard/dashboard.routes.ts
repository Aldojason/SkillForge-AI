import { Router } from "express";
import { getDashboard } from "./dashboard.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getDashboard);

export default router;