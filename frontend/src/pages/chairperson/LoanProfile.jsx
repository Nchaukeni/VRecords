import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoanProfile = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { members, loans, loanRepayments } = useAuth();

  const loan = loans.find(l => l.id === loanId);

  if (!loan) {
    return <div>Loan not found.</div>;
  }

  const member = members.find(m => m.id === loan.memberId);

  const repayments = loanRepayments
  .filter(r => r.loanId === loanId)
  .sort((a, b) => new Date(a.date) - new Date(b.date));

  const validTotal = repayments
    .filter(r => r.status === "valid")
    .reduce((sum, r) => sum + r.amount, 0);

  const flaggedExists = repayments.some(r => r.flagged);

  const balance =
    loan.expectedTotalPayment - validTotal;

    let runningBalance = loan.expectedTotalPayment;

const repaymentsWithBalance = repayments.map(rep => {
  if (rep.status === "valid") {
    runningBalance -= rep.amount;
  }

  return {
    ...rep,
    balanceAfter: runningBalance
  };
});

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1 style={{ marginTop: "1rem" }}>
        Loan Profile
      </h1>

      <h3>
        Member: {member?.fullName}
      </h3>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>Loan Summary</h2>
      <div style={{ display: "flex" , flexDirection: "row", gap: "4rem" }}>
      <div>
        <p>Principal: K{loan.principal}</p>
        <p>Monthly Interest Rate: {loan.interestRate * 100}%</p>
      </div>
      <div>
        <p>Expected Total: K{loan.expectedTotalPayment}</p>
        <p>Total Paid (Valid): K{validTotal}</p>
      </div>
      <div>
        <p>
        Outstanding Balance:{" "}
        <strong>K{balance}</strong>
      </p></div>
      <div>
        <p>Status: {loan.status}</p>
      </div>
      
      </div>
      

      {flaggedExists && (
        <p style={{ color: "red" }}>
          ⚠ This loan has flagged repayments.
        </p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Repayment History</h2>

      {repayments.length === 0 ? (
        <p>No repayments recorded.</p>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
          className = "table"
        >
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Loan Balance</th>
              <th>Amount Paid</th>
              <th>Payment Entered By</th>
              <th>Interest Acrued</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {repaymentsWithBalance.map(rep => (
              <tr
                key={rep.id}
                style={{
                  backgroundColor:
                    rep.flagged ? "#ffe5e5" : "white"
                }}
              >
                <td>
                  {new Date(rep.date).toLocaleDateString()}
                </td>
                <td>K{rep.balanceAfter}</td>
                <td>K{rep.amount}</td>
                <td>{rep.enteredBy}</td>
                <td>To be added</td> {/* Compounded Interest calculation not implemented yet */}
                <td>{rep.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanProfile;