import { injectable, inject } from "inversify";
import bcrypt from "bcryptjs";

import { AdminRepository } from "../repositories/admin.repository";
import { TYPES } from "../app/types";
import { AppError } from "../utils/error.util";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { IAdmin } from "../models/admin.model";
import { IAdminService } from "./interfaces/IAdminService";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private adminRepository: AdminRepository
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<{
    admin: Omit<IAdmin, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin || !admin.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(
      admin._id.toString(),
      admin.email,
      "admin"
    );
    const refreshToken = generateRefreshToken(admin._id.toString(), "admin");

    const { password: _, ...adminSafe } = admin.toObject();

    return {
      admin: adminSafe,
      accessToken,
      refreshToken,
    };
  }

  async logout(adminId: string): Promise<void> {
    await this.adminRepository.clearRefreshToken(adminId);
  }
}
