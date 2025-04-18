import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/error.util";

export const validateRequest =
  (dtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Inside validation middleware");
    console.log(req.body)

    const dtoInstance = plainToInstance(dtoClass, req.body);
    console.log("DTO instance:", dtoInstance);
    const errors = await validate(dtoInstance);
    console.log("Validation errors:", errors);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints!).join(", "))
        .join("; ");

      return next(new AppError(errorMessages, 400));
    }

    next();
  };
