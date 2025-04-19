import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import {
  useGetApplicantPlanByIdQuery,
  useUpdateApplicantPlanMutation,
} from "../../api/endpoints/planApi";

const applicantPlanSchema = z.object({
  name: z.enum(["normal", "standard", "premium"]),
  jobApplyLimit: z.coerce.number().min(1, "Must be at least 1"),
  canAccessChat: z.boolean(),
  credits: z.coerce.number().min(0, "Must be 0 or more"),
  price: z.coerce.number().min(0, "Must be 0 or more"),
  durationInDays: z.coerce.number().min(1, "Must be at least 1"),
  planDescription: z.string().optional(),
});

type ApplicantPlanInput = z.infer<typeof applicantPlanSchema>;

const planOptions = ["normal", "standard", "premium"];

const ApplicantPlanEditForm: React.FC = () => {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();

  const {
    data: plan,
    isLoading,
    error,
  } = useGetApplicantPlanByIdQuery(planId as string);

  const [updateApplicantPlan, { isLoading: isSaving }] =
    useUpdateApplicantPlanMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicantPlanInput>({
    resolver: zodResolver(applicantPlanSchema),
  });

  useEffect(() => {
    if (plan) {
      setValue("name", plan.name);
      setValue("jobApplyLimit", plan.jobApplyLimit);
      setValue("canAccessChat", plan.canAccessChat || false);
      setValue("credits", plan.credits);
      setValue("price", plan.price);
      setValue("durationInDays", plan.durationInDays);
      setValue("planDescription", plan.planDescription || "");
    }
  }, [plan, setValue]);

  const onSubmit = async (formData: ApplicantPlanInput) => {
    if (planId) {
      await updateApplicantPlan({
        id: planId,
        data: formData,
      }).unwrap();
      toast.success("Plan updated successfully!");
      navigate("/admin/applicant-plans");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading plan data.</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-3xl mx-auto p-6 border rounded-md shadow-md bg-white text-gray-700"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Applicant Plan</h2>

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
          { name: "jobApplyLimit", label: "Job Apply Limit" },
          { name: "credits", label: "Credits" },
          { name: "price", label: "Price (₹)" },
          { name: "durationInDays", label: "Duration (Days)" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block font-medium text-sm">{label}</label>
            <input
              type="number"
              {...register(name as keyof ApplicantPlanInput)}
              className="w-full border p-2 rounded text-sm"
            />
            {errors[name as keyof ApplicantPlanInput] && (
              <p className="text-red-500 text-xs">
                {errors[name as keyof ApplicantPlanInput]?.message?.toString()}
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

      {/* Access Chat */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("canAccessChat")}
          className="mr-2"
        />
        <label className="text-sm">Can Access Chat</label>
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

export default ApplicantPlanEditForm;
