import { Request, Response, NextFunction } from "express";
import { EmployerRepository } from "../repositories/employer.repository";
import { container } from "../app/container";
import { IEmployerWithPlan } from "../models/employer.model";
import { AuthenticatedEmployerRequest } from "./employer-auth.middleware";

export const employerPlanCheckMiddleware = async (
  req: AuthenticatedEmployerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[DEBUG] Employer plan check middleware triggered");

    // 1. Ensure employer is authenticated
    if (!req.employer) {
      return res.status(401).json({ message: "Employer is not authenticated" });
    }

    const employer: IEmployerWithPlan = req.employer;

    // 2. Check the number of job posts left for the employer
    if (employer.jobPostsLeft === "unlimited") {
      console.log("[DEBUG] Employer has unlimited job posts.");
      return next();
    }

    if (
      typeof employer.jobPostsLeft === "number" &&
      employer.jobPostsLeft > 0
    ) {
      console.log(
        "[DEBUG] Employer has job posts remaining:",
        employer.jobPostsLeft
      );
      return next();
    }

    // 3. If no job posts are left or plan does not support posting
    console.log("[ERROR] Employer cannot post a job - Job posts limit reached");
    return res.status(403).json({
      message:
        "Job posting limit reached - Upgrade your plan to post more jobs",
    });
  } catch (error: any) {
    console.error(
      "[ERROR] Employer plan check middleware error:",
      error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
