import axios, {AxiosRequestHeaders, ResponseType} from "axios";

type ApiRequest = {
    method?: 'GET' | 'POST';
    endpoint?: string;
    url: string;
    body?: any;
    responseType?: ResponseType;
    timeout?: number
}

export const request = async (request: ApiRequest, headers?: AxiosRequestHeaders) => {
    try {
        const { method = 'GET', endpoint, url, body, responseType = 'json', timeout = 60000 } = request;

        const axiosRequest = {
            timeout,
            ...(body ? { data: body } : {}),
            ...(headers ? { headers } : {}),
            method,
            url,
            responseType
        };

        const response = await axios(axiosRequest);
        return response;
    } catch (error) {
        throw error;
    }
};