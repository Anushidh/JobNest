import { IEmployerPlan } from "../../models/employerPlan.model";

export interface IEmployerPlanRepository {
  getAllEmployerPlans(): Promise<IEmployerPlan[]>;
}
