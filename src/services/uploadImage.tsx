import {Config} from "../resources/Config";
import axios from "axios";
import {request} from './request';

// update this to new api
export const uploadImage = async (formData: any) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    const response = await axios.post(`${Config.NOSTR_BUILD_BASE_URL}/upload.php`, formData, {
        headers
    });
    return response && response.data;
};

export const uploadToNostrCheckMe = async (file: any) => {
    const formData = new FormData();
    formData.append('type', 'media');
    formData.append('apikey', '26d075787d261660682fb9d20dbffa538c708b1eda921d0efa2be95fbef4910a')
    formData.append('publicgallery', file);

    const response = await request({
        url: 'https://nostrcheck.me/api/v2/media',
        method: 'POST',
        body: formData
    });

    console.log('nostrcheck.me response data', { data: response.data })

    return response.data?.nip94_event.tags[0][1];
};

export const uploadToNostrBuild = async (file: any) => {
    const formData = new FormData();
    formData.append('file[]', file);

    const response = await request({
        url: 'https://nostr.build/api/v2/upload/files',
        method: 'POST',
        body: formData
    });

    return response.data?.data[0].url;
};