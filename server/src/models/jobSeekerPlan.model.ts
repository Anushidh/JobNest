import mongoose, { Schema, Document, model } from "mongoose";

export interface IJobSeekerPlan extends Document {
  name: "normal" | "standard" | "premium";
  jobApplyLimit: number;
  canAccessChat: boolean;
  credits: number;
  price: number;
  durationInDays: number;
}

const jobSeekerPlanSchema = new Schema<IJobSeekerPlan>(
  {
    name: {
      type: String,
      enum: ["normal", "standard", "premium"],
      required: true,
      unique: true,
    },
    jobApplyLimit: {
      type: Number,
      required: true,
    },
    canAccessChat: {
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
  },
  { timestamps: true }
);

export default model<IJobSeekerPlan>("JobSeekerPlan", jobSeekerPlanSchema);
