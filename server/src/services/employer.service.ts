import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";

import redisClient from "../config/redis.config";
import { EmployerRepository } from "../repositories/employer.repository";
import { CreateEmployerDto, UpdateEmployerDto } from "../dtos/employer.dto";
import { AppError } from "../utils/error.util";
import generateOTP from "../utils/otp.util";
import { TYPES } from "../app/types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import { IEmployerService } from "./interfaces/IEmployerService";
import { IEmployer, IEmployerWithPlan } from "../models/employer.model";

@injectable()
export class EmployerService implements IEmployerService {
  constructor(
    @inject(TYPES.EmployerRepository)
    private employerRepository: EmployerRepository
  ) {}

  async registerEmployer(employerData: CreateEmployerDto): Promise<string> {
    // Check if employer exists
    const existingEmployer = await this.employerRepository.findByEmail(
      employerData.email
    );
    if (existingEmployer) {
      throw new AppError("Employer with this email already exists", 409);
    }

    // Hash password if provided
    if (employerData.password) {
      const saltRounds = 10;
      employerData.password = await bcrypt.hash(
        employerData.password,
        saltRounds
      );
    }

    const otp = await generateOTP(employerData.email);
    console.log('otp', otp)
    if (!otp) {
      throw new AppError("Failed to generate OTP", 500);
    }

    // 4. Store in Redis for 10 minutes
    await redisClient.setEx(
      `employer:otp:${employerData.email}`,
      600, // 10 minutes TTL
      JSON.stringify({
        employerData: {
          email: employerData.email,
          password: employerData.password,
          companyName: employerData.companyName,
        },
        otp,
      })
    );

    // 5. Send OTP (implementation depends on your email/sms service)
    console.log(`OTP for ${employerData.email}: ${otp}`); // Remove in production!

    return "OTP sent to email. Please verify to complete registration.";
  }

  async verifyEmployerOTP(email: string, otp: string): Promise<string> {
    // 1. Get Redis data
    const redisKey = `employer:otp:${email}`;
    const redisData = await redisClient.get(redisKey);
    if (!redisData) {
      throw new AppError("OTP expired or invalid", 400);
    }

    // 2. Compare OTP
    const { employerData, otp: storedOTP } = JSON.parse(redisData);
    if (otp !== storedOTP) {
      throw new AppError("Invalid OTP", 400);
    }

    // 3. Create employer
    const employer = await this.employerRepository.create({
      ...employerData,
      role: "employer",
      isVerified: true,
      jobPostsLeft: 5,
    });

    // 4. Cleanup Redis
    await redisClient.del(redisKey);

    return "User registered successfully.";
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    employer: Omit<IEmployerWithPlan, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const employer = await this.employerRepository.findByEmail(email);
    console.log(employer)

    if (!employer) {
      throw new AppError("Account not found.", 401);
    }

    if (!employer.password) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, employer.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (employer.isBlocked) {
      throw new AppError(
        "Your account is blocked. Please contact support.",
        403
      );
    }

    if (!employer.isVerified) {
      throw new AppError(
        "Your email is not verified. Please verify before logging in.",
        403
      );
    }

    // Generate Tokens using utils
    const accessToken = generateAccessToken(
      employer._id.toString(),
      employer.email,
      "employer"
    );
    const refreshToken = generateRefreshToken(
      employer._id.toString(),
      employer.email
    );

    // Store Refresh Token in Database
    employer.refreshToken = refreshToken;
    await employer.save();

    const employerObj = employer.toObject();
    const { password: _, ...employerWithoutPassword } = employerObj; // Remove password safely

    return { employer: employerWithoutPassword, accessToken, refreshToken };
  }

  async logout(employerId: string): Promise<void> {
    const employer = await this.employerRepository.findById(employerId);
    if (!employer) {
      throw new AppError("User not found", 404);
    }

    await this.employerRepository.revokeRefreshToken(employerId);
  }

  async registerWithGoogle(employerData: Partial<IEmployer>): Promise<{
    employer: Omit<IEmployer, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingemployer = await this.employerRepository.findByEmail(
      employerData.email!
    );

    if (existingemployer) {
      throw new AppError("User already registered with Google.", 400);
    }

    if (!employerData.googleId) {
      throw new AppError("Google ID is required", 400);
    }

    employerData.isGoogleUser = true;
    employerData.isVerified = true; // ✅ Google users are already verified

    const newemployer = await this.employerRepository.create(employerData);
    if (!newemployer) {
      throw new AppError("Failed to create a Google user.", 500);
    }

    const accessToken = generateAccessToken(
      newemployer._id.toString(),
      newemployer.email,
      "employer"
    );
    const refreshToken = generateRefreshToken(
      newemployer._id.toString(),
      newemployer.email
    );

    newemployer.refreshToken = refreshToken;
    await newemployer.save();

    const employerObj = newemployer.toObject();
    const { password: _, ...employerWithoutPassword } = employerObj;

    return { employer: employerWithoutPassword, accessToken, refreshToken };
  }

  async loginWithGoogle(employerData: Partial<IEmployer>): Promise<{
    employer: Omit<IEmployer, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingemployer = await this.employerRepository.findByEmail(
      employerData.email!
    );

    if (!existingemployer) {
      throw new AppError("User not registered. Please sign up first.", 404);
    }

    if (
      !existingemployer.isGoogleUser ||
      existingemployer.googleId !== employerData.googleId
    ) {
      throw new AppError("Invalid Google login attempt.", 401);
    }

    const accessToken = generateAccessToken(
      existingemployer._id.toString(),
      existingemployer.email,
      "employer"
    );
    const refreshToken = generateRefreshToken(
      existingemployer._id.toString(),
      existingemployer.email
    );

    existingemployer.refreshToken = refreshToken;
    await existingemployer.save();

    const employerObj = existingemployer.toObject();
    const { password: _, ...employerWithoutPassword } = employerObj;

    return { employer: employerWithoutPassword, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
    employer: Omit<IEmployer, "password">;
  }> {
    // Find employer by refresh token
    const employer = await this.employerRepository.findByRefreshToken(
      refreshToken
    );

    if (!employer) {
      throw new AppError("Invalid refresh token.", 401);
    }

    // Verify Refresh Token
    verifyRefreshToken(refreshToken, employer._id.toString(), employer.email);

    // Generate new tokens
    const newAccessToken = generateAccessToken(
      employer._id.toString(),
      employer.email,
      "employer"
    );

    const newRefreshToken = generateRefreshToken(
      employer._id.toString(),
      employer.email
    );

    // Update and save new refresh token in DB
    employer.refreshToken = newRefreshToken;
    await employer.save();

    // Remove password before returning employer details
    const employerObj = employer.toObject();
    const { password: _, ...employerWithoutPassword } = employerObj;

    return {
      newAccessToken,
      newRefreshToken,
      employer: employerWithoutPassword,
    };
  }

  async updateProfile(
    employerId: string,
    updateData: Partial<IEmployer>
  ): Promise<IEmployer> {
    // Check if employer exists
    const employer = await this.employerRepository.findById(employerId);
    if (!employer) {
      throw new AppError("Employer not found", 404);
    }

    const updatedEmployer = await this.employerRepository.update(
      employerId,
      updateData
    );
    if (!updatedEmployer) {
      throw new AppError("Failed to update employer", 500);
    }

    return updatedEmployer;
  }

  async getAllEmployers(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    employers: IEmployer[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    return this.employerRepository.findAllEmployers(page, limit);
  }

async getEmployer(id: string): Promise<IEmployerWithPlan | null> {
  return this.employerRepository.findById(id)
}

  async toggleBlockStatus(id: string): Promise<IEmployerWithPlan | null> {
    const employer = await this.employerRepository.findById(id);

    if (!employer) {
      throw new Error("Employer not found");
    }

    employer.isBlocked = !employer.isBlocked;

    await this.employerRepository.updateEmployer(employer);

    return employer;
  }
}
