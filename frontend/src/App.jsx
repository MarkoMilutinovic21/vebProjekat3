import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePlanPage from "./pages/CreatePlanPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import EditPlanPage from "./pages/EditPlanPage";

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/plans/new" element={<PrivateRoute><CreatePlanPage /></PrivateRoute>} />
            <Route path="/plans/:id" element={<PrivateRoute><PlanDetailPage /></PrivateRoute>} />
            <Route path="/plans/:id/edit" element={<PrivateRoute><EditPlanPage /></PrivateRoute>} />
        </Routes>
    );
}

export default App;