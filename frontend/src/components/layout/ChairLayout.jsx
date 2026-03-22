// src/layouts/ChairLayout.jsx

import { NavLink, Outlet } from "react-router-dom";
import "../../styles/ChairLayout.css";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/VRecords Images/Print.svg";


const ChairLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="chair-layout-dark">

      {/* SIDEBAR */}
      <aside className="chair-sidebar-dark no-print">
        <div className="sidebar-logo">
              <img src={logo} alt="VRecords Logo" />
        </div>

        <nav className="nav-section">
          <NavLink to="/chair" end className="nav-link-dark">
            Dashboard
          </NavLink>

          <NavLink to="/chair/memberManagement" className="nav-link-dark">
            Governance Control Center
          </NavLink>

          <NavLink to="/chair/add-member" className="nav-link-dark">
            Add Member
          </NavLink>

          <NavLink to="/chair/loan-approvals" className="nav-link-dark">
            Loan Approvals
          </NavLink>

          <NavLink to="/chair/repayments" className="nav-link-dark">
            Repayment Oversight
          </NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="chair-main-dark">

        {/* HEADER */}
        <header className="chair-header-dark no-print">
          <div>
            <span className="user-label">Logged in as:</span>{" "}
            <strong>{user.fullName}</strong>{" "}
            <span className="role-badge">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          <button onClick={logout} className="btn-vrecords-danger">
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <main className="chair-content-dark">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default ChairLayout;


/*import { NavLink, Outlet } from "react-router-dom";
import "../../styles/ChairLayout.css";
import { useAuth } from "../../context/AuthContext";

const ChairLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="chair-layout">
      
      <aside className="chair-sidebar no-print">
        <h2 className="chair-title">Chairperson Panel</h2>

        <nav>
          <NavLink
            to="/chair"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/chair/memberManagement"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Governance Control Center
          </NavLink>
           <NavLink
            to="/chair/add-member"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Add Member
          </NavLink>

          <NavLink
            to="/chair/loan-approvals"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Loan Approvals
          </NavLink>

          <NavLink
            to="/chair/repayments"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Repayment Oversight
          </NavLink>
          
        </nav>
      </aside>
      <div className="chair-main">
        <header className="chair-header no-print">
          <div>
            Logged in as: <strong>{user.fullName}</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </header>
        
        <main className="chair-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default ChairLayout; */