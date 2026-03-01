import { createContext, useContext, useState } from "react";
import { members, shares } from "../mock";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
      principal: 5000,
      interestRate: 0.1,
      expectedTotalPayment: 5500,
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
  // Authentication
  // -------------------------
  const login = (role) => {
    setUser({ role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        members,
        shares,
        login,
        logout,
        loans,
        setLoans,
        addLoan,
        loanApplications,
        setLoanApplications,
        loanRepayments,
        setLoanRepayments,
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