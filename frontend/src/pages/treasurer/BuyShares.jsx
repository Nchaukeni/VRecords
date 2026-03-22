import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BuyShares = () => {

  const { members, shares, setShares, cycleConfig, user } = useAuth();

  const [memberId, setMemberId] = useState("");
  const [shareCount, setShareCount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const member = members.find(m => m.id === memberId);

    if(!member){
      alert("Member not found.");
      return;
    }

    if(member.status !== "active"){
      alert("Only active members can buy shares.");
      return;
    }
    /////////////////////////////
    // here, create block that iterates according to share count and creates 
    // individual share records with unique IDs. 
    // This is important for tracking and auditing purposes.
    // /////////////////////////////
    const total = Number(shareCount) * cycleConfig.sharePrice;

    for(let i=0; i<shareCount; i++){
      const newShare = {
        id: `s-${Date.now()}-${i}`,
        memberId,
        amount: cycleConfig.sharePrice,
        enteredBy: `${user?.fullName} (${user?.role})`,
        purchaseDate: new Date().toISOString(),
        cycleYear: cycleConfig.cycleYear,
      };

      setShares(prev => [...prev, newShare]);
    }

    alert(`Shares recorded. Total contribution: K${total}`);
    setMemberId("");
    setShareCount("");
  };

  return (

    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-body">

          <h4>
            <i className="bi bi-piggy-bank"></i> Record Share Purchase
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label>Member</label>

              <select
                className="form-select"
                value={memberId}
                onChange={(e)=>setMemberId(e.target.value)}
              >

                <option value="">Select member</option>

                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}

              </select>

            </div>

            <div className="mb-3">

              <label>Number of Shares</label>

              <input
                type="number"
                className="form-control"
                value={shareCount}
                onChange={(e)=>setShareCount(e.target.value)}
              />

            </div>

            <div className="mb-3">

              <strong>
                Share Price: K{cycleConfig.sharePrice}
              </strong>

            </div>

            <button className="btn btn-success">
              Record Shares
            </button>

          </form>

        </div>

      </div>

    </div>

  );

};

export default BuyShares;