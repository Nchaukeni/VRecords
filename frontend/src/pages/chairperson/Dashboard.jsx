import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { contributions } from "../../mock";
import { useNavigate } from "react-router-dom";

import { calculateTotalOutstandingExposure, countClosedLoans, countPendingApplications, 
  countFlaggedRepayments,
  calculateTotalValidRepaymentsAll,
} from "../../utils/finance";




export default function Dashboard() {
  const { logout, loans, loanApplications, loanRepayments, shares, penalties, members } = useAuth();
  const membersWithShares = new Set(shares.map(s => s.memberId)).size;

  //////////////// These will be removed into utils later /////////////////////
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === "active").length;
  const inactiveMembers = totalMembers - activeMembers;

  const membersWithLoans = new Set(loans.map(l => l.memberId)).size;

  ///////////////////////////////////////////////////////////////////////////

  const totalOutstanding = calculateTotalOutstandingExposure( loans, loanRepayments, penalties);

  const closedLoans = countClosedLoans(loans);
  const pendingApplications = countPendingApplications(loanApplications);
  const flaggedRepayments = countFlaggedRepayments(loanRepayments);
  const totalCollected = calculateTotalValidRepaymentsAll(loanRepayments);
  const navigate = useNavigate();

  return (  
    <div className="dashboard-container">
      <h1 className="dashboard-title">Chairperson Dashboard</h1>
       <div className="row g-3">

          <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-bank stats-icon"></i>
                <div className="stats-title">Governance Overview</div>
                <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
                  <div className="stats-description">Total Outstanding Exposure:<strong> K{totalOutstanding}</strong></div>
                  <div className="stats-description">Total Collected (Valid): <strong>K{totalCollected}</strong> </div>
                  <div className="stats-description">Closed Loans: <strong>{closedLoans}</strong></div>
                  <div className="stats-description">Pending Applications: <strong>{pendingApplications}</strong></div>
                  <div style={{ color: flaggedRepayments > 0 ? "red" : "black" }} className="stats-description"> Flagged Repayments: <strong>{flaggedRepayments}</strong></div>
            </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-people-fill stats-icon"></i>
                <div className="stats-title">Total Members</div>
                <div className="stats-value">{totalMembers}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-person-check stats-icon"></i>
                <div className="stats-title">Active Members</div>
                <div className="stats-value">{activeMembers}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-person-exclamation stats-icon"></i>
                <div className="stats-title">Inactive Members</div>
                <div className="stats-value">{inactiveMembers}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-person-lines-fill stats-icon"></i>
                <div className="stats-title">Members With Loans</div>
                <div className="stats-value">{membersWithLoans}</div>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="stats-card">
                <i className="bi bi-person-fill-lock stats-icon"></i>
                <div className="stats-title">Members with Share</div>
                <div className="stats-value">{membersWithShares}</div>
              </div>
            </div>
       </div>

    <h3 className="section-title">Members Overview</h3>
    <div className="card shadow-sm">
      <div className="card-body">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Member #</th>
              <th>Name</th>
              <th>Status</th>
              <th>Shares</th>
              <th>Loans</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              const memberShares = shares.filter(s => s.memberId === member.id).length;
              const memberLoans = loans.filter(l => l.memberId === member.id).length;

            return (
              <tr key={member.id} onClick={() => navigate(`/chair/members/${member.vgroupId}/${member.memberNumber}`)} style={{ cursor: "pointer" }}>
                <td>{member.memberNumber}</td>
                <td>{member.fullName}</td>
                <td>{member.status}</td>
                <td>{memberShares}</td>
                <td>{memberLoans}</td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>

    <button onClick={logout} className="btn btn-danger" style={{ marginTop: "2rem" }}>
      Logout
    </button>
    </div>
    );

}
