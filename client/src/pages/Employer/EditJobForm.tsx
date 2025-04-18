import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";

import {
  useGetJobQuery,
  useUpdateJobMutation,
} from "../../api/endpoints/jobApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Description is required"),
  companyName: z.string().min(1, "Company name is required"),
  salary: z.object({
    min: z.string().min(1, "Minimum salary is required"),
    max: z.string().min(1, "Maximum salary is required"),
  }),
  jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
  educationRequirements: z.array(z.string().min(1)).optional(),
  location: z.enum(["remote", "hybrid", "onsite"]),
  deadline: z.string().optional(),
  skillsRequired: z.array(z.string().min(1)).optional(),
  isFeatured: z.boolean().optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

const EditJobForm: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [educationRequirements, setEducationRequirements] = useState<string[]>(
    []
  );
  const navigate = useNavigate();
  const { jobId } = useParams();
  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useGetJobQuery(jobId as string);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
  });

  useEffect(() => {
    if (job) {
      // Set the form values dynamically with the job data
      setValue("title", job.title);
      setValue("description", job.description);
      setValue("companyName", job.companyName);
      setValue("salary.min", job.salary.min);
      setValue("salary.max", job.salary.max);
      setValue("jobType", job.jobType);
      setValue("experienceLevel", job.experienceLevel);
      setValue("educationRequirements", job.educationRequirements || []);
      setValue("location", job.location);
      setValue("deadline", job.deadline ? job.deadline.split("T")[0] : "");
      setValue("skillsRequired", job.skillsRequired || []);
      setValue("isFeatured", job.isFeatured || false);

      setSkills(job.skillsRequired || []);
      setEducationRequirements(job.educationRequirements || []);
    }
  }, [job, setValue]);

  const handleEducationAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const education = (e.target as HTMLInputElement).value.trim();
      if (education && !educationRequirements.includes(education)) {
        const updatedEducation = [...educationRequirements, education];
        setEducationRequirements(updatedEducation);
        setValue("educationRequirements", updatedEducation);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleEducationDelete = (educationToDelete: string) => {
    const updated = educationRequirements.filter(
      (edu) => edu !== educationToDelete
    );
    setEducationRequirements(updated);
    setValue("educationRequirements", updated);
  };

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = (e.target as HTMLInputElement).value.trim();
      if (skill && !skills.includes(skill)) {
        const updatedSkills = [...skills, skill];
        setSkills(updatedSkills);
        setValue("skillsRequired", updatedSkills);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleSkillDelete = (skillToDelete: string) => {
    const updated = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updated);
    setValue("skillsRequired", updated);
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      const updatedData = { ...data, id: jobId };
      await updateJob(updatedData).unwrap();
      toast.success("Job updated successfully!");
      navigate("/employer/posted-jobs");
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";

      if (typeof error === "object" && error !== null && "status" in error) {
        const err = error as FetchBaseQueryError;

        if ("data" in err) {
          if (typeof err.data === "string") {
            errorMessage = err.data;
          } else if (typeof err.data === "object" && err.data !== null) {
            errorMessage =
              (err.data as { message?: string }).message || errorMessage;
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  if (isLoading) return <p>Loading job data...</p>;
  if (isError) return <p>Error loading job data: {error?.message}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-5">
      <h2 className="text-2xl text-white font-semibold p-4 bg-[#5FACEB] mb-6 text-center">
        Edit Job
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            {...register("title")}
            className="mt-1 w-full p-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            className="mt-1 w-full p-2 border rounded-md"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            {...register("companyName")}
            className="mt-1 w-full p-2 border rounded-md"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
        </div>

        {/* Salary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Min
            </label>
            <input
              type="number"
              {...register("salary.min")}
              className="w-full p-2 border rounded-md"
            />
            {errors.salary?.min && (
              <p className="text-red-500 text-sm">
                {errors.salary.min.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Max
            </label>
            <input
              type="number"
              {...register("salary.max")}
              className="w-full p-2 border rounded-md"
            />
            {errors.salary?.max && (
              <p className="text-red-500 text-sm">
                {errors.salary.max.message}
              </p>
            )}
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <select
            {...register("jobType")}
            className="w-full p-2 border rounded-md"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            {...register("experienceLevel")}
            className="w-full p-2 border rounded-md"
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Requirements
          </label>
          <input
            onKeyDown={handleEducationAdd}
            className="w-full p-2 border rounded-md"
            placeholder="Press Enter to add"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {educationRequirements.map((edu) => (
              <span
                key={edu}
                className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
              >
                {edu}
                <button
                  onClick={() => handleEducationDelete(edu)}
                  className="ml-2 text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills Required
          </label>
          <input
            onKeyDown={handleSkillAdd}
            className="w-full p-2 border rounded-md"
            placeholder="Press Enter to add"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                <button
                  onClick={() => handleSkillDelete(skill)}
                  className="ml-2 text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            {...register("location")}
            className="w-full p-2 border rounded-md"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Deadline
          </label>
          <input
            type="date"
            {...register("deadline")}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#5FACEB] hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
