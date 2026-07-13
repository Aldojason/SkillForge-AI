import { prisma } from "../../config/db";

export async function getDashboardData(userId: string) {
  const [profile, solvedCount, totalProblems, tasksDone, tasksTotal, recentTasks] =
    await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.problemProgress.count({ where: { userId, status: "SOLVED" } }),
      prisma.problem.count(),
      prisma.task.count({ where: { userId, status: "DONE" } }),
      prisma.task.count({ where: { userId } }),
      prisma.task.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { title: true, status: true, updatedAt: true },
      }),
    ]);

  return {
    streak: profile?.currentStreak ?? 0,
    longestStreak: profile?.longestStreak ?? 0,
    problemsSolved: solvedCount,
    totalProblems,
    tasksDone,
    tasksTotal,
    recentActivity: recentTasks.map((t) => ({
      title: t.title,
      status: t.status,
      date: t.updatedAt,
    })),
  };
}