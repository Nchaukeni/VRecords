import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { contributions } from "../../mock";

const MemberProfile = () => {
  const { loans, members, shares } = useAuth();
  const { memberId } = useParams();
  const navigate = useNavigate();

  const member = members.find(m => m.id === memberId);

  if (!member) {
    return <div>Member not found.</div>;
  }

  const memberLoans = loans.filter(l => l.memberId === memberId);
  const memberShares = shares.filter(s => s.memberId === memberId);
  const memberContributions = contributions.filter(
    c => c.memberId === memberId
  );

  const totalSharesValue = memberShares.reduce(
    (sum, share) => sum + share.amount,
    0
  );

  const totalLoanExposure = memberLoans.reduce(
    (sum, loan) => sum + loan.expectedTotalPayment,
    0
  );

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1 style={{ marginTop: "1rem" }}>
        {member.fullName} ({member.memberNumber})
      </h1>

      <p>Status: {member.status}</p>
      <p>Joined: {member.joinDate}</p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Financial Summary</h2>
      <p>Total Share Value: ${totalSharesValue}</p>
      <p>Total Loan Exposure: ${totalLoanExposure}</p>
      <p>Total Contributions: ${memberContributions.reduce((s, c) => s + c.amount, 0)}</p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Loans</h2>
      {memberLoans.length === 0 ? (
        <p>No loans.</p>
      ) : (
        <><table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Loan Id</th>
              <th>Principal</th>
              <th>Monthly Interest Rate</th>
              <th>Loan Tenure</th>
              <th>Total Payable</th>
              <th>Issued Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {memberLoans.map(loan => (
              <tr key={loan.id} onClick={() => navigate(`/chair/loans/${loan.id}`)} style={{ cursor: "pointer" }}>
                <td>{loan.id}</td>
                <td>K{loan.principal}</td>
                <td>{loan.interestRate*100}%</td>
                <td>To be updated</td>
                <td>K{loan.expectedTotalPayment}</td>
                <td>{new Date(loan.issuedDate).toLocaleDateString()}</td>
                <td>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
        
      )}

      <h2 style={{ marginTop: "2rem" }}>Shares</h2>
      {memberShares.length === 0 ? (
        <p>No shares.</p>
      ) : (
        <ul>
          {memberShares.map(share => (
            <li key={share.id}>
              ${share.amount} — {share.purchaseDate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberProfile;
