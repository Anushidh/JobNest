import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Admin from "../models/admin.model";

export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    id: string;
    role: "admin";
  };
}

export const adminAuthMiddleware = async (
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[DEBUG] Admin auth middleware triggered");

    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as JwtPayload & {
      id: string;
      role: string;
    };

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied - Not an admin" });
    }

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Admin not found" });
    }

    req.admin = {
      id: admin._id.toString(),
      role: "admin",
    };

    console.log("[DEBUG] Admin authenticated:", req.admin);
    next();
  } catch (error: any) {
    console.error("[ERROR] Admin auth error:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired - Please log in again"
        : "Invalid authentication token";

    res.status(401).json({ message });
  }
};
