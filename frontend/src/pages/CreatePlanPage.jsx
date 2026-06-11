import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        <div className="page">
            <div className="navbar">
                <h2 style={{ margin: 0 }}>TravelPlanner</h2>
                <Link to="/dashboard"><button className="secondary">Back to Dashboard</button></Link>
            </div>

            <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "32px" }}>
                <h3 style={{ marginBottom: "24px" }}>Create New Travel Plan</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
                    <div>
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="My Trip to Paris" />
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Short description" />
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
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange} required placeholder="0" min="0" />
                    </div>
                    <div>
                        <label>Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any additional notes..." />
                    </div>
                    {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}
                    <button type="submit" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>Create Plan</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePlanPage;