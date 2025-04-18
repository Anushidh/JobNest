import { injectable } from "inversify";
import Admin, { IAdmin } from "../models/admin.model"; 
import { IAdminRepository } from "./interfaces/IAdminRepository";

@injectable()
export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async findById(adminId: string): Promise<IAdmin | null> {
    return await Admin.findById(adminId);
  }

  async updateRefreshToken(
    adminId: string,
    refreshToken: string
  ): Promise<void> {
    await Admin.findByIdAndUpdate(adminId, { refreshToken });
  }

  async clearRefreshToken(adminId: string): Promise<void> {
    await Admin.findByIdAndUpdate(adminId, { refreshToken: null });
  }
}
