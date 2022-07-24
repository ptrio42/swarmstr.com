import {useEffect, useState} from "react";
import {getBitcoinPrice} from "../../services/bitcoinPrice";

export const BitcoinPrice = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  useEffect(() => {
      const fetchBitcoinPrice = async () => {
          const bitcoinPrice = await getBitcoinPrice();
          setBitcoinPrice(bitcoinPrice);
      };

      fetchBitcoinPrice()
          .catch(console.error);
  }, []);

  return (
      <div>${ bitcoinPrice }</div>
  );
};