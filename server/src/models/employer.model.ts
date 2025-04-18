import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IEmployer extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  googleId?: string;
  isGoogleUser: boolean;
  companyName: string;
  companyLogo?: string;
  description?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  foundedYear?: number;
  linkedin?: string;
  postedJobs: mongoose.Types.ObjectId[];
  role: "employer";
  isVerified: boolean;
  isBlocked: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  plan?: mongoose.Types.ObjectId;
  planExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  companyTagline?: string;
  companyCulture?: string;
  missionStatement?: string;
}

const employerSchema: Schema<IEmployer> = new Schema(
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
      required: function (this: IEmployer) {
        return !this.isGoogleUser;
      },
    },
    googleId: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      minlength: 2,
      maxlength: 100,
    },
    companyLogo: {
      type: String,
      validate: {
        validator: (v: string) => v.startsWith("https://res.cloudinary.com/"),
        message: "Only Cloudinary URLs are allowed",
      },
    },
    description: String,
    website: String,
    industry: { type: String },
    companySize: { type: String },
    headquarters: { type: String },
    foundedYear: { type: Number },
    linkedin: {
      type: String,
      validate: {
        validator: (v: string) =>
          !v || v.startsWith("https://www.linkedin.com"),
        message: "LinkedIn URL must start with https://www.linkedin.com",
      },
    },
    companyTagline: {
      type: String,
      maxlength: 150,
    },
    companyCulture: {
      type: String,
    },
    missionStatement: {
      type: String,
    },
    postedJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    role: {
      type: String,
      default: "employer",
      immutable: true,
      enum: ["employer"],
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "EmployerPlan",
    },
    planExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Employer: Model<IEmployer> = model<IEmployer>("Employer", employerSchema);

export default Employer;
