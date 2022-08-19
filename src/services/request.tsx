import axios from "axios";

type ApiRequest = {
    method?: 'GET' | 'POST',
    endpoint?: string,
    url: string;
    body?: any;
}

export const request = async (request: ApiRequest) => {
    try {
        const { method = 'GET', endpoint, url, body } = request;

        const axiosRequest = {
            timeout: 30000,
            ...(body ? { data: body } : {}),
            headers: {},
            method,
            url
        };

        const response = await axios(axiosRequest);
        return response;
    } catch (error) {
        throw error;
    }
};