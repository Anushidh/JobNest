import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import { useCreateJobMutation } from "../../api/endpoints/jobApi";

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
  educationRequirements: z
    .array(z.string().min(1, "At least one education requirement is required"))
    .optional(),
  responsibilities: z
    .array(z.string().min(1, "At least one education requirement is required"))
    .optional(),
  location: z.enum(["remote", "hybrid", "onsite"]),
  deadline: z.string().optional(),
  skillsRequired: z
    .array(z.string().min(1, "At least one skill is required"))
    .optional(),
  isFeatured: z.boolean().optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

const JobPostForm: React.FC = () => {
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [educationRequirements, setEducationRequirements] = useState<string[]>(
    []
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      companyName: "",
      salary: { min: "", max: "" },
      jobType: "full-time",
      experienceLevel: "entry",
      educationRequirements: [],
      responsibilities: [],
      location: "remote",
      deadline: "",
      skillsRequired: [],
      isFeatured: false,
    },
  });

  const handleEducationAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const education = (e.target as HTMLInputElement).value.trim();
      if (education && !educationRequirements.includes(education)) {
        setEducationRequirements((prev) => {
          const updatedEducation = [...prev, education];
          setValue("educationRequirements", updatedEducation);
          return updatedEducation;
        });
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleEducationDelete = (educationToDelete: string) => {
    setEducationRequirements(
      educationRequirements.filter((edu) => edu !== educationToDelete)
    );
    setValue(
      "educationRequirements",
      educationRequirements.filter((edu) => edu !== educationToDelete)
    );
  };

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = (e.target as HTMLInputElement).value.trim();
      if (skill && !skills.includes(skill)) {
        setSkills((prevSkills) => {
          const newSkills = [...prevSkills, skill];
          setValue("skillsRequired", newSkills); // Update the skillsRequired field
          return newSkills;
        });
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleSkillDelete = (skillToDelete: string) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
    setValue(
      "skillsRequired",
      skills.filter((skill) => skill !== skillToDelete)
    ); // Update skillsRequired field after deletion
  };

  // Responsibilities Add/Remove
  const handleResponsibilityAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const responsibility = (e.target as HTMLInputElement).value.trim();
      if (responsibility && !responsibilities.includes(responsibility)) {
        setResponsibilities((prev) => {
          const updatedResponsibilities = [...prev, responsibility];
          setValue("responsibilities", updatedResponsibilities);
          return updatedResponsibilities;
        });
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleResponsibilityDelete = (responsibilityToDelete: string) => {
    setResponsibilities(
      responsibilities.filter((resp) => resp !== responsibilityToDelete)
    );
    setValue(
      "responsibilities",
      responsibilities.filter((resp) => resp !== responsibilityToDelete)
    );
  };

  const onSubmit = async (data: JobFormData) => {
    console.log(data);
    const result = await createJob(data).unwrap();
    console.log("Job successfully posted:", result);
    toast.success("Job successfully posted!");
    navigate("/employer/posted-jobs");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-5">
      <h2 className="text-2xl text-white font-semibold p-4 bg-[#5FACEB] mb-6 text-center">
        Post a New Job
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
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
            rows={4}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2 resize-none"
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
            type="text"
            {...register("companyName")}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salary Min
            </label>
            <input
              type="number"
              {...register("salary.min")}
              className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
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
              className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
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
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2 bg-white"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          {errors.jobType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jobType.message}
            </p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            {...register("experienceLevel")}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2 bg-white"
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.experienceLevel.message}
            </p>
          )}
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsibilities
          </label>
          <input
            type="text"
            onKeyDown={handleResponsibilityAdd}
            placeholder="Press Enter to add responsibility"
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
          />
          <div className="flex flex-wrap gap-2 mb-2 mt-2">
            {responsibilities.map((responsibility) => (
              <span
                key={responsibility}
                className="bg-blue-500 text-white py-1 px-3 rounded-full flex items-center space-x-2"
              >
                <span>{responsibility}</span>
                <button
                  type="button"
                  onClick={() => handleResponsibilityDelete(responsibility)}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {errors.responsibilities && (
            <p className="text-red-500 text-sm">
              {errors.responsibilities.message}
            </p>
          )}
        </div>

        {/* Education Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Requirements
          </label>
          <input
            type="text"
            onKeyDown={handleEducationAdd}
            placeholder="Press Enter to add education requirement"
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
          />
          <div className="flex flex-wrap gap-2 mb-2 mt-2">
            {educationRequirements.map((education) => (
              <span
                key={education}
                className="bg-blue-500 text-white py-1 px-3 rounded-full flex items-center space-x-2"
              >
                <span>{education}</span>
                <button
                  type="button"
                  onClick={() => handleEducationDelete(education)}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {errors.educationRequirements && (
            <p className="text-red-500 text-sm">
              {errors.educationRequirements.message}
            </p>
          )}
        </div>

        {/* Skills Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills Required
          </label>

          <input
            type="text"
            onKeyDown={handleSkillAdd}
            placeholder="Press Enter to add skill"
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
          />
          <div className="flex flex-wrap gap-2 mb-2 mt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-green-500 text-white py-1 px-3 rounded-full flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleSkillDelete(skill)}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {errors.skillsRequired && (
            <p className="text-red-500 text-sm">
              {errors.skillsRequired.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            {...register("location")}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2 bg-white"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            {...register("deadline")}
            className="mt-1 w-full text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deadline.message}
            </p>
          )}
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Featured Job
          </label>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-[#5FACEB] hover:bg-[rgb(72,67,180)] text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;
