import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { contributions } from "../../mock";
import { calculateTotalGroupSavingsAndInterest } from "../../utils/finance";

const MemberProfile = () => {
  const { loans, members, shares, penalties } = useAuth();
  const { vgroupId, memberNumber } = useParams();
  const navigate = useNavigate();

  const member = members.find(
    m => m.vgroupId === vgroupId && m.memberNumber === memberNumber
  );

  const memberId = member?.id;

  if (!member) {
    return <div className="container mt-4 text-light">Member not found.</div>;
  }

  const totalGroupSavingsAndInterest =
    calculateTotalGroupSavingsAndInterest(loans, shares, penalties);

  const memberLoans = loans.filter(l => l.memberId === memberId);
  const memberShares = shares.filter(s => s.memberId === memberId);
  const memberContributions = contributions.filter(c => c.memberId === memberId);

  const totalSharesValue = memberShares.reduce((sum, s) => sum + s.amount, 0);
  const totalGroupShares = shares.reduce((sum, s) => sum + s.amount, 0);

  const memberReturns =
    totalGroupSavingsAndInterest *
    (totalSharesValue / (totalGroupShares || 1));

  const totalLoanExposure = memberLoans.reduce(
    (sum, loan) => sum + loan.expectedTotalPayment,
    0
  );

  const totalContributions = memberContributions.reduce(
    (s, c) => s + c.amount,
    0
  );

  return (
    <div className="container-fluid py-4 text-light" style={{ maxWidth: "1000px" }}>

      {/* ACTIONS */}
      <div className="d-flex justify-content-between mb-4 no-print">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-info"
        >
          ← Back
        </button>

        <button
          onClick={() => window.print()}
          className="btn btn-vrecords"
        >
          🖨 Print / PDF
        </button>
      </div>

      {/* HEADER */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-info">{member.fullName}</h1>
        <p className="text-secondary">Member #{member.memberNumber}</p>
      </div>

      {/* BASIC INFO */}
      <div className="card table-card-dark mb-4">
        <div className="card-body">
          <p className="stats-title"><strong>Status:</strong> {member.status}</p>
          <p className="stats-title"><strong>Joined:</strong> {member.joinDate}</p>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}
      <h3 className="section-title-dark">Financial Summary</h3>
      <div className="card table-card-dark mb-4">
        <div className="card-body">
          <table className="table table-dark table-striped">
            <tbody>
              <tr>
                <td>Total Shares Value</td>
                <td>K{totalSharesValue}</td>
              </tr>
              <tr>
                <td>Total Loan Exposure</td>
                <td>K{totalLoanExposure}</td>
              </tr>
              <tr>
                <td>Total Contributions</td>
                <td>K{totalContributions}</td>
              </tr>
              <tr>
                <td>Estimated Returns</td>
                <td>K{memberReturns.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* LOANS */}
      <h3 className="section-title-dark">Loans</h3>
      {memberLoans.length === 0 ? (
        <p className="text-secondary">No loans.</p>
      ) : (
        <div className="card table-card-dark mb-4">
          <div className="card-body">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Tenure</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {memberLoans.map(loan => (
                  <tr
                    key={loan.id}
                    onClick={() => navigate(`/chair/loans/${loan.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{loan.id}</td>
                    <td>K{loan.principal}</td>
                    <td>{loan.interestRate * 100}%</td>
                    <td>{loan.termMonths}m</td>
                    <td>K{loan.expectedTotalPayment}</td>
                    <td>
                      {new Date(loan.issuedDate).toLocaleDateString("en-ZM")}
                    </td>
                    <td>{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SHARES */}
      <h3 className="section-title-dark">Shares</h3>
      {memberShares.length === 0 ? (
        <p className="text-secondary">No shares.</p>
      ) : (
        <div className="card table-card-dark">
          <div className="card-body">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {memberShares.map(share => (
                  <tr key={share.id}>
                    <td>{share.id}</td>
                    <td>K{share.amount}</td>
                    <td>
                      {new Date(share.purchaseDate).toLocaleDateString("en-ZM")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default MemberProfile;