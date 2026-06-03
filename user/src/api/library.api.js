import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createLibraryApi = async (payload) => {
    const token = localStorage.getItem("token");

    // Since our backend uses @UseInterceptors(FilesInterceptor('image')), 
    // we MUST send data as FormData instead of standard JSON.
    const formData = new FormData();
    
    Object.keys(payload).forEach(key => {
        if (key === 'image') {
            // Append all selected images (Array of File objects)
            if (payload.image && payload.image.length > 0) {
                for (let i = 0; i < payload.image.length; i++) {
                    formData.append("image", payload.image[i]);
                }
            }
        } else {
            // Append other text fields
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

export const updateLibraryApi = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${baseUrl}/librarys/${id}`, data, {
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
