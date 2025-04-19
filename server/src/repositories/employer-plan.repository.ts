import EmployerPlan, { IEmployerPlan } from "../models/employer-plan.model";
import { IEmployerPlanRepository } from "./interfaces/IEmployerPlanRepository";

export class EmployerPlanRepository implements IEmployerPlanRepository {
  async getAllEmployerPlans(): Promise<IEmployerPlan[]> {
    return await EmployerPlan.find();
  }

  async getEmployerPlanById(planId: string): Promise<IEmployerPlan | null> {
    const plan = await EmployerPlan.findById(planId); // Find plan by ID
    return plan;
  }

  // Create a new employer plan in the database
  async createEmployerPlan(planData: IEmployerPlan): Promise<IEmployerPlan> {
    const newPlan = new EmployerPlan(planData);
    await newPlan.save(); // Save to the database
    return newPlan;
  }

  // Update employer plan in the database
  async updateEmployerPlan(
    planId: string,
    planData: Partial<IEmployerPlan>
  ): Promise<IEmployerPlan | null> {
    const updatedPlan = await EmployerPlan.findByIdAndUpdate(planId, planData, {
      new: true,
    });
    return updatedPlan;
  }
}
