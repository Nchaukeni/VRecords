import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MemberManagement = () => {

  const { members, setMembers, logout } = useAuth();
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

          {members.map(member => (

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
                {new Date(member.joinDate).toLocaleDateString()}
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

        </tbody>

      </table>

    </div>

  );

};

export default MemberManagement;