import { IApplicantPlan } from "../../models/applicant-plan.model";

export interface IApplicantPlanRepository {
  getAllApplicantPlans(): Promise<IApplicantPlan[]>;
  getApplicantPlanById(planId: string): Promise<IApplicantPlan | null>;
  createApplicantPlan(planData: IApplicantPlan): Promise<IApplicantPlan>;
  updateApplicantPlan(
    planId: string,
    planData: Partial<IApplicantPlan>
  ): Promise<IApplicantPlan | null>;
}
