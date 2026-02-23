import { NavLink, Outlet } from "react-router-dom";
import "../../styles/TreasurerLayout.css";
import { useAuth } from "../../context/AuthContext";

const TreasurerLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="treasurer-layout">
      {/* Sidebar */}
      <aside className="treasurer-sidebar">
        <h2 className="treasurer-title">Treasurer Panel</h2>

        <nav>
          <NavLink
            to="/treasurer"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/treasurer/apply-loan"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Apply Loan
          </NavLink>

          <NavLink
            to="/treasurer/loan-portfolio"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Loan Portfolio
          </NavLink>
        </nav>
      </aside>
      <div className="treasurer-main">
        <header className="treasurer-header">
          <div>
            Logged in as: <strong>{user.name}</strong> (Chairperson)
          </div>
          <button onClick={logout} className="logout-btn">
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