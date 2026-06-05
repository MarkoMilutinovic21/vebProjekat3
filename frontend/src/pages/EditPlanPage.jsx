import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById, updatePlan } from "../services/travelPlanService";

function EditPlanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        budget: "",
        notes: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        loadPlan();
    }, [id]);

    const loadPlan = async () => {
        try {
            const data = await getPlanById(id);
            setFormData({
                title: data.title,
                description: data.description,
                startDate: data.startDate.split('T')[0],
                endDate: data.endDate.split('T')[0],
                budget: data.budget,
                notes: data.notes || ""
            });
        } catch (err) {
            setError("Failed to load plan.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            setError("End date cannot be before start date.");
            return;
        }

        if (parseFloat(formData.budget) < 0) {
            setError("Budget cannot be negative.");
            return;
        }

        try {
            await updatePlan(id, formData);
            navigate(`/plans/${id}`);
        } catch (err) {
            setError(err.response?.data || "Failed to update plan.");
        }
    };

    return (
        <div>
            <h2>Edit Travel Plan</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Budget</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} />
                </div>
                <button type="submit">Update Plan</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default EditPlanPage;