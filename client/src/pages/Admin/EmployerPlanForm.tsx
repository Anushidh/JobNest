import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { useCreateEmployerPlanMutation } from "../../api/endpoints/planApi";

const employerPlanSchema = z.object({
  name: z.enum(["normal", "standard", "premium"]),
  jobPostLimit: z.coerce.number().min(1, "Must be at least 1"),
  credits: z.coerce.number().min(0, "Must be 0 or more"),
  price: z.coerce.number().min(0, "Must be 0 or more"),
  durationInDays: z.coerce.number().min(1, "Must be at least 1"),
  planDescription: z.string().optional(),

  canViewApplicants: z.boolean(),
  prioritySupport: z.boolean(),
  featuredJobSlots: z.coerce.number().min(0, "Must be 0 or more"),
  analyticsAccess: z.boolean(),
  highlightCompany: z.boolean(),
  customBranding: z.boolean(),
  candidateInsights: z.boolean(),
  canDownloadResumes: z.boolean(),
});

type EmployerPlanInput = z.infer<typeof employerPlanSchema>;

const planOptions = ["normal", "standard", "premium"];

const EmployerPlanForm: React.FC = () => {
  const [createEmployerPlan, { isLoading }] = useCreateEmployerPlanMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployerPlanInput>({
    resolver: zodResolver(employerPlanSchema),
    defaultValues: {
      name: "normal",
      jobPostLimit: 1,
      credits: 0,
      price: 0,
      durationInDays: 30,
      planDescription: "",
      canViewApplicants: false,
      prioritySupport: false,
      featuredJobSlots: 0,
      analyticsAccess: false,
      highlightCompany: false,
      customBranding: false,
      candidateInsights: false,
      canDownloadResumes: false,
    },
  });

  const onSubmit = async (data: EmployerPlanInput) => {
    try {
      await createEmployerPlan(data).unwrap();
      toast.success("Plan created successfully!");
      reset(); // Clear form
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create plan.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-2xl mx-auto p-6 border rounded-md shadow-md bg-white"
    >
      <h2 className="text-2xl font-bold mb-4">Create / Edit Employer Plan</h2>

      {/* Plan Name */}
      <div>
        <label className="block font-medium">Plan Name</label>
        <select {...register("name")} className="w-full border p-2 rounded">
          {planOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Numeric Inputs */}
      {[
        { name: "jobPostLimit", label: "Job Post Limit" },
        { name: "credits", label: "Credits" },
        { name: "price", label: "Price ($)" },
        { name: "durationInDays", label: "Duration (Days)" },
        { name: "featuredJobSlots", label: "Featured Job Slots" },
      ].map(({ name, label }) => (
        <div key={name}>
          <label className="block font-medium">{label}</label>
          <input
            type="number"
            {...register(name as keyof EmployerPlanInput)}
            className="w-full border p-2 rounded"
          />
          {errors[name as keyof EmployerPlanInput] && (
            <p className="text-red-500 text-sm">
              {errors[name as keyof EmployerPlanInput]?.message?.toString()}
            </p>
          )}
        </div>
      ))}

      {/* Description */}
      <div>
        <label className="block font-medium">Plan Description</label>
        <textarea
          {...register("planDescription")}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      {/* Boolean Checkboxes */}
      {[
        "canViewApplicants",
        "prioritySupport",
        "analyticsAccess",
        "highlightCompany",
        "customBranding",
        "candidateInsights",
        "canDownloadResumes",
      ].map((field) => (
        <div key={field}>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register(field as keyof EmployerPlanInput)}
              className="mr-2"
            />
            {field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase())}
          </label>
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
      >
        {isLoading ? "Saving..." : "Save Plan"}
      </button>
    </form>
  );
};

export default EmployerPlanForm;
