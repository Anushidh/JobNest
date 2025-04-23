import { injectable } from "inversify";

import Applicant, {
  IApplicant,
  IApplicantWithPlan,
} from "../models/applicant.model";
import { IApplicantRepository } from "./interfaces/IApplicantRepository";
import { AppError } from "../utils/error.util";
import { UpdateApplicantDto } from "../dtos/applicant.dto";

@injectable()
export class ApplicantRepository implements IApplicantRepository {
  private handleDatabaseError(error: unknown): never {
    console.error("Database error:", error);
    throw new AppError("Operation could not be completed", 500);
  }

  async findByEmail(email: string): Promise<IApplicantWithPlan | null> {
    try {
      return await Applicant.findOne({ email }).populate("plan");
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async create(applicantData: Partial<IApplicant>): Promise<IApplicant> {
    try {
      const applicant = new Applicant(applicantData);
      return await applicant.save();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findById(providerId: string): Promise<IApplicantWithPlan | null> {
    try {
      return await Applicant.findById(providerId).populate("plan");
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async revokeRefreshToken(providerId: string): Promise<void> {
    try {
      await Applicant.findByIdAndUpdate(providerId, { refreshToken: null });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateApplicant(applicant: IApplicant): Promise<IApplicant | null> {
    try {
      return await Applicant.findByIdAndUpdate(applicant._id, applicant, {
        new: true,
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async addJobToApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicantWithPlan | null> {
    try {
      return await Applicant.findByIdAndUpdate(
        applicantId,
        { $push: { appliedJobs: jobId } },
        { new: true }
      ).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<IApplicant | null> {
    try {
      return await Applicant.findOne({ refreshToken });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateById(
    applicantId: string,
    updateData: Partial<IApplicant>
  ): Promise<IApplicant | null> {
    try {
      const updatedApplicant = await Applicant.findByIdAndUpdate(
        applicantId,
        {
          $set: {
            name: updateData.name,
            skills: updateData.skills,
            experience: updateData.experience,
            education: updateData.education,
          },
        },
        { new: true } // This option ensures the updated document is returned
      ).exec();

      return updatedApplicant;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAllApplicants(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    applicants: IApplicant[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [applicants, total] = await Promise.all([
      Applicant.find()
        .select(
          "-password -googleId -refreshToken -resetPasswordToken -resetPasswordExpires -__v"
        )
        .skip(skip)
        .limit(limit)
        .lean(),
      Applicant.countDocuments(),
    ]);

    return {
      applicants,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
