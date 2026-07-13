import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../config/db";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../shared/jwt";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error("An account with this email already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} },
      subscription: { create: { plan: "free", status: "ACTIVE" } },
    },
  });

  return issueTokens(user.id, user.role);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  return issueTokens(user.id, user.role);
}

export async function issueTokens(userId: string, role: "STUDENT" | "PREMIUM" | "ADMIN") {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId });

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(oldToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!stored || stored.expiresAt < new Date()) {
    const err: any = new Error("Refresh token invalid or expired");
    err.status = 401;
    throw err;
  }

  let payload: { userId: string };
  try {
    payload = verifyRefreshToken(oldToken);
  } catch {
    // Token has an invalid or expired JWT signature — clean it up and reject
    await prisma.refreshToken.deleteMany({ where: { token: oldToken } });
    const err: any = new Error("Refresh token invalid or expired");
    err.status = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    await prisma.refreshToken.deleteMany({ where: { token: oldToken } });
    const err: any = new Error("User no longer exists");
    err.status = 401;
    throw err;
  }

  // Use deleteMany to avoid P2025 crash if concurrent requests already deleted this token
  await prisma.refreshToken.deleteMany({ where: { token: oldToken } });
  return issueTokens(user.id, user.role);
}

export async function logoutUser(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      profile: true,
      subscription: { select: { plan: true, status: true } },
    },
  });
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always behave the same whether or not the user exists, to avoid leaking which emails are registered
  if (!user) return null;

  const token = crypto.randomBytes(32).toString("hex");
  // In production: persist a hashed token + expiry (e.g. a PasswordResetToken model) and email the raw token.
  // Wire up your SMTP provider (see .env.example) inside this function.
  return token;
}
