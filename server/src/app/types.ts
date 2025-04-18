const TYPES = {
  EmployerRepository: Symbol.for("EmployerRepository"),
  EmployerService: Symbol.for("EmployerService"),
  JobRepository: Symbol.for("JobRepository"),
  JobService: Symbol.for("JobService"),
  ApplicantRepository: Symbol.for("ApplicantRepository"),
  ApplicantService: Symbol.for("ApplicantService"),
  EmployerPlanRepository: Symbol.for("EmployerPlanRepository"),
  PlanService: Symbol.for("PlanService"),
  PaymentService: Symbol.for("PaymentService"),
  PaymentRepository: Symbol.for("PaymentRepository"),
  AdminService: Symbol.for("AdminService"),
  AdminRepository: Symbol.for("AdminRepository"),
  employerAuthMiddleware: Symbol.for("employerAuthMiddleware"),
};

export { TYPES };
