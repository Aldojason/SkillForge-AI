import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

// Centralized error handler — keep this as the last middleware in app.ts
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      details: err.flatten(),
    });
  }

  if (err instanceof Error) {
    const status = (err as any).status ?? 500;
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
    return res.status(status).json({ success: false, message: err.message || "Server error" });
  }

  return res.status(500).json({ success: false, message: "Unknown server error" });
}
