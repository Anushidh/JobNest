import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId; // Link to either an employer or applicant
  userType: "employer" | "applicant"; // Specify the user type
  amount: number; // The total amount paid
  transactionId: string; // Razorpay transaction ID
  razorpayOrderId: string; // Razorpay order ID
  razorpayPaymentId: string; // Razorpay payment ID
  status: "success" | "failed" | "pending"; // Payment status
  paymentDate: Date; // Date of the transaction
  planModel: "EmployerPlan" | "ApplicantPlan"; // The plan type purchased
  plan: mongoose.Types.ObjectId; // Link to the plan (EmployerPlan or ApplicantPlan)
  receiptUrl?: string; // URL of the receipt for the user (optional)
  refundStatus?: "none" | "requested" | "refunded"; // Refund status (optional)
  currency: "INR"; // Fixed currency as INR (Indian Rupee)
  paymentMethod: "Razorpay"; // Hardcoded payment method as Razorpay
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userType", // Dynamic reference depending on userType
    },
    userType: {
      type: String,
      enum: ["employer", "applicant"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    planModel: {
      type: String,
      enum: ["EmployerPlan", "ApplicantPlan"],
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "planModel", // Dynamic reference to the correct plan model
    },
    receiptUrl: {
      type: String,
      required: false, // Optional, URL for the user's receipt
    },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "refunded"],
      default: "none", // Default is "none"
    },
    currency: {
      type: String,
      default: "INR", // Hardcoded to INR as currency is always INR
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Razorpay", // Hardcoded to Razorpay as the only payment method
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
