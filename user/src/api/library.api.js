import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const createLibraryApi = async (payload) => {
    const token = localStorage.getItem("token");

    // Since our backend uses @UseInterceptors(FilesInterceptor('image')), 
    // we MUST send data as FormData instead of standard JSON.
    const formData = new FormData();
    
    Object.keys(payload).forEach(key => {
        if (key === 'image') {
            // Append all selected images (FileList object)
            if (payload.image && payload.image.length > 0) {
                console.log(`✅ Appending ${payload.image.length} image(s) to FormData...`);
                for (let i = 0; i < payload.image.length; i++) {
                    console.log(`- Image ${i + 1}:`, payload.image[i].name);
                    formData.append("image", payload.image[i]);
                }
            } else {
                console.log("❌ No images found in payload.image");
            }
        } else {
            // Append other text fields
            formData.append(key, payload[key]);
        }
    });

    // To verify formData contents in the browser console
    for (let [key, value] of formData.entries()) {
        if (key === 'image') {
            console.log(`📦 FormData contains image:`, value.name);
        }
    }

    const res = await axios.post(`${baseUrl}/librarys`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true,
        }
    );

    return res.data;
};
