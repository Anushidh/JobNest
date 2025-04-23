import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import multer from "multer";

import { TYPES } from "../app/types";
import { EmployerService } from "../services/employer.service";
import { validateRequest } from "../middlewares/validate.middleware";
import { CreateEmployerDto, UpdateEmployerDto } from "../dtos/employer.dto";
import {
  AuthenticatedEmployerRequest,
  employerAuthMiddleware,
} from "../middlewares/employer-auth.middleware";

import { storage } from "../config/cloudinaryStorage.config";

const upload = multer({ storage });

@controller("/employer")
export class EmployerController extends BaseHttpController {
  private client: OAuth2Client;
  constructor(
    @inject(TYPES.EmployerService)
    private employerService: EmployerService
  ) {
    super();
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @httpPost("/signup", validateRequest(CreateEmployerDto))
  async registerEmployer(req: Request, res: Response) {
    console.log(req.body);
    const message = await this.employerService.registerEmployer(req.body);
    res.status(201).json({ message });
  }

  @httpPost("/verify")
  async verifyEmployerOTP(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;

    const message = await this.employerService.verifyEmployerOTP(email, otp);

    res.status(200).json({ message });
  }

  @httpPost("/login")
  async loginEmployer(req: Request, res: Response) {
    const { email, password } = req.body;
    const { employer, accessToken, refreshToken } =
      await this.employerService.login(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: employer,
      accessToken,
      role: "employer",
    });
  }

  @httpPost("/logout")
  async logout(req: Request, res: Response) {
    const { employerId } = req.body;
    console.log(employerId);
    await this.employerService.logout(employerId);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" });
  }

  @httpPost("/google-signup")
  async googleSignup(req: Request, res: Response) {
    const { token } = req.body; // ✅ Get token from frontend

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    // ✅ Verify token with Google
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Must match your Google project
    });

    const payload = ticket.getPayload(); // ✅ Extract user info
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    // ✅ Get user details from Google response
    const googleId = payload.sub; // Unique user ID
    const email = payload.email;
    const companyName = payload.name;
    const profileImage = payload.picture;

    const { employer, accessToken, refreshToken } =
      await this.employerService.registerWithGoogle({
        googleId,
        email,
        companyName,
      });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: employer,
      accessToken,
      role: "employer",
    });
  }

  @httpPost("/google-login")
  async googleLogin(req: Request, res: Response) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    // ✅ Verify token with Google
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Must match your Google project
    });

    const payload = ticket.getPayload(); // ✅ Extract user info
    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    // ✅ Get user details from Google response
    const googleId = payload.sub; // Unique user ID
    const email = payload.email;

    const { employer, accessToken, refreshToken } =
      await this.employerService.loginWithGoogle({
        googleId,
        email,
      });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: employer,
      accessToken,
      role: "employer",
    });
  }

  @httpPost("/refresh")
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const { newAccessToken, newRefreshToken, employer } =
      await this.employerService.refreshToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: employer,
      role: "employer",
    });
  }

  @httpPut(
    "/update-profile",
    employerAuthMiddleware,
    validateRequest(UpdateEmployerDto)
  )
  async updateProfile(req: AuthenticatedEmployerRequest, res: Response) {
    const employerId = req.employer?.id;
    console.log(req.body);
    if (req.body.foundedYear) {
      const foundedYear = Number(req.body.foundedYear); // Convert to number
      if (isNaN(foundedYear)) {
        return res.status(400).json({ message: "Invalid foundedYear value" });
      }
      req.body.foundedYear = foundedYear; // Update the request body with the valid number
    }

    const updatedEmployer = await this.employerService.updateProfile(
      employerId!,
      req.body
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedEmployer,
    });
  }

  @httpPost(
    "/upload-logo",
    employerAuthMiddleware,
    upload.single("logo") // Middleware to handle single file upload (field name: "logo")
  )
  async uploadLogo(req: AuthenticatedEmployerRequest, res: Response) {
    const employerId = req.employer?.id;
    const file = req.file as Express.Multer.File & { path: string }; // Cloudinary returns `path` as the URL

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update the employer's logo URL in the database
    const updatedEmployer = await this.employerService.updateProfile(
      employerId!,
      {
        companyLogo: file.path, // Cloudinary URL is stored in `file.path`
      }
    );

    res.status(200).json({
      message: "Logo uploaded successfully",
      user: updatedEmployer,
    });
  }
}
