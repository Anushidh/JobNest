import { IJob } from "../../models/job.model";

export interface IJobRepository {
  create(jobData: Partial<IJob>): Promise<IJob>;
  findById(id: string): Promise<IJob | null>;
  findByEmployer(employerId: string): Promise<IJob[]>;
  update(id: string, jobData: Partial<IJob>): Promise<IJob | null>;
  delete(id: string): Promise<boolean>;
  listActiveJobs(
    page: number,
    limit: number,
    search: string,
    filters: Record<string, string[]>
  ): Promise<IJob[]>;
  findByIds(ids: string[]): Promise<IJob[]>;
  addApplication(jobId: string, applicantId: string): Promise<IJob | null>;
}
