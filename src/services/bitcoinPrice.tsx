import { request } from './request';
import { Config } from "../resources/Config";

export const getBitcoinPrice = async () => {
    const response = await request({
       url: `${Config.API_COINGECKO_BASE_URL}/coins/bitcoin`
    });
    return response && response.data && response.data.market_data && response.data.market_data.current_price.usd;
};