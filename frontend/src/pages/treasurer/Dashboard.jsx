import { members, shares, contributions } from "../../mock";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 

const TreasurerDashboard = () => {
    const navigate = useNavigate();
    const { loans,logout } = useAuth(); // custorm hook to get loans from context

  // Totals
  const totalShareCapital = shares.reduce(
    (sum, share) => sum + share.amount,
    0
  );

  const totalContributions = contributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );

  const totalLoanExposure = loans
  .filter(l => l.status === "active")
  .reduce((sum, loan) => sum + (loan.expectedTotalPayment - loan.amountPaid), 0);

  const totalMonthlyExpected = loans.reduce(
    (sum, loan) => sum + loan.monthlyInstallment,
    0
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Treasurer Dashboard</h1>

      <section style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div>
          <h3>Total Share Capital</h3>
          <p>${totalShareCapital}</p>
        </div>

        <div>
          <h3>Total Contributions</h3>
          <p>${totalContributions}</p>
        </div>

        <div>
          <h3>Total Loan Exposure</h3>
          <p>${totalLoanExposure}</p>
        </div>

        <div>
          <h3>Monthly Expected Inflow</h3>
          <p>${totalMonthlyExpected.toFixed(2)}</p>
        </div>
        <div>
          <Link to="/treasurer/apply-loan"><h3>Apply for New Loan</h3></Link>
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
                <td>${loan.principal}</td>
                <td>{loan.interestRate * 100}%</td>
                <td>${loan.expectedTotalPayment}</td>
                <td>${loan.amountPaid}</td>
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
