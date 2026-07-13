import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@skillforge.ai" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@skillforge.ai",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      profile: { create: {} },
      subscription: { create: { plan: "free", status: "ACTIVE" } },
    },
  });

  const problems = [
    { title: "Two Sum", slug: "two-sum", difficulty: "EASY", topic: "Arrays", companies: ["Amazon", "Google"], url: "https://leetcode.com/problems/two-sum" },
    { title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "EASY", topic: "Linked List", companies: ["Microsoft"], url: "" },
    { title: "Binary Search", slug: "binary-search", difficulty: "EASY", topic: "Binary Search", companies: ["Zoho", "TCS"], url: "" },
    { title: "Merge Intervals", slug: "merge-intervals", difficulty: "MEDIUM", topic: "Arrays", companies: ["Amazon", "Microsoft"], url: "" },
    { title: "LRU Cache", slug: "lru-cache", difficulty: "MEDIUM", topic: "Design", companies: ["Amazon", "Google"], url: "" },
    { title: "Word Ladder", slug: "word-ladder", difficulty: "HARD", topic: "Graphs", companies: ["Google"], url: "" },
  ];

  for (const p of problems) {
    await prisma.problem.upsert({ where: { slug: p.slug }, update: {}, create: p as any });
  }

  console.log("Seed complete. Admin login: admin@skillforge.ai / Admin@12345");
}

main().finally(() => prisma.$disconnect());
