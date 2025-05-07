import mongoose, { Document, Schema, model, Model } from "mongoose";

export interface IApplication extends Document {
  applicant: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  employer: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Application: Model<IApplication> = model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;
