import { Router } from "express";
import { healthCheck, register, login } from "./auth.controller";


const router = Router();

router.get("/health", healthCheck);

router.post("/register", register);

router.post("/login", login);

export default router;