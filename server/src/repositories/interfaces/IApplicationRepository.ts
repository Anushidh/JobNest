import { ObjectId, Types } from "mongoose";
import { IApplication } from "../../models/application.model";

export default interface IApplicationRepository {
  findByApplicantAndJob(
    applicantId: Types.ObjectId,
    jobId: Types.ObjectId
  ): Promise<IApplication | null>;
  create(data: Partial<IApplication>): Promise<IApplication>;
  findByJob(jobId: Types.ObjectId): Promise<IApplication[]>;
  updateStatus(
    applicationId: ObjectId,
    status: "accepted" | "rejected"
  ): Promise<IApplication | null>;
  deleteById(applicationId: ObjectId): Promise<IApplication | null>;
  findById(applicationId: Types.ObjectId): Promise<IApplication | null>;
}
