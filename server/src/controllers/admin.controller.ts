import { Request, Response } from "express";
import {
  controller,
  httpPost,
  BaseHttpController,
  httpGet,
  httpPatch,
} from "inversify-express-utils";
import { inject } from "inversify";
import bcrypt from "bcryptjs";

import { TYPES } from "../app/types";
import { validateRequest } from "../middlewares/validate.middleware";
import { AdminService } from "../services/admin.service";
import { SignInDto } from "../dtos/applicant.dto";
import Admin from "../models/admin.model";
import { ApplicantService } from "../services/applicant.service";
import { EmployerService } from "../services/employer.service";

@controller("/admin")
export class AdminController extends BaseHttpController {
  constructor(
    @inject(TYPES.AdminService)
    private adminService: AdminService,
    @inject(TYPES.ApplicantService)
    private applicantService: ApplicantService,
    @inject(TYPES.EmployerService)
    private employerService: EmployerService
  ) {
    super();
  }

  @httpPost("/create")
  async createAdmin(req: Request, res: Response) {
    console.log(req.body);
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    res.sendStatus(201);
  }

  @httpPost("/login", validateRequest(SignInDto))
  async loginAdmin(req: Request, res: Response) {
    const { email, password } = req.body;
    const { admin, accessToken, refreshToken } = await this.adminService.login(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: admin,
      accessToken,
      role: "admin",
    });
  }

  @httpPost("/logout")
  async logoutAdmin(req: Request, res: Response) {
    const { adminId } = req.body;
    await this.adminService.logout(adminId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logout successful" });
  }

  @httpGet("/applicants")
  async getAllApplicants(req: Request, res: Response) {
    const applicants = await this.applicantService.getAllApplicants();
    res.status(200).json(applicants);
  }

  @httpPatch("/applicants/:id/block-status")
  async toggleApplicantBlockStatus(req: Request, res: Response) {
    const { id } = req.params;
    const updatedApplicant = await this.applicantService.toggleBlockStatus(id);
    res.status(200).json(updatedApplicant);
  }

  @httpPatch("/employers/:id/block-status")
  async toggleEmployerBlockStatus(req: Request, res: Response) {
    const { id } = req.params;
    const updatedEmployer = await this.employerService.toggleBlockStatus(id);
    res.status(200).json(updatedEmployer);
  }

  @httpGet("/employers")
  async getAllEmployers(req: Request, res: Response) {
    const employers = await this.employerService.getAllEmployers();
    res.status(200).json(employers);
  }
}
