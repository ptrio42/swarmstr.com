import {request} from "./request";
import {Config} from "../resources/Config";

export const getBitcoinLatestBlock = async () => {
    const response = await request({
        url: `${Config.API_BLOCKCHAIN_INFO_BASE_URL}/q/getblockcount`
    });
    return response && response.data;
};