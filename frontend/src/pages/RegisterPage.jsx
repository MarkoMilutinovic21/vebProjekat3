import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await register(formData.name, formData.email, formData.password);
            loginUser(data);
            navigate("/dashboard");
        } catch (err) {
            setError("Registration failed. Email may already be in use.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div className="card" style={{ width: "400px", padding: "32px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "4px" }}>TravelPlanner</h2>
                <p style={{ textAlign: "center", marginBottom: "24px", fontSize: "14px" }}>Create your account</p>
                <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}
                    <button type="submit" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>Register</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;