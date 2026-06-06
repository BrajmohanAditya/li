import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const getDashboardApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/dashboard`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
