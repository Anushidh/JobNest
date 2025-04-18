// import {
//     controller,
//     httpPost,
//     request,
//     response,
//   } from "inversify-express-utils";
//   import { inject } from "inversify";
//   import TYPES from "../types";
//   import { PaymentService } from "../services/payment.service";
//   import { Request, Response } from "express";
  
//   @controller("/api/payments")
//   export class PaymentController {
//     constructor(
//       @inject(TYPES.PaymentService)
//       private paymentService: PaymentService
//     ) {}
  
//     @httpPost("/order")
//     async createOrder(@request() req: Request, @response() res: Response) {
//       const { amount } = req.body;
//       const order = await this.paymentService.createOrder(amount);
//       res.status(200).json(order);
//     }
  
//     @httpPost("/verify")
//     async verify(@request() req: Request, @response() res: Response) {
//       const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
//       try {
//         const result = await this.paymentService.verifyPayment(
//           order_id,
//           razorpay_payment_id,
//           razorpay_signature
//         );
//         res.status(200).json(result);
//       } catch (err: any) {
//         res.status(400).json({ error: err.message });
//       }
//     }
//   }
  