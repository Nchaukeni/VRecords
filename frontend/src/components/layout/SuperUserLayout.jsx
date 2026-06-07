import { NavLink, Outlet } from "react-router-dom";
import "../../styles/SuperUserLayout.css";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/VRecords Images/Print.svg";

const SuperUserLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="superuser-layout">
      <header className="superuser-header">
       <div className="sidebar-logo">
            <img src={logo} alt="VRecords Logo" />
        </div>
        <h1>VRecords</h1>
        <button onClick={logout} className="btn-vrecords-danger">
          Logout
        </button>
      </header>
      <main className="superuser-main">
        <Outlet />
      </main>
    </div>
  );
}
export default SuperUserLayout;