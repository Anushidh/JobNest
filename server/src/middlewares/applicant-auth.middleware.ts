import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { TYPES } from "../app/types";
import { ApplicantRepository } from "../repositories/applicant.repository";
import { container } from "../app/container";
import { IApplicantWithPlan } from "../models/applicant.model";

export interface AuthenticatedApplicantRequest extends Request {
  applicant?: IApplicantWithPlan;
}

export const applicantAuthMiddleware = async (
  req: AuthenticatedApplicantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("[DEBUG] Applicant auth middleware triggered");

    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as JwtPayload & { id: string; role: string };

    if (decoded.role !== "applicant") {
      return res
        .status(403)
        .json({ message: "Access denied - Not an applicant" });
    }

    const applicantRepository = container.get<ApplicantRepository>(
      TYPES.ApplicantRepository
    );
    const applicant = await applicantRepository.findById(decoded.id);

    if (!applicant) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Applicant not found" });
    }

    if (applicant.isBlocked) {
      return res
        .status(403)
        .json({ message: "Account blocked - Contact support" });
    }

    if (!applicant.isVerified) {
      return res
        .status(403)
        .json({ message: "Account not verified - Check your email" });
    }

    req.applicant = applicant;

    console.log("[DEBUG] Applicant authenticated:", req.applicant);
    next();
  } catch (error: any) {
    console.error("[ERROR] Applicant auth middleware error:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired - Please log in again"
        : "Invalid authentication token";

    res.status(401).json({ message });
  }
};
