import { Request, Response } from "express";
import {
  controller,
  httpGet,
  BaseHttpController,
  httpPost,
  httpPatch,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../app/types";
import { PlanService } from "../services/plan.service";
import { adminAuthMiddleware } from "../middlewares/admin-auth.middleware";

@controller("/plans")
export class PlanController extends BaseHttpController {
  constructor(@inject(TYPES.PlanService) private planService: PlanService) {
    super();
  }

  @httpGet("/employer", adminAuthMiddleware)
  async getAllEmployerPlans(req: Request, res: Response): Promise<void> {
    console.log("Fetching all employer plans...");
    const plans = await this.planService.getAllEmployerPlans();
    console.log(plans);
    res.status(200).json({ plans });
  }

  @httpGet("/employer/:id", adminAuthMiddleware)
  async getEmployerPlanById(req: Request, res: Response): Promise<void> {
    const planId = req.params.id;
    console.log(`Fetching employer plan with ID: ${planId}`);
    const plan = await this.planService.getEmployerPlanById(planId);
    console.log(plan);
    if (!plan) {
      res.status(404).json({ message: "Employer plan not found" });
    } else {
      res.status(200).json({ plan });
    }
  }

  // Create new employer plan
  @httpPost("/employer", adminAuthMiddleware)
  async createEmployerPlan(req: Request, res: Response): Promise<void> {
    const planData = req.body;
    console.log("Creating a new employer plan:", planData);
    const newPlan = await this.planService.createEmployerPlan(planData);
    res.status(201).json({ plan: newPlan });
  }

  // Update employer plan
  @httpPatch("/employer/:id", adminAuthMiddleware)
  async updateEmployerPlan(req: Request, res: Response): Promise<void> {
    const planId = req.params.id;
    const planData = req.body;
    console.log(`Updating employer plan with ID: ${planId}`);
    const updatedPlan = await this.planService.updateEmployerPlan(
      planId,
      planData
    );
    console.log(updatedPlan);
    if (!updatedPlan) {
      res.status(404).json({ message: "Employer plan not found" });
    } else {
      res.status(200).json({ plan: updatedPlan });
    }
  }

  @httpGet("/applicant", adminAuthMiddleware)
  async getAllApplicantPlans(req: Request, res: Response): Promise<void> {
    console.log("Fetching all applicant plans...");
    const plans = await this.planService.getAllApplicantPlans();
    console.log(plans);
    res.status(200).json({ plans });
  }

  @httpGet("/applicant/:id", adminAuthMiddleware)
  async getApplicantPlanById(req: Request, res: Response): Promise<void> {
    const planId = req.params.id;
    console.log(`Fetching applicant plan with ID: ${planId}`);
    const plan = await this.planService.getApplicantPlanById(planId);
    console.log(plan);
    if (!plan) {
      res.status(404).json({ message: "Applicant plan not found" });
    } else {
      res.status(200).json({ plan });
    }
  }

  @httpPost("/applicant", adminAuthMiddleware)
  async createApplicantPlan(req: Request, res: Response): Promise<void> {
    const planData = req.body;
    console.log("Creating a new applicant plan:", planData);
    const newPlan = await this.planService.createApplicantPlan(planData);
    res.status(201).json({ plan: newPlan });
  }

  @httpPatch("/applicant/:id", adminAuthMiddleware)
  async updateApplicantPlan(req: Request, res: Response): Promise<void> {
    const planId = req.params.id;
    const planData = req.body;
    console.log(`Updating applicant plan with ID: ${planId}`);
    const updatedPlan = await this.planService.updateApplicantPlan(
      planId,
      planData
    );
    console.log(updatedPlan);
    if (!updatedPlan) {
      res.status(404).json({ message: "Applicant plan not found" });
    } else {
      res.status(200).json({ plan: updatedPlan });
    }
  }
}
