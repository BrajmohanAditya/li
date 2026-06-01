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
                // Do NOT set Content-Type manually for FormData!
                // Axios auto-sets it with the correct multipart boundary.
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true,
        }
    );

    return res.data;
};
