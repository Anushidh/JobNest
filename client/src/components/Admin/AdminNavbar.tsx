import { useAdminLogoutMutation } from "../../api/endpoints/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { logout } from "../../redux/slices/adminSlice";

const AdminNavbar = () => {
  const [logoutAdmin] = useAdminLogoutMutation();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.admin.admin);

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        {/* Mobile menu button would go here */}
        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">{admin?.email}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
