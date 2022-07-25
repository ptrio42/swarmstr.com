import {useEffect, useState} from "react";
import {getBitcoinPrice} from "../../services/bitcoinPrice";

interface Props {
    handlePrice?: (value: number) => void
}

export const BitcoinPrice = ({ handlePrice }: Props) => {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  useEffect(() => {
      const fetchBitcoinPrice = async () => {
          const bitcoinPrice = await getBitcoinPrice();
          setBitcoinPrice(bitcoinPrice);
          handlePrice && handlePrice(bitcoinPrice);
      };

      fetchBitcoinPrice()
          .catch(console.error);
  }, []);

  return (
      <div>${ bitcoinPrice }</div>
  );
};