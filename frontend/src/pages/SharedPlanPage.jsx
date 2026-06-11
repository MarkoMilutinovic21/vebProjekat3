import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanByShareToken, getShareTokenInfo, updatePlanByShareToken } from "../services/shareService";
import { addDestination, deleteDestination } from "../services/destinationService";
import { addActivity, deleteActivity } from "../services/activityService";
import { addExpense, deleteExpense } from "../services/expenseService";
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from "../services/checklistService";
import { useAuth } from "../context/AuthContext";
import ActivityCalendar from "../components/ActivityCalendar";

function SharedPlanPage() {
    const { token } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editData, setEditData] = useState(null);

    const [destination, setDestination] = useState({ name: "", location: "", arrivalDate: "", departureDate: "", description: "" });
    const [activity, setActivity] = useState({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
    const [expense, setExpense] = useState({ name: "", category: "transport", amount: "", date: "", description: "" });
    const [checklistItem, setChecklistItem] = useState({ name: "" });

    useEffect(() => { loadAll(); }, [token]);

    const loadAll = async () => {
        try {
            const [planData, tokenInfo] = await Promise.all([
                getPlanByShareToken(token),
                getShareTokenInfo(token)
            ]);
            setPlan(planData);
            setAccessType(tokenInfo.accessType);

            if (tokenInfo.accessType === "EDIT" && !user) {
                navigate(`/login?redirect=/shared/${token}`);
                return;
            }

            setEditData({
                title: planData.title,
                description: planData.description,
                startDate: planData.startDate.split('T')[0],
                endDate: planData.endDate.split('T')[0],
                budget: planData.budget,
                notes: planData.notes || ""
            });
        } catch (err) {
            setError("Invalid or expired share token.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePlanByShareToken(token, editData);
            setMessage("Plan updated successfully!");
            loadAll();
        } catch (err) {
            setError("Failed to update plan.");
        }
    };

    const handleAddDestination = async (e) => {
        e.preventDefault();
        try {
            await addDestination({ ...destination, travelPlanId: plan.id });
            loadAll();
            setDestination({ name: "", location: "", arrivalDate: "", departureDate: "", description: "" });
        } catch (err) { setError("Failed to add destination."); }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await addActivity({ ...activity, travelPlanId: plan.id, estimatedCost: parseFloat(activity.estimatedCost) });
            loadAll();
            setActivity({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
        } catch (err) { setError("Failed to add activity."); }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await addExpense({ ...expense, travelPlanId: plan.id, amount: parseFloat(expense.amount) });
            loadAll();
            setExpense({ name: "", category: "transport", amount: "", date: "", description: "" });
        } catch (err) { setError("Failed to add expense."); }
    };

    const handleAddChecklistItem = async (e) => {
        e.preventDefault();
        try {
            await addChecklistItem({ name: checklistItem.name, travelPlanId: plan.id });
            loadAll();
            setChecklistItem({ name: "" });
        } catch (err) { setError("Failed to add checklist item."); }
    };

    if (error) return (
        <div className="page" style={{ textAlign: "center", paddingTop: "60px" }}>
            <p style={{ color: "#ef4444", fontSize: "18px" }}>{error}</p>
        </div>
    );
    if (!plan) return <p style={{ textAlign: "center", paddingTop: "60px" }}>Loading...</p>;

    return (
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner</h2>
                <span style={{ fontSize: "13px", padding: "4px 10px", background: "var(--accent-bg)", borderRadius: "4px", color: "var(--accent)" }}>
                    {accessType} Access
                </span>
            </div>

            {error && <p style={{ color: "#ef4444" }}>{error}</p>}

            <div className="card">
                <h3 style={{ margin: "0 0 8px" }}>{plan.title}</h3>
                <p>{plan.description}</p>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </p>
                <div style={{ display: "flex", gap: "24px", marginTop: "12px", padding: "12px", background: "var(--accent-bg)", borderRadius: "6px" }}>
                    <span>Budget: <strong>{plan.budget}</strong></span>
                    <span>Spent: <strong>{plan.totalExpenses}</strong></span>
                    <span>Remaining: <strong style={{ color: plan.remainingBudget < 0 ? "#ef4444" : "inherit" }}>{plan.remainingBudget}</strong></span>
                </div>
                {plan.notes && <p style={{ marginTop: "12px", fontSize: "14px" }}>Notes: {plan.notes}</p>}
            </div>

            {accessType === "EDIT" && user && editData && (
                <div className="card">
                    <h3>Edit Plan</h3>
                    {message && <p style={{ color: "#22c55e" }}>{message}</p>}
                    <form onSubmit={handleUpdate} style={{ maxWidth: "100%" }}>
                        <div><label>Title</label><input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} required /></div>
                        <div><label>Description</label><input type="text" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div><label>Start Date</label><input type="date" value={editData.startDate} onChange={e => setEditData({...editData, startDate: e.target.value})} required /></div>
                            <div><label>End Date</label><input type="date" value={editData.endDate} onChange={e => setEditData({...editData, endDate: e.target.value})} required /></div>
                        </div>
                        <div><label>Budget</label><input type="number" value={editData.budget} onChange={e => setEditData({...editData, budget: e.target.value})} required /></div>
                        <div><label>Notes</label><textarea value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})} /></div>
                        <button type="submit" style={{ width: "100%", marginTop: "8px" }}>Update Plan</button>
                    </form>
                </div>
            )}

            <div className="card">
                <h3>Destinations</h3>
                {accessType === "EDIT" && user && (
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
                )}
                {plan.destinations?.length === 0 && <p style={{ fontSize: "14px" }}>No destinations.</p>}
                {plan.destinations?.map(d => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{d.name}</strong> — {d.location}
                            <p style={{ fontSize: "13px" }}>{new Date(d.arrivalDate).toLocaleDateString()} - {new Date(d.departureDate).toLocaleDateString()}</p>
                            {d.description && <p style={{ fontSize: "13px" }}>{d.description}</p>}
                        </div>
                        {accessType === "EDIT" && user && (
                            <button className="danger" onClick={() => deleteDestination(d.id).then(loadAll)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Activities</h3>
                <ActivityCalendar activities={plan.activities} />
                {accessType === "EDIT" && user && (
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
                )}
                {plan.activities?.length === 0 && <p style={{ fontSize: "14px" }}>No activities.</p>}
                {plan.activities?.map(a => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{a.name}</strong> — {new Date(a.date).toLocaleDateString()} {a.time && `at ${a.time}`}
                            <p style={{ fontSize: "13px" }}>{a.location} | Status: {a.status} | Cost: {a.estimatedCost}</p>
                        </div>
                        {accessType === "EDIT" && user && (
                            <button className="danger" onClick={() => deleteActivity(a.id).then(loadAll)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Expenses</h3>
                {accessType === "EDIT" && user && (
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
                )}
                {plan.expenses?.length === 0 && <p style={{ fontSize: "14px" }}>No expenses.</p>}
                {plan.expenses?.map(e => (
                    <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div>
                            <strong>{e.name}</strong> — {e.category}
                            <p style={{ fontSize: "13px" }}>Amount: {e.amount}</p>
                        </div>
                        {accessType === "EDIT" && user && (
                            <button className="danger" onClick={() => deleteExpense(e.id).then(loadAll)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>

            <div className="card">
                <h3>Checklist</h3>
                {accessType === "EDIT" && user && (
                    <form onSubmit={handleAddChecklistItem} style={{ flexDirection: "row", maxWidth: "100%", display: "flex", gap: "8px" }}>
                        <input type="text" placeholder="Pack passport..." value={checklistItem.name} onChange={e => setChecklistItem({name: e.target.value})} required style={{ flex: 1 }} />
                        <button type="submit">Add</button>
                    </form>
                )}
                {plan.checklistItems?.length === 0 && <p style={{ fontSize: "14px" }}>No checklist items.</p>}
                {plan.checklistItems?.map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input type="checkbox" checked={c.isCompleted} onChange={accessType === "EDIT" && user ? () => toggleChecklistItem(c.id).then(loadAll) : undefined} readOnly={!(accessType === "EDIT" && user)} />
                            <span style={{ textDecoration: c.isCompleted ? 'line-through' : 'none', color: c.isCompleted ? 'var(--text)' : 'var(--text-h)' }}>{c.name}</span>
                        </div>
                        {accessType === "EDIT" && user && (
                            <button className="danger" onClick={() => deleteChecklistItem(c.id).then(loadAll)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SharedPlanPage;