import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useEditEmployerMutation } from "../../api/endpoints/employerApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { updateEmployer } from "../../redux/slices/employerSlice";
import { useDispatch } from "react-redux";

const notAvailableCheck = (value: string) =>
  value.trim().toLowerCase() !== "not available";

const formSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .refine(notAvailableCheck, {
      message: "Company name cannot be 'not available'",
    }),
  industry: z
    .string()
    .min(1, "Industry is required")
    .refine(notAvailableCheck, {
      message: "Industry cannot be 'not available'",
    }),
  email: z
    .string()
    .email("Invalid email address")
    .refine(notAvailableCheck, { message: "Email cannot be 'not available'" }),
  headquarters: z
    .string()
    .min(1, "headquarters is required")
    .refine(notAvailableCheck, {
      message: "headquarters cannot be 'not available'",
    }),
  companySize: z
    .string()
    .min(1, "Company size is required")
    .refine(notAvailableCheck, {
      message: "Company size cannot be 'not available'",
    }),
  foundedYear: z.string().min(1, "Year is required").refine(notAvailableCheck, {
    message: "Year cannot be 'not available'",
  }),
  website: z.string().url("Invalid website URL").refine(notAvailableCheck, {
    message: "Website cannot be 'not available'",
  }),
  linkedin: z.string().url("Invalid LinkedIn URL").refine(notAvailableCheck, {
    message: "LinkedIn cannot be 'not available'",
  }),
  description: z.string().refine(notAvailableCheck, {
    message: "Description cannot be 'not available'",
  }),
  companyTagline: z.string().refine(notAvailableCheck, {
    message: "Tagline cannot be 'not available'",
  }),
  missionStatement: z.string().refine(notAvailableCheck, {
    message: "Mission cannot be 'not available'",
  }),
  companyCulture: z.string().refine(notAvailableCheck, {
    message: "Culture cannot be 'not available'",
  }),
});

type FormData = z.infer<typeof formSchema>;
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormData;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, initialData }) => {
  const [editEmployer] = useEditEmployerMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      companyName: "",
      industry: "",
      email: "",
      headquarters: "",
      companySize: "",
      foundedYear: "",
      website: "",
      linkedin: "",
      description: "",
      companyTagline: "",
      missionStatement: "",
      companyCulture: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    console.log("Submitted Data:", data);

    try {
      const { user } = await editEmployer({ data }).unwrap();
      dispatch(updateEmployer(user));
      toast.success("Profile updated successfully!");
      onClose();
      navigate("/employer/settings"); // change to desired route
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-2/3 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Company Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">
                  Company Name
                </label>
                <input
                  {...register("companyName")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Title</label>
                <input
                  {...register("industry")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm">
                    {errors.industry.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Location</label>
                <input
                  {...register("headquarters")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.headquarters && (
                  <p className="text-red-500 text-sm">
                    {errors.headquarters.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">
                  Company Size
                </label>
                <input
                  {...register("companySize")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.companySize && (
                  <p className="text-red-500 text-sm">
                    {errors.companySize.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Founded</label>
                <input
                  {...register("foundedYear")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.foundedYear && (
                  <p className="text-red-500 text-sm">
                    {errors.foundedYear.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Website</label>
                <input
                  {...register("website")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">LinkedIn</label>
                <input
                  {...register("linkedin")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.linkedin && (
                  <p className="text-red-500 text-sm">
                    {errors.linkedin.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 5 */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Tagline</label>
                <input
                  {...register("companyTagline")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                {errors.companyTagline && (
                  <p className="text-red-500 text-sm">
                    {errors.companyTagline.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                {/* empty space for layout balance */}
              </div>
            </div>

            {/* Full width textareas */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Mission</label>
              <textarea
                {...register("missionStatement")}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows={3}
              />
              {errors.missionStatement && (
                <p className="text-red-500 text-sm">
                  {errors.missionStatement.message}
                </p>
              )}
            </div>

            {/* Full Width Textareas */}

            <div>
              <label className="block text-sm font-medium">Culture</label>
              <textarea
                {...register("companyCulture")}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows={3}
              />
              {errors.companyCulture && (
                <p className="text-red-500 text-sm">
                  {errors.companyCulture.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
