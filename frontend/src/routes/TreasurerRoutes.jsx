// src/routes/TreasurerRoutes.jsx

import { Routes, Route } from "react-router-dom";
import TreasurerLayout from "../components/layout/TreasurerLayout";
import Dashboard from "../pages/treasurer/Dashboard";
import LoanApplicationForm from "../pages/treasurer/LoanApplicationForm";
import LoanPortfolio from "../pages/treasurer/LoanPortfolio";
import LoanRepaymentForm from "../pages/treasurer/LoanRepayment";

const TreasurerRoutes = () => {
  return (
    <Routes>
      <Route element={<TreasurerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="apply-loan" element={<LoanApplicationForm />} />
        <Route path="loan-portfolio" element={<LoanPortfolio />} />
        {/*<Route path="loans/:loanId" element={<LoanRepaymentForm />} /> */}
      </Route>
    </Routes>
  );
};

export default TreasurerRoutes;




/*
import Dashboard from "../pages/treasurer/Dashboard";
import { Routes, Route } from "react-router-dom";
import LoanRepayment from "../pages/treasurer/LoanRepayment";
import LoanApplicationForm from "../pages/treasurer/LoanApplicationForm";

const TreasurerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="loans/:loanId" element={<LoanRepayment />} />
      <Route path="*" element={<Dashboard />} />
      <Route path="apply-loan" element={<LoanApplicationForm />} />
  </Routes>
  );
}

export default TreasurerRoutes; */