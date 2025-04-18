import { CreateApplicantDto } from "../../dtos/applicant.dto";
import { IApplicant } from "../../models/applicant.model";

export interface IApplicantService {
  registerApplicant(applicantData: CreateApplicantDto): Promise<string>;

  verifyApplicantOTP(email: string, otp: string): Promise<string>;

  login(
    email: string,
    password: string
  ): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }>;

  logout(applicantId: string): Promise<void>;

  registerWithGoogle(data: {
    googleId: string;
    email: string;
    fullName: string;
  }): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }>;

  loginWithGoogle(data: { googleId: string; email: string }): Promise<{
    applicant: Omit<IApplicant, "password">;
    accessToken: string;
    refreshToken: string;
  }>;

  toggleSaveJobForApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null>;

  getApplicantById(applicantId: string): Promise<IApplicant | null>;

  unsaveJobForApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null>;

  refreshToken(oldToken: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
    applicant: Omit<IApplicant, "password">;
  }>;
}
