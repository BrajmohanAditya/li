import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createFeatureApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/library-feature`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllFeaturesApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/library-feature`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getFeatureByIdApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/library-feature/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateFeatureApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${baseUrl}/library-feature/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteFeatureApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/library-feature/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getFeaturesByLibraryIdApi = async (libraryId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/library-feature/libraryId/${libraryId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
