import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const addActivity = async (activity) => {
    const response = await axios.post(`${API_URL}/api/activities`, activity, getAuthHeader());
    return response.data;
};

export const updateActivity = async (id, activity) => {
    const response = await axios.put(`${API_URL}/api/activities/${id}`, activity, getAuthHeader());
    return response.data;
};

export const deleteActivity = async (id) => {
    await axios.delete(`${API_URL}/api/activities/${id}`, getAuthHeader());
};