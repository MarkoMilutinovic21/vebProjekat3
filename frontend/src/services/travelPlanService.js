import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllPlans = async (userId) => {
    const response = await axios.get(`${API_URL}/api/travel-plans?userId=${userId}`, getAuthHeader());
    return response.data;
};

export const getPlanById = async (id) => {
    const response = await axios.get(`${API_URL}/api/travel-plans/${id}`, getAuthHeader());
    return response.data;
};

export const createPlan = async (plan) => {
    const userId = localStorage.getItem('userId');
    const response = await axios.post(`${API_URL}/api/travel-plans?userId=${userId}`, plan, getAuthHeader());
    return response.data;
};

export const updatePlan = async (id, plan) => {
    const response = await axios.put(`${API_URL}/api/travel-plans/${id}`, plan, getAuthHeader());
    return response.data;
};

export const deletePlan = async (id) => {
    await axios.delete(`${API_URL}/api/travel-plans/${id}`, getAuthHeader());
};