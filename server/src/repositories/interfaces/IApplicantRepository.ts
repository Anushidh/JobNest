import { UpdateApplicantDto } from "../../dtos/applicant.dto";
import { IApplicant } from "../../models/applicant.model";

export interface IApplicantRepository {
  findByEmail(email: string): Promise<IApplicant | null>;
  findById(id: string): Promise<IApplicant | null>;
  revokeRefreshToken(applicantId: string): Promise<void>;
  create(data: Partial<IApplicant>): Promise<IApplicant>;
  updateApplicant(applicant: IApplicant): Promise<IApplicant | null>;
  addJobToApplicant(
    applicantId: string,
    jobId: string
  ): Promise<IApplicant | null>;
  findByRefreshToken(refreshToken: string): Promise<IApplicant | null>;
  updateById(
    applicantId: string,
    updateData: Partial<IApplicant>
  ): Promise<IApplicant | null>;
}
