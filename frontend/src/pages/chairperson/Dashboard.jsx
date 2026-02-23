import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { members, loans, shares, contributions } from "../../mock";
import { useNavigate } from "react-router-dom";

import { calculateTotalOutstandingExposure, countClosedLoans, countPendingApplications, 
  countFlaggedRepayments,
  calculateTotalValidRepaymentsAll,
} from "../../utils/finance";

//////////////// These will be removed into utils later /////////////////////
const totalMembers = members.length;
const activeMembers = members.filter(m => m.status === "active").length;
const inactiveMembers = totalMembers - activeMembers;

const membersWithLoans = new Set(loans.map(l => l.memberId)).size;
const membersWithShares = new Set(shares.map(s => s.memberId)).size;
///////////////////////////////////////////////////////////////////////////


export default function Dashboard() {
  const { logout, loans, loanApplications, loanRepayments } = useAuth();

  const totalOutstanding = calculateTotalOutstandingExposure( loans, loanRepayments );

  const closedLoans = countClosedLoans(loans);
  const pendingApplications = countPendingApplications(loanApplications);
  const flaggedRepayments = countFlaggedRepayments(loanRepayments);
  const totalCollected = calculateTotalValidRepaymentsAll(loanRepayments);
  const navigate = useNavigate();

  return (  
  <div style={{ padding: "2rem" }}>
    <h1>Chairperson Dashboard</h1>

    <section style={{ display: "flex", gap: "2rem", marginTop: "1.5rem" }}>
       <div style={{ marginBottom: "30px" }}>
            <h2>Governance Overview</h2>

            <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
                  <div><strong>Total Outstanding Exposure:</strong> {totalOutstanding}</div>
                  <div><strong>Total Collected (Valid):</strong> {totalCollected}</div>
                  <div><strong>Closed Loans:</strong> {closedLoans}</div>
                  <div><strong>Pending Applications:</strong> {pendingApplications}</div>
                  <div style={{ color: flaggedRepayments > 0 ? "red" : "black" }}>
                    <strong>Flagged Repayments:</strong> {flaggedRepayments}
                  </div>
            </div>
        </div>
      <div>
        <h3>Total Members</h3>
        <p>{totalMembers}</p>
      </div>

      <div>
        <h3>Active Members</h3>
        <p>{activeMembers}</p>
      </div>

      <div>
        <h3>Inactive Members</h3>
        <p>{inactiveMembers}</p>
      </div>

      <div>
        <h3>Members with Loans</h3>
        <p>{membersWithLoans}</p>
      </div>

      <div>
        <h3>Members with Shares</h3>
        <p>{membersWithShares}</p>
      </div>
    </section>
    
    <h2 style={{ marginTop: "3rem" }}>Members Overview</h2>
    <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }} className="table table-hover">
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
            <tr key={member.id} onClick={() => navigate(`/chair/members/${member.id}`)} style={{ cursor: "pointer" }}>
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


    <button onClick={logout} style={{ marginTop: "2rem" }}>
      Logout
    </button>
  </div>);

}
