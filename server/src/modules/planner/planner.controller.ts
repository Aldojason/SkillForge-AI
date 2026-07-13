import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { prisma } from "../../config/db";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user!.userId },
    orderBy: { dueDate: "asc" },
  });
  return ok(res, tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, studyPlanId } = req.body;
  const task = await prisma.task.create({
    data: {
      userId: req.user!.userId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      studyPlanId,
    },
  });
  return ok(res, task, 201);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return ok(res, task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  return ok(res, { message: "Task deleted" });
});
