import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { getDashboardData } from "./dashboard.service";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getDashboardData(req.user!.userId);
  return ok(res, data);
});