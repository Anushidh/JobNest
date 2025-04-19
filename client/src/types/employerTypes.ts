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
  plan?: string;
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployerPlan {
  _id: string;
  name: "normal" | "standard" | "premium";
  jobPostLimit: number;
  canViewApplicants: boolean;
  credits: number;
  price: number;
  durationInDays: number;
  prioritySupport: boolean;
  featuredJobSlots: number;
  analyticsAccess: boolean;
  highlightCompany: boolean;
  customBranding: boolean;
  candidateInsights: boolean;
  canDownloadResumes: boolean;
  planDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}
