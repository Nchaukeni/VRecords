

// src/routes/ChairRoutes.jsx

import { Routes, Route } from "react-router-dom";
import ChairLayout from "../components/layout/ChairLayout";
import Dashboard from "../pages/chairperson/Dashboard";
import LoanApprovalPanel from "../pages/chairperson/LoanApprovalPanel";
import RepaymentOversightPanel from "../pages/chairperson/RepaymentOversightPanel";
import MemberProfile from "../pages/chairperson/MemberProfile";

const ChairRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChairLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="loan-approvals" element={<LoanApprovalPanel />} />
        <Route path="repayments" element={<RepaymentOversightPanel />} />
        <Route path="members/:memberId" element={<MemberProfile />} />
      </Route>
    </Routes>
  );
};

export default ChairRoutes;

/*import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/chairperson/Dashboard";
import MemberProfile from "../pages/chairperson/MemberProfile";
import LoanApprovalPanel from "../pages/chairperson/LoanApprovalPanel";
import RepaymentOversightPanel from "../pages/chairperson/RepaymentOversightPanel";

const ChairRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="members/:memberId" element={<MemberProfile />} />
      <Route path="*" element={<Dashboard />} />
      <Route path="loan-approvals" element={<LoanApprovalPanel />} />
      <Route path="repayments" element={<RepaymentOversightPanel />} />
    </Routes>
  );
};

export default ChairRoutes;

*/
