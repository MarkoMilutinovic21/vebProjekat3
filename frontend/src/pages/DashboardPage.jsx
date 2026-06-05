import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPlans, deletePlan } from "../services/travelPlanService";
import { Link } from "react-router-dom";

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
        <div>
            <div>
                <h2>Welcome, {user?.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div>
                <h3>My Travel Plans</h3>
                <Link to="/plans/new"><button>Create New Plan</button></Link>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {plans.map(plan => (
                <div key={plan.id}>
                    <h4>{plan.title}</h4>
                    <p>{plan.description}</p>
                    <p>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
                    <p>Budget: {plan.budget} | Spent: {plan.totalExpenses} | Remaining: {plan.remainingBudget}</p>
                    <Link to={`/plans/${plan.id}`}><button>View</button></Link>
                    <Link to={`/plans/${plan.id}/edit`}><button>Edit</button></Link>
                    <button onClick={() => handleDelete(plan.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default DashboardPage;