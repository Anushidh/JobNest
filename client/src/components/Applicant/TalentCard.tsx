import { Briefcase, GraduationCap, Upload } from "lucide-react";
import { Link } from "react-router";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const TalentCard: React.FC = () => {
  // Get applicant data from Redux
  const applicant = useSelector(
    (state: RootState) => state.applicant.applicant
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(applicant);
  if (!applicant) return null;

  const { name, profilePicture, resume, experience, education, skills } =
    applicant;

  const experienceLabels: Record<string, string> = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead Level",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      // Assuming you have an uploadProfilePicture function
      // const response = await uploadProfilePicture(formData).unwrap();
      // const updatedLogo = response?.user?.companyLogo;
      // if (updatedLogo) {
      //   setLogoUrl(updatedLogo);
      // }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded border border-dashed border-gray-300 text-sm text-gray-700 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Talent Card</h2>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 border-2 text-[13px] font-semibold rounded-full border-[rgb(88,81,211)] text-[rgb(88,81,211)] bg-white">
            Update Resume
          </button>
          <Link
            to="/profile"
            className="px-3 py-1 border-2 text-[13px] font-semibold rounded-full border-[rgb(88,81,211)] text-[rgb(88,81,211)] bg-white flex items-center justify-center"
          >
            Edit Talent Card
          </Link>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0 group mr-4">
          <img
            src={profilePicture || "https://via.placeholder.com/150"}
            alt="Profile Picture"
            className="w-20 h-20 object-contain rounded"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload
            size={36}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
            style={{ color: "rgb(88,81,211)" }}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
        <div>
          <div className="font-medium">{name}</div>
          {resume && (
            <a
              href={resume}
              className="text-[rgb(88,81,211)] text-sm font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          )}
        </div>
      </div>

      {/* Experience */}
      <div className="flex items-center text-sm gap-2">
        <Briefcase className="w-4 h-4 text-gray-500" />
        <span>
          <span className="font-semibold">Experience:</span>{" "}
          {experienceLabels[experience]}
        </span>
      </div>

      {/* Education */}
      {education && education.length > 0 && (
        <div className="flex items-center text-sm gap-2">
          <GraduationCap className="w-4 h-4 text-gray-500" />
          <span>
            <span className="font-semibold">Alma Mater:</span>{" "}
            {education.join(", ")}
          </span>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="pt-2">
          <span className="font-semibold text-sm">Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1 text-xs">
            {skills.map((skill: string, index: number) => (
              <span
                key={skill}
                className={`px-2 py-1 rounded-full ${
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
      )}
    </div>
  );
};

export default TalentCard;
