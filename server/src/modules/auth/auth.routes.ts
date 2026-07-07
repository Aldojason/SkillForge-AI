import { Router } from "express";
import { healthCheck, register } from "./auth.controller";

const router = Router();

router.get("/health", healthCheck);

router.post("/register", register);

export default router;