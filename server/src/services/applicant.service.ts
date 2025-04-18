import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import redisClient from "../config/redis.config";
import { Types } from "mongoose";

import { ApplicantRepository } from "../repositories/applicant.repository";
import { CreateApplicantDto, UpdateApplicantDto } from "../dtos/applicant.dto";
import { AppError } from "../utils/error.util";
import generateOTP from "../utils/otp.util";
import { TYPES } from "../app/types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import { IApplicantService } from "./interfaces/IApplicantService";
import { IApplicant } from "../models/applicant.model";

@injectable()
export class ApplicantService implements IApplicantService {
  constructor(
    @inject(TYPES.ApplicantRepository)
    private applicantRepository: ApplicantRepository
  ) {}

  async registerApplicant(applicantData: CreateApplicantDto): Promise<string> {
    const existingApplicant = await this.applicantRepository.findByEmail(
      applicantData.email
    );
    if (existingApplicant) {
      throw new AppError("Applicant with this email already exists", 409);
    }

    if (applicantData.password) {
      const saltRounds = 10;
      applicantData.password = await bcrypt.hash(
        applicantData.password,
        saltRounds
      );
    }

    const otp = await generateOTP(applicantData.email);
    if (!otp) {
      throw new AppError("Failed to generate OTP", 500);
    }

    await redisClient.setEx(
      `applicant:otp:${applicantData.email}`,
      600,
      JSON.stringify({
        applicantData: {
          email: applicantData.email,
          password: applicantData.password,
          name: applicantData.name,
        },
        otp,
      })
    );

    console.log(`OTP for ${applicantData.email}: ${otp}`);

    return "OTP sent to email. Please verify to complete registration.";
  }

  async verifyApplicantOTP(email: string, otp: string): Promise<string> {
    const redisKey = `applicant:otp:${email}`;
    const redisData = await redisClient.get(redisKey);
    if (!redisData) {
      throw new AppError("OTP expired or invalid", 400);
    }

    const { applicantData, otp: storedOTP } = JSON.parse(redisData);
    if (otp !== storedOTP) {
      throw new AppError("Invalid OTP", 400);
    }

    const applicant = await this.applicantRepository.create({
      ...applicantData,
      role: "applicant",
      isVerified: true,
    });

    await redisClient.del(redisKey);

    return "User registered successfully.";
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const applicant = await this.applicantRepository.findByEmail(email);

    if (!applicant) {
      throw new AppError("Account not found.", 401);
    }

    if (!applicant.password) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, applicant.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (applicant.isBlocked) {
      throw new AppError(
        "Your account is blocked. Please contact support.",
        403
      );
    }

    if (!applicant.isVerified) {
      throw new AppError(
        "Your email is not verified. Please verify before logging in.",
        403
      );
    }

    const accessToken = generateAccessToken(
      applicant._id.toString(),
      applicant.email,
      "applicant"
    );
    const refreshToken = generateRefreshToken(
      applicant._id.toString(),
      applicant.email
    );

    // Store Refresh Token in Database
    applicant.refreshToken = refreshToken;
    await applicant.save();

    const applicantObj = applicant.toObject();
    const { password: _, ...applicantWithoutPassword } = applicantObj;

    return { applicant: applicantWithoutPassword, accessToken, refreshToken };
  }

  async logout(applicantId: string): Promise<void> {
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new AppError("User not found", 404);
    }

    await this.applicantRepository.revokeRefreshToken(applicantId);
  }

  async registerWithGoogle(applicantData: Partial<IApplicant>): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingapplicant = await this.applicantRepository.findByEmail(
      applicantData.email!
    );

    if (existingapplicant) {
      throw new AppError("User already registered with Google.", 400);
    }

    if (!applicantData.googleId) {
      throw new AppError("Google ID is required", 400);
    }

    applicantData.isGoogleUser = true;
    applicantData.isVerified = true;

    const newapplicant = await this.applicantRepository.create(applicantData);
    if (!newapplicant) {
      throw new AppError("Failed to create a Google user.", 500);
    }

    const accessToken = generateAccessToken(
      newapplicant._id.toString(),
      newapplicant.email,
      "applicant"
    );
    const refreshToken = generateRefreshToken(
      newapplicant._id.toString(),
      newapplicant.email
    );

    newapplicant.refreshToken = refreshToken;
    await newapplicant.save();

    const applicantObj = newapplicant.toObject();
    const { password: _, ...applicantWithoutPassword } = applicantObj;

    return { applicant: applicantWithoutPassword, accessToken, refreshToken };
  }

  async loginWithGoogle(applicantData: Partial<IApplicant>): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingapplicant = await this.applicantRepository.findByEmail(
      applicantData.email!
    );

    if (!existingapplicant) {
      throw new AppError("User not registered. Please sign up first.", 404);
    }

    if (
      !existingapplicant.isGoogleUser ||
      existingapplicant.googleId !== applicantData.email
    ) {
      throw new AppError("Invalid Google login attempt.", 401);
    }

    const accessToken = generateAccessToken(
      existingapplicant._id.toString(),
      existingapplicant.email,
      "applicant"
    );
    const refreshToken = generateRefreshToken(
      existingapplicant._id.toString(),
      existingapplicant.email
    );

    existingapplicant.refreshToken = refreshToken;
    await existingapplicant.save();

    const applicantObj = existingapplicant.toObject();
    const { password: _, ...applicantWithoutPassword } = applicantObj;

    return { applicant: applicantWithoutPassword, accessToken, refreshToken };
  }

  async toggleSaveJobForApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null> {
    // Fetch the applicant to check if the job is already saved
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new AppError("Applicant not found", 404);
    }

    // Convert jobId to ObjectId using Mongoose
    const objectIdJob = new Types.ObjectId(jobId);

    // Check if the job is already in savedJobs
    const jobIndex = applicant.savedJobs?.findIndex(
      (job) => job._id.equals(objectIdJob) // Compare ObjectId instances
    );

    // If job is not saved, add it; if it's saved, remove it
    if (jobIndex === -1) {
      // Job is not saved, so add it
      applicant.savedJobs.push(objectIdJob);
    } else {
      // Job is saved, so remove it
      applicant.savedJobs.splice(jobIndex, 1);
    }

    // Save the updated applicant to the database
    const updatedApplicant = await this.applicantRepository.updateApplicant(
      applicant
    );

    if (!updatedApplicant) {
      throw new AppError("Failed to save job for applicant", 400);
    }

    return updatedApplicant;
  }

  async getApplicantById(applicantId: string): Promise<IApplicant | null> {
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new AppError("Applicant not found", 404);
    }
    return applicant;
  }

  async unsaveJobForApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null> {
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new AppError("Applicant not found", 404);
    }

    const objectIdJob = new Types.ObjectId(jobId);

    // Filter out the jobId from savedJobs
    applicant.savedJobs = applicant.savedJobs.filter(
      (job) => !job._id.equals(objectIdJob)
    );

    const updatedApplicant = await this.applicantRepository.updateApplicant(
      applicant
    );
    if (!updatedApplicant) {
      throw new AppError("Failed to unsave job", 400);
    }

    return updatedApplicant;
  }

  async addJobToApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null> {
    // Call the repository method to add the job to the applicant
    const updatedApplicant = await this.applicantRepository.addJobToApplicant(
      applicantId,
      jobId
    );

    if (!updatedApplicant) {
      throw new AppError("Failed to add job to applicant", 400);
    }

    return updatedApplicant;
  }

  async refreshToken(refreshToken: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
    applicant: Omit<IApplicant, "password">;
  }> {
    // Find employer by refresh token
    const applicant = await this.applicantRepository.findByRefreshToken(
      refreshToken
    );

    if (!applicant) {
      throw new AppError("Invalid refresh token.", 401);
    }

    // Verify Refresh Token
    verifyRefreshToken(refreshToken, applicant._id.toString(), applicant.email);

    // Generate new tokens
    const newAccessToken = generateAccessToken(
      applicant._id.toString(),
      applicant.email,
      "applicant"
    );

    const newRefreshToken = generateRefreshToken(
      applicant._id.toString(),
      applicant.email
    );

    // Update and save new refresh token in DB
    applicant.refreshToken = newRefreshToken;
    await applicant.save();

    // Remove password before returning applicant details
    const applicantObj = applicant.toObject();
    const { password: _, ...applicantWithoutPassword } = applicantObj;

    return {
      newAccessToken,
      newRefreshToken,
      applicant: applicantWithoutPassword,
    };
  }

  async updateProfile(
    applicantId: string,
    updateData: Partial<IApplicant>
  ): Promise<IApplicant> {
    const updatedApplicant = await this.applicantRepository.updateById(
      applicantId,
      updateData
    );
    if (!updatedApplicant) {
      throw new AppError("Failed to update employer", 500);
    }

    return updatedApplicant;
  }

  async getAllApplicants(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    applicants: IApplicant[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    return this.applicantRepository.findAllApplicants(page, limit);
  }

  async toggleBlockStatus(id: string): Promise<IApplicant | null> {
    const applicant = await this.applicantRepository.findById(id);

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    applicant.isBlocked = !applicant.isBlocked;

    await this.applicantRepository.updateApplicant(applicant);

    return applicant;
  }
}
