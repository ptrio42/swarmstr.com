import {useEffect, useState} from "react";
import {getBitcoinPrice} from "../../services/bitcoinPrice";
import React from 'react';

interface BitcoinPriceProps {
    handlePrice?: (value: number) => void,
    currency?: Currency
}

export type Currency = {
    name: 'usd' | 'eur' | 'gbp' | 'pln',
    symbol: '$' | '€' | '£' | 'zł'
};

export const currencies: Currency[] = [
    {
        name: 'usd',
        symbol: '$'
    },
    {
        name: 'eur',
        symbol: '€'
    },
    {
        name: 'gbp',
        symbol: '£'
    },
    {
        name: 'pln',
        symbol: 'zł'
    }
];

export const BitcoinPrice = ({ handlePrice, currency }: BitcoinPriceProps) => {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  useEffect(() => {
      const fetchBitcoinPrice = async () => {
          if (!currency) {
              currency = currencies[0];
          }
          const bitcoinPrice = await getBitcoinPrice(currency);
          setBitcoinPrice(bitcoinPrice);
          handlePrice && handlePrice(bitcoinPrice);
      };

      fetchBitcoinPrice()
          .catch(console.error);
  }, [currency]);

  return (
      <div>{currency?.symbol} { bitcoinPrice }</div>
  );
};