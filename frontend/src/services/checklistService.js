import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const addChecklistItem = async (item) => {
    const response = await axios.post(`${API_URL}/api/checklist`, item, getAuthHeader());
    return response.data;
};

export const toggleChecklistItem = async (id) => {
    const response = await axios.put(`${API_URL}/api/checklist/${id}/toggle`, {}, getAuthHeader());
    return response.data;
};

export const deleteChecklistItem = async (id) => {
    await axios.delete(`${API_URL}/api/checklist/${id}`, getAuthHeader());
};