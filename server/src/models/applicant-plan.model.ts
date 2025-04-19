import mongoose, { Schema, Document, model } from "mongoose";

export interface IApplicantPlan extends Document {
  _id: mongoose.Types.ObjectId;
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

const applicantPlanSchema = new Schema<IApplicantPlan>(
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
    planDescription: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

export default model<IApplicantPlan>("ApplicantPlan", applicantPlanSchema);
