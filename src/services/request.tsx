import axios from "axios";

type ApiRequest = {
    method?: 'GET' | 'POST',
    endpoint?: string,
    url: string;
}

export const request = async (request: ApiRequest) => {
    try {
        const { method = 'GET', endpoint, url } = request;

        const axiosRequest = {
            timeout: 30000,
            data: {},
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