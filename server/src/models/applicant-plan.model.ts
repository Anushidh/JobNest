import mongoose, { Schema, Document, model } from "mongoose";

interface ApplicantPlanFeatures {
  applicationLimit: number | "unlimited";
  resumeBoost: boolean;
  personalizedSupport: boolean;
  durationInDays: number;
}

export interface IApplicantPlan extends Document {
  _id: mongoose.Types.ObjectId;
  name: "basic" | "standard" | "premium";
  description: string;
  price: number;
  features: ApplicantPlanFeatures;
  createdAt: Date;
  updatedAt: Date;
}
const applicantPlanSchema = new Schema<IApplicantPlan>(
  {
    name: {
      type: String,
      enum: {
        values: ["basic", "standard", "premium"],
        message: "{VALUE} is not a valid plan name",
      },
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      applicationLimit: { type: Schema.Types.Mixed, required: true }, // number or 'unlimited'
      resumeBoost: { type: Boolean, default: false },
      personalizedSupport: { type: Boolean, default: false },
      durationInDays: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default model<IApplicantPlan>("ApplicantPlan", applicantPlanSchema);
