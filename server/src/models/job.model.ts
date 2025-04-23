import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  employer: mongoose.Types.ObjectId; // Reference to Employer
  companyName: string; // Denormalized for performance
  companyLogo?: string; // Optional field for company logo
  // Denormalized for performance
  salary: {
    min: number;
    max: number;
  };
  responsibilities: string[];
  jobType: "full-time" | "part-time" | "contract" | "internship";
  location: "remote" | "hybrid" | "onsite";
  skillsRequired: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  educationRequirements?: string[];
  applications: mongoose.Types.ObjectId[]; // Reference to Applicant
  status: "active" | "paused" | "closed";
  deadline?: Date;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema: Schema<IJob> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: 50,
      maxlength: 5000,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    companyName: {
      type: String,
      required: true, // Denormalized from Employer
    },
    companyLogo: {
      type: String,
    },
    salary: {
      min: {
        type: Number,
        min: 0,
        required: true,
      },
      max: {
        type: Number,
        min: 0,
        required: true,
        validate: {
          validator: function (this: any, v: number) {
            return v >= this.salary.min;
          },
          message: "Max salary must be greater than or equal to min salary",
        },
      },
    },
    responsibilities: {
      type: [String],
      required: [true, "At least one job responsibility is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Please specify at least one responsibility",
      },
    },
    
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    location: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      required: true,
    },
    skillsRequired: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v: string[]) => v.length > 0 && v.length <= 15,
        message: "1-15 skills required",
      },
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      required: true,
    },
    educationRequirements: {
      type: [String],
      default: undefined, // Makes the array optional
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Applicant",
        default: [],
      },
    ],
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (this: IJob, v: Date) {
          return !v || v > new Date();
        },
        message: "Deadline must be in the future",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> = model<IJob>("Job", jobSchema);

export default Job;
