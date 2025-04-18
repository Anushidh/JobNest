import { IEmployer } from "../../models/employer.model";

export interface IEmployerRepository {
  findByEmail(email: string): Promise<IEmployer | null>;
  create(employerData: Partial<IEmployer>): Promise<IEmployer>;
  findById(providerId: string): Promise<IEmployer | null>;
  revokeRefreshToken(employerId: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<IEmployer | null>;
}
