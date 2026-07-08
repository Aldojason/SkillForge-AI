import { Request, Response } from "express";
import { getDashboardData } from "./dashboard.service";

export const getDashboard = async (
  _req: Request,
  res: Response
) => {
  const data = await getDashboardData();

  return res.json({
    success: true,
    data,
  });
};