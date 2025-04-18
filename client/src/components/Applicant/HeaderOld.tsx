import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              JobSeek
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 cursor-pointer hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Jobs
            </Link>
            <Link
              to="/signup"
              className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/jobs"
            className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Jobs
          </Link>
          <Link
            to="/signup"
            className="text-white bg-indigo-600 hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-indigo-600 border border-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium mt-1"
            onClick={toggleMenu}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
