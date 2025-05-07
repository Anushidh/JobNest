import { ObjectId, Types } from "mongoose";
import { injectable } from "inversify";

import Application, { IApplication } from "../models/application.model";
import IApplicationRepository from "./interfaces/IApplicationRepository";

@injectable()
export class ApplicationRepository implements IApplicationRepository {
  async findByApplicantAndJob(
    applicantId: Types.ObjectId,
    jobId: Types.ObjectId
  ): Promise<IApplication | null> {
    return Application.findOne({ applicant: applicantId, job: jobId });
  }

  async create(data: Partial<IApplication>): Promise<IApplication> {
    const application = new Application(data);
    return application.save();
  }

  async findByJob(jobId: Types.ObjectId): Promise<IApplication[]> {
    return Application.find({ job: jobId })
      .populate("applicant", "name email profilePicture resume skills")
      .sort({ createdAt: -1 });
  }

  async updateStatus(
    applicationId: ObjectId,
    status: "accepted" | "rejected"
  ): Promise<IApplication | null> {
    return Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
  }

  async deleteById(applicationId: ObjectId): Promise<IApplication | null> {
    return Application.findByIdAndDelete(applicationId);
  }

  async findById(applicationId: Types.ObjectId): Promise<IApplication | null> {
    return Application.findById(applicationId).populate(
      "applicant job employer"
    );
  }
}
