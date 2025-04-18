import jwt from "jsonwebtoken";
import { AppError } from "./error.util";

export const generateAccessToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1d" }
  );
};

export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (
  refreshToken: string,
  Id: string,
  email: string
) => {
  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    if (decoded.id !== Id || decoded.email !== email) {
      throw new AppError("Invalid refresh token.", 401);
    }

    return decoded; // Return decoded token data if verification is successful
  } catch (error) {
    throw new AppError("Expired or invalid refresh token.", 401);
  }
};
