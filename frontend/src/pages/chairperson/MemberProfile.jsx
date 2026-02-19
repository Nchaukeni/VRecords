import { useParams, useNavigate } from "react-router-dom";
import { members, loans, shares, contributions } from "../../mock";

const MemberProfile = () => {
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
        <ul>
          {memberLoans.map(loan => (
            <li key={loan.id}>
              ${loan.principal} at {loan.interestRate * 100}% — {loan.status}
            </li>
          ))}
        </ul>
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
