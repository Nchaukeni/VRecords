
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  calculateLoanTotal,
  calculateRemainingBalance,
} from "../../utils/finance";

const LoanRepayment = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const { loans, setLoans, loanRepayments, setLoanRepayments, user, members } = useAuth();

  const [paymentAmount, setPaymentAmount] = useState("");

  const loan = loans.find((l) => l.id === loanId);

  // 🛑 Safety guard
  if (!loan) {
    return <div>Loan not found.</div>;
  }

  const totalLoanAmount = calculateLoanTotal(loan);
  const remainingBalance = calculateRemainingBalance(
    loan,
    loanRepayments
  );
  /////////////////////////////////////////////////////////////////////////////////////////
  //              This is the 3rd version of handleSubmit that includes auto loan closure 
  //              and better state management
  /////////////////////////////////////////////////////////////////////////////////////////
  const handleSubmit = (e) => {
  e.preventDefault();

  const paymentValue = Number(paymentAmount);

  if (!paymentValue || paymentValue <= 0) {
    alert("Enter a valid payment amount");
    return;
  }

  if (paymentValue > remainingBalance) {
    alert("Payment exceeds remaining balance");
    return;
  }

  const newRepayment = {
    id: `r-${Date.now()}`,
    loanId: loan.id,
    memberId: loan.memberId,
    amount: paymentValue,
    enteredBy: user?.role || "treasurer",
    status: "valid",
    date: new Date().toISOString(),
  };

  //Add repayment
  setLoanRepayments((prev) => [...prev, newRepayment]);

  //Calculate updated balance AFTER payment
  const updatedRemaining = remainingBalance - paymentValue;

  // Auto close If fully paid → close loan
  if (updatedRemaining === 0) {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loan.id
          ? { ...l, status: "closed" }
          : l
      )
    );
  }

  setPaymentAmount("");
  navigate("/treasurer");
};
//////////////////////////////////////////////////////////////////////////////////////////
//              This is the second version after refactor to include repayment transactions (audit trail)
//////////////////////////////////////////////////////////////////////////////////////////

/*
  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentValue = Number(paymentAmount);

    if (!paymentValue || paymentValue <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    if (paymentValue > remainingBalance) {
      alert("Payment exceeds remaining balance");
      return;
    }

    // ✅ Append repayment transaction (Audit record)
    setLoanRepayments((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        loanId: loan.id,
        memberId: loan.memberId,
        amount: paymentValue,
        enteredBy: user?.role || "treasurer",
        status: "valid",
        date: new Date().toISOString(),
      },
    ]);

    setPaymentAmount("");

    navigate("/treasurer/dashboard");
  };
 */

//////////////////////////////////////////////////////////////////////////////
                      //First Version Before Refactor
////////////////////////////////////////////////////////////////////////////// 
/*
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
  }; */
  // This prevents users from trying to repay a non-existent loan or a loan that has already been closed.
  if (loan.status === "closed") {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Loan Closed</h2>
      <p>This loan has already been fully repaid.</p>
    </div>
  );
}
  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>Loan Repayment</h1>

      <h3>{members.find(m => m.id === loan.memberId)?.fullName}</h3>

      <p>Principal: ${loan.principal}</p>
      <p>Total Expected: ${loan.expectedTotalPayment}</p>
      <p>Amount Paid: ${loan.amountPaid}</p>
      <p>Remaining Balance: ${remainingBalance}</p>

      <hr style={{ margin: "2rem 0" }} />

      <input
        type="number"
        placeholder="Enter repayment amount"
        value={paymentAmount}
        onChange={e => setPaymentAmount(e.target.value)}
      />

      <button onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
        Submit Payment
      </button>
    </div>
  );
};

export default LoanRepayment;
