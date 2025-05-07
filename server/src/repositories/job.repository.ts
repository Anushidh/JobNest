import { injectable } from "inversify";
import Job, { IJob } from "../models/job.model";
import { IJobRepository } from "./interfaces/IJobRepository";
import { Types } from "mongoose";
import { AppError } from "../utils/error.util";
import Application from "../models/application.model";

@injectable()
export class JobRepository implements IJobRepository {
  private handleDatabaseError(error: unknown): never {
    console.error("Database error:", error); // Server-side logging
    throw new AppError("Operation could not be completed", 500);
  }

  async create(jobData: Partial<IJob>): Promise<IJob> {
    try {
      const job = new Job(jobData);
      return await job.save();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findById(id: string): Promise<IJob | null> {
    try {
      return await Job.findById(id).populate("employer").exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findByEmployer(employerId: string): Promise<IJob[]> {
    try {
      return await Job.find({
        employer: new Types.ObjectId(employerId),
      }).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: string, jobData: Partial<IJob>): Promise<IJob | null> {
    try {
      return await Job.findByIdAndUpdate(id, jobData, { new: true }).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Job.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async listActiveJobs(
    page: number,
    limit: number,
    search: string,
    filters: Record<string, string[]> = {} // Make sure filters is typed properly here too
  ): Promise<IJob[]> {
    try {
      const query: Record<string, any> = { status: "active" };

      // If there's a search query, filter by title, skills, or company
      if (search) {
        query["$or"] = [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search in the title
          { skills: { $regex: search, $options: "i" } }, // Search in skills
          { company: { $regex: search, $options: "i" } }, // Search in company name
        ];
      }

      if (filters.jobType?.length) {
        query.jobType = { $in: filters.jobType };
      }

      if (filters.location?.length) {
        query.location = { $in: filters.location };
      }

      if (filters.experienceLevel?.length) {
        query.experienceLevel = { $in: filters.experienceLevel };
      }

      return await Job.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findByIds(ids: string[]): Promise<IJob[]> {
    try {
      return await Job.find({
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
      }).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async addApplication(
    jobId: string,
    applicantId: string
  ): Promise<IJob | null> {
    try {
      return await Job.findOneAndUpdate(
        { _id: jobId, applications: { $ne: applicantId } },
        { $push: { applications: applicantId } },
        { new: true }
      ).exec();
    } catch (error) {
      console.log("inside catch block of addApplication", error);
      this.handleDatabaseError(error);
    }
  }

  async countAllByEmployer(employerId: string): Promise<number> {
    return Job.countDocuments({ employer: employerId });
  }

  async countByEmployerAndStatus(
    employerId: string,
    status: string
  ): Promise<number> {
    return Job.countDocuments({ employer: employerId, status });
  }

  async countApplicationsByEmployer(employerId: string): Promise<number> {
    const jobs = await Job.find({ employer: employerId }, "applications");
    return jobs.reduce((sum, job) => sum + job.applications.length, 0);
  }

  async countApplicationsByEmployerAndStatus(
    employerId: string,
    status: string
  ): Promise<number> {
    // Assuming you have an Application model with job reference
    return Application.countDocuments({
      job: { $in: await Job.find({ employer: employerId }).distinct("_id") },
      status,
    });
  }
}
