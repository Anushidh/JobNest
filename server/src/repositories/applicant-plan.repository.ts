import ApplicantPlan, { IApplicantPlan } from "../models/applicant-plan.model";
import { IApplicantPlanRepository } from "./interfaces/IApplicantPlanRepository";

export class ApplicantPlanRepository implements IApplicantPlanRepository {
  // Get all applicant plans
  async getAllApplicantPlans(): Promise<IApplicantPlan[]> {
    return await ApplicantPlan.find();
  }

  // Get applicant plan by ID
  async getApplicantPlanById(planId: string): Promise<IApplicantPlan | null> {
    const plan = await ApplicantPlan.findById(planId);
    return plan;
  }

  // Create a new applicant plan
  async createApplicantPlan(planData: IApplicantPlan): Promise<IApplicantPlan> {
    const newPlan = new ApplicantPlan(planData);
    await newPlan.save();
    return newPlan;
  }

  // Update applicant plan
  async updateApplicantPlan(
    planId: string,
    planData: Partial<IApplicantPlan>
  ): Promise<IApplicantPlan | null> {
    const updatedPlan = await ApplicantPlan.findByIdAndUpdate(
      planId,
      planData,
      {
        new: true,
      }
    );
    return updatedPlan;
  }
}
