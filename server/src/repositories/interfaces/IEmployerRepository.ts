import { IEmployer, IEmployerWithPlan } from "../../models/employer.model";

export interface IEmployerRepository {
  findByEmail(email: string): Promise<IEmployerWithPlan | null>;
  create(employerData: Partial<IEmployer>): Promise<IEmployerWithPlan>;
  findById(providerId: string): Promise<IEmployerWithPlan | null>;
  revokeRefreshToken(employerId: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<IEmployer | null>;
}
