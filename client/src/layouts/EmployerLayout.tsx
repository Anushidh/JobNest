import { Outlet } from "react-router";
import EmployerHeader from "../components/Employer/EmployerHeader";

const EmployerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <EmployerHeader />
      <div className="flex flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
