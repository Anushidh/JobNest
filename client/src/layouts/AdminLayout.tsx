import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import { RootState } from "../app/store";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminNavbar from "../components/Admin/AdminNavbar";

const AdminLayout = () => {
  const location = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.accessToken
  );
  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <AdminSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Navbar */}
        <header className="bg-white shadow-sm z-10">
          <AdminNavbar />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
