import {Config} from "../resources/Config";
import axios from "axios";
import {request} from './request';

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
    const headers = {
        'Content-Type': 'multipart/form-data'
    };

    const formData = new FormData();
    formData.append('type', 'media');
    formData.append('apikey', '26d075787d261660682fb9d20dbffa538c708b1eda921d0efa2be95fbef4910a')
    formData.append('publicgallery', file);
    console.log({formData});

    const response = await request({
        url: 'https://nostrcheck.me/api/media.php',
        method: 'POST',
        body: formData
    });

    console.log({response: response.data});
    return response.data?.URL;
};