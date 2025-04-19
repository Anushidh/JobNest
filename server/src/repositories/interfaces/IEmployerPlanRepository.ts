import { IEmployerPlan } from "../../models/employer-plan.model";

export interface IEmployerPlanRepository {
  getAllEmployerPlans(): Promise<IEmployerPlan[]>;
  getEmployerPlanById(planId: string): Promise<IEmployerPlan | null>;
  createEmployerPlan(planData: IEmployerPlan): Promise<IEmployerPlan>;
  updateEmployerPlan(planId: string, planData: Partial<IEmployerPlan>): Promise<IEmployerPlan | null>;

}
