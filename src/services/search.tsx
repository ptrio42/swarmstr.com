import {request} from "./request";

export const getSearchResults = async (query: string): Promise<string[]|void> => {
    try {
        const response = await request({ url: `${process.env.BASE_URL}/search-api/${query}`, timeout: 60000 });
        return response.data;
    } catch (error) {
        console.error({error});
        throw error;
    }
};