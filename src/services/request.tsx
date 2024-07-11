import axios, {AxiosRequestHeaders, ResponseType} from "axios";

type ApiRequest = {
    method?: 'GET' | 'POST';
    endpoint?: string;
    url: string;
    body?: any;
    responseType?: ResponseType;
    timeout?: number;
    maxRedirects?: number;
}

export const request = async (request: ApiRequest, headers?: AxiosRequestHeaders) => {

    // axios.interceptors.response.use((response) => {
    //     // console.log('axios response: ', JSON.stringify(response))
    // }, (error) => {
    //     // console.error('axios response error: ', JSON.stringify(error), {error})
    // })

    try {
        const { method = 'GET', endpoint, url, body, responseType = 'json', timeout = 60000, maxRedirects } = request;

        const axiosRequest = {
            timeout,
            ...(body ? { data: body } : {}),
            ...(headers ? { headers } : {}),
            method,
            url,
            responseType,
            ...(maxRedirects && { maxRedirects })
        };

        const response = await axios(axiosRequest);
        return response;
    } catch (error) {
        console.error('request.tsx: error', {error})
        throw error;
    }
};