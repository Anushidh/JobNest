import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logout as employerLogout } from "../../redux/slices/employerSlice";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useLogoutMutation } from "../../api/endpoints/employerApi";
import { toast } from "react-toastify";

const EmployerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { employer, role, accessToken } = useSelector(
    (state: RootState) => state.employer
  );

  const isLoggedIn = !!accessToken && role === "employer";
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const employerNavLinks = [
    "Dashboard",
    "Posted Jobs",
    "Candidates",
    "Messages",
    "Plans",
  ];

  const handleLogout = async () => {
    try {
      await logout({ employerId: employer?._id }).unwrap();
      dispatch(employerLogout());
      toast.success("Logout successful!");
      navigate("/employer/signin");
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

  return (
    <nav className="bg-white shadow-md px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link
        to="/employer/dashboard"
        className="text-xl font-bold text-indigo-600"
      >
        JobNest
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-1 justify-center gap-6 text-gray-700">
        {employerNavLinks.map((link) => (
          <Link
            to={`/employer/${link.toLowerCase().replace(" ", "-")}`}
            key={link}
            className="hover:text-indigo-600"
          >
            {link}
          </Link>
        ))}
      </div>

      {/* Right Side - Always shows employer controls */}
      <div className="hidden md:flex items-center gap-4">
        <Bell className="text-gray-700 w-5 h-5 cursor-pointer" />
        <div className="relative group">
          <img
            src={employer?.companyLogo || "/default-company.png"}
            alt="company logo"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <div className="absolute right-0 mt-2 bg-white border shadow-md rounded opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-10">
            {/* <Link
              to="/employer/settings"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </Link> */}
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md z-10 md:hidden flex flex-col items-center py-4 space-y-4">
          {employerNavLinks.map((link) => (
            <Link
              to={`/employer/${link.toLowerCase().replace(" ", "-")}`}
              key={link}
              onClick={toggleMenu}
              className="text-gray-700 hover:text-indigo-600"
            >
              {link}
            </Link>
          ))}
          <Link
            to="/employer/settings"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-indigo-600"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-indigo-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default EmployerNavbar;