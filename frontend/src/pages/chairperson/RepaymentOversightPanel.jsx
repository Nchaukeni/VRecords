import { useAuth } from "../../context/AuthContext";
import { updateLoanPaidAmount } from "../../utils/finance";

const RepaymentOversightPanel = () => {
  const { loanRepayments, setLoanRepayments, setLoans, loans } = useAuth();

  const handleFlagToggle = (repaymentId) => {
    const currentRepayment = loanRepayments.find(r => r.id === repaymentId);
    const newStatus = currentRepayment.status === "valid" ? "flagged" : "valid";

    setLoanRepayments((prev) =>
      prev.map((r) =>
        r.id === repaymentId
          ? { ...r, status: newStatus }
          : r
      )
    );

    if (newStatus === "valid") {
      const loan = loans.find(l => l.id === currentRepayment.loanId);
      updateLoanPaidAmount(loan.id, currentRepayment, setLoans);
    }
  };

  if (loanRepayments.length === 0) {
    return (
      <div className="container-fluid text-light">
        <h2 className="section-title-dark">Repayment Oversight</h2>
        <p className="text-secondary">No repayment records available.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid text-light">

      {/* HEADER */}
      <h2 className="section-title-dark mb-4">
        <i className="bi bi-shield-check me-2"></i>
        Repayment Oversight Panel
      </h2>

      {/* TABLE CARD */}
      <div className="card table-card-dark">
        <div className="card-body">

          <table className="table table-dark table-hover align-middle">

            <thead>
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
                <tr
                  key={repayment.id}
                  className={
                    repayment.status === "flagged"
                      ? "row-flagged"
                      : ""
                  }
                >
                  <td>{repayment.loanId}</td>
                  <td>{repayment.memberId}</td>
                  <td>K{repayment.amount}</td>
                  <td>{repayment.enteredBy}</td>
                  <td>
                    {new Date(repayment.date).toLocaleDateString("en-ZM")}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        repayment.status === "valid"
                          ? "bg-success"
                          : repayment.status === "flagged"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {repayment.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    <button
                      onClick={() => handleFlagToggle(repayment.id)}
                      className={`btn btn-sm ${
                        repayment.status === "valid"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
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
      </div>

    </div>
  );
};

export default RepaymentOversightPanel;









/*import { useAuth } from "../../context/AuthContext";
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

                            /* 
                                To Do List
                                1 . Available cash update after loan approval - must be corrected (it is currently
                                    adding money to available cash instead of deducting after loan approval)
                            //////////////////////////////////////////////////////////////////
                                //     following block is there to update the loan's         
                                //     amountPaid when chairperson toggles a repayment to valid.
                            //////////////////////////////////////////////////////////////////

                                  
                            */ /*

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

export default RepaymentOversightPanel; */