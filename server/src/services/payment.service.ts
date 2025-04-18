// import { inject, injectable } from "inversify";
// import { razorpayInstance } from "../utils/razorpay";
// import TYPES from "../types";
// import { PaymentRepository } from "../repositories/payment.repository";
// import crypto from "crypto";

// @injectable()
// export class PaymentService {
//   constructor(
//     @inject(TYPES.PaymentRepository)
//     private paymentRepository: PaymentRepository
//   ) {}

//   async createOrder(amount: number) {
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: `rcpt_${Date.now()}`,
//     };
//     const order = await razorpayInstance.orders.create(options);
//     return order;
//   }

//   async verifyPayment(orderId: string, paymentId: string, signature: string) {
//     const body = `${orderId}|${paymentId}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== signature) {
//       throw new Error("Invalid payment signature");
//     }

//     await this.paymentRepository.saveTransaction({ orderId, paymentId });
//     return { success: true };
//   }
// }
