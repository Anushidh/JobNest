import { Container } from "inversify";
import { TYPES } from "./types";
import { EmployerService } from "../services/employer.service";
import { EmployerRepository } from "../repositories/employer.repository";
import { JobRepository } from "../repositories/job.repository";
import { JobService } from "../services/job.service";
import { ApplicantRepository } from "../repositories/applicant.repository";
import { ApplicantService } from "../services/applicant.service";
import { PlanService } from "../services/plan.service";
import { EmployerPlanRepository } from "../repositories/employer-plan.repository";
// import { PaymentRepository } from "../repositories/payment.repository";
// import { PaymentService } from "../services/payment.service";

//import { ServiceProviderAuthMiddleware } from "../middlewares/ServiceProviderAuthMiddleware";

const container = new Container({ defaultScope: "Singleton" });

// Bind the repository
container
  .bind<EmployerRepository>(TYPES.EmployerRepository)
  .to(EmployerRepository);
container.bind<JobRepository>(TYPES.JobRepository).to(JobRepository);
container
  .bind<ApplicantRepository>(TYPES.ApplicantRepository)
  .to(ApplicantRepository);
container
  .bind<EmployerPlanRepository>(TYPES.EmployerPlanRepository)
  .to(EmployerPlanRepository);
// container
//   .bind<PaymentRepository>(TYPES.PaymentRepository)
//   .to(PaymentRepository);

// // Bind the service
container.bind<EmployerService>(TYPES.EmployerService).to(EmployerService);
container.bind<JobService>(TYPES.JobService).to(JobService);
container.bind<ApplicantService>(TYPES.ApplicantService).to(ApplicantService);
container.bind<PlanService>(TYPES.PlanService).to(PlanService);
// container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);

// ✅ Bind Middleware
// container
//   .bind<ServiceProviderAuthMiddleware>(TYPES.ServiceProviderAuthMiddleware)
//   .to(ServiceProviderAuthMiddleware);
export { container };
