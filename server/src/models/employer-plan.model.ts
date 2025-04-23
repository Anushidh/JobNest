import mongoose, { Schema, Document, model, Model } from "mongoose";

interface EmployerPlanFeatures {
  jobLimit: number | "unlimited";
  highlightJobs: boolean;
  premiumSupport: boolean;
  durationInDays: number;
}

export interface IEmployerPlan extends Document {
  _id: mongoose.Types.ObjectId;
  name: "basic" | "standard" | "premium";
  description: string;
  price: number;
  features: EmployerPlanFeatures;
  createdAt: Date;
  updatedAt: Date;
}

const employerPlanSchema = new Schema<IEmployerPlan>(
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
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      jobLimit: { type: Schema.Types.Mixed, required: true }, // number or "unlimited"
      highlightJobs: { type: Boolean, default: false },
      premiumSupport: { type: Boolean, default: false },
      durationInDays: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const EmployerPlan: Model<IEmployerPlan> = model<IEmployerPlan>(
  "EmployerPlan",
  employerPlanSchema
);

export default EmployerPlan;
