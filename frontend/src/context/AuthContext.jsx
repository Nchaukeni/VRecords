import { createContext, useContext, useState } from "react";
import { ROLES } from "../utils/roles";
import { loans as MockLoans, members, shares, contributions } from "../mock";

const AuthContext = createContext(null); //create the context 

export function AuthProvider({ children }) { //This is the provider component that will wrap the app and provide auth state
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState(
    MockLoans.map(loan => ({
      ...loan,
      amountPaid: 0, // new tracking field for repayments
    }))
  );  

  const login = (role) => {
    setUser({ /// We mock a user object with an id, name, and role based on the selected role
      id: "mock-user-1",
      name: role === ROLES.CHAIRPERSON ? "Chairperson" : "Treasurer",
      role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout , loans, setLoans }}>
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
*/