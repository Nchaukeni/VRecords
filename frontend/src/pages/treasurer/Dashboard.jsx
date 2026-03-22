import { contributions } from "../../mock";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { calculateTotalGroupSavingsAndInterest, calculateAvailableCash, calculateTotalOutstandingExposure } from "../../utils/finance";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../../styles/Dashboard.css";

const TreasurerDashboard = () => {
    const navigate = useNavigate();
    const { loans,logout, loanRepayments, penalties, members, shares } = useAuth(); // custorm hook to get loans from context

  // Totals
  const totalShareCapital = shares.reduce(
    (sum, share) => sum + share.amount,
    0
  );
  const totalGroupSavingsAndInterest = calculateTotalGroupSavingsAndInterest(loans, shares, penalties );

  const totalContributions = contributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );

  const totalLoanExposure = calculateTotalOutstandingExposure(loans, loanRepayments, penalties);

  const totalMonthlyExpected = loans.reduce(
    (sum, loan) => sum + loan.monthlyInstallment,
    0
  );

  const availableCash = calculateAvailableCash(loanRepayments, loans, shares, penalties);

  return (
        <div className="dashboard-container">

          <h1 className="dashboard-title">Treasurer Dashboard</h1>

          <div className="row g-3">

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-piggy-bank stats-icon"></i>
                <div className="stats-title">Group Savings & Interest</div>
                <div className="stats-value">K{totalGroupSavingsAndInterest}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-bar-chart-line stats-icon"></i>
                <div className="stats-title">Share Capital</div>
                <div className="stats-value">K{totalShareCapital}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-wallet2 stats-icon"></i>
                <div className="stats-title">Contributions</div>
                <div className="stats-value">K{totalContributions}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-cash stats-icon"></i>
                <div className="stats-title">Available Cash</div>
                <div className="stats-value">K{availableCash}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-exclamation-diamond stats-icon"></i>
                <div className="stats-title">Loan Exposure</div>
                <div className="stats-value">K{totalLoanExposure}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-graph-up stats-icon"></i>
                <div className="stats-title">Monthly Inflow</div>
                <div className="stats-value">K{totalMonthlyExpected.toFixed(2)}</div>
            </div>
            </div>
          </div>

          <h3 className="section-title">Loan Portfolio</h3>
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-hover">
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
            </div>
          </div>
           <button onClick={logout} style={{ marginTop: "2rem" }}>Logout</button>

        </div>
  );
};

export default TreasurerDashboard;
