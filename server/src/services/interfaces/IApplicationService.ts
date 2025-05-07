import { ObjectId, Types } from "mongoose";
import { IApplication } from "../../models/application.model";

export default interface IApplicationService {
  checkDuplicateApplication(
    applicantId: Types.ObjectId,
    jobId: Types.ObjectId
  ): Promise<boolean>;
  createApplication(data: Partial<IApplication>): Promise<IApplication>;
  getApplicationsByJob(jobId: Types.ObjectId): Promise<IApplication[]>;
  getApplicationById(applicationId: Types.ObjectId): Promise<IApplication | null>;
  updateApplicationStatus(
    applicationId: ObjectId,
    status: "accepted" | "rejected"
  ): Promise<IApplication | null>;
  deleteApplication(applicationId: ObjectId): Promise<IApplication | null>;
}
