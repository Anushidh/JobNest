import { injectable, inject } from "inversify";
import { IPlanService } from "./interfaces/IPlanService";
import { IEmployerPlan } from "../models/employerPlan.model";
import { IEmployerPlanRepository } from "../repositories/interfaces/IEmployerPlanRepository";
import { TYPES } from "../app/types";

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.EmployerPlanRepository)
    private employerPlanRepository: IEmployerPlanRepository
  ) {}

  async getAllEmployerPlans(): Promise<IEmployerPlan[]> {
    return this.employerPlanRepository.getAllEmployerPlans();
  }
}
