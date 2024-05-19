import {request} from "./request";

export const searchImageDatabase = async (query: string, page: number = 1) => {
    try {
        const response = await request({
            url: `https://pixabay.com/api?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&page=${page}`
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};