import mongoose, { Document, Schema, Model, model } from "mongoose";
import { IApplicantPlan } from "./applicant-plan.model";

export interface IApplicant extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  googleId?: string;
  isGoogleUser: boolean;
  name: string;
  profilePicture?: string;
  resume?: string;
  skills: string[];
  experience?: "entry" | "mid" | "senior" | "lead";
  education?: string[];
  savedJobs: mongoose.Types.ObjectId[];
  role: "applicant";
  isBlocked: boolean;
  isVerified: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | null;
  plan?: mongoose.Types.ObjectId;
  planExpiresAt?: Date;
  applicationsLeft: number | "unlimited";
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicantWithPlan extends Omit<IApplicant, "plan"> {
  plan?: IApplicantPlan | mongoose.Types.ObjectId;
}

const applicantSchema: Schema<IApplicant> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: function (this: IApplicant) {
        return !this.isGoogleUser;
      },
    },
    googleId: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    profilePicture: {
      type: String,
      validate: {
        validator: (v: string) => v.startsWith("https://res.cloudinary.com/"),
        message: "Only Cloudinary URLs are allowed",
      },
    },
    resume: {
      type: String,
      validate: {
        validator: (v: string) => v.startsWith("https://res.cloudinary.com/"),
        message: "Only Cloudinary URLs are allowed",
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 20,
        message: "Maximum 20 skills allowed",
      },
    },
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
    },
    education: {
      type: [String],
      default: undefined, // Makes the array optional
    },
    savedJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
        default: [],
      },
    ],
    role: {
      type: String,
      default: "applicant",
      immutable: true,
      enum: ["applicant"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // 👇 Plan integration
    plan: {
      type: Schema.Types.ObjectId,
      ref: "ApplicantPlan",
    },
    planExpiresAt: {
      type: Date,
    },
    applicationsLeft: {
      type: Schema.Types.Mixed, // number or 'unlimited'
    },
  },

  {
    timestamps: true,
  }
);

applicantSchema.pre<IApplicant>("save", async function (next) {
  if (!this.plan) {
    try {
      const basicPlan = await mongoose
        .model("ApplicantPlan")
        .findOne({ name: "basic" });

      if (basicPlan) {
        this.plan = basicPlan._id;
        this.applicationsLeft = basicPlan.features.applicationLimit;
      } else {
        console.warn("⚠️ No default 'basic' plan found in the database.");
      }

      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

const Applicant: Model<IApplicant> = model<IApplicant>(
  "Applicant",
  applicantSchema
);

export default Applicant;
