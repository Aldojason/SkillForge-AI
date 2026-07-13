import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import * as dsaService from "./dsa.service";

export const getProblems = asyncHandler(async (req: Request, res: Response) => {
  const { difficulty, topic, status, search } = req.query as Record<string, string>;
  const problems = await dsaService.listProblems(req.user!.userId, { difficulty, topic, status, search });
  return ok(res, problems);
});

export const createProblem = asyncHandler(async (req: Request, res: Response) => {
  const problem = await dsaService.createProblem(req.body);
  return ok(res, problem, 201);
});

export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const progress = await dsaService.upsertProgress(req.user!.userId, req.params.id, req.body);
  return ok(res, progress);
});

export const removeProblem = asyncHandler(async (req: Request, res: Response) => {
  await dsaService.deleteProblem(req.params.id);
  return ok(res, { message: "Problem deleted" });
});

export const heatmap = asyncHandler(async (req: Request, res: Response) => {
  const data = await dsaService.getHeatmap(req.user!.userId);
  return ok(res, data);
});
