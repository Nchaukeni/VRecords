import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/chairperson/Dashboard";
import MemberProfile from "../pages/chairperson/MemberProfile";

const ChairRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="members/:memberId" element={<MemberProfile />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default ChairRoutes;
