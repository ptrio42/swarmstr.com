import axios, {AxiosRequestHeaders} from "axios";

type ApiRequest = {
    method?: 'GET' | 'POST',
    endpoint?: string,
    url: string;
    body?: any;
}

export const request = async (request: ApiRequest, headers?: AxiosRequestHeaders) => {
    try {
        const { method = 'GET', endpoint, url, body } = request;

        const axiosRequest = {
            timeout: 30000,
            ...(body ? { data: body } : {}),
            ...(headers ? { headers } : {}),
            method,
            url
        };

        const response = await axios(axiosRequest);
        return response;
    } catch (error) {
        throw error;
    }
};