import { injectable, inject } from "inversify";
import { IPlanService } from "./interfaces/IPlanService";
import { IEmployerPlan } from "../models/employer-plan.model";
import { IEmployerPlanRepository } from "../repositories/interfaces/IEmployerPlanRepository";
import { TYPES } from "../app/types";
import { IApplicantPlan } from "../models/applicant-plan.model";
import { IApplicantPlanRepository } from "../repositories/interfaces/IApplicantPlanRepository";

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.EmployerPlanRepository)
    private employerPlanRepository: IEmployerPlanRepository,
    @inject(TYPES.ApplicantPlanRepository)
    private applicantPlanRepository: IApplicantPlanRepository
  ) {}

  async getAllEmployerPlans(): Promise<IEmployerPlan[]> {
    return this.employerPlanRepository.getAllEmployerPlans();
  }

  // Get employer plan by ID
  async getEmployerPlanById(planId: string): Promise<IEmployerPlan | null> {
    const plan = await this.employerPlanRepository.getEmployerPlanById(planId);
    return plan;
  }

  // Create new employer plan
  async createEmployerPlan(planData: IEmployerPlan): Promise<IEmployerPlan> {
    const newPlan = await this.employerPlanRepository.createEmployerPlan(
      planData
    );
    return newPlan;
  }

  // Update employer plan
  async updateEmployerPlan(
    planId: string,
    planData: Partial<IEmployerPlan>
  ): Promise<IEmployerPlan | null> {
    const updatedPlan = await this.employerPlanRepository.updateEmployerPlan(
      planId,
      planData
    );
    return updatedPlan;
  }

  // Get all applicant plans
  async getAllApplicantPlans(): Promise<IApplicantPlan[]> {
    return this.applicantPlanRepository.getAllApplicantPlans();
  }

  // Get applicant plan by ID
  async getApplicantPlanById(planId: string): Promise<IApplicantPlan | null> {
    const plan = await this.applicantPlanRepository.getApplicantPlanById(
      planId
    );
    return plan;
  }

  // Create new applicant plan
  async createApplicantPlan(planData: IApplicantPlan): Promise<IApplicantPlan> {
    const newPlan = await this.applicantPlanRepository.createApplicantPlan(
      planData
    );
    return newPlan;
  }

  // Update applicant plan
  async updateApplicantPlan(
    planId: string,
    planData: Partial<IApplicantPlan>
  ): Promise<IApplicantPlan | null> {
    const updatedPlan = await this.applicantPlanRepository.updateApplicantPlan(
      planId,
      planData
    );
    return updatedPlan;
  }
}
