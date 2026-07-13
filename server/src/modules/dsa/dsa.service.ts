import { prisma } from "../../config/db";

export async function listProblems(userId: string, filters: { difficulty?: string; topic?: string; status?: string; search?: string }) {
  const problems = await prisma.problem.findMany({
    where: {
      difficulty: filters.difficulty as any,
      topic: filters.topic ? { equals: filters.topic, mode: "insensitive" } : undefined,
      title: filters.search ? { contains: filters.search, mode: "insensitive" } : undefined,
    },
    include: { progress: { where: { userId } } },
    orderBy: { createdAt: "asc" },
  });

  return problems.map((p: (typeof problems)[number]) => ({
    ...p,
    myStatus: p.progress[0]?.status ?? "TODO",
    bookmarked: p.progress[0]?.bookmarked ?? false,
    notes: p.progress[0]?.notes ?? null,
    progress: undefined,
  }));
}

export async function upsertProgress(userId: string, problemId: string, data: { status?: string; notes?: string; bookmarked?: boolean }) {
  return prisma.problemProgress.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: {
      status: data.status as any,
      notes: data.notes,
      bookmarked: data.bookmarked,
      solvedAt: data.status === "SOLVED" ? new Date() : undefined,
    },
    create: {
      userId,
      problemId,
      status: (data.status as any) ?? "TODO",
      notes: data.notes,
      bookmarked: data.bookmarked ?? false,
    },
  });
}

export async function createProblem(input: { title: string; slug: string; difficulty: string; topic: string; companies?: string[]; url?: string }) {
  return prisma.problem.create({ data: input as any });
}

export async function deleteProblem(id: string) {
  return prisma.problem.delete({ where: { id } });
}

export async function getHeatmap(userId: string) {
  const solved = await prisma.problemProgress.findMany({
    where: { userId, status: "SOLVED", solvedAt: { not: null } },
    select: { solvedAt: true },
  });

  const counts: Record<string, number> = {};
  for (const row of solved) {
    const day = row.solvedAt!.toISOString().slice(0, 10);
    counts[day] = (counts[day] ?? 0) + 1;
  }
  return counts;
}
