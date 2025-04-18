import { IAdmin } from "../../models/admin.model";

export interface IAdminService {
  login(
    email: string,
    password: string
  ): Promise<{
    admin: Omit<IAdmin, "password">;
    accessToken: string;
    refreshToken: string;
  }>;

  logout(adminId: string): Promise<void>;
}
