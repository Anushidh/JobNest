import { Routes, Route } from "react-router";
import Applicant from "./routes/ApplicantRoutes";
import Employer from "./routes/EmployerRoutes";
import Admin from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/employer/*" element={<Employer />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/*" element={<Applicant />} />
    </Routes>
  );
}

export default App;
