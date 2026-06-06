import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createFeedbackApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/feedback`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllFeedbacksApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/feedback`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getFeedbackByIdApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/feedback/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateFeedbackApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${baseUrl}/feedback/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteFeedbackApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/feedback/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getFeedbacksByLibraryApi = async (libraryId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/feedback/library/${libraryId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
