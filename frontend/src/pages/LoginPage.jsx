import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await login(formData.email, formData.password);
            loginUser(data);
            const params = new URLSearchParams(location.search);
            const redirect = params.get('redirect');
            navigate(redirect || "/dashboard");
        } catch (err) {
            setError("Invalid email or password.");
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
                <p style={{ textAlign: "center", marginBottom: "24px", fontSize: "14px" }}>Plan your next adventure</p>
                <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    {error && <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>}
                    <button type="submit" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>Login</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--accent)" }}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;