
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "../../styles/LoanPortfolio.css"

const LoanPortfolio = () => {
  const { user, members, loans, setLoanRepayments, loanRepayments, penalties } = useAuth();
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState("");
  const [loanBalance, setBalance] = useState(null);
  const [userLoan, setUserLoan] = useState(null);


  // SUMMARY CALCULATIONS
  const approvedLoans = loans.filter(l => l.status === "approved");

  const totalPrincipal = approvedLoans.reduce((sum, l) => sum + l.principal, 0);

  const totalExpected = approvedLoans.reduce(
    (sum, l) => sum + l.expectedTotalPayment,
    0
  );

  const totalRepaid = loanRepayments
    .filter(r => r.status === "valid")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

  const totalOutstanding = totalExpected - totalRepaid + totalPenalties;
  ///////////////////////////////////////////////////////////////////////

  // BAR CHART DATA (Loan per member)
  const loanChartData = approvedLoans.map((loan) => {
    const member = members.find(m => m.id === loan.memberId);
    return {
      name: member?.fullName || "Unknown",
      loan: loan.principal,
    };
  });

  // PIE CHART DATA
  const repaymentData = [
    { name: "Paid", value: totalRepaid },
    { name: "Remaining", value: totalOutstanding },
  ];

  

  const getLoanBalance = (loan) => {
    if (loan.status !== "approved") return 0;

    const approvedRepayments = loanRepayments
      .filter(r => r.memberId === loan.memberId && r.status === "valid")
      .reduce((sum, r) => sum + r.amount, 0);

    return loan.expectedTotalPayment - approvedRepayments;
  };

  const handleRowClick = (member, balance, loan) => {
    if (balance > 0) {
      setSelectedMember(member);
      setBalance(balance);
      setUserLoan(loan);
    }
  };

  const handleSubmitRepayment = () => {
    if (!amount || Number(amount) <= 0) return;

    const newRepayment = {
      id: Date.now(),
      loanId: userLoan.id,
      memberId: selectedMember.id,
      amount: Number(amount),
      status: "pending",
      flagged: false,
      date: new Date().toISOString(),
      enteredBy: `${user?.fullName} (${user?.role})`,
    };

    setLoanRepayments([...loanRepayments, newRepayment]);

    setAmount("");
    setSelectedMember(null);
  };

  return (
    <div className="container-fluid text-light">

      {/* HEADER */}
      <h2 className="section-title-dark mb-4">
        <i className="bi bi-cash-stack me-2"></i>
        Loan Portfolio
      </h2>

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card dashboard-card-dark p-3">
            <h6>Total Loans</h6>
            <h4>K{totalPrincipal}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card dashboard-card-dark p-3">
            <h6>Total Repaid</h6>
            <h4 className="text-success">K{totalRepaid}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card dashboard-card-dark p-3">
            <h6>Outstanding</h6>
            <h4 className="text-danger">K{totalOutstanding}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card dashboard-card-dark p-3">
            <h6>Penalties</h6>
            <h4 className="text-warning">K{totalPenalties}</h4>
          </div>
        </div>

      </div>
      {/*/////////////////////////////////////////////Visuals///////////////////////////////////////////////////// */}

      <div className="row mb-4">

        {/* BAR CHART */}
        <div className="col-md-8">
          <div className="card dashboard-card-dark p-3">
            <h6 className="mb-3">Loan Distribution</h6>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loanChartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="loan" fill="#00bcd4" />
              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-4">
          <div className="card dashboard-card-dark p-3">
            <h6 className="mb-3">Repayment Progress</h6>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={repaymentData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#4caf50" />
                  <Cell fill="#f44336" />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>
      {/*////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

      {/* TABLE */}
      <div className="card table-card-dark">
        <div className="card-body">

          <table className="table table-dark table-hover align-middle">

            <thead>
              <tr>
                <th>Name</th>
                <th>Principal</th>
                <th>Interest %</th>
                <th>Interest</th>
                <th>Tenure</th>
                <th>Penalties</th>
                <th>Paid</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {loans.map((loan) => {
                const member = members.find(m => m.id === loan.memberId);
                const penaltyAmount = penalties
                  .filter(p => p.loanId === loan.id)
                  .reduce((sum, p) => sum + p.amount, 0);

                const balance = getLoanBalance(loan) + penaltyAmount;

                if (!member || loan.status !== "approved") return null;

                return (
                  <tr
                    key={loan.id}
                    onClick={() => handleRowClick(member, balance, loan)}
                    style={{ cursor: balance > 0 ? "pointer" : "default" }}
                    className={balance > 0 ? "clickable-row" : ""}
                  >
                    <td>{member.fullName}</td>
                    <td>K{loan.principal}</td>
                    <td>{loan.interestRate * 100}%</td>
                    <td>
                      K{Math.round(
                        Math.pow(1 + loan.interestRate, loan.termMonths) *
                          loan.principal -
                          loan.principal
                      )}
                    </td>
                    <td>{loan.termMonths}m</td>
                    <td className="text-warning">K{penaltyAmount}</td>
                    <td className="text-success">K{loan.amountPaid}</td>
                    <td
                      className={
                        balance > 0 ? "text-danger fw-bold" : "text-success"
                      }
                    >
                      K{balance}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="repayment-modal-dark">

            <h4 className="text-info mb-3">Record Repayment</h4>

            <p><strong>{selectedMember.fullName}</strong></p>
            <p className="text-warning">
              Balance: <strong>K{loanBalance}</strong>
            </p>

            <input
              className="form-control input-dark mb-3"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="d-flex gap-2">

              <button
                onClick={handleSubmitRepayment}
                className="btn btn-vrecords w-100"
              >
                Submit
              </button>

              <button
                onClick={() => setSelectedMember(null)}
                className="btn btn-outline-danger w-100"
              >
                Cancel
              </button>

            </div>

            <small className="text-secondary d-block mt-3">
              Requires Chairperson approval
            </small>

          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPortfolio;




/*
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
    </div> /*
      

      {/* Modal *
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