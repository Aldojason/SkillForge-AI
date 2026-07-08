import { Router } from "express";
import {
  healthCheck,
  register,
  login,
  getCurrentUser,
} from "./auth.controller";

import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/health", healthCheck);

router.post("/register", register);

router.post("/login", login);

router.get("/me", verifyToken, getCurrentUser);

export default router;