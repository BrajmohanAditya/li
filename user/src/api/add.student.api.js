import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const addStudentApi = async (payload) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/users/create`, payload,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true,
        }
    )

    return res.data
};

export const getAllStudentsApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/users?limit=1000`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteStudentApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/users/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
