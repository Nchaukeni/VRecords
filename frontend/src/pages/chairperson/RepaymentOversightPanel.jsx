import { useAuth } from "../../context/AuthContext";
import { updateLoanPaidAmount } from "../../utils/finance";
import "bootstrap/dist/css/bootstrap.min.css"; 

const RepaymentOversightPanel = () => {
  const { loanRepayments, setLoanRepayments, setLoans, loans } = useAuth();

  const handleFlagToggle = (repaymentId) => {
    // First, we find the current repayment to know its current status
    const currentRepayment = loanRepayments.find(r => r.id === repaymentId);
    const newStatus = currentRepayment.status === "valid" ? "flagged" : "valid";
  
    // Update the repayments state
    setLoanRepayments((prev) =>
      prev.map((r) =>
        r.id === repaymentId
          ? { ...r, status: newStatus }
          : r
    )
    );
  
    // new repayment status is used to update loan paid amount
    if (newStatus === "valid") {
      const loan = loans.find(l => l.id === currentRepayment.loanId);
      updateLoanPaidAmount(loan.id, currentRepayment, setLoans);
    }
  };

 /* const handleFlagToggle = (repaymentId) => {
    setLoanRepayments((prev) =>
      prev.map((r) =>
        r.id === repaymentId
          ? {
              ...r,
              status: r.status === "valid" ? "flagged" : "valid",
            }
          : r
      )
    );
//////////////////////////////////////////////////////////////////
    //     following block is there to update the loan's         
    //     amountPaid when chairperson toggles a repayment to valid.
///////////////////////////////////////////////////////////////
    const toggledRepayment = loanRepayments.find(r => r.id === repaymentId);
    console.log(toggledRepayment.status);
    if (toggledRepayment.status === "valid") {
      const loan = loans.find(l => l.id === toggledRepayment.loanId);
      updateLoanPaidAmount(loan.id, toggledRepayment, setLoans);
    }

  };
 */

  if (loanRepayments.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Repayment Oversight</h2>
        <p>No repayment records available.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Repayment Oversight Panel</h2>

      <table border="1" cellPadding="8" className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Loan ID</th>
            <th>Member ID</th>
            <th>Amount</th>
            <th>Entered By</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loanRepayments.map((repayment) => (
            <tr key={repayment.id}>
              <td>{repayment.loanId}</td>
              <td>{repayment.memberId}</td>
              <td>K{repayment.amount}</td>
              <td>{repayment.enteredBy}</td>
              <td>
                {new Date(repayment.date).toLocaleDateString()}
              </td>
              <td
                style={{
                  color:
                    repayment.status === "pending"
                      ? "red"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {repayment.status}
              </td>
              <td>
                <button
                  onClick={() => handleFlagToggle(repayment.id)}
                >
                  {repayment.status === "valid"
                    ? "Flag"
                    : "Unflag"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepaymentOversightPanel;