import Employer, { IEmployer } from "../models/employer.model";
import { injectable } from "inversify";
import { IEmployerRepository } from "./interfaces/IEmployerRepository";
import { AppError } from "../utils/error.util";

@injectable()
export class EmployerRepository implements IEmployerRepository {
  private handleDatabaseError(error: unknown): never {
    console.error("Database error:", error); // Server-side logging only
    throw new AppError("Operation could not be completed", 500);
  }

  async findByEmail(email: string): Promise<IEmployer | null> {
    try {
      return await Employer.findOne({ email }).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async create(employerData: Partial<IEmployer>): Promise<IEmployer> {
    try {
      const employer = new Employer(employerData);
      return await employer.save();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findById(providerId: string): Promise<IEmployer | null> {
    try {
      return await Employer.findById(providerId);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async revokeRefreshToken(providerId: string): Promise<void> {
    try {
      await Employer.findByIdAndUpdate(providerId, { refreshToken: null });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<IEmployer | null> {
    try {
      return await Employer.findOne({ refreshToken });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(
    employerId: string,
    updateData: Partial<IEmployer>
  ): Promise<IEmployer | null> {
    try {
      return await Employer.findByIdAndUpdate(employerId, updateData, {
        new: true,
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
}
