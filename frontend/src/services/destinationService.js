import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const addDestination = async (destination) => {
    const response = await axios.post(`${API_URL}/api/destinations`, destination, getAuthHeader());
    return response.data;
};

export const updateDestination = async (id, destination) => {
    const response = await axios.put(`${API_URL}/api/destinations/${id}`, destination, getAuthHeader());
    return response.data;
};

export const deleteDestination = async (id) => {
    await axios.delete(`${API_URL}/api/destinations/${id}`, getAuthHeader());
};