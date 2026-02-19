import Dashboard from "../pages/treasurer/Dashboard";
import { Routes, Route } from "react-router-dom";
import LoanRepayment from "../pages/treasurer/LoanRepayment";

const TreasurerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="loans/:loanId" element={<LoanRepayment />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default TreasurerRoutes;