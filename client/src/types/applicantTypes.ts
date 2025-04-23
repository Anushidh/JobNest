import { Employer } from "./employerTypes";

export interface Applicant {
  _id: string;
  email: string;
  password?: string;
  googleId?: string;
  isGoogleUser: boolean;
  name: string;
  profilePicture?: string;
  resume?: string; // Cloudinary URL
  skills: string[];
  experience: "entry" | "mid" | "senior" | "lead";
  education: string[];
  appliedJobs: string[]; // Array of job IDs
  savedJobs: string[]; // Array of job IDs
  role: "applicant";
  isBlocked: boolean;
  isVerified: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | null;
  plan: string;
  planExpiresAt?: Date | null;
}

export interface ApplicantPlan {
  _id: string;
  name: "normal" | "standard" | "premium";
  jobApplyLimit: number;
  canAccessChat: boolean;
  credits: number;
  price: number;
  durationInDays: number;
  planDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  employer: Employer;
  companyName: string;
  companyLogo?: string; // Optional field for company logo
  salary: {
    min: number;
    max: number;
  };
  jobType: "full-time" | "part-time" | "contract" | "internship";
  location: "remote" | "hybrid" | "onsite";
  skillsRequired: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  educationRequirements?: string[];
  responsibilities: string[];
  applications: string[];
  status: "active" | "paused" | "closed";
  deadline?: string; // ISO string from backend
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
