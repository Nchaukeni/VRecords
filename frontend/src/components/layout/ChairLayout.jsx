// src/layouts/ChairLayout.jsx

import { NavLink, Outlet } from "react-router-dom";
import "../../styles/ChairLayout.css";
import { useAuth } from "../../context/AuthContext";

const ChairLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="chair-layout">
      {/* Sidebar */}
      <aside className="chair-sidebar">
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
        <header className="chair-header">
          <div>
            Logged in as: <strong>{user.fullName}</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </header>
         {/* Main Content */}
        <main className="chair-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default ChairLayout;