import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import ChairRoutes from "./ChairRoutes";
import TreasurerRoutes from "./TreasurerRoutes";
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

  return (
      <Routes>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            user.role === ROLES.CHAIRPERSON
              ? <Navigate to="/chair" replace />
              : <Navigate to="/treasurer" replace />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

</Routes>

  );
}
