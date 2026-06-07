import { Routes, Route, Navigate } from "react-router-dom";
import  SuperUserLayout from "../components/layout/SuperUserLayout";
import  SuperUserDashboard from "../pages/SuperUser/SuperUserDashboard.jsx";

const SuperUserRoutes = () => {
    return (<>
        <Routes>
            <Route path="/" element={<SuperUserLayout />}>
                <Route index element={<SuperUserDashboard />} />
                {/* Future routes for superuser management can be added here */}
            </Route>
        </Routes>
    </>)
}
export default SuperUserRoutes;