import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ShareSettings = () => {

  const { cycleConfig, setCycleConfig } = useAuth();
  const [price, setPrice] = useState(cycleConfig.sharePrice);
  const [cycle, setCycle] = useState(cycleConfig.cycleYear);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(price <= 0){
      alert("Share price must be greater than zero.");
      return;
    }

    setCycleConfig({
      ...cycleConfig,
      sharePrice: Number(price)
    });

    alert("Share price updated successfully.");
  };

  return (

    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-body">

          <h4>
            <i className="bi bi-coin"></i> Share Settings
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">

              <label className="form-label"> Current Cycle Year </label>
              <input
                type="text"
                className="form-control"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Share Price (ZMW)
              </label>

              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
              />

            </div>

            <button className="btn btn-primary">
              Update Share Price
            </button>

          </form>

        </div>

      </div>

    </div>

  );

};

export default ShareSettings;