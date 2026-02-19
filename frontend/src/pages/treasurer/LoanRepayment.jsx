import { useParams, useLocation, useNavigate } from "react-router-dom";
import { members } from "../../mock";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoanRepayment = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const { loans, setLoans } = useAuth();

  const loan = loans.find(l => l.id === loanId);

  const member = members.find(m => m.id === loan.memberId);

  const [payment, setPayment] = useState("");

  const remainingBalance =
    loan.expectedTotalPayment - loan.amountPaid;

  const handleSubmit = () => {
    const paymentValue = parseFloat(payment);

    if (!paymentValue || paymentValue <= 0) return;

    setLoans(prevLoans =>
      prevLoans.map(l =>
        l.id === loanId
          ? {
              ...l,
              amountPaid: l.amountPaid + paymentValue,
              status:
                l.amountPaid + paymentValue >= l.expectedTotalPayment
                  ? "closed"
                  : "active",
            }
          : l
      )
    );
    console.log(`Processed payment of $${paymentValue} for loan ${loanId}`);
    navigate("/treasurer/dashboard");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>Loan Repayment</h1>

      <h3>{member?.fullName}</h3>

      <p>Principal: ${loan.principal}</p>
      <p>Total Expected: ${loan.expectedTotalPayment}</p>
      <p>Amount Paid: ${loan.amountPaid}</p>
      <p>Remaining Balance: ${remainingBalance}</p>

      <hr style={{ margin: "2rem 0" }} />

      <input
        type="number"
        placeholder="Enter repayment amount"
        value={payment}
        onChange={e => setPayment(e.target.value)}
      />

      <button onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
        Submit Payment
      </button>
    </div>
  );
};

export default LoanRepayment;
