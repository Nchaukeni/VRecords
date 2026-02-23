import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 

const RepaymentOversightPanel = () => {
  const { loanRepayments, setLoanRepayments } = useAuth();

  const handleFlagToggle = (repaymentId) => {
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
  };

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
              <td>{repayment.amount}</td>
              <td>{repayment.enteredBy}</td>
              <td>
                {new Date(repayment.date).toLocaleDateString()}
              </td>
              <td
                style={{
                  color:
                    repayment.status === "flagged"
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