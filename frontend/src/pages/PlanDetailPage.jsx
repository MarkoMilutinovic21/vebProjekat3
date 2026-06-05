import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);

    const [destination, setDestination] = useState({ name: "", location: "", arrivalDate: "", departureDate: "", description: "" });
    const [activity, setActivity] = useState({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
    const [expense, setExpense] = useState({ name: "", category: "transport", amount: "", date: "", description: "" });
    const [checklistItem, setChecklistItem] = useState({ name: "" });

    useEffect(() => {
        loadPlan();
    }, [id]);

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
        } catch (err) {
            setError("Failed to add destination.");
        }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await addActivity({ ...activity, travelPlanId: parseInt(id), estimatedCost: parseFloat(activity.estimatedCost) });
            loadPlan();
            setActivity({ name: "", date: "", time: "", location: "", description: "", estimatedCost: "", status: "planned" });
        } catch (err) {
            setError("Failed to add activity.");
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await addExpense({ ...expense, travelPlanId: parseInt(id), amount: parseFloat(expense.amount) });
            loadPlan();
            setExpense({ name: "", category: "transport", amount: "", date: "", description: "" });
        } catch (err) {
            setError("Failed to add expense.");
        }
    };

    const handleAddChecklistItem = async (e) => {
        e.preventDefault();
        try {
            await addChecklistItem({ name: checklistItem.name, travelPlanId: parseInt(id) });
            loadPlan();
            setChecklistItem({ name: "" });
        } catch (err) {
            setError("Failed to add checklist item.");
        }
    };

    if (!plan) return <p>Loading...</p>;

    return (
        <div>
            <Link to="/dashboard"><button>Back</button></Link>
            <h2>{plan.title}</h2>
            <p>{plan.description}</p>
            <p>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
            <p>Budget: {plan.budget} | Spent: {plan.totalExpenses} | Remaining: {plan.remainingBudget}</p>
            <p>Notes: {plan.notes}</p>

            <button onClick={() => setShowShareModal(true)}>Share Plan</button>
            {showShareModal && <ShareModal planId={parseInt(id)} onClose={() => setShowShareModal(false)} />}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Destinations</h3>
            <form onSubmit={handleAddDestination}>
                <input type="text" placeholder="Name" value={destination.name} onChange={e => setDestination({...destination, name: e.target.value})} required />
                <input type="text" placeholder="Location" value={destination.location} onChange={e => setDestination({...destination, location: e.target.value})} required />
                <input type="date" value={destination.arrivalDate} onChange={e => setDestination({...destination, arrivalDate: e.target.value})} required />
                <input type="date" value={destination.departureDate} onChange={e => setDestination({...destination, departureDate: e.target.value})} required />
                <input type="text" placeholder="Description" value={destination.description} onChange={e => setDestination({...destination, description: e.target.value})} />
                <button type="submit">Add Destination</button>
            </form>
            {plan.destinations?.map(d => (
                <div key={d.id}>
                    <p>{d.name} - {d.location}</p>
                    <button onClick={() => deleteDestination(d.id).then(loadPlan)}>Delete</button>
                </div>
            ))}

            <h3>Activities</h3>
            <ActivityCalendar activities={plan.activities} />
            <form onSubmit={handleAddActivity}>
                <input type="text" placeholder="Name" value={activity.name} onChange={e => setActivity({...activity, name: e.target.value})} required />
               <input 
                    type="date" 
                    value={activity.date} 
                    onChange={e => setActivity({...activity, date: e.target.value})} 
                    min={plan.startDate.split('T')[0]}
                    max={plan.endDate.split('T')[0]}
                    required 
                />
                <input type="time" value={activity.time} onChange={e => setActivity({...activity, time: e.target.value})} />
                <input type="text" placeholder="Location" value={activity.location} onChange={e => setActivity({...activity, location: e.target.value})} />
                <input type="text" placeholder="Description" value={activity.description} onChange={e => setActivity({...activity, description: e.target.value})} />
                <input type="number" placeholder="Cost" value={activity.estimatedCost} onChange={e => setActivity({...activity, estimatedCost: e.target.value})} />
                <select value={activity.status} onChange={e => setActivity({...activity, status: e.target.value})}>
                    <option value="planned">Planned</option>
                    <option value="reserved">Reserved</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button type="submit">Add Activity</button>
            </form>
            {plan.activities?.map(a => (
                <div key={a.id}>
                    <p>{a.name} - {new Date(a.date).toLocaleDateString()} - {a.status}</p>
                    <button onClick={() => deleteActivity(a.id).then(loadPlan)}>Delete</button>
                </div>
            ))}

            <h3>Expenses</h3>
            <form onSubmit={handleAddExpense}>
                <input type="text" placeholder="Name" value={expense.name} onChange={e => setExpense({...expense, name: e.target.value})} required />
                <select value={expense.category} onChange={e => setExpense({...expense, category: e.target.value})}>
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="food">Food</option>
                    <option value="tickets">Tickets</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                </select>
                <input type="number" placeholder="Amount" value={expense.amount} onChange={e => setExpense({...expense, amount: e.target.value})} required />
                <input type="date" value={expense.date} onChange={e => setExpense({...expense, date: e.target.value})} required />
                <input type="text" placeholder="Description" value={expense.description} onChange={e => setExpense({...expense, description: e.target.value})} />
                <button type="submit">Add Expense</button>
            </form>
            {plan.expenses?.map(e => (
                <div key={e.id}>
                    <p>{e.name} - {e.category} - {e.amount}</p>
                    <button onClick={() => deleteExpense(e.id).then(loadPlan)}>Delete</button>
                </div>
            ))}

            <h3>Checklist</h3>
            <form onSubmit={handleAddChecklistItem}>
                <input type="text" placeholder="Item name" value={checklistItem.name} onChange={e => setChecklistItem({name: e.target.value})} required />
                <button type="submit">Add Item</button>
            </form>
            {plan.checklistItems?.map(c => (
                <div key={c.id}>
                    <input type="checkbox" checked={c.isCompleted} onChange={() => toggleChecklistItem(c.id).then(loadPlan)} />
                    <span style={{ textDecoration: c.isCompleted ? 'line-through' : 'none' }}>{c.name}</span>
                    <button onClick={() => deleteChecklistItem(c.id).then(loadPlan)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default PlanDetailPage;