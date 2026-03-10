import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 

const LoanApprovalPanel = () => {
  const {
    loanApplications,
    setLoanApplications,
    loans,
    setLoans,
  } = useAuth();

  const pendingApplications = loanApplications.filter(
    (app) => app.status === "pending"
  );

  const handleApprove = (application) => {

    const compoundedTotal = application.requestedAmount * Math.pow(1 + application.interestRate, application.termMonths);
    const expectedTotalPayment = Math.round(compoundedTotal);

    // 1️⃣ Create new loan based on the approved application
    setLoans((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        memberId: application.memberId,
        principal: application.requestedAmount,
        interestRate: application.interestRate,
        expectedTotalPayment,
        monthlyInstallment: Math.round(expectedTotalPayment / application.termMonths),
        amountPaid: 0,
        issuedDate: new Date().toISOString(),
        termMonths: application.termMonths,
        status: "approved",
      },
      
    ]);

    // 2️⃣ Update application status
    setLoanApplications((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? { ...app, status: "approved" }
          : app
      )
    );
    ////////////////////////////////////////////////////
    //    Need to add function that updates available cash 
    //    here after loan approval
    ////////////////////////////////////////////////////////
  };
 

  const handleReject = (applicationId) => {
    setLoanApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: "rejected" }
          : app
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Loan Approval Panel</h2>

      {pendingApplications.length === 0 ? (
        <p>No pending loan applications.</p>
      ) : (
        <table border="1" cellPadding="8" className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Member ID</th>
              <th>Requested Amount</th>
              <th>Interest Rate</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((app) => (
              <tr key={app.id}>
                <td>{app.memberId}</td>
                <td>{app.requestedAmount}</td>
                <td>{app.interestRate}</td>
                <td>{new Date(app.date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleApprove(app)}
                    style={{ marginRight: "8px" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanApprovalPanel;