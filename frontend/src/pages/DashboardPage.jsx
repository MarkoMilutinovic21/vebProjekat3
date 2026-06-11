import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPlans, deletePlan } from "../services/travelPlanService";

function DashboardPage() {
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState("");
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await getAllPlans(user.userId);
            setPlans(data);
        } catch (err) {
            setError("Failed to load travel plans.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePlan(id);
            setPlans(plans.filter(p => p.id !== id));
        } catch (err) {
            setError("Failed to delete plan.");
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text)" }}>Welcome, <strong>{user?.name}</strong></span>
                    {user?.role === "admin" && (
                        <Link to="/admin">
                            <button className="secondary">Admin Panel</button>
                        </Link>
                    )}
                    <button className="secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>My Travel Plans</h3>
                <Link to="/plans/new">
                    <button>+ Create New Plan</button>
                </Link>
            </div>

            {error && <p style={{ color: "#ef4444" }}>{error}</p>}

            {plans.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                    <p>No travel plans yet. Create your first one!</p>
                </div>
            )}

            {plans.map(plan => (
                <div className="card" key={plan.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <h4 style={{ margin: "0 0 4px" }}>{plan.title}</h4>
                            <p style={{ fontSize: "14px" }}>{plan.description}</p>
                            <p style={{ fontSize: "13px", marginTop: "8px" }}>
                                {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                            </p>
                            <p style={{ fontSize: "13px" }}>
                                Budget: <strong>{plan.budget}</strong> | Spent: <strong>{plan.totalExpenses}</strong> | Remaining: <strong style={{ color: plan.remainingBudget < 0 ? "#ef4444" : "inherit" }}>{plan.remainingBudget}</strong>
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <Link to={`/plans/${plan.id}`}><button className="secondary">View</button></Link>
                            <Link to={`/plans/${plan.id}/edit`}><button className="secondary">Edit</button></Link>
                            <button className="danger" onClick={() => handleDelete(plan.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardPage;