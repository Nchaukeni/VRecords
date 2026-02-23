
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/LoanPortfolio.css"

const LoanPortfolio = () => {
  const { members, loans, setLoanRepayments, loanRepayments } = useAuth();

  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState("");
  const [ loanBalance, setBalance ] = useState(null);

  // Get member loan
  /////////////////////////////////////////////////////
    const getLoanBalance = (loan) => {
  if (loan.status !== "approved") return 0;

  const approvedRepayments = loanRepayments
    .filter(
      (r) =>
        r.memberId === loan.memberId &&
        r.status === "valid"
    )
    .reduce((sum, r) => sum + r.amount, 0);

  return loan.expectedTotalPayment - approvedRepayments;
};

  ////////////////////////////////////////////////

  const handleRowClick = (member, balance) => {
    if (balance > 0) {
      setSelectedMember(member);
      setBalance(balance);
    }
  };

  const handleSubmitRepayment = () => {
    if (!amount || Number(amount) <= 0) return;

    const newRepayment = {
      id: Date.now(),
      memberId: selectedMember.id,
      amount: Number(amount),
      status: "pending", // IMPORTANT: chair must approve
      flagged: false,
      date: new Date().toISOString(),
      recordedBy: "treasurer",
    };

    setLoanRepayments([...loanRepayments, newRepayment]);

    setAmount("");
    setSelectedMember(null);
  };

  return (
    <div>
      <h2>Loan Portfolio</h2>

      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Loan Total</th>
            <th>Loan Balance</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan) => {
            const member = members.find(m => m.id === loan.memberId);
            const balance = getLoanBalance(loan);
            if ( !member || loan.status !== 'approved') return null;
            return (
              <tr
                key={loan.id}
                onClick={() => handleRowClick(member, balance)}
                style={{ cursor: balance > 0 ? "pointer" : "default" }}
              >
                <td>{member.fullName}</td>
                <td>{ loan.expectedTotalPayment }</td>
                <td>{balance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="repayment-modal">
            <h3>Record Repayment</h3>

            <p><strong>{selectedMember.fullName}</strong></p>
            <p>
              Current Balance:{" "}
              {loanBalance}
            </p>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleSubmitRepayment}>
                Submit
              </button>
              <button onClick={() => setSelectedMember(null)}>
                Cancel
              </button>
            </div>

            <small>
              This repayment will require Chairperson approval.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPortfolio;
/*

const LoanPortfolio = () => {
    const { members, loans } = useAuth();
    return(
    <>
        <div className="portfolio-main-content">
            <h2>Loan Portfolio</h2>
            <table className="table table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Member ID</th>
                        <th>Full Name</th>
                        <th>Loan ID</th>
                        <th>Loan Amount</th>
                        <th>Total Paid</th>
                        <th>Loan Balance</th>
                    </tr>
                </thead>
                <tbody>
                    { loans.map(loan => {
                          const member = members.find(m => m.id === loan.memberId);
                         return(  <tr>
                            <td>{loan.memberId}</td>
                            <td>{member.fullName}</td>
                            <td>{loan.id}</td>
                            <td>{loan.expectedTotalPayment}</td>
                            <td>${loan.amountPaid}</td>
                            <td>{loan.status}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            {}
        </div>
    </>)
}

export default LoanPortfolio;

*/