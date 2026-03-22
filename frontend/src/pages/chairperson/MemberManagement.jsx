
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { members, setMembers, logout } = useAuth();
  const navigate = useNavigate();

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const promoteToTreasurer = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member.status !== "active") {
      alert("Only active members can be promoted.");
      return;
    }

    if (!window.confirm(`Promote ${member.fullName} to Treasurer?`)) return;

    setMembers(prev =>
      prev.map(m => {
        if (m.role === "treasurer") return { ...m, role: "member" };
        if (m.id === memberId) return { ...m, role: "treasurer" };
        return m;
      })
    );
  };

  const toggleStatus = (memberId) => {
    const member = members.find(m => m.id === memberId);
    const action = member.status === "active" ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} ${member.fullName}?`)) return;

    if (member.status === "active") {
      if (["chairperson", "treasurer"].includes(member.role)) {
        alert("Cannot deactivate leadership roles.");
        return;
      }
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "inactive" } : m));
    } else {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "active" } : m));
    }
  };

  const transferChairperson = (memberId) => {
    if (!window.confirm("Transfer Chairperson role?")) return;

    setMembers(prev =>
      prev.map(m => {
        if (m.role === "chairperson") return { ...m, role: "member" };
        if (m.id === memberId) return { ...m, role: "chairperson" };
        return m;
      })
    );

    alert("Chairperson changed. Please login again.");
    logout();
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title-dark">
          <i className="bi bi-people"></i> Member Management
        </h2>

        <button
          className="btn btn-vrecords"
          onClick={() => navigate("/chair/add-member")}
        >
          <i className="bi bi-person-plus"></i> Add Member
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4" style={{ maxWidth: "400px" }}>
        <div className="input-group input-group-dark">
          <span className="input-group-text bg-dark text-light border-0">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="text"
            className="form-control input-dark"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card table-card-dark">
        <div className="card-body">

          <table className="table table-dark table-hover align-middle">

            <thead>
              <tr>
                <th>NRC</th>
                <th>Name</th>
                <th>Member #</th>
                <th>Status</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>

                  <td>{member.id}</td>
                  <td>{member.fullName}</td>
                  <td>{member.memberNumber}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        member.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  {/* ROLE */}
                  <td>
                    {member.role === "chairperson" && (
                      <span className="badge bg-warning text-dark">Chairperson</span>
                    )}
                    {member.role === "treasurer" && (
                      <span className="badge bg-info text-dark">Treasurer</span>
                    )}
                    {member.role === "member" && (
                      <span className="badge bg-light text-dark">Member</span>
                    )}
                  </td>

                  <td>
                    {new Date(member.joinDate).toLocaleDateString("en-ZM")}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="d-flex flex-wrap gap-2">

                      {member.role === "member" && (
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => promoteToTreasurer(member.id)}
                        >
                          Treasurer
                        </button>
                      )}

                      {member.role !== "chairperson" && (
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => transferChairperson(member.id)}
                        >
                          Chair
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status === "active" ? "Deactivate" : "Activate"}
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No members found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default MemberManagement;


/*import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const MemberManagement = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const { members, setMembers, logout } = useAuth();
  const filteredMembers = members.filter(member =>
  member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.id.toLowerCase().includes(searchTerm.toLowerCase())
);
  const navigate = useNavigate();

  const promoteToTreasurer = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member.status !== "active") {
      alert("Only active members can be promoted to Treasurer.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to promote ${member.fullName} to Treasurer? This will demote the current Treasurer to a regular member.`
    );

    if (!confirmed) return;
    // This will be replaced by backend API call in the future. For now, we just update the local state.
    
    setMembers(prev =>
      prev.map(m => {
        if (m.role === "treasurer") {
          return { ...m, role: "member" };
        }

        if (m.id === memberId) {
          return { ...m, role: "treasurer" };
        }

        return m;
      }
      
      )
    );
   //////////////////////////////////////////////
  };

  const toggleStatus = (memberId) => {
    // tO be replaced by backend API call in the future. For now, we just update the local state.
    const member = members.find(m => m.id === memberId);
    const action = member.status === "active" ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${member.fullName}?`
    );
    
    if (!confirmed) return;
    if (member.status === "active"){
        if (member.role === "chairperson" || member.role === "treasurer") {
          alert("Cannot deactivate the Chairperson or Treasurer. Please transfer the role to another member before deactivating.");
          return;
        }
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "inactive" } : m));
    }
    else {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "active" } : m));
    }
    
    ////////////////////////////////////////
  };

  const transferChairperson = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member.status !== "active") {
      alert("Only active members can be promoted to Treasurer.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to transfer the Chairperson role?"
    );

    if (!confirmed) return;
    // This will be replaced by a backend API call in the future. For now, we just update the local state and logout to simulate the change.
    setMembers(prev =>
      prev.map(m => {

        if (m.role === "chairperson") {
          return { ...m, role: "member" };
        }

        if (m.id === memberId) {
          return { ...m, role: "chairperson" };
        }

        return m;

      })
    );

    alert("Chairperson role transferred. Please login again.");

    logout();
    /////////////////////////////////////////////////////////
  };

  return (

    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h3>
          <i className="bi bi-people"></i> Member Management
        </h3>

        <button
          className="btn btn-success"
          onClick={() => navigate("/chair/add-member")}
        >
          <i className="bi bi-person-plus"></i> Add Member
        </button>

      </div>
      <div className="row mb-3">

            <div className="col-md-6">

                <div className="input-group">

                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, NRC or member number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>

            </div>

        </div>

      <table className="table table-hover">

        <thead className="table-light">

          <tr>
            <th>NRC</th>
            <th>Name</th>
            <th>Member Number</th>
            <th>Status</th>
            <th>Role</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {filteredMembers.map(member => (

            <tr key={member.id}>

              <td>{member.id}</td>
              <td>{member.fullName}</td>
              <td>{member.memberNumber}</td>

              <td>

                {member.status === "active" ? (

                  <span className="badge bg-success">
                    Active
                  </span>

                ) : (

                  <span className="badge bg-secondary">
                    Inactive
                  </span>

                )}

              </td>

              <td>

                {member.role === "chairperson" && (
                  <span className="badge bg-warning text-dark">
                    Chairperson
                  </span>
                )}

                {member.role === "treasurer" && (
                  <span className="badge bg-primary">
                    Treasurer
                  </span>
                )}

                {member.role === "member" && (
                  <span className="badge bg-light text-dark">
                    Member
                  </span>
                )}

              </td>

              <td>
                {new Date(member.joinDate).toLocaleDateString("en-ZM", { year: "numeric", month: "short", day: "numeric" })}
              </td>

              <td>

                <div className="btn-group">

                  {member.role === "member" && (

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => promoteToTreasurer(member.id)}
                    >
                      <i className="bi bi-arrow-up-circle"></i> Make Treasurer
                    </button>

                  )}

                  {member.role !== "chairperson" && (

                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => transferChairperson(member.id)}
                    >
                      <i className="bi bi-person-check"></i> Make Chairperson
                    </button>

                  )}

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => toggleStatus(member.id)}
                  >
                    <i className="bi bi-person-x"></i> {member.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                </div>

              </td>

            </tr>

          ))}
          {filteredMembers.length === 0 && (
                <tr><td colSpan="7" className="text-center text-muted">No members found</td></tr>
            )}
        </tbody>

      </table>

    </div>

  );

};

export default MemberManagement; */