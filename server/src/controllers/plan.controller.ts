import { Request, Response } from "express";
import {
  controller,
  httpGet,
  BaseHttpController,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../app/types";
import { PlanService } from "../services/plan.service";
import { employerAuthMiddleware } from "../middlewares/employer-auth.middleware";

@controller("/plans")
export class PlanController extends BaseHttpController {
  constructor(@inject(TYPES.PlanService) private planService: PlanService) {
    super();
  }

  @httpGet("/employer", employerAuthMiddleware)
  async getAllEmployerPlans(req: Request, res: Response): Promise<void> {
    try {
        console.log('Fetching all employer plans...');
      const plans = await this.planService.getAllEmployerPlans();
      console.log(plans)
      res.status(200).json({ plans });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({
          message: "Failed to fetch employer plans",
          error: error.message,
        });
    }
  }
}
