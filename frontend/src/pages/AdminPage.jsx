import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser, changeUserRole, deleteTravelPlan, getUserTravelPlans } from "../services/adminService";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [userPlans, setUserPlans] = useState({});
    const [expandedUser, setExpandedUser] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users.");
        }
    };

    const handleShowPlans = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }
        try {
            const plans = await getUserTravelPlans(userId);
            setUserPlans({ ...userPlans, [userId]: plans });
            setExpandedUser(userId);
        } catch (err) {
            setError("Failed to load plans.");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            setMessage("User deleted successfully.");
        } catch (err) {
            setError("Failed to delete user.");
        }
    };

    const handleChangeRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            await changeUserRole(id, newRole);
            setMessage(`Role changed to ${newRole}.`);
            loadUsers();
        } catch (err) {
            setError("Failed to change role.");
        }
    };

    const handleDeletePlan = async (planId, userId) => {
        try {
            await deleteTravelPlan(planId);
            setUserPlans({
                ...userPlans,
                [userId]: userPlans[userId].filter(p => p.id !== planId)
            });
            setMessage("Travel plan deleted successfully.");
        } catch (err) {
            setError("Failed to delete travel plan.");
        }
    };

    return (
        <div>
            <Link to="/dashboard"><button>Back to Dashboard</button></Link>
            <h2>Admin Panel</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <h3>User Management</h3>
            {users.map(user => (
                <div key={user.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <p><strong>{user.name}</strong> - {user.email} - {user.role}</p>
                    <button onClick={() => handleShowPlans(user.id)}>
                        {expandedUser === user.id ? "Hide Plans" : "Show Plans"}
                    </button>
                    <button onClick={() => handleChangeRole(user.id, user.role)}>
                        {user.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>

                    {expandedUser === user.id && userPlans[user.id] && (
                        <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                            <h4>Travel Plans:</h4>
                            {userPlans[user.id].length === 0 && <p>No travel plans.</p>}
                            {userPlans[user.id].map(plan => (
                                <div key={plan.id} style={{ border: "1px solid #eee", padding: "5px", marginBottom: "5px" }}>
                                    <p>{plan.title} - {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
                                    <button onClick={() => navigate(`/plans/${plan.id}/edit`)}>Edit</button>
                                    <button onClick={() => handleDeletePlan(plan.id, user.id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AdminPage;