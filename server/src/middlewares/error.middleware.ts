import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Inside global error handler");
  console.error(err.stack);
  console.error(err.message);
  console.error(err.status);
  

  // Handle AppErrors
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // Handle Mongoose errors
  if (err.name === "MongoError") {
    res.status(503).json({ error: "Database unavailable" });
    return;
  }

  // Fallback
  res.status(500).json({ error: "Something went wrong" });
};

export default globalErrorHandler;
