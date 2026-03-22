import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ members, setMembers] = useState([
  {
    vgroupId: "vg-001", // Virtual Group ID, for potential expansion to multiple groups, this will always match group ID of the chairperson
    id: "m-001",
    fullName: "Alice Moyo",
    memberNumber: "VR-001",
    email: "alice@example.com",
    password: "password123",
    joinDate: "2023-01-15",
    status: "active", // active | inactive
    role: "chairperson", // member | treasurer | chairperson
  },
  {
    vgroupId: "vg-001",
    id: "m-002",
    fullName: "Brian Ndlovu",
    memberNumber: "VR-002",
    email: "nchaukeni@example.com",
    password: "password123",
    joinDate: "2023-03-10",
    status: "active",
    role: "treasurer"
  },
  {
    vgroupId: "vg-001",
    id: "m-003",
    fullName: "Chipo Dube",
    memberNumber: "VR-003",
    email: "chipo@example.com",
    password: "password123",
    joinDate: "2024-02-01",
    status: "inactive",
    role: "member"
  },
]);

////////////////////////////////////
const [shares, setShares] = useState([
  {
    id: "s-001",
    memberId: "m-001",
    amount: 300,
    enteredBy: "treasurer",
    purchaseDate: "2023-02-01",
    cycleYear: 2026
  },
  {
    id: "s-002",
    memberId: "m-002",
    amount: 300,
    enteredBy: "treasurer",
    purchaseDate: "2023-04-12",
    cycleYear: 2026
  },
  {
    id: "s-003",
    memberId: "m-001",
    amount: 300,
    enteredBy: "treasurer",
    purchaseDate: "2024-01-20",
    cycleYear: 2026
  },
]); // Initialize shares state with mock data
//////////////////////////////////// Cycle Configuration //////////////////////////
const [cycleConfig, setCycleConfig] = useState({
  sharePrice: 0,
  cycleYear: 2026
});

  // -------------------------
  // Loans (Only approved loans live here)
  // -------------------------
  const addLoan = (loans, newLoan) => { /// This adds any approved loan
    loans.push(newLoan);
  }
  ////////// This is valid loan format //////////////////

  const [loans, setLoans] = useState([
    {
      id: "l-001",
      memberId: "m-001",
      principal: 900,
      interestRate: 0.1,
      expectedTotalPayment: 2825,
      monthlyInstallment: 458.33,
      amountPaid: 500,
      issuedDate: new Date().toISOString(),
      termMonths: 12,
      status: "approved", // pending | approved | rejected | closed
    },
  ]);

  // -------------------------
  // Loan Applications (Awaiting chair approval)
  // -------------------------
  const [loanApplications, setLoanApplications] = useState([]);

  // -------------------------
  // Loan Repayment Transactions (Audit Ledger)
  // -------------------------
  const [loanRepayments, setLoanRepayments] = useState([
    {
      id: "r-001",
      loanId: "l-001",
      memberId: "m-001",
      amount: 500,
      status: "valid", 
      flagged: false,
      enteredBy: "treasurer",// valid | flagged
      date: new Date().toISOString(),
    },
  ]);

    // -------------------------
  // Penalties (For late payments, etc.)
  // -------------------------
  const [penalties, setPenalties] = useState([ 
    {
    id: "pen-001",
    loanId: "l-001",
    memberId: "m-001",
    amount: 100,
    reason: "Late installment",
    dateApplied: "2026-03-01",
    status: "unpaid"
  },]);
  // -------------------------
  // Authentication
  // -------------------------
  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        members,
        cycleConfig,
        setCycleConfig,
        shares,
        setShares,
        login,
        logout,
        loans,
        setLoans,
        addLoan,
        setMembers,
        loanApplications,
        setLoanApplications,
        loanRepayments,
        setLoanRepayments,
        penalties,
        setPenalties,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);









/* import { createContext, useContext, useState } from "react";
import { ROLES } from "../utils/roles";
import { loans as MockLoans, members, shares, contributions } from "../mock";



const AuthContext = createContext(null); //create the context 

export function AuthProvider({ children }) { //This is the provider component that will wrap the app and provide auth state
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([
  {
    id: "l-001",
    memberId: "m-001",
    principal: 5000,
    interestRate: 0.1,
    status: "approved", // pending | approved | rejected | closed
  }
]);

 const [loanApplications, setLoanApplications] = useState([]);

 const [loanRepayments, setLoanRepayments] = useState([
  {
    id: "r-001",
    loanId: "l-001",
    memberId: "m-001",
    amount: 500,
    enteredBy: "treasurer",
    status: "valid", // valid | flagged
    date: new Date().toISOString(),
  }
]);

  const login = (role) => {
    setUser({ /// We mock a user object with an id, name, and role based on the selected role
      id: "mock-user-1",
      name: role === ROLES.CHAIRPERSON ? "Chairperson" : "Treasurer",
      role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout , loans, setLoans,  loanApplications,
    setLoanApplications,
    loanRepayments,
    setLoanRepayments }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/*
    This file defines an AuthCoontext using React's Context API to manage authentication 
    state across the application. It provides a login function that sets a mock user object
     based on the selected role (chairperson or treasurer) and a logout function that clears 
     the user state. The useAuth hook allows components to easily access the authentication 
     context. 

     login will be replaced with a backend API call in a real application, but for this 
     mock setup, it simply sets a user object with the appropriate role. The AuthProvider 
     component wraps the entire app to provide access to the auth state and functions 
     throughout the component tree.
*
*/