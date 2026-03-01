import { members, shares, contributions } from "../../mock";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calculateTotalGroupSavingsAndInterest, calculateAvailableCash, calculateTotalOutstandingExposure } from "../../utils/finance";
import "bootstrap/dist/css/bootstrap.min.css"; 

const TreasurerDashboard = () => {
    const navigate = useNavigate();
    const { loans,logout, loanRepayments } = useAuth(); // custorm hook to get loans from context

  // Totals
  const totalShareCapital = shares.reduce(
    (sum, share) => sum + share.amount,
    0
  );
  const totalGroupSavingsAndInterest = calculateTotalGroupSavingsAndInterest(loans, shares);

  const totalContributions = contributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );

  const totalLoanExposure = calculateTotalOutstandingExposure(loans, loanRepayments);

  const totalMonthlyExpected = loans.reduce(
    (sum, loan) => sum + loan.monthlyInstallment,
    0
  );

  const availableCash = calculateAvailableCash(loanRepayments, loans, shares);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Treasurer Dashboard</h1>

      <section style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div>
          <h3>Group Savings & Interest</h3>
          <p>K{totalGroupSavingsAndInterest}</p>
        </div>
        <div>
          <h3>Total Share Capital</h3>
          <p>K{totalShareCapital}</p>
        </div>

        <div>
          <h3>Total Contributions</h3>
          <p>K{totalContributions}</p>
        </div>
        <div>
          <h3>Available Cash</h3>
          <p>K{availableCash}</p>
        </div>
        <div>
          <h3>Total Loan Exposure</h3>
          <p>K{totalLoanExposure}</p>
        </div>

        <div>
          <h3>Monthly Expected Inflow</h3>
          <p>K{totalMonthlyExpected.toFixed(2)}</p>
        </div>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Loan Portfolio</h2>

      <table border="1" cellPadding="8" style={{ width: "100%" }} className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Member</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Total Payable</th>
            <th>Amount Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => {
            const member = members.find(m => m.id === loan.memberId);

            return (
              <tr   key={loan.id}
                    onClick={() => navigate(`/treasurer/loans/${loan.id}`)}
                    style={{ cursor: "pointer" }}>
                <td>{member?.fullName}</td>
                <td>K{loan.principal}</td>
                <td>{loan.interestRate * 100}%</td>
                <td>K{loan.expectedTotalPayment}</td>
                <td>K{loan.amountPaid}</td>
                <td>{loan.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
         <button onClick={logout} style={{ marginTop: "2rem" }}>
      Logout
    </button>
    </div>
  );
};

export default TreasurerDashboard;
