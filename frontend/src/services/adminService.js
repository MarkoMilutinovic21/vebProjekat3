import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/api/admin/users`, getAuthHeader());
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/api/admin/users/${id}`, getAuthHeader());
};

export const changeUserRole = async (id, role) => {
    const response = await axios.put(`${API_URL}/api/admin/users/${id}/role`, JSON.stringify(role), {
        ...getAuthHeader(),
        headers: { ...getAuthHeader().headers, 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const getAllTravelPlans = async () => {
    const response = await axios.get(`${API_URL}/api/admin/travel-plans`, getAuthHeader());
    return response.data;
};

export const deleteTravelPlan = async (id) => {
    await axios.delete(`${API_URL}/api/admin/travel-plans/${id}`, getAuthHeader());
};

export const getUserTravelPlans = async (userId) => {
    const response = await axios.get(`${API_URL}/api/admin/users/${userId}/travel-plans`, getAuthHeader());
    return response.data;
};