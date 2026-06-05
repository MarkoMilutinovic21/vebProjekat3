import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const createShareToken = async (shareToken) => {
    const response = await axios.post(`${API_URL}/api/share`, shareToken, getAuthHeader());
    return response.data;
};

export const getPlanByShareToken = async (token) => {
    const response = await axios.get(`${API_URL}/api/share/${token}`);
    return response.data;
};

export const updatePlanByShareToken = async (token, plan) => {
    const response = await axios.put(`${API_URL}/api/share/${token}/update`, plan, getAuthHeader());
    return response.data;
};

export const getShareTokenInfo = async (token) => {
    const response = await axios.get(`${API_URL}/api/share/${token}/info`);
    return response.data;
};