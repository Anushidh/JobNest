import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBullseye,
  FaCalendarAlt,
  FaGlobe,
  FaHeart,
  FaIndustry,
  FaLinkedin,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaRegMoneyBillAlt,
  FaUsers,
} from "react-icons/fa";
import { BsBriefcase } from "react-icons/bs";
import { toast } from "react-toastify";

import {
  useApplyForJobMutation,
  useGetJobForApplicantQuery,
  useToggleSaveJobForApplicantMutation,
} from "../../api/endpoints/jobApi";
import { RootState } from "../../app/store";
import { updateApplicant } from "../../redux/slices/applicantSlice";

const JobDetail = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams<{ jobId: string }>();
  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useGetJobForApplicantQuery(jobId || "");
  console.log(job);
  const applicant =
    useSelector((state: RootState) => state.applicant?.applicant) || null;
  const applicantId = applicant?._id || "";
  const [applyForJob] = useApplyForJobMutation();
  const [toggleSaveJobForApplicant, { isLoading: isSaving }] =
    useToggleSaveJobForApplicantMutation();

  const handleApply = async () => {
    const { applicant } = await applyForJob({ jobId: jobId }).unwrap();
    dispatch(updateApplicant(applicant));
    refetch();
    toast.success("Job application submitted!");
  };
  const handleSave = async () => {
    const updatedApplicant = await toggleSaveJobForApplicant(jobId!).unwrap();
    dispatch(updateApplicant(updatedApplicant));
    toast.success("Job save status updated!");
    refetch();
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading job details...</div>;
  if (isError || !job)
    return (
      <div className="text-center mt-10 text-red-500">
        Job not found or an error occurred.
      </div>
    );

  const hasApplied = job?.applications?.includes(applicantId);
  const hasSaved = applicant?.savedJobs?.includes(jobId);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {/* Blue Header Section */}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Main Job Info Section */}
          <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-md p-6">
            {/* Top Part: Job Info */}
            {/* Top Part: Job Info with Buttons on Right */}
            <div className="flex justify-between items-center gap-6 flex-wrap">
              <div className="flex items-start gap-4 flex-1">
                {job.employer.companyLogo && (
                  <img
                    src={job.employer.companyLogo}
                    alt="Company Logo"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {job.companyName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-2 flex-wrap">
                    <BsBriefcase /> {job.experienceLevel}
                    <span className="mx-2">|</span>
                    <FaRegMoneyBillAlt />
                    {job.salary
                      ? `₹${job.salary.min} - ₹${job.salary.max}`
                      : "Salary not disclosed"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> {job.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-4 lg:mt-0">
                <button
                  className={`px-6 py-3 rounded-full font-semibold text-[14px] text-[rgb(88,81,211)] border-2 border-[rgb(88,81,211)] ${
                    isSaving
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[rgb(88,81,211)] hover:text-white transition duration-200"
                  }`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {hasSaved ? "Saved" : "Save this job"}
                </button>

                <button
                  className={`px-6 py-3 rounded-full font-semibold text-white text-[14px] ${
                    hasApplied
                      ? "bg-[rgb(88,81,211)] cursor-not-allowed opacity-50"
                      : "bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] transition-colors duration-200"
                  }`}
                  onClick={handleApply}
                  disabled={hasApplied}
                >
                  Apply to this job
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            {/* Bottom Part: Posted On + Applicants / Save & Apply */}
            {/* <div className="flex justify-between items-center flex-wrap gap-4">      
              <div className="text-sm text-gray-600">
                <p>
                  Posted on:{" "}
                  <span className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  <span className="font-medium">
                    {job.applications?.length || 0}
                  </span>{" "}
                  applicants
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Status: </span>
                <span className="font-semibold text-gray-700">
                  {job.status}
                </span>
              </div>
              {job.deadline && (
                <div>
                  <span className="font-medium">Deadline: </span>
                  <span className="font-semibold text-gray-700">
                    {new Date(job.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div> */}
            {/* Divider */}
            {/* <hr className="my-6 border-gray-200" /> */}

            {/* New Section: Job Description, Education Requirements, Skills, Status, and Deadline */}
            <div className="space-y-6">
              {/* Company Mission */}
              {job.employer.missionStatement && (
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Company Mission
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.employer.missionStatement}
                  </p>
                </div>
              )}

              {/* Company Culture */}
              {job.employer.companyCulture && (
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Company Culture
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.employer.companyCulture}
                  </p>
                </div>
              )}
              {/* Job Description */}
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Job Description
                </h2>
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Responsibilities
                  </h2>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Education Requirements */}
              {job.educationRequirements && (
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Education Requirements
                  </h2>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {job.educationRequirements.map((education, index) => (
                      <li key={index}>{education}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              <div className="pt-2">
                <span className="font-semibold text-base">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={skill}
                      className={`px-3 py-2 rounded-md ${
                        index % 2 === 0
                          ? "bg-[rgb(88,81,211)] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Related Jobs Placeholder */}
          <div className="w-full lg:w-[30%] bg-white rounded-xl shadow-md p-6 min-h-[200px] space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              About the Company
            </h2>
            <div className="grid grid-cols-1 gap-y-4 text-sm text-gray-700">
              {job.employer.website && (
                <div className="flex items-start gap-2">
                  <FaGlobe className="mt-1" />
                  <a
                    href={job.employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800 break-all"
                  >
                    {job.employer.website}
                  </a>
                </div>
              )}
              {job.employer.industry && (
                <div className="flex items-start gap-2">
                  <FaIndustry className="mt-1" />
                  <span>{job.employer.industry}</span>
                </div>
              )}
              {job.employer.companySize && (
                <div className="flex items-start gap-2">
                  <FaUsers className="mt-1" />
                  <span>{job.employer.companySize}</span>
                </div>
              )}
              {job.employer.headquarters && (
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1" />
                  <span>{job.employer.headquarters}</span>
                </div>
              )}
              {job.employer.foundedYear && (
                <div className="flex items-start gap-2">
                  <FaCalendarAlt className="mt-1" />
                  <span>{job.employer.foundedYear}</span>
                </div>
              )}
              {job.employer.linkedin && (
                <div className="flex items-start gap-2">
                  <FaLinkedin className="mt-1" />
                  <a
                    href={job.employer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800 break-all"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {job.employer.companyTagline && (
                <div className="flex items-start gap-2 italic text-gray-500">
                  <FaQuoteLeft className="mt-1" />
                  <span>{job.employer.companyTagline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
