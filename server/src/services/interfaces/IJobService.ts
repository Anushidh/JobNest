import { IJob } from "../../models/job.model";

type JobFilter = {
  jobType?: string[];
  locationType?: string[];
  experience?: string[];
};

export interface IJobService {
  createJob(jobData: Partial<IJob>): Promise<IJob>;
  getJobById(id: string): Promise<IJob | null>;
  updateJob(id: string, jobData: Partial<IJob>): Promise<IJob | null>;
  deleteJob(id: string): Promise<boolean>;
  getEmployerJobs(employerId: string): Promise<IJob[]>;
  listJobs(
    page: number,
    limit: number,
    search: string,
    filters: JobFilter
  ): Promise<IJob[]>;
  applyForJob(jobId: string, applicantId: string): Promise<IJob | null>;
  getEmployerDashboardStats(employerId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    applicationsInReview: number;
  }>;
}
