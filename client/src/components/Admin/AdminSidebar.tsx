import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      path: "/admin/applicants",
      icon: <Users className="w-5 h-5" />,
      label: "Applicants",
    },
    {
      path: "/admin/employers",
      icon: <Users className="w-5 h-5" />,
      label: "Employers",
    },
    {
      path: "/admin/jobs",
      icon: <FileText className="w-5 h-5" />,
      label: "Jobs",
    },
    {
      path: "/admin/employer-plans",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Employer Plans",
    },
    {
      path: "/admin/applicant-plans",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Applicant Plans",
    },
    {
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="h-full overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {/* Logo/Brand can be added here */}
            <div className="px-4 py-4 mb-4 hidden md:block">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mx-2 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
