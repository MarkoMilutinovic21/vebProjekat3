import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const addExpense = async (expense) => {
    const response = await axios.post(`${API_URL}/api/expenses`, expense, getAuthHeader());
    return response.data;
};

export const updateExpense = async (id, expense) => {
    const response = await axios.put(`${API_URL}/api/expenses/${id}`, expense, getAuthHeader());
    return response.data;
};

export const deleteExpense = async (id) => {
    await axios.delete(`${API_URL}/api/expenses/${id}`, getAuthHeader());
};