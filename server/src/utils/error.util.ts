export class AppError extends Error {
    public status: number;
  
    constructor(message: string, status: number) {
      console.log("inside apperror");
      super(message);
      this.status = status;
      Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
      Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
  }
  