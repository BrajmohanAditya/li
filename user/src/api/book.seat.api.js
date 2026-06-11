import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createBookingApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/bookings/manual`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllBookingsApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/bookings`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getBookingByIdApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/bookings/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getBookingsByLibraryApi = async (libraryId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/bookings/library/${libraryId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateBookingApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${baseUrl}/bookings/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteBookingApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/bookings/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
