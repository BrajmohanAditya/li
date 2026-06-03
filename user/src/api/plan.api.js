import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createPlanApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/library-price`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deletePlanApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/librarys/details/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllPlansApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/library-price`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getPlansByLibraryApi = async (libraryId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/library-price/library/${libraryId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
