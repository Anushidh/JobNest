import { Request, Response, NextFunction } from "express";
import { IApplicantWithPlan } from "../models/applicant.model";
import { AuthenticatedApplicantRequest } from "./applicant-auth.middleware";


export const applicantPlanCheckMiddleware = async (
  req: AuthenticatedApplicantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[DEBUG] Applicant plan check middleware triggered");

    // 1. Ensure applicant is authenticated
    if (!req.applicant) {
      return res
        .status(401)
        .json({ message: "Applicant is not authenticated" });
    }

    const applicant: IApplicantWithPlan = req.applicant;

    // 2. If applications are unlimited
    if (applicant.applicationsLeft === "unlimited") {
      console.log("[DEBUG] Applicant has unlimited application quota.");
      return next();
    }

    // 3. If they have applications left
    if (
      typeof applicant.applicationsLeft === "number" &&
      applicant.applicationsLeft > 0
    ) {
      console.log(
        "[DEBUG] Applicant has applications remaining:",
        applicant.applicationsLeft
      );
      return next();
    }

    // 4. No applications left
    console.log("[ERROR] Applicant has no applications left.");
    return res.status(403).json({
      message:
        "Application limit reached - Upgrade your plan to apply to more jobs.",
    });
  } catch (error: any) {
    console.error(
      "[ERROR] Applicant plan check middleware error:",
      error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
