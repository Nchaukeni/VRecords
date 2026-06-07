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
        <div className="container-fluid text-light">

          <h2 className="section-title-dark mb-4"><i className="bi bi-speedometer2 me-2"></i>Treasurer Dashboard</h2>

          <div className="row g-3">

            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-piggy-bank fs-4 text-info mb-2"></i>
                <div className="small text-secondary">Group Savings With Interest</div>
                <div className="fw-bold fs-5">K{totalGroupSavingsAndInterest}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-bar-chart-line fs-4 text-primary mb-2"></i>
                <div className="small text-secondary">Share Capital</div>
                <div className="fw-bold fs-5">K{totalShareCapital}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-wallet2 fs-4 text-primary mb-2"></i>
                <div className="small text-secondary">Contributions</div>
                <div className="fw-bold fs-5">K{totalContributions}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-cash fs-4 text-success mb-2"></i>
                <div className="small text-secondary">Available Cash</div>
                <div className="fw-bold fs-5">K{availableCash}</div>
              </div>
            </div>
           
            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-exclamation-diamond fs-4 text-danger mb-2"></i>
                <div className="small text-secondary">Loan Exposure</div>
                <div className="fw-bold fs-5">K{totalLoanExposure}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="card dashboard-card-dark p-3 text-center">
                <i className="bi bi-graph-up fs-4 text-warning mb-2"></i>
                <div className="small text-secondary">Monthly Inflow</div>
                <div className="fw-bold fs-5">K{totalMonthlyExpected.toFixed(2)}</div>
              </div>
            </div>

          </div>

          <h3 className="section-title">Loan Portfolio</h3>
          <div className="card table-card-dark">
              <div className="card-body">

                <table className="table table-dark table-hover align-middle">

                  <thead>
                      <tr>
                        <th>Member</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Total Payable</th>
                        <th>Paid</th>
                        <th>Status</th>
                      </tr>
                  </thead>

                  <tbody>
                        {loans.map(loan => {
                            const member = members.find(m => m.id === loan.memberId);

                            return (
                      <tr
                          key={loan.id}
                          onClick={() => navigate(`/treasurer/loans/${loan.id}`)}
                          style={{ cursor: "pointer" }}
                          className="clickable-row"
                        >
                          <td>{member?.fullName}</td>
                            <td>K{loan.principal}</td>
                            <td>{loan.interestRate * 100}%</td>
                            <td>K{loan.expectedTotalPayment}</td>
                            <td className="text-success">K{loan.amountPaid}</td>
                            <td>
                              <span className={`badge ${
                                loan.status === "approved"? "bg-success": loan.status === "pending"? "bg-warning text-dark": "bg-danger"}`}>
                                {loan.status}
                              </span>
                            </td>
                      </tr>
                      );
                        })}
                    </tbody>

                 </table>

              </div>
            </div>

        </div>
  );
};

export default TreasurerDashboard;
