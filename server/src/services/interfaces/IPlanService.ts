import { IEmployerPlan } from "../../models/employerPlan.model";

export interface IPlanService {
  getAllEmployerPlans(): Promise<IEmployerPlan[]>;
}
