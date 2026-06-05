import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlanByShareToken, getShareTokenInfo, updatePlanByShareToken } from "../services/shareService";

function SharedPlanPage() {
    const { token } = useParams();
    const [plan, setPlan] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        loadAll();
    }, [token]);

    const loadAll = async () => {
        try {
            const [planData, tokenInfo] = await Promise.all([
                getPlanByShareToken(token),
                getShareTokenInfo(token)
            ]);
            setPlan(planData);
            setAccessType(tokenInfo.accessType);
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

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!plan) return <p>Loading...</p>;

    return (
        <div>
            <h2>{plan.title}</h2>
            <p>{plan.description}</p>
            <p>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
            <p>Budget: {plan.budget} | Spent: {plan.totalExpenses} | Remaining: {plan.remainingBudget}</p>
            <p>Notes: {plan.notes}</p>
            <p>Access: <strong>{accessType}</strong></p>

            {accessType === "EDIT" && (
                <div>
                    <h3>Edit Plan</h3>
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Title</label>
                            <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} required />
                        </div>
                        <div>
                            <label>Description</label>
                            <input type="text" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
                        </div>
                        <div>
                            <label>Start Date</label>
                            <input type="date" value={editData.startDate} onChange={e => setEditData({...editData, startDate: e.target.value})} required />
                        </div>
                        <div>
                            <label>End Date</label>
                            <input type="date" value={editData.endDate} onChange={e => setEditData({...editData, endDate: e.target.value})} required />
                        </div>
                        <div>
                            <label>Budget</label>
                            <input type="number" value={editData.budget} onChange={e => setEditData({...editData, budget: e.target.value})} required />
                        </div>
                        <div>
                            <label>Notes</label>
                            <textarea value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})} />
                        </div>
                        <button type="submit">Update Plan</button>
                    </form>
                </div>
            )}

            <h3>Destinations</h3>
            {plan.destinations?.map(d => (
                <div key={d.id}>
                    <p>{d.name} - {d.location}</p>
                    <p>{new Date(d.arrivalDate).toLocaleDateString()} - {new Date(d.departureDate).toLocaleDateString()}</p>
                    <p>{d.description}</p>
                </div>
            ))}

            <h3>Activities</h3>
            {plan.activities?.map(a => (
                <div key={a.id}>
                    <p>{a.name} - {new Date(a.date).toLocaleDateString()} - {a.time}</p>
                    <p>{a.location} - {a.status}</p>
                    <p>{a.description}</p>
                </div>
            ))}

            <h3>Expenses</h3>
            {plan.expenses?.map(e => (
                <div key={e.id}>
                    <p>{e.name} - {e.category} - {e.amount}</p>
                </div>
            ))}

            <h3>Checklist</h3>
            {plan.checklistItems?.map(c => (
                <div key={c.id}>
                    <input type="checkbox" checked={c.isCompleted} readOnly />
                    <span style={{ textDecoration: c.isCompleted ? 'line-through' : 'none' }}>{c.name}</span>
                </div>
            ))}
        </div>
    );
}

export default SharedPlanPage;