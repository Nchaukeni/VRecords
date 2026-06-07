import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import ChairRoutes from "./ChairRoutes";
import TreasurerRoutes from "./TreasurerRoutes";
import SuperUserRoutes from "./SuperUserRoutes";
import { ROLES } from "../utils/roles";

export default function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
    );
  }

  const roleMap = {
    [ROLES.CHAIRPERSON]: "/chair",
    [ROLES.TREASURER]: "/treasurer",
    [ROLES.SUPERUSER]: "/superuser"
  };

  return (
      <Routes>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            roleMap[user.role] ? <Navigate to={roleMap[user.role]} replace /> : null
        }
        />

        {/* Chair routes */}
        {user.role === ROLES.CHAIRPERSON && (
          <Route path="/chair/*" element={<ChairRoutes />} />
        )}

        {/* Treasurer routes */}
        {user.role === ROLES.TREASURER && (
          <Route path="/treasurer/*" element={<TreasurerRoutes />} />
        )}

        {/* SuperUser routes */}
        {user.role === ROLES.SUPERUSER && (
          <Route path="/superuser/*" element={<SuperUserRoutes />} />
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

</Routes>

  );
}
