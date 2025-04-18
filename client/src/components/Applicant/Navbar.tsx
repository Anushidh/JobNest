import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logout as applicantLogout } from "../../redux/slices/applicantSlice";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";

import { useApplicantLogoutMutation } from "../../api/endpoints/applicantApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useApplicantLogoutMutation();
  const { applicant, role, accessToken } = useSelector(
    (state: RootState) => state.applicant
  );

  const isLoggedIn = !!accessToken && role === "applicant";
  const isGuest = !accessToken;

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    "Dashboard",
    "View Jobs",
    "Messages",
    "Plans",
  ];

  const handleLogout = async () => {
    await logout({ applicantId: applicant?._id }).unwrap();
    dispatch(applicantLogout());
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-md px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold text-indigo-600">JobNest</div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-1 justify-center gap-6 text-gray-700">
        {navLinks.map((link) => (
          <Link
            to={`/${link.toLowerCase().replace(" ", "-")}`}
            key={link}
            className="hover:text-indigo-600"
          >
            {link}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Bell className="text-gray-700 w-5 h-5 cursor-pointer" />
            <div className="relative group">
              <img
                src="/profile.jpg"
                alt="profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
              <div className="absolute right-0 mt-2 bg-white border shadow-md rounded opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-10">
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-4 py-2 rounded-full font-semibold text-white text-[13px] bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] transition-colors duration-200"
            >
              Find Jobs
            </Link>

            <Link
              to="/employer/signin"
              className="px-4 py-2 rounded-full font-semibold text-[13px] text-[rgb(88,81,211)] border-2 border-[rgb(88,81,211)] bg-transparent hover:bg-[rgb(88,81,211)] 
            hover:text-white transition duration-200"
            >
              Hire Talent
            </Link>
          </>
        )}
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
          {navLinks.map((link) => (
            <Link
              to={`/${link.toLowerCase().replace(" ", "-")}`}
              key={link}
              onClick={toggleMenu}
              className="text-gray-700 hover:text-indigo-600"
            >
              {link}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to="/settings" onClick={toggleMenu}>
                Settings
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: "rgb(88, 81, 211)" }}
              >
                Find Jobs
              </Link>
              <Link
                to="/employer/signin"
                className="px-4 py-2 rounded-md"
                style={{
                  color: "rgb(88, 81, 211)",
                  backgroundColor: "transparent",
                }}
              >
                Hire Talent
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
