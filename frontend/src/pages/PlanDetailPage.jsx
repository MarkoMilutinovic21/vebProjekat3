import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getPlanById } from "../services/travelPlanService";
import { addDestination, deleteDestination } from "../services/destinationService";
import { addActivity, deleteActivity } from "../services/activityService";
import { addExpense, deleteExpense } from "../services/expenseService";
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "../services/checklistService";
import ActivityCalendar from "../components/ActivityCalendar";
import ShareModal from "../components/ShareModal";

function PlanDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/dashboard";
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);

    const [destination, setDestination] = useState({ name: "", location: "", arrivalDate: "", departureDate: "", description: "" });
    const [activity, setActivity] = useState({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
    const [expense, setExpense] = useState({ name: "", category: "transport", amount: "", date: "", description: "" });
    const [checklistItem, setChecklistItem] = useState({ name: "" });

    useEffect(() => { loadPlan(); }, [id]);

    const loadPlan = async () => {
        try {
            const data = await getPlanById(id);
            setPlan(data);
        } catch (err) {
            setError("Failed to load plan.");
        }
    };

    const handleAddDestination = async (e) => {
        e.preventDefault();
        try {
            await addDestination({ ...destination, travelPlanId: parseInt(id) });
            loadPlan();
            setDestination({ name: "", location: "", arrivalDate: "", departureDate: "", description: "" });
        } catch (err) { setError("Failed to add destination."); }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await addActivity({ ...activity, travelPlanId: parseInt(id), estimatedCost: parseFloat(activity.estimatedCost) });
            loadPlan();
            setActivity({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
        } catch (err) { setError("Failed to add activity."); }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await addExpense({ ...expense, travelPlanId: parseInt(id), amount: parseFloat(expense.amount) });
            loadPlan();
            setExpense({ name: "", category: "transport", amount: "", date: "", description: "" });
        } catch (err) { setError("Failed to add expense."); }
    };

    const handleAddChecklistItem = async (e) => {
        e.preventDefault();
        try {
            await addChecklistItem({ name: checklistItem.name, travelPlanId: parseInt(id) });
            loadPlan();
            setChecklistItem({ name: "" });
        } catch (err) { setError("Failed to add checklist item."); }
    };

    if (!plan) return <p>Loading...</p>;

    return (
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setShowShareModal(true)} className="secondary">Share Plan</button>
                    <Link to={from}><button className="secondary">Back</button></Link>
                </div>
            </div>

            {showShareModal && <ShareModal planId={parseInt(id)} onClose={() => setShowShareModal(false)} />}
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}

            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h3 style={{ margin: "0 0 8px" }}>{plan.title}</h3>
                        <p>{plan.description}</p>
                        <p style={{ fontSize: "14px", marginTop: "8px" }}>
                            {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                        </p>
                    </div>
                    <Link to={`/plans/${id}/edit`} state={{ from: from === '/admin' ? '/admin' : `/plans/${id}` }}>
                        <button className="secondary">Edit Plan</button>
                    </Link>
                </div>
                <div style={{ display: "flex", gap: "24px", marginTop: "12px", padding: "12px", background: "var(--accent-bg)", borderRadius: "6px" }}>
                    <span>Budget: <strong>{plan.budget}</strong></span>
                    <span>Spent: <strong>{plan.totalExpenses}</strong></span>
                    <span>Remaining: <strong style={{ color: plan.remainingBudget < 0 ? "#ef4444" : "inherit" }}>{plan.remainingBudget}</strong></span>
                </div>
                {plan.notes && <p style={{ marginTop: "12px", fontSize: "14px" }}>Notes: {plan.notes}</p>}
            </div>

            <div className="card">
                <h3>Destinations</h3>
                <form onSubmit={handleAddDestination} style={{ maxWidth: "100%" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div><label>Name</label><input type="text" placeholder="Paris" value={destination.name} onChange={e => setDestination({...destination, name: e.target.value})} required /></div>
                        <div><label>Location</label><input type="text" placeholder="France" value={destination.location} onChange={e => setDestination({...destination, location: e.target.value})} required /></div>
                        <div><label>Arrival Date</label><input type="date" value={destination.arrivalDate} onChange={e => setDestination({...destination, arrivalDate: e.target.value})} required /></div>
                        <div><label>Departure Date</label><input type="date" value={destination.departureDate} onChange={e => setDestination({...destination, departureDate: e.target.value})} required /></div>
                    </div>
                    <div><label>Description</label><input type="text" placeholder="Description" value={destination.description} onChange={e => setDestination({...destination, description: e.target.value})} /></div>
                    <button type="submit" style={{ marginTop: "8px" }}>Add Destination</button>
                </form>
                {plan.destinations?.map(d => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{d.name}</strong> — {d.location}
                            <p style={{ fontSize: "13px" }}>{new Date(d.arrivalDate).toLocaleDateString()} - {new Date(d.departureDate).toLocaleDateString()}</p>
                        </div>
                        <button className="danger" onClick={() => deleteDestination(d.id).then(loadPlan)}>Delete</button>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Activities</h3>
                <ActivityCalendar activities={plan.activities} />
                <form onSubmit={handleAddActivity} style={{ maxWidth: "100%", marginTop: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div><label>Name</label><input type="text" placeholder="Eiffel Tower Visit" value={activity.name} onChange={e => setActivity({...activity, name: e.target.value})} required /></div>
                        <div><label>Date</label><input type="date" value={activity.date} onChange={e => setActivity({...activity, date: e.target.value})} min={plan.startDate.split('T')[0]} max={plan.endDate.split('T')[0]} required /></div>
                        <div><label>Time</label><input type="time" value={activity.time} onChange={e => setActivity({...activity, time: e.target.value})} /></div>
                        <div><label>Location</label><input type="text" placeholder="Location" value={activity.location} onChange={e => setActivity({...activity, location: e.target.value})} /></div>
                        <div><label>Estimated Cost</label><input type="number" placeholder="0" value={activity.estimatedCost} onChange={e => setActivity({...activity, estimatedCost: e.target.value})} /></div>
                        <div><label>Status</label>
                            <select value={activity.status} onChange={e => setActivity({...activity, status: e.target.value})}>
                                <option value="planned">Planned</option>
                                <option value="reserved">Reserved</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div><label>Description</label><input type="text" placeholder="Description" value={activity.description} onChange={e => setActivity({...activity, description: e.target.value})} /></div>
                    <button type="submit" style={{ marginTop: "8px" }}>Add Activity</button>
                </form>
                {plan.activities?.map(a => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{a.name}</strong> — {new Date(a.date).toLocaleDateString()} {a.time && `at ${a.time}`}
                            <p style={{ fontSize: "13px" }}>{a.location} | Status: {a.status} | Cost: {a.estimatedCost}</p>
                        </div>
                        <button className="danger" onClick={() => deleteActivity(a.id).then(loadPlan)}>Delete</button>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Expenses</h3>
                <form onSubmit={handleAddExpense} style={{ maxWidth: "100%" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div><label>Name</label><input type="text" placeholder="Hotel" value={expense.name} onChange={e => setExpense({...expense, name: e.target.value})} required /></div>
                        <div><label>Category</label>
                            <select value={expense.category} onChange={e => setExpense({...expense, category: e.target.value})}>
                                <option value="transport">Transport</option>
                                <option value="accommodation">Accommodation</option>
                                <option value="food">Food</option>
                                <option value="tickets">Tickets</option>
                                <option value="shopping">Shopping</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div><label>Amount</label><input type="number" placeholder="0" value={expense.amount} onChange={e => setExpense({...expense, amount: e.target.value})} required /></div>
                        <div><label>Date</label><input type="date" value={expense.date} onChange={e => setExpense({...expense, date: e.target.value})} required /></div>
                    </div>
                    <div><label>Description</label><input type="text" placeholder="Description" value={expense.description} onChange={e => setExpense({...expense, description: e.target.value})} /></div>
                    <button type="submit" style={{ marginTop: "8px" }}>Add Expense</button>
                </form>
                {plan.expenses?.map(e => (
                    <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{e.name}</strong> — {e.category}
                            <p style={{ fontSize: "13px" }}>Amount: {e.amount} | {new Date(e.date).toLocaleDateString()}</p>
                        </div>
                        <button className="danger" onClick={() => deleteExpense(e.id).then(loadPlan)}>Delete</button>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Checklist</h3>
                <form onSubmit={handleAddChecklistItem} style={{ flexDirection: "row", maxWidth: "100%", display: "flex", gap: "8px" }}>
                    <input type="text" placeholder="Pack passport..." value={checklistItem.name} onChange={e => setChecklistItem({name: e.target.value})} required style={{ flex: 1 }} />
                    <button type="submit">Add</button>
                </form>
                {plan.checklistItems?.map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input type="checkbox" checked={c.isCompleted} onChange={() => toggleChecklistItem(c.id).then(loadPlan)} />
                            <span style={{ textDecoration: c.isCompleted ? 'line-through' : 'none', color: c.isCompleted ? 'var(--text)' : 'var(--text-h)' }}>{c.name}</span>
                        </div>
                        <button className="danger" onClick={() => deleteChecklistItem(c.id).then(loadPlan)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlanDetailPage;