import { request } from './request';
import { Config } from "../resources/Config";
import {Currency} from "../components/BitcoinPrice/BitcoinPrice";

export const getBitcoinPrice = async (currency: Currency) => {
    const { name = 'usd' } = currency;

    const response = await request({
       url: `${Config.API_COINGECKO_BASE_URL}/coins/bitcoin`
    });
    return response && response.data && response.data.market_data &&
        response.data.market_data.current_price[name];
};