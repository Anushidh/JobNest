import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { TYPES } from "../app/types";
import { EmployerRepository } from "../repositories/employer.repository";
import { container } from "../app/container";
import { IEmployer, IEmployerWithPlan } from "../models/employer.model";


// Authenticated request (always use this across middleware)
export interface AuthenticatedEmployerRequest extends Request {
  employer?: IEmployerWithPlan
}

export const employerAuthMiddleware = async (
  req: AuthenticatedEmployerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[DEBUG] Employer auth middleware triggered");

    // 1. Extract token from header
    const authHeader = req.header("Authorization");
    console.log(authHeader);
    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      console.log("1");
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    // 2. Verify JWT configuration
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.log("2");
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    // 3. Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as JwtPayload & {
      id: string;
      role: string;
    };

    console.log("[DEBUG] Decoded token:", decoded);

    // 4. Role validation
    if (decoded.role !== "employer") {
      console.log("3");
      res.status(403).json({ message: "Access denied - Not an employer" });
      return;
    }

    // 5. Fetch employer from database
    const employerRepository = container.get<EmployerRepository>(
      TYPES.EmployerRepository
    );

    const employer = await employerRepository.findById(decoded.id);

    if (!employer) {
      console.log("4");
      res.status(401).json({ message: "Unauthorized - employer not found" });
      return;
    }

    // 6. Check account status
    if (employer.isBlocked) {
      console.log("5");
      res.status(403).json({
        message: "Account blocked - Contact support",
      });
      return;
    }

    if (!employer.isVerified) {
      console.log("6");
      res.status(403).json({
        message: "Account not verified - Check your email",
      });
      return;
    }

    req.employer = employer

    console.log("[DEBUG] Employer authenticated:", req.employer);
    next();
  } catch (error: any) {
    console.error("[ERROR] Auth middleware error:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired - Please log in again"
        : "Invalid authentication token";

    res.status(401).json({
      message,
    });
    return;
  }
};
