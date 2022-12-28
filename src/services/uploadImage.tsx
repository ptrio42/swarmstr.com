import {Config} from "../resources/Config";
import axios from "axios";

export const uploadImage = async (formData: any) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    const response = await axios.post(`${Config.NOSTR_BUILD_BASE_URL}/upload.php`, formData, {
        headers
    });
    return response && response.data;
};