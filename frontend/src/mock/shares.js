// frontend/src/mocks/shares.js
const fixedValue = 300; /* Cost of a share will be set by the treasurer through 
                        his/her dashboard. Number of total group shares will be
                        changing as members buy more shares, but the cost of each 
                        share will remain fixed. 
                        */

export const shares = [
  {
    id: "s-001",
    memberId: "m-001",
    amount: fixedValue,
    purchaseDate: "2023-02-01",
  },
  {
    id: "s-002",
    memberId: "m-002",
    amount: fixedValue,
    purchaseDate: "2023-04-12",
  },
  {
    id: "s-003",
    memberId: "m-001",
    amount: fixedValue,
    purchaseDate: "2024-01-20",
  },
];
