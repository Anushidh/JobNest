import { Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import mongoose from "mongoose";

import { TYPES } from "../app/types";
import { JobService } from "../services/job.service";
import { validateRequest } from "../middlewares/validate.middleware";
import { CreateJobDto, UpdateJobDto } from "../dtos/job.dto";
import {
  AuthenticatedEmployerRequest,
  employerAuthMiddleware,
} from "../middlewares/employer-auth.middleware";
import {
  applicantAuthMiddleware,
  AuthenticatedApplicantRequest,
} from "../middlewares/applicant-auth.middleware";
import { ApplicantService } from "../services/applicant.service";
import { PlanService } from "../services/plan.service";
import { EmployerService } from "../services/employer.service";
import { employerPlanCheckMiddleware } from "../middlewares/employer.plan-check.middleware";
import { applicantPlanCheckMiddleware } from "../middlewares/applicant.plan-check.middleware";

@controller("/jobs")
export class JobController extends BaseHttpController {
  constructor(
    @inject(TYPES.JobService)
    private jobService: JobService,
    @inject(TYPES.ApplicantService)
    private applicantService: ApplicantService,
    @inject(TYPES.EmployerService)
    private employerService: EmployerService,
    @inject(TYPES.PlanService)
    private planService: PlanService
  ) {
    super();
  }

  @httpPost(
    "/employer",
    employerAuthMiddleware,
    employerPlanCheckMiddleware,
    validateRequest(CreateJobDto)
  )
  async createJob(req: AuthenticatedEmployerRequest, res: Response) {
    console.log("inside");
    console.log(req.body);
    let employer = req.employer;
    if (!employer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const employerObjectId = new mongoose.Types.ObjectId(employer.id);
    const jobData = {
      ...req.body,
      employer: employerObjectId,
      companyName: employer.companyName,
      companyLogo: employer.companyLogo,
    };
    const job = await this.jobService.createJob(jobData);
    if (employer.jobPostsLeft !== "unlimited") {
      employer.jobPostsLeft = employer.jobPostsLeft - 1;
      await employer.save();
    }
    res.status(201).json(job);
  }

  @httpGet("/employer", employerAuthMiddleware)
  async getEmployerJobs(req: AuthenticatedEmployerRequest, res: Response) {
    try {
      const employerId = req.employer?.id;
      if (!employerId) {
        res.status(403).json({
          message: "Unauthorized access - No employer ID found",
        });
        return;
      }
      const jobs = await this.jobService.getEmployerJobs(employerId);
      res.status(200).json(jobs);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  @httpGet("/employer/:id", employerAuthMiddleware)
  async getJob(req: AuthenticatedEmployerRequest, res: Response) {
    try {
      const id = req.params.id;
      console.log(id);
      const job = await this.jobService.getJobById(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json(job);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  @httpPut(
    "/employer/:id",
    employerAuthMiddleware,
    validateRequest(UpdateJobDto)
  )
  async updateJob(req: AuthenticatedEmployerRequest, res: Response) {
    try {
      const id = req.params.id;
      const updatedJob = await this.jobService.updateJob(id, req.body);
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json(updatedJob);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  @httpDelete("/employer/:id", employerAuthMiddleware)
  async deleteJob(req: AuthenticatedEmployerRequest, res: Response) {
    const id = req.params.id;
    const employer = req.employer;
    if (!employer) {
      res.status(403).json({
        message: "Unauthorized access - No employer ID found",
      });
      return;
    }
    const success = await this.jobService.deleteJob(id);
    if (!success) {
      return res.status(404).json({ message: "Job not found" });
    }
    const jobs = await this.jobService.getEmployerJobs(employer.id);
    if (!jobs) {
      return res
        .status(404)
        .json({ message: "No jobs found for this employer" });
    }
    if (employer.jobPostsLeft !== "unlimited") {
      employer.jobPostsLeft = employer.jobPostsLeft + 1;
      await employer.save();
    }
    res.status(200).json(jobs);
  }

  @httpGet("/applicant", applicantAuthMiddleware)
  async listJobs(req: AuthenticatedApplicantRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    // Parse filters from query string as arrays
    const jobType = this.ensureArray(req.query.jobType as string | string[]);
    const location = this.ensureArray(req.query.location as string | string[]);
    const experienceLevel = this.ensureArray(
      req.query.experienceLevel as string | string[]
    );

    const filters = {
      jobType,
      location,
      experienceLevel,
    };

    const jobs = await this.jobService.listJobs(page, limit, search, filters);
    res.status(200).json(jobs);
  }

  private ensureArray(param: string | string[] | undefined): string[] {
    if (!param) return [];

    if (Array.isArray(param)) {
      return param.flatMap((item) => item.toString().split(",")); // Split array elements into multiple strings
    }

    return param.toString().split(","); // Split a single string into an array
  }

  // @httpPost("/toggle-save-job", applicantAuthMiddleware)
  // async toggleSaveJobForApplicant(
  //   req: AuthenticatedApplicantRequest,
  //   res: Response
  // ) {
  //   const { jobId } = req.body;
  //   console.log(jobId);
  //   const applicantId = req.applicant?.id;

  //   if (!applicantId || !jobId) {
  //     return res
  //       .status(400)
  //       .json({ message: "Applicant ID or Job ID missing" });
  //   }

  //   try {
  //     const updatedApplicant =
  //       await this.applicantService.toggleSaveJobForApplicant(
  //         applicantId,
  //         jobId
  //       );

  //     res.status(200).json(updatedApplicant);
  //   } catch (error: any) {
  //     res.status(error.statusCode || 500).json({ message: error.message });
  //   }
  // }

  // @httpGet("/saved", applicantAuthMiddleware)
  // async getSavedJobsForApplicant(
  //   req: AuthenticatedApplicantRequest,
  //   res: Response
  // ) {
  //   console.log("inside saved jobs");
  //   const applicantId = req.applicant?.id;
  //   console.log(applicantId);
  //   if (!applicantId) {
  //     return res.status(400).json({ message: "Applicant ID is missing" });
  //   }

  //   try {
  //     const applicant = await this.applicantService.getApplicantById(
  //       applicantId
  //     );
  //     console.log(applicant);
  //     if (!applicant) {
  //       return res.status(404).json({ message: "Applicant not found" });
  //     }

  //     const savedJobIds: string[] = (applicant.savedJobs || []).map(
  //       (jobId) => jobId.toString() // Convert ObjectId to string
  //     );
  //     const savedJobs = await this.jobService.getSavedJobs(savedJobIds);
  //     res.status(200).json(savedJobs);
  //   } catch (error: any) {
  //     res.status(error.statusCode || 500).json({ message: error.message });
  //   }
  // }

  // @httpDelete("/unsave/:jobId", applicantAuthMiddleware)
  // async unsaveJobForApplicant(
  //   req: AuthenticatedApplicantRequest,
  //   res: Response
  // ) {
  //   const applicantId = req.applicant?.id;
  //   const jobId = req.params.jobId;

  //   if (!applicantId || !jobId) {
  //     return res
  //       .status(400)
  //       .json({ message: "Applicant ID or Job ID missing" });
  //   }

  //   try {
  //     const updatedApplicant =
  //       await this.applicantService.unsaveJobForApplicant(applicantId, jobId);

  //     if (!updatedApplicant) {
  //       return res.status(500).json({ message: "Failed to unsave job" });
  //     }

  //     return res.status(200).json({
  //       savedJobs: updatedApplicant.savedJobs,
  //     });
  //   } catch (error: any) {
  //     return res
  //       .status(error.statusCode || 500)
  //       .json({ message: error.message });
  //   }
  // }

  @httpPost("/:id/apply", applicantAuthMiddleware, applicantPlanCheckMiddleware)
  async applyForJob(req: AuthenticatedApplicantRequest, res: Response) {
    const jobId = req.params.id;
    let applicant = req.applicant;

    if (!applicant) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Applicant not found" });
    }

    const job = await this.jobService.applyForJob(jobId, applicant.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedApplicant = await this.applicantService.addJobToApplicant(
      applicant.id,
      jobId
    );
    if (!updatedApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    if (updatedApplicant.applicationsLeft !== "unlimited") {
      updatedApplicant.applicationsLeft = updatedApplicant.applicationsLeft - 1;
      await updatedApplicant.save();
    }
    applicant = updatedApplicant;

    res.status(200).json({ job, applicant });
  }

  @httpGet("/applicant/:id", applicantAuthMiddleware)
  async getJobForApplicant(req: AuthenticatedApplicantRequest, res: Response) {
    console.log(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    try {
      const job = await this.jobService.getJobById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      return res.status(200).json(job);
    } catch (error: any) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}
