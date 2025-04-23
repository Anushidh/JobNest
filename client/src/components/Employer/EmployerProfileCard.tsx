import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Mail,
  MapPin,
  Users,
  Calendar,
  Globe,
  Linkedin,
  Pencil,
  Upload,
} from "lucide-react";

import { RootState } from "../../app/store";
import Modal from "./Modal";
import { useUploadLogoMutation } from "../../api/endpoints/employerApi";


const EmployerProfileCard = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const employer = useSelector((state: RootState) => state.employer.employer);
  const [logoUrl, setLogoUrl] = useState(employer?.companyLogo || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLogo] = useUploadLogoMutation();
  // console.log(employer)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const companyName = employer?.companyName || "Not available";
  const industry = employer?.industry || "Not available";
  const companyTagline = employer?.companyTagline || "Not available";
  const updatedAt = employer?.updatedAt || "Not available";
  const email = employer?.email || "Not available";
  const headquarters = employer?.headquarters || "Not available";
  const companySize = employer?.companySize || "Not available";
  const foundedYear = employer?.foundedYear || "Not available";
  const website = employer?.website || "Not available";
  const linkedin = employer?.linkedin || "Not available";
  const description = employer?.description || "Not available";
  const companyCulture = employer?.companyCulture || "Not available";
  const missionStatement = employer?.missionStatement || "Not available";

  const formData = {
    companyName,
    industry,
    email,
    headquarters,
    companySize,
    foundedYear: foundedYear.toString(),
    website,
    linkedin,
    description,
    companyTagline,
    missionStatement,
    companyCulture,
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    const response = await uploadLogo(formData).unwrap();
    const updatedLogo = response?.user?.companyLogo;
    if (updatedLogo) {
      setLogoUrl(updatedLogo);
    }
  };
  return (
    <div className="bg-white h-full rounded-lg shadow p-4 mb-4 text-sm text-gray-800">
      {/* Top Section: Logo + Name + Info */}
      <div className="flex justify-between items-center mb-3">
        {/* Logo with upload */}
        <div className="relative flex-shrink-0 group mr-4">
          <img
            src={logoUrl || "https://via.placeholder.com/150"}
            alt="Company Logo"
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

        {/* Name & Title */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{companyName}</h3>
            <Pencil
              size={16}
              className="cursor-pointer"
              style={{ color: "rgb(88,81,211)" }}
              onClick={openModal}
            />
          </div>
          <p className="text-gray-600">{industry}</p>

          {/* Company Tagline */}
          <p className="text-indigo-700 italic text-xs mt-1">
            "{companyTagline}"
          </p>
        </div>

        {/* Updated Date */}
        <div className="text-gray-500 text-xs whitespace-nowrap">
          Updated on {updatedAt.toString().slice(0, 10)}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />

      {/* Details Section */}
      <div className="space-y-3 text-gray-700">
        {/* Row: Email + Headquarters */}
        <div className="flex justify-between gap-4">
          <p className="w-1/2 flex items-center gap-2">
            <Mail size={16} style={{ color: "rgb(88,81,211)" }} />
            <span>{email}</span>
          </p>
          <p className="w-1/2 flex items-center gap-2">
            <MapPin size={16} style={{ color: "rgb(88,81,211)" }} />
            <span>{headquarters}</span>
          </p>
        </div>

        {/* Row: Company Size + Founded */}
        <div className="flex justify-between gap-4">
          <p className="w-1/2 flex items-center gap-2">
            <Users size={16} style={{ color: "rgb(88,81,211)" }} />
            <span>{companySize} employees</span>
          </p>
          <p className="w-1/2 flex items-center gap-2">
            <Calendar size={16} style={{ color: "rgb(88,81,211)" }} />
            <span>Founded: {foundedYear}</span>
          </p>
        </div>

        {/* Row: Website + LinkedIn */}
        <div className="flex justify-between gap-4">
          <p className="w-1/2 flex items-center gap-2">
            <Globe size={16} style={{ color: "rgb(88,81,211)" }} />
            <a
              href="https://acmecorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-indigo-600 hover:underline ${
                website === "Not available" ? "cursor-not-allowed" : ""
              }`}
            >
              {website}
            </a>
          </p>
          <p className="w-1/2 flex items-center gap-2">
            <Linkedin size={16} style={{ color: "rgb(88,81,211)" }} />
            <a
              href="https://www.linkedin.com/company/acme-corp"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-indigo-600 hover:underline ${
                linkedin === "Not available" ? "cursor-not-allowed" : ""
              }`}
            >
              {linkedin}
            </a>
          </p>
        </div>

        {/* Description */}
        <div className="pt-1 text-gray-600">
          <p>{description}.</p>
        </div>

        {/* Mission Statement */}
        <div className="pt-2">
          <h4 className="font-semibold text-sm mb-1">Mission Statement</h4>
          <p className="text-gray-600">{missionStatement}.</p>
        </div>

        {/* Company Culture */}
        <div className="pt-2">
          <h4 className="font-semibold text-sm mb-1">Company Culture</h4>
          <p className="text-gray-600">{companyCulture}.</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-300" />
      {/* Modal for editing */}
      <Modal isOpen={isModalOpen} onClose={closeModal} initialData={formData}>
        <h2>Edit Profile</h2>
        <form>
          {/* Your form fields here */}
          <button type="button" onClick={closeModal}>
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EmployerProfileCard;
