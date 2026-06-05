import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../services/travelPlanService";

function CreatePlanPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        budget: "",
        notes: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            await createPlan(formData);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data || "Failed to create plan.");
        }
    };

    return (
        <div>
            <h2>Create New Travel Plan</h2>
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
                <button type="submit">Create Plan</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default CreatePlanPage;