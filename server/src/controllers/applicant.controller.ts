import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  httpPut,
} from "inversify-express-utils";

import { TYPES } from "../app/types";
import { ApplicantService } from "../services/applicant.service";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  CreateApplicantDto,
  SignInDto,
  UpdateApplicantDto,
} from "../dtos/applicant.dto";
import {
  applicantAuthMiddleware,
  AuthenticatedApplicantRequest,
} from "../middlewares/applicant-auth.middleware";
import multer from "multer";
import { storage } from "../config/cloudinaryStorage.config";

const upload = multer({ storage });

@controller("/applicant")
export class ApplicantController extends BaseHttpController {
  private client: OAuth2Client;
  constructor(
    @inject(TYPES.ApplicantService)
    private applicantService: ApplicantService
  ) {
    super();
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @httpPost("/signup", validateRequest(CreateApplicantDto))
  async registerApplicant(req: Request, res: Response) {
    console.log("inside registerApplicant", req.body);
    const message = await this.applicantService.registerApplicant(req.body);
    res.status(201).json({ message });
  }

  @httpPost("/verify")
  async verifyApplicantOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const message = await this.applicantService.verifyApplicantOTP(email, otp);
    res.status(200).json({ message });
  }

  @httpPost("/login", validateRequest(SignInDto))
  async loginApplicant(req: Request, res: Response) {
    const { email, password } = req.body;
    const { applicant, accessToken, refreshToken } =
      await this.applicantService.login(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: applicant,
      accessToken,
      role: "applicant",
    });
  }

  @httpPost("/logout")
  async logout(req: Request, res: Response) {
    const { applicantId } = req.body;
    await this.applicantService.logout(applicantId);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" });
  }

  @httpPost("/google-signup")
  async googleSignup(req: Request, res: Response) {
    const { token } = req.body;
    console.log(token);
    if (!token) return res.status(400).json({ message: "Missing token" });
    console.log(
      "About to verify token with client ID:",
      process.env.GOOGLE_CLIENT_ID
    );
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    console.log(payload);
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    const { sub: googleId, email, name, picture } = payload;
    if (!googleId || !email || !name || !picture) {
      return res
        .status(400)
        .json({ message: "Incomplete Google profile info" });
    }
    const { applicant, accessToken, refreshToken } =
      await this.applicantService.registerWithGoogle({
        googleId,
        email,
        name,
        profilePicture: picture,
      });
    console.log("1");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Signup successful",
      user: applicant,
      accessToken,
      role: "applicant",
    });
  }

  @httpPost("/google-login")
  async googleLogin(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Missing token" });

    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    const { sub: googleId, email, name, picture } = payload;
    if (!googleId || !email || !name || !picture) {
      return res
        .status(400)
        .json({ message: "Incomplete Google profile info" });
    }
    const { applicant, accessToken, refreshToken } =
      await this.applicantService.loginWithGoogle({
        googleId,
        email,
        name,
        profilePicture: picture,
      });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: applicant,
      accessToken,
      role: "applicant",
    });
  }

  @httpPost("/refresh")
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(401).json({ message: "Missing refresh token" });

    const { newAccessToken, newRefreshToken, applicant } =
      await this.applicantService.refreshToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: applicant,
      role: "applicant",
    });
  }

  @httpPut(
    "/update-profile",
    applicantAuthMiddleware,
    validateRequest(UpdateApplicantDto)
  )
  async updateProfile(req: AuthenticatedApplicantRequest, res: Response) {
    const applicantId = req.applicant?.id;
    console.log("Incoming applicant update:", req.body);

    const updatedApplicant = await this.applicantService.updateProfile(
      applicantId!,
      req.body
    );
    console.log(updatedApplicant);
     res.status(200).json(updatedApplicant);
  }

  @httpPost(
    "/upload-profile-picture",
    applicantAuthMiddleware,
    upload.single("profilePicture") // field name: "profilePicture"
  )
  async uploadProfilePicture(
    req: AuthenticatedApplicantRequest,
    res: Response
  ) {
    
      const applicantId = req.applicant?.id;
      const file = req.file as Express.Multer.File & { path: string }; // Cloudinary returns URL as `path`

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Update the applicant's profile picture URL in the database
      const updatedApplicant = await this.applicantService.updateProfile(
        applicantId!,
        {
          profilePicture: file.path, // Cloudinary URL
        }
      );

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        user: updatedApplicant,
      });
    } 
  }

