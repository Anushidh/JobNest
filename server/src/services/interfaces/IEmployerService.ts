import { CreateEmployerDto } from "../../dtos/employer.dto";
import { IEmployer, IEmployerWithPlan } from "../../models/employer.model";

export interface IEmployerService {
  registerEmployer(employerData: CreateEmployerDto): Promise<string>;
  verifyEmployerOTP(email: string, otp: string): Promise<string>;
  login(
    email: string,
    password: string
  ): Promise<{
    employer: Omit<IEmployerWithPlan, "password">;
    accessToken: string;
    refreshToken: string;
  }>;
  logout(employerId: string): Promise<void>;
  registerWithGoogle(employerData: Partial<IEmployer>): Promise<{
    employer: Omit<IEmployer, "password">;
    accessToken: string;
    refreshToken: string;
  }>;
  loginWithGoogle(employerData: Partial<IEmployer>): Promise<{
    employer: Omit<IEmployer, "password">;
    accessToken: string;
    refreshToken: string;
  }>;
  refreshToken(refreshToken: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
    employer: Omit<IEmployer, "password">;
  }>;
}
