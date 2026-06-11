import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getPlanById, updatePlan } from "../services/travelPlanService";

function EditPlanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || `/plans/${id}`;
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
            navigate(from);
        } catch (err) {
            setError(err.response?.data || "Failed to update plan.");
        }
    };

    return (
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner</h2>
                <button className="secondary" onClick={() => navigate(-1)}>Back</button>
            </div>

            <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "32px" }}>
                <h3 style={{ marginBottom: "24px" }}>Edit Travel Plan</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
                    <div>
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label>Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label>Budget</label>
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange} required min="0" />
                    </div>
                    <div>
                        <label>Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}
                    <button type="submit" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>Update Plan</button>
                </form>
            </div>
        </div>
    );
}

export default EditPlanPage;