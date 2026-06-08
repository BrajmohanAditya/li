import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createSettingApi = async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/settings`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllSettingsApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/settings`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getSettingByIdApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/settings/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateSettingApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${baseUrl}/settings/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteSettingApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/settings/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
