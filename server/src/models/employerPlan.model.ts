import mongoose, { Schema, Document, model, Model } from "mongoose";

export interface IEmployerPlan extends Document {
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
}

const employerPlanSchema = new Schema<IEmployerPlan>(
  {
    name: {
      type: String,
      enum: ["normal", "standard", "premium"],
      required: true,
      unique: true,
    },
    jobPostLimit: {
      type: Number,
      required: true,
    },
    canViewApplicants: {
      type: Boolean,
      default: false,
    },
    credits: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
    featuredJobSlots: {
      type: Number,
      default: 0,
    },
    analyticsAccess: {
      type: Boolean,
      default: false,
    },
    highlightCompany: {
      type: Boolean,
      default: false,
    },
    customBranding: {
      type: Boolean,
      default: false,
    },
    candidateInsights: {
      type: Boolean,
      default: false,
    },
    canDownloadResumes: {
      type: Boolean,
      default: false,
    },
    planDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmployerPlan: Model<IEmployerPlan> = model<IEmployerPlan>(
  "EmployerPlan",
  employerPlanSchema
);

export default EmployerPlan;
