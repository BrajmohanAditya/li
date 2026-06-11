import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createLibraryApi = async (payload) => {
    const token = localStorage.getItem("token");

    // Since our backend uses @UseInterceptors(FilesInterceptor('image')), 
    // we MUST send data as FormData instead of standard JSON.
    const formData = new FormData();
    
    // Append files
    const files = payload.image || payload.images;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }
    }
    
    // Append other fields
    Object.keys(payload).forEach(key => {
        if (key !== 'image' && key !== 'images') {
            formData.append(key, payload[key]);
        }
    });

    const res = await axios.post(`${baseUrl}/librarys`, formData,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true,
        }
    );

    return res.data;
};

export const getAllLibrariesApi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/librarys/details`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const getAllLibrariesApiInDetails = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/librarys`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const updateLibraryApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${baseUrl}/librarys/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};

export const deleteLibraryApi = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/librarys/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
    });
    return res.data;
};
