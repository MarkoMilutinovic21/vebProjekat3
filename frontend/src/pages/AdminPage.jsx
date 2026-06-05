import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllUsers, deleteUser, changeUserRole } from "../services/adminService";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            setMessage("User deleted successfully.");
        } catch (err) {
            setError("Failed to delete user.");
        }
    };

    const handleChangeRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            await changeUserRole(id, newRole);
            setMessage(`Role changed to ${newRole}.`);
            loadUsers();
        } catch (err) {
            setError("Failed to change role.");
        }
    };

    return (
        <div>
            <Link to="/dashboard"><button>Back to Dashboard</button></Link>
            <h2>Admin Panel - User Management</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            {users.map(user => (
                <div key={user.id}>
                    <p>{user.name} - {user.email} - {user.role}</p>
                    <button onClick={() => handleChangeRole(user.id, user.role)}>
                        {user.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default AdminPage;