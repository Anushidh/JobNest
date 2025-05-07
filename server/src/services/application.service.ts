import { injectable, inject } from "inversify";
import { ObjectId, Types } from "mongoose";

import { IApplication } from "../models/application.model";
import IApplicationService from "./interfaces/IApplicationService";
import { ApplicationRepository } from "../repositories/application.repository";
import { TYPES } from "../app/types";

@injectable()
export class ApplicationService implements IApplicationService {
  constructor(
    @inject(TYPES.ApplicationRepository)
    private applicationrepository: ApplicationRepository
  ) {}

  async checkDuplicateApplication(
    applicantId: Types.ObjectId,
    jobId: Types.ObjectId
  ): Promise<boolean> {
    const existing = await this.applicationrepository.findByApplicantAndJob(
      applicantId,
      jobId
    );
    return !!existing;
  }

  async createApplication(data: Partial<IApplication>): Promise<IApplication> {
    return this.applicationrepository.create(data);
  }

  async getApplicationsByJob(jobId: Types.ObjectId): Promise<IApplication[]> {
    return this.applicationrepository.findByJob(jobId);
  }

  async getApplicationById(
    applicationId: Types.ObjectId
  ): Promise<IApplication | null> {
    return this.applicationrepository.findById(applicationId);
  }

  async updateApplicationStatus(
    applicationId: ObjectId,
    status: "accepted" | "rejected"
  ): Promise<IApplication | null> {
    return this.applicationrepository.updateStatus(applicationId, status);
  }

  async deleteApplication(
    applicationId: ObjectId
  ): Promise<IApplication | null> {
    return this.applicationrepository.deleteById(applicationId);
  }
}
