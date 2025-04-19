import { Request, Response, NextFunction } from "express";
import EmployerPlan, { IEmployerPlan } from "../models/employer-plan.model";
import { EmployerRepository } from "../repositories/employer.repository";
import { container } from "../app/container";
import { AuthenticatedEmployerRequest } from "./employer-auth.middleware";
import { TYPES } from "../app/types";

export const employerPlanCheckMiddleware = async (
  req: AuthenticatedEmployerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const employerId = req.employer?.id;
    if (!employerId) {
      return res.status(401).json({ message: "Employer not authenticated" });
    }

    const employerRepository = container.get<EmployerRepository>(
      TYPES.EmployerRepository
    );
    const employer = await employerRepository.findById(employerId);

    if (!employer || !employer.plan) {
      return res.status(404).json({ message: "Employer or plan not found" });
    }

    const employerPlan = employer.plan
    const jobPostCount = employer.postedJobs?.length || 0;

    if (jobPostCount >= employerPlan.jobPostLimit) {
      return res.status(403).json({
        message: `Job post limit exceeded. Limit: ${employerPlan.jobPostLimit}`,
      });
    }

    const expiryDate = new Date(employer.createdAt);
    expiryDate.setDate(expiryDate.getDate() + employerPlan.durationInDays);

    if (new Date() > expiryDate) {
      return res
        .status(403)
        .json({ message: "Plan expired. Please renew your subscription." });
    }

    next();
  } catch (error: any) {
    console.error("[EmployerPlanMiddleware Error]", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
