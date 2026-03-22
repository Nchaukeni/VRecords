import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { contributions } from "../../mock";
import { useNavigate } from "react-router-dom";

import { calculateTotalOutstandingExposure, countClosedLoans, countPendingApplications, 
  countFlaggedRepayments,
  calculateTotalValidRepaymentsAll,
} from "../../utils/finance";
import "../../styles/chairDashboard.css"

export default function Dashboard() {
  const { logout, loans, loanApplications, loanRepayments, shares, penalties, members } = useAuth();
  const navigate = useNavigate();

  const membersWithShares = new Set(shares.map(s => s.memberId)).size;

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === "active").length;
  const inactiveMembers = totalMembers - activeMembers;
  const membersWithLoans = new Set(loans.map(l => l.memberId)).size;

  const totalOutstanding = calculateTotalOutstandingExposure(loans, loanRepayments, penalties);
  const closedLoans = countClosedLoans(loans);
  const pendingApplications = countPendingApplications(loanApplications);
  const flaggedRepayments = countFlaggedRepayments(loanRepayments);
  const totalCollected = calculateTotalValidRepaymentsAll(loanRepayments);

  return (
    <div className="dashboard-container-dark">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title-dark">Chairperson Dashboard</h1>
      </div>

      {/* STATS */}
      <div className="row g-4 mb-4">

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
                <i className="bi bi-graph-up-arrow stats-icon"></i>
                <div>
                  <div className="stats-title">Outstanding Exposure</div>
                  <div className="stats-value">K{totalOutstanding}</div>
               </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-cash stats-icon"></i>
              <div>
                <div className="stats-title">Total Collected</div>
                <div className="stats-value">K{totalCollected}</div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
             <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-cash-coin stats-icon"></i>
              <div>
                <div className="stats-title">Closed Loans</div>
                <div className="stats-value">{closedLoans}</div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-hourglass-split stats-icon"></i>
              <div>
                <div className="stats-title">Pending Loan Apps</div>
                <div className="stats-value">{pendingApplications}</div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-exclamation-triangle-fill stats-icon"></i>
              <div>
                <div className="stats-title">Flagged Repayments</div>
                <div className="stats-value" style={{ color: flaggedRepayments > 0 ? "#ff4d4f" : "#22d3ee" }}>
                  {flaggedRepayments}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-people-fill stats-icon"></i>
              <div>
                <div className="stats-title">Total Members</div>
                <div className="stats-value">{totalMembers}</div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-person-check-fill stats-icon"></i>
              <div>
                <div className="stats-title">Active Members</div>
                <div className="stats-value">{activeMembers}</div>
            </div>
            </div>
            
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="stats-card-dark">
            <div className="d-flex align-items-center justify-content-between">
              <i className="bi bi-person-lines-fill stats-icon"></i>
              <div>
                <div className="stats-title">Members With Loans</div>
                <div className="stats-value">{membersWithLoans}</div>
            </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* TABLE */}
      <h3 className="section-title-dark">Members Overview</h3>

      <div className="card table-card-dark">
        <div className="card-body">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
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
                  <tr
                    key={member.id}
                    onClick={() =>
                      navigate(`/chair/members/${member.vgroupId}/${member.memberNumber}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
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

    </div>
  );
}

/*import { useAuth } from "../../context/AuthContext";
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
*/