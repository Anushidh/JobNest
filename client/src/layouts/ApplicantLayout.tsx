import { Outlet } from "react-router";
import Navbar from "../components/Applicant/Navbar";
// import Footer from "../components/user/Footer";

const ApplicantLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ApplicantLayout;
