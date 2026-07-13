import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// Validates req.body/query/params against a Zod schema before the controller runs
export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
  schema.parse({ body: req.body, query: req.query, params: req.params });
  next();
};
