import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calculateAvailableCash } from "../../utils/finance";

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const { setLoanApplications, user, members, loans, shares, loanRepayments, penalties } = useAuth();

  const [memberId, setMemberId] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(requestedAmount);
    const rate = Number(interestRate);
    const months = Number(termMonths);
    const availableCash = calculateAvailableCash(loanRepayments, loans, shares, penalties);

    if (amount > availableCash) {
      alert(`Requested amount exceeds available cash (K${availableCash}).`);
      return;
    }
    if (!memberId || !amount || !rate || !months) {
      alert("All fields are required.");
      return;
    }

    if (amount <= 0 || rate < 0 || months <= 0) {
      alert("Enter valid loan amount, interest rate, and term.");
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
        termMonths: months,
        requestedBy: user?.role || "treasurer",
        status: "pending",
        date: new Date().toISOString(),
      },
    ]);

    alert("Loan application submitted for approval.");

    navigate("/treasurer");
  };

  return (
        <div className="dashboard-container">
            <div className="card shadow-sm" style={{ maxWidth: "600px" }}>
              <div className="card-body">
                <h4 className="mb-4">Loan Application</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Select Member:</label>
                      <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                          <option value="">-- Select Member --</option>
                            {members.map((member) => (
                          <option key={member.id} value={member.id} className="form-control">{member.fullName} ({member.id})</option>
                            ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Loan Amount:</label>
                      <input
                        placeholder="Enter Requested Amount"
                        className="form-control"
                        type="number"
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}/>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Interest Rate (e.g. 0.1 for 10%):</label>
                      <input
                        placeholder="Enter Interest Rate"
                        className="form-control"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}/>
                    </div> 
                    <div className="mb-3">
                      <label className="form-label">Loan Term (Months):</label>
                        <input
                          placeholder="Enter Loan Term in Months"
                          className="form-control"
                          type="number"
                          step="1"
                          value={termMonths}
                          onChange={(e) => setTermMonths(e.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Application
                    </button>
                  </form>
              </div>
            </div>
        </div>

  );
};

export default LoanApplicationForm;
