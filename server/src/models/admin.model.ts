import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: "admin";
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema<IAdmin> = new Schema(
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
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "admin",
      immutable: true,
      enum: ["admin"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> = model<IAdmin>("Admin", adminSchema);

export default Admin;
