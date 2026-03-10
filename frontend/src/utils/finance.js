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
  const total = loan.expectedTotalPayment;
  const paid = calculateTotalValidRepayments(loan.id, repayments);
  return total - paid;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//      Below are some additional utility functions for financial calculations and Daashboard metrics
///////////////////////////////////////////////////////////////////////////////////////////////////////


//// Calculates the total outstanding exposure across all approved loans
export const calculateTotalOutstandingExposure = (loans, repayments, penalties) => {
    const loansTotalBalance = loans.filter((loan) => loan.status === "approved").reduce((sum, loan) => {
      const remaining = calculateRemainingBalance(loan, repayments);
      return sum + (remaining > 0 ? remaining : 0);
    }, 0);
    const unPaidPenaltiesTotal = penalties.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0);
    const totalExposure = loansTotalBalance + unPaidPenaltiesTotal;
    return totalExposure;
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
/////////////////////////Total Group Savings and Interest ///////////////////////

export const calculateTotalGroupSavingsAndInterest = (loans, shares, penalties ) => {
  const totalShares = shares.reduce((sum, s) => sum + s.amount, 0);

  const totalInterest = loans.reduce(
    (sum, loan) => sum + (loan.expectedTotalPayment - loan.principal),
    0
  );

  const totalPenalties = penalties.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return totalShares + totalInterest + totalPenalties;
};


/*
//// Calculates the total group savings and interest for dashboard display
export const calculateTotalGroupSavingsAndInterest = (loans, shares) => {
  const totalShareCapital = shares.reduce((sum, share) => sum + share.amount, 0);
  return loans.reduce((sum, loan) => sum + loan.expectedTotalPayment, 0) + totalShareCapital;
};

*/

//// Calculates the available cash in the group by considering share capital and outstanding loan exposure

export const calculateAvailableCash = (repayments, loans, shares, penalties) => {
  const availableCash = calculateTotalGroupSavingsAndInterest(loans, shares, penalties) - calculateTotalOutstandingExposure(loans, repayments, penalties);
  return availableCash > 0 ? availableCash : 0;
}

/////////////////////////////////////////////////////////////////////
//    Risk Classification and overdue detection                   //
////////////////////////////////////////////////////////////////////

export const isLoanOverdue = (loan, balance) => {
  if (!loan || balance <= 0) return false;

  const issuedDate = new Date(loan.issuedDate);

  const endDate = new Date(issuedDate);
  endDate.setMonth(
    endDate.getMonth() + loan.termMonths
  );

  const today = new Date();

  return today > endDate;
};



export const classifyLoanRisk = ({ loan, balance, flaggedExists, penalties }) => {
  const penaltyExists = penalties.filter(p => p.loanId === loan.id ).length > 0;
  if (balance <= 0) return "CLOSED";

  if (isLoanOverdue(loan, balance)|| penaltyExists) {
    return "HIGH";
  }

  if (flaggedExists) {
    return "MEDIUM";
  }

  return "LOW";
};


/////////////////////////////////////////////////////////////////////
//      Calculates penalty interest for overdue loans
/////////////////////////////////////////////////////////////////////

export const calculateOverduePenalty = (loan, balance) => {
  if (!loan || balance <= 0) return 0;

  const issuedDate = new Date(loan.issuedDate);

  const endDate = new Date(issuedDate);
  endDate.setMonth(endDate.getMonth() + loan.termMonths);

  const today = new Date();

  if (today <= endDate) return 0;

  // calculate months overdue
  const monthsOverdue =
    (today.getFullYear() - endDate.getFullYear()) * 12 +
    (today.getMonth() - endDate.getMonth());

  const PENALTY_RATE = 0.03; // 3% monthly penalty

  return balance * PENALTY_RATE * monthsOverdue;
};

/////////////////////////////////////////////////////////////////////
//      Calculates final balance including overdue penalties
/////////////////////////////////////////////////////////////////////

export const calculateLoanBalanceWithPenalty = (loan, repayments) => {
  const baseBalance = calculateRemainingBalance(loan, repayments);

  const penalty = calculateOverduePenalty(loan, baseBalance);

  return baseBalance + penalty;
};

/////////////////////////////////////////////////////////////////
//   Create a panalties object for dashboard metrics
/////////////////////////////////////////////////////////////////
