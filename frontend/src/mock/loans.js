// frontend/src/mocks/loans.js

export const loans = [
  {
    id: "l-001",
    memberId: "m-002",
    principal: 2000,
    interestRate: 0.1, // 10%
    issuedDate: "2023-06-01",
    termMonths: 12,
    status: "active", // active | closed | defaulted
    expectedTotalPayment: 2200,  // Calculation here must be revisited later to account for compounding interest if needed.
    monthlyInstallment: 183.33  // Calculated as expectedTotalPayment / termMonths
  },
  {
    id: "l-002",
    memberId: "m-001",
    principal: 1500,
    interestRate: 0.08,
    issuedDate: "2024-03-01",
    termMonths: 10,
    status: "active",
    expectedTotalPayment: 1620,  // Calculated as principal + (principal * interestRate)
    monthlyInstallment: 162  // Calculated as expectedTotalPayment / termMonths
  },
];
