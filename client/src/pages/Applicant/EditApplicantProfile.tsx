import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEditApplicantMutation } from "../../api/endpoints/applicantApi";
import { updateApplicant } from "../../redux/slices/applicantSlice";
import { useNavigate } from "react-router";

const applicantSchema = z.object({
  name: z.string().min(1),
  skills: z.array(z.string().min(1).optional()).max(20),
  experience: z.string().optional(),
  education: z.array(z.string().min(1)).optional(),
});

type ApplicantFormData = z.infer<typeof applicantSchema>;

const EditApplicantProfile: React.FC = () => {
  const applicant = useSelector(
    (state: RootState) => state.applicant.applicant
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>(applicant?.skills || []);
  const [education, setEducation] = useState<string[]>(
    applicant?.education || []
  );
  const [editApplicant, { isLoading }] = useEditApplicantMutation();

  useEffect(() => {
    if (applicant) {
      setValue("name", applicant.name);
      setValue("skills", applicant.skills || []);
      setValue("experience", applicant.experience || "");
      setValue("education", applicant.education || []);

      setEducation(applicant.education || []);
      setSkills(applicant.skills || []);
    }
  }, [applicant, setValue]);

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = e.currentTarget.value.trim();
      if (skill && !skills.includes(skill)) {
        const updated = [...skills, skill];
        setSkills(updated);
        setValue("skills", updated);
        e.currentTarget.value = "";
      }
    }
  };

  const handleSkillDelete = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    setValue("skills", updated);
  };

  const handleEducationAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !education.includes(value)) {
        const updated = [...education, value];
        setEducation(updated);
        setValue("education", updated);
        e.currentTarget.value = "";
      }
    }
  };

  const handleEducationDelete = (edu: string) => {
    const updated = education.filter((e) => e !== edu);
    setEducation(updated);
    setValue("education", updated);
  };

  const onSubmit = async (data: ApplicantFormData) => {
    const formData = {
      name: data.name,
      skills,
      experience: data.experience || "",
      education: data.education || [],
    };
    console.log(formData);
    // Call the mutation hook to submit the data
    const updatedApplicant = await editApplicant({ data: formData }).unwrap();

    dispatch(updateApplicant(updatedApplicant));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl text-white font-semibold p-4 bg-[#5FACEB] mb-6 text-center">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium">Skills</label>
          <input
            type="text"
            onKeyDown={handleSkillAdd}
            placeholder="Type and press Enter"
            className="w-full p-2 border rounded-md"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillDelete(skill)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            {...register("experience")}
            className="w-full p-2 border rounded-md"
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        {/* Education Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Requirements
          </label>
          <input
            onKeyDown={handleEducationAdd}
            className="w-full p-2 text-base border rounded-md"
            placeholder="Press Enter to add"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {education.map((edu) => (
              <span
                key={edu}
                className="bg-blue-500 text-sm text-white px-3 py-1 rounded-full flex items-center"
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#5FACEB] text-white py-2 rounded-md"
        >
          {isLoading ? "Saving" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditApplicantProfile;
