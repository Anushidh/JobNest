import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import {
  useGetEmployerPlanByIdQuery,
  useUpdateEmployerPlanMutation,
} from "../../api/endpoints/planApi";

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

const EmployerPlanEditForm: React.FC = () => {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const {
    data: plan,
    isLoading,
    error,
    refetch,
  } = useGetEmployerPlanByIdQuery(planId as string);

  const [updateEmployerPlan, { isLoading: isSaving }] =
    useUpdateEmployerPlanMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmployerPlanInput>({
    resolver: zodResolver(employerPlanSchema),
  });

  useEffect(() => {
    console.log(plan);
    if (plan) {
      setValue("name", plan.name);
      setValue("jobPostLimit", plan.jobPostLimit);
      setValue("credits", plan.credits);
      setValue("price", plan.price);
      setValue("durationInDays", plan.durationInDays);
      setValue("planDescription", plan.planDescription || "");
      setValue("canViewApplicants", plan.canViewApplicants || false);
      setValue("prioritySupport", plan.prioritySupport || false);
      setValue("featuredJobSlots", plan.featuredJobSlots);
      setValue("analyticsAccess", plan.analyticsAccess || false);
      setValue("highlightCompany", plan.highlightCompany || false);
      setValue("customBranding", plan.customBranding || false);
      setValue("candidateInsights", plan.candidateInsights || false);
      setValue("canDownloadResumes", plan.canDownloadResumes || false);
    }
  }, [plan, setValue]);

  const onSubmit = async (formData: EmployerPlanInput) => {
    if (planId) {
      await updateEmployerPlan({
        id: planId,
        data: formData,
      }).unwrap();
      //   refetch();
      toast.success("Plan updated successfully!");
      navigate("/admin/employer-plans");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading plan data.</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto p-6 border rounded-md shadow-md bg-white text-gray-700"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Employer Plan</h2>

      {/* Plan Name */}
      <div>
        <label className="block font-medium text-sm">Plan Name</label>
        <select
          {...register("name")}
          className="w-full border p-2 rounded text-sm"
        >
          {planOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Numeric Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "jobPostLimit", label: "Job Post Limit" },
          { name: "credits", label: "Credits" },
          { name: "price", label: "Price ($)" },
          { name: "durationInDays", label: "Duration (Days)" },
          { name: "featuredJobSlots", label: "Featured Job Slots" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block font-medium text-sm">{label}</label>
            <input
              type="number"
              {...register(name as keyof EmployerPlanInput)}
              className="w-full border p-2 rounded text-sm"
            />
            {errors[name as keyof EmployerPlanInput] && (
              <p className="text-red-500 text-xs">
                {errors[name as keyof EmployerPlanInput]?.message?.toString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-sm">Plan Description</label>
        <textarea
          {...register("planDescription")}
          className="w-full border p-2 rounded text-sm"
          rows={3}
        />
      </div>

      {/* Boolean Checkboxes */}
      <div className="grid grid-cols-2 gap-4">
        {[
          "canViewApplicants",
          "prioritySupport",
          "analyticsAccess",
          "highlightCompany",
          "customBranding",
          "candidateInsights",
          "canDownloadResumes",
        ].map((field) => (
          <div key={field} className="flex items-center">
            <input
              type="checkbox"
              {...register(field as keyof EmployerPlanInput)}
              className="mr-2"
            />
            <label className="text-sm">
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
            </label>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-sm"
      >
        {isSaving ? "Saving..." : "Save Plan"}
      </button>
    </form>
  );
};

export default EmployerPlanEditForm;
