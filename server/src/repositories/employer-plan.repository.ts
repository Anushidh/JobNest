import EmployerPlan, { IEmployerPlan } from '../models/employerPlan.model';
import { IEmployerPlanRepository } from './interfaces/IEmployerPlanRepository';


export class EmployerPlanRepository implements IEmployerPlanRepository {
  async getAllEmployerPlans(): Promise<IEmployerPlan[]> {
    return await EmployerPlan.find();
  }
}
