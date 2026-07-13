import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok, fail } from "../../shared/apiResponse";
import * as authService from "./auth.service";

const REFRESH_COOKIE = "sf_refresh_token";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { accessToken, refreshToken } = await authService.registerUser(name, email, password);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  return ok(res, { accessToken }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.loginUser(email, password);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  return ok(res, { accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const oldToken = req.cookies?.[REFRESH_COOKIE];
  if (!oldToken) return fail(res, "No refresh token provided", 401);

  const { accessToken, refreshToken } = await authService.rotateRefreshToken(oldToken);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  return ok(res, { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) await authService.logoutUser(token);
  res.clearCookie(REFRESH_COOKIE);
  return ok(res, { message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  if (!user) return fail(res, "User not found", 404);
  return ok(res, user);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.createPasswordResetToken(req.body.email);
  // Same response regardless of whether the email exists (prevents account enumeration)
  return ok(res, { message: "If that email is registered, a reset link has been sent." });
});
