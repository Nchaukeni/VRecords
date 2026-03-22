
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/LoanPortfolio.css"

const LoanPortfolio = () => {
  const {user, members, loans, setLoanRepayments, loanRepayments, penalties } = useAuth();

  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState("");
  const [ loanBalance, setBalance ] = useState(null);
  const [ userLoan, setUserLoan ] = useState(null);

  // Get member loan
  /////////////////////////////////////////////////////
  const getLoanBalance = (loan) => {
    if (loan.status !== "approved") return 0;

    const approvedRepayments = loanRepayments.filter((r) => r.memberId === loan.memberId && r.status === "valid"
    ).reduce((sum, r) => sum + r.amount, 0);

  return loan.expectedTotalPayment - approvedRepayments;
};

  ////////////////////////////////////////////////

  const handleRowClick = (member, balance, loan) => {
    if (balance > 0) {
      setSelectedMember(member); //setting seleceted member 
      setBalance(balance);       //Setting balance
      setUserLoan(loan);   //selecting userLoan so that its used in handleSubmitRepayment
    }
  };

  const handleSubmitRepayment = () => {
    if (!amount || Number(amount) <= 0) return;
    const enteredBy = `${user?.fullName} (${user?.role})`;
    const newRepayment = {
      id: Date.now(),
      loanId: userLoan.id,
      memberId: selectedMember.id,
      amount: Number(amount),
      status: "pending", // IMPORTANT: chair must approve
      flagged: false,
      date: new Date().toISOString(),
      enteredBy: enteredBy,
    };
   
    setLoanRepayments([...loanRepayments, newRepayment]);

    setAmount("");
    setSelectedMember(null);
  };

  return (
    <div className="dashboard-container">
      <h3 className="section-title">Loan Portfolio</h3>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Loan Principal</th>
                <th>Interest %</th>
                <th>Loan Interest</th>
                <th>Loan Tenure</th>
                <th>Penalties Acrued</th>
                <th>Amount Paid</th>
                <th>Loan Balance</th>
              </tr>
            </thead>
            <tbody>
                {loans.map((loan) => {
                  const member = members.find(m => m.id === loan.memberId);
                  const penaltyAmount = penalties.filter(p => p.loanId === loan.id).reduce((sum, p) => sum + p.amount, 0);
                  const balance = getLoanBalance(loan) + penaltyAmount;
                    if ( !member || loan.status !== 'approved') return null;
                        return (
                    <tr
                      key={loan.id}
                      onClick={() => handleRowClick(member, balance, loan)}
                      style={{ cursor: balance > 0 ? "pointer" : "default" }}
                    >
                      <td>{member.fullName}</td>
                      <td>K{ loan.principal }</td>
                      <td>{loan.interestRate * 100}%</td>
                      <td>K{Math.round(Math.pow(1+loan.interestRate, loan.termMonths) * loan.principal - loan.principal)}</td>
                      <td>{loan.termMonths} months</td>
                      <td>K{penaltyAmount}</td>
                      <td>K{loan.amountPaid}</td>
                      <td>K{balance}</td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      </div>
    </div>
      

      {/* Modal */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="repayment-modal">
            <h3>Record Repayment</h3>

            <p><strong>{selectedMember.fullName}</strong></p>
            <p>
              Current Balance:{" "}
              {loanBalance}
            </p>

            <input
              className="form-control"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleSubmitRepayment} className="btn btn-success">
                Submit
              </button>
              <button onClick={() => setSelectedMember(null)} className="btn btn-danger">
                Cancel
              </button>
            </div>

            <small>
              This repayment will require Chairperson approval.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPortfolio;
/*

const LoanPortfolio = () => {
    const { members, loans } = useAuth();
    return(
    <>
        <div className="portfolio-main-content">
            <h2>Loan Portfolio</h2>
            <table className="table table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Member ID</th>
                        <th>Full Name</th>
                        <th>Loan ID</th>
                        <th>Loan Amount</th>
                        <th>Total Paid</th>
                        <th>Loan Balance</th>
                    </tr>
                </thead>
                <tbody>
                    { loans.map(loan => {
                          const member = members.find(m => m.id === loan.memberId);
                         return(  <tr>
                            <td>{loan.memberId}</td>
                            <td>{member.fullName}</td>
                            <td>{loan.id}</td>
                            <td>{loan.expectedTotalPayment}</td>
                            <td>${loan.amountPaid}</td>
                            <td>{loan.status}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
            {}
        </div>
    </>)
}

export default LoanPortfolio;

*/