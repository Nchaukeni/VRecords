export const calculateLoanTotal = (loan) => {
  return loan.principal + loan.principal * loan.interestRate;
};

export const calculateTotalValidRepayments = (loanId, repayments) => {
  return repayments
    .filter(r => r.loanId === loanId && r.status === "valid")
    .reduce((sum, r) => sum + r.amount, 0);
};

export const calculateRemainingBalance = (loan, repayments) => {
  const total = calculateLoanTotal(loan);
  const paid = calculateTotalValidRepayments(loan.id, repayments);
  return total - paid;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//      Below are some additional utility functions for financial calculations and Daashboard metrics
///////////////////////////////////////////////////////////////////////////////////////////////////////


//// Calculates the total outstanding exposure across all approved loans
export const calculateTotalOutstandingExposure = (loans, repayments) => {
  return loans
    .filter((loan) => loan.status === "approved")
    .reduce((sum, loan) => {
      const remaining = calculateRemainingBalance(loan, repayments);
      return sum + (remaining > 0 ? remaining : 0);
    }, 0);
};

////      Calculates the total number of closed loans
export const countClosedLoans = (loans) => {
  return loans.filter((loan) => loan.status === "closed").length;
};

////      Calculates number of pending loan applications
export const countPendingApplications = (applications) => {
  return applications.filter((app) => app.status === "pending").length;
};

////.      Calculates the number of flagged repayments for oversight metrics
export const countFlaggedRepayments = (repayments) => {
  return repayments.filter((r) => r.status === "flagged").length;
};

///       Calculates the total amount from valid repayments
export const calculateTotalValidRepaymentsAll = (repayments) => {
  return repayments
    .filter((r) => r.status === "valid")
    .reduce((sum, r) => sum + r.amount, 0);
};