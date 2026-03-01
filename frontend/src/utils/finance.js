///////////////////////////////////////////////////////////////////////
//      This file contains utility functions for financial calculations
//      and loan management logic used across the application.
///////////////////////////////////////////////////////////////////


/// first function - CalculateLoanTotal calculates the total amount to 
// be repaid for a loan, including interest.
export const calculateLoanTotal = (loan) => {
  return loan.principal + loan.principal * loan.interestRate;
};
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////
//     The second function - calculateTotalValidRepayments sums up all valid 
//      repayments for a given loan.
export const calculateTotalValidRepayments = (loanId, repayments) => {
  return repayments
    .filter(r => r.loanId === loanId && r.status === "valid")
    .reduce((sum, r) => sum + r.amount, 0);
};
//////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
//      The fourth function - updateLoanPaidAmount updates the 
//      paid amount on a loan when chairperson approves a repayment.
export const updateLoanPaidAmount = (loanId, loanRepayment, setLoans) => {
  setLoans(prev =>
    prev.map(loan =>
      loan.id === loanId ? { ...loan, amountPaid: loan.amountPaid + loanRepayment.amount } : loan))
}

/////////////////////////////////////////////////////////////////////
//      The fifth function - calculateRemainingBalance computes the 
//      remaining balance on a loan by subtracting total valid repayments
//      from the total loan amount.
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
//// Calculates the total group savings and interest for dashboard display
export const calculateTotalGroupSavingsAndInterest = (loans, shares) => {
  const totalShareCapital = shares.reduce((sum, share) => sum + share.amount, 0);
  return loans.reduce((sum, loan) => sum + loan.expectedTotalPayment, 0) + totalShareCapital;
};

//// Calculates the available cash in the group by considering share capital and outstanding loan exposure

export const calculateAvailableCash = (repayments, loans, shares) => {
  const availableCash = calculateTotalGroupSavingsAndInterest(loans, shares) - calculateTotalOutstandingExposure(loans, repayments);
  return availableCash > 0 ? availableCash : 0;
}