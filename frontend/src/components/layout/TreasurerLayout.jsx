import { NavLink, Outlet } from "react-router-dom";
import "../../styles/TreasurerLayout.css";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/VRecords Images/Print.svg";

const TreasurerLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="treasurer-layout">
      {/* Sidebar */}
      <aside className="treasurer-sidebar no-print">
         <div className="sidebar-logo">
              <img src={logo} alt="VRecords Logo" />
          </div>

        <nav className="nav-section">
          <NavLink
            to="/treasurer"
            end
            className="nav-link-dark"
          >
            Dashboard
          </NavLink>

           <NavLink
            to="/treasurer/buy-shares"
            className="nav-link-dark"
          >
            Shares Portal
          </NavLink>

          <NavLink
            to="/treasurer/share-settings"
            className="nav-link-dark"
          >
            Share Configuarations
          </NavLink>
          
          <NavLink
            to="/treasurer/apply-loan"
            className="nav-link-dark"
          >
            Apply Loan
          </NavLink>

          <NavLink
            to="/treasurer/loan-portfolio"
            className="nav-link-dark"
          >
            Loan Portfolio
          </NavLink>
        </nav>
      </aside>
      <div className="treasurer-main">
        <header className="treasurer-header-dark no-print">
          <div>
              <span className="user-label">Logged in as:</span>{" "}
              <strong>{user.fullName}</strong>{" "}
              <span className="role-badge">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
          </div>
          <button onClick={logout} className=" btn-vrecords-danger">
            Logout
          </button>
        </header>
         {/* Main Content */}
        <main className="treasurer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TreasurerLayout;