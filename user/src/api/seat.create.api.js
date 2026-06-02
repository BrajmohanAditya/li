import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSheetApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/sheets`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllSheetsApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/sheets`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getSheetByIdApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/sheets/library/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateSheetApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${baseUrl}/sheets/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteSheetApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/sheets/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
