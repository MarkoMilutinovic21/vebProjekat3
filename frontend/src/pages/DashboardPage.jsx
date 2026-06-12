import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPlans, deletePlan, getPlanById } from "../services/travelPlanService";
import jsPDF from "jspdf";

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
                            <button className="secondary" onClick={() => handleGeneratePdf(plan.id)}>PDF</button>
                            <button className="danger" onClick={() => handleDelete(plan.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardPage;