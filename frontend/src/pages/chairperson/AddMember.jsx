import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AddMember = () => {

  const { members, setMembers, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const memberNumber = `VR-${String(members.length + 1).padStart(3, "0")}`;
  const [status, setStatus] = useState("active");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;

    // NRC validation
    if (!nrcRegex.test(memberId)) {
      alert("Invalid NRC format. Use 123456/78/9 format.");
      return;
    }

    // Prevent duplicates
    const exists = members.some(m => m.id === memberId);

    if (exists) {
      alert("Member with this NRC already exists.");
      return;
    }

    if (!fullName || !memberNumber) {
      alert("Please fill all required fields.");
      return;
    }

    const newMember = {
      vgroupId: user.vgroupId,
      id: memberId,
      fullName,
      memberNumber,
      email: memberEmail,
      password: "default",
      joinDate: new Date().toISOString(),
      status,
      role: "member"
    };

    setMembers(prev => [...prev, newMember]);

    alert("Member added successfully.");

    navigate("/chair");
  };

  return (
    <div className="container mt-4">

      <div className="card shadow-sm">

        <div className="card-body">

          <h4 className="mb-4">
            <i className="bi bi-person-plus"></i> Add New Member
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
              />

            </div>
             <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                className="form-control"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter email"
              />

            </div>

            <div className="mb-3">
              <label className="form-label">National Registration Card (NRC)</label>

              <input
                type="text"
                className="form-control"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="123456/78/9"
              />

              <small className="text-muted">
                Format: 6 digits / 2 digits / 1 digit
              </small>

            </div>

            <div className="mb-3">

              <label className="form-label">Member Status</label>

              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active (Can buy shares)</option>
                <option value="inactive">Inactive (Loans only)</option>
              </select>

            </div>

            <div className="mt-4">

              <button className="btn btn-primary me-2">
                Add Member
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/chair")}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddMember;