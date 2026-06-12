import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser, changeUserRole, deleteTravelPlan, getUserTravelPlans } from "../services/adminService";
import { getPlanById } from "../services/travelPlanService";
import jsPDF from "jspdf";

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

    const handleGeneratePdf = async (planId) => {
        try {
            const plan = await getPlanById(planId);
            const doc = new jsPDF();
            let y = 20;

            doc.setFontSize(18);
            doc.text(plan.title, 14, y);
            y += 10;

            doc.setFontSize(11);
            if (plan.description) {
                doc.text(`Description: ${plan.description}`, 14, y);
                y += 8;
            }
            doc.text(`Dates: ${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`, 14, y);
            y += 8;
            doc.text(`Budget: ${plan.budget} | Spent: ${plan.totalExpenses} | Remaining: ${plan.remainingBudget}`, 14, y);
            y += 8;
            if (plan.notes) {
                doc.text(`Notes: ${plan.notes}`, 14, y);
                y += 8;
            }
            y += 4;

            doc.setFontSize(14);
            doc.text("Destinations", 14, y);
            y += 8;
            doc.setFontSize(10);
            if (!plan.destinations || plan.destinations.length === 0) {
                doc.text("No destinations.", 14, y);
                y += 6;
            } else {
                plan.destinations.forEach(d => {
                    doc.text(`${d.name} - ${d.location} (${new Date(d.arrivalDate).toLocaleDateString()} - ${new Date(d.departureDate).toLocaleDateString()})`, 14, y);
                    y += 6;
                });
            }
            y += 4;

            doc.setFontSize(14);
            doc.text("Activities", 14, y);
            y += 8;
            doc.setFontSize(10);
            if (!plan.activities || plan.activities.length === 0) {
                doc.text("No activities.", 14, y);
                y += 6;
            } else {
                plan.activities.forEach(a => {
                    doc.text(`${a.name} - ${new Date(a.date).toLocaleDateString()} ${a.time || ''} | ${a.location || ''} | Status: ${a.status} | Cost: ${a.estimatedCost}`, 14, y);
                    y += 6;
                    if (y > 270) { doc.addPage(); y = 20; }
                });
            }
            y += 4;

            doc.setFontSize(14);
            doc.text("Expenses", 14, y);
            y += 8;
            doc.setFontSize(10);
            if (!plan.expenses || plan.expenses.length === 0) {
                doc.text("No expenses.", 14, y);
                y += 6;
            } else {
                plan.expenses.forEach(e => {
                    doc.text(`${e.name} - ${e.category} - ${e.amount}`, 14, y);
                    y += 6;
                    if (y > 270) { doc.addPage(); y = 20; }
                });
            }
            y += 4;

            doc.setFontSize(14);
            doc.text("Checklist", 14, y);
            y += 8;
            doc.setFontSize(10);
            if (!plan.checklistItems || plan.checklistItems.length === 0) {
                doc.text("No checklist items.", 14, y);
            } else {
                plan.checklistItems.forEach(c => {
                    doc.text(`[${c.isCompleted ? 'x' : ' '}] ${c.name}`, 14, y);
                    y += 6;
                    if (y > 270) { doc.addPage(); y = 20; }
                });
            }

            doc.save(`${plan.title}.pdf`);
        } catch (err) {
            setError("Failed to generate PDF.");
        }
    };

    return (
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner — Admin Panel</h2>
                <Link to="/dashboard"><button className="secondary">Back to Dashboard</button></Link>
            </div>

            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            {message && <p style={{ color: "#22c55e" }}>{message}</p>}

            <h3>User Management</h3>
            {users.map(user => (
                <div className="card" key={user.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <strong>{user.name}</strong>
                            <p style={{ fontSize: "13px" }}>{user.email} — <span style={{ color: user.role === "admin" ? "var(--accent)" : "var(--text)" }}>{user.role}</span></p>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                            <button className="secondary" onClick={() => handleShowPlans(user.id)}>
                                {expandedUser === user.id ? "Hide Plans" : "Show Plans"}
                            </button>
                            <button className="secondary" onClick={() => handleChangeRole(user.id, user.role)}>
                                {user.role === "admin" ? "Make User" : "Make Admin"}
                            </button>
                            <button className="danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </div>
                    </div>

                    {expandedUser === user.id && userPlans[user.id] && (
                        <div style={{ marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                            <h4 style={{ marginBottom: "8px" }}>Travel Plans</h4>
                            {userPlans[user.id].length === 0 && <p style={{ fontSize: "14px" }}>No travel plans.</p>}
                            {userPlans[user.id].map(plan => (
                                <div key={plan.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--accent-bg)", borderRadius: "6px", marginBottom: "6px" }}>
                                    <div>
                                        <strong>{plan.title}</strong>
                                        <p style={{ fontSize: "13px" }}>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <button className="secondary" onClick={() => navigate(`/plans/${plan.id}`, { state: { from: '/admin' } })}>View</button>
                                        <button className="secondary" onClick={() => navigate(`/plans/${plan.id}/edit`, { state: { from: '/admin' } })}>Edit</button>
                                        <button className="secondary" onClick={() => handleGeneratePdf(plan.id)}>PDF</button>
                                        <button className="danger" onClick={() => handleDeletePlan(plan.id, user.id)}>Delete</button>
                                    </div>
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