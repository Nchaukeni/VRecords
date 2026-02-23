import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const { setLoanApplications, user, members, loans } = useAuth();

  const [memberId, setMemberId] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(requestedAmount);
    const rate = Number(interestRate);

    if (!memberId || !amount || !rate) {
      alert("All fields are required.");
      return;
    }

    if (amount <= 0 || rate < 0) {
      alert("Enter valid loan amount and interest rate.");
      return;
    }
    // Check if member already has an active loan
    const hasActiveLoan = loans.some((loan) => loan.memberId === memberId && loan.status === "approved"); 

    if (hasActiveLoan) {
      alert("This member already has an active loan.");
      return ;
    }
   
    setLoanApplications((prev) => [
      ...prev,
      {
        id: `app-${Date.now()}`,
        memberId,
        requestedAmount: amount,
        interestRate: rate,
        requestedBy: user?.role || "treasurer",
        status: "pending",
        date: new Date().toISOString(),
      },
    ]);

    alert("Loan application submitted for approval.");

    navigate("/treasurer");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Request Loan for Member</h2>

      <form onSubmit={handleSubmit}>
       <div>
              <label>Select Member:</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                  <option value="">-- Select Member --</option>
                      {members.map((member) => (
                  <option key={member.id} value={member.id}>
                      {member.fullName} ({member.id})
                  </option>
                  ))}
              </select>
        </div>
       {/* <div>
          <label>Member ID:</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div> */} 

        <div>
          <label>Loan Amount:</label>
          <input
            type="number"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
          />
        </div>

        <div>
          <label>Interest Rate (e.g. 0.1 for 10%):</label>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>   
        <button type="submit" style={{ marginTop: "10px" }}>
          Submit Application
        </button>
      </form>
      <div>
        { /*
           const memberActiveLoan = loans.find( (loan) => loan.memberId === memberId && loan.status === "approved");
           memberActiveLoan && <div style={{ color: "orange" }}>This member currently has an active loan.</div>
        } */}
      </div>
    </div>
  );
};

export default LoanApplicationForm;
