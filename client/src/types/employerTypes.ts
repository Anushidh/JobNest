export interface Employer {
  _id: string;
  email: string;
  password?: string;
  googleId?: string;
  isGoogleUser?: boolean;
  companyName: string;
  companyLogo?: string;
  description?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  foundedYear?: number;
  linkedin?: string;
  companyTagline?: string;
  companyCulture?: string;
  missionStatement?: string;
  benefits?: string[];
  postedJobs: string[];
  role: "employer";
  isVerified: boolean;
  isBlocked: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  plan?: EmployerPlan;
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type EmployerPlanType = "basic" | "standard" | "premium";

export interface EmployerPlanFeatures {
  jobLimit: number | "unlimited";
  highlightJobs: boolean;
  premiumSupport: boolean;
  durationInDays: number;
}

export interface EmployerPlan {
  _id: string; // string version of ObjectId for frontend
  name: EmployerPlanType;
  description: string;
  price: number;
  features: EmployerPlanFeatures;
  createdAt: string; // ISO string from server
  updatedAt: string;
}
