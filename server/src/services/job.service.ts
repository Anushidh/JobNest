import { inject, injectable } from "inversify";
import { IJobService } from "./interfaces/IJobService";
import { IJobRepository } from "../repositories/interfaces/IJobRepository";
import { TYPES } from "../app/types";
import { IJob } from "../models/job.model";
import { AppError } from "../utils/error.util";
import { Types } from "mongoose";

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private jobRepository: IJobRepository
  ) {}

  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    if (jobData.deadline && new Date(jobData.deadline) <= new Date()) {
      throw new AppError("Deadline must be in the future", 400);
    }
    return this.jobRepository.create(jobData);
  }

  async getJobById(id: string): Promise<IJob | null> {
    return this.jobRepository.findById(id);
  }

  async updateJob(id: string, jobData: Partial<IJob>): Promise<IJob | null> {
    return this.jobRepository.update(id, jobData);
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobRepository.delete(id);
  }

  async getEmployerJobs(employerId: string): Promise<IJob[]> {
    return this.jobRepository.findByEmployer(employerId);
  }

  async listJobs(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    filters: Record<string, string[]> = {}  // Make sure filters is typed properly as Record<string, string[]>
  ): Promise<IJob[]> {
    return this.jobRepository.listActiveJobs(page, limit, search, filters);
  }
  
  
  

  async getSavedJobs(jobIds: string[]): Promise<IJob[]> {
    if (!jobIds || jobIds.length === 0) {
      return [];
    }

    const jobs = await this.jobRepository.findByIds(jobIds);
    if (!jobs || jobs.length === 0) {
      throw new AppError("No saved jobs found", 404);
    }

    return jobs;
  }

  async applyForJob(jobId: string, applicantId: string): Promise<IJob | null> {
    return this.jobRepository.addApplication(jobId, applicantId);
  }
}
