import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { loginUser } from "./auth.service";


export const healthCheck = (_req: Request, res: Response) => {
  res.json({
    module: "Authentication",
    status: "working",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        error.errors?.[0]?.message ||
        "Registration failed",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message:
        error.message ||
        error.errors?.[0]?.message ||
        "Login failed",
    });
  }
};
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
