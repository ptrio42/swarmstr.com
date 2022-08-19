import {request} from "./request";
import {Config} from "../resources/Config";

export const createLightningGift = async (amount: number) => {
    const response = await request({
        url: `${Config.API_LIGHTNING_GIFTS_BASE_URL}/create`,
        method: 'POST',
        body: {
            amount
        }
    });
    return response && response.data;
};