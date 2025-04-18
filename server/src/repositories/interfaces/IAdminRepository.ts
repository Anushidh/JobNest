import { IAdmin } from "../../models/admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(adminId: string): Promise<IAdmin | null>;
  updateRefreshToken(adminId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(adminId: string): Promise<void>;
}
