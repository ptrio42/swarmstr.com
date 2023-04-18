import {BitcoinPrice} from "..";
import {useFormik} from "formik";
import {useState} from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {currencies, Currency} from "../BitcoinPrice/BitcoinPrice";
import ReactDOM from 'react-dom';
import {PriceReceipt} from "../PriceReceipt/PriceReceipt";
import React from 'react';

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const FiatToSatsCalculator = () => {
    const [bitcoinPrice, setBitcoinPrice] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
        ...currencies[0]
    });
    const [estimatedSats, setEstimatedSats] = useState(0);

    const handleBitcoinPrice = (price: number) => {
      setBitcoinPrice(price);
    };

    const handleFiatAmountChange = (values: { fiatAmount: number }) => {
      const estimatedSats = parseFloat((values.fiatAmount / bitcoinPrice).toFixed(8)) * 100000000;
      setEstimatedSats(Math.floor(estimatedSats));
    };

    const handleCurrencyChange = (currencySymbol: string) => {
        const currency = currencies.find(c => c.symbol === currencySymbol);
        if (currency) {
            setSelectedCurrency(currency);
        }
    };

    const formik = useFormik({
        initialValues: {
            fiatAmount: 0,
            currency: selectedCurrency.symbol
        },
        onSubmit: (values) => {
            handleFiatAmountChange(values);
        }
    });

    return (
      <Card sx={{ maxWidth: '373px' }}>
          <CardContent>
              <Typography variant="h6" component="div">Fiat to <i className="fak fa-satoshisymbol-solidtilt" /> (sats) converter</Typography>
              <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={2}>
                      <Item>
                          <BitcoinPrice handlePrice={handleBitcoinPrice} currency={selectedCurrency} />
                      </Item>
                      <Item>
                          <Input
                              id="fiatAmount"
                              name="fiatAmount"
                              type="number"
                              inputProps={{
                                  step: "0.01"
                              }}
                              startAdornment={
                                  <InputAdornment position="start">
                                      {selectedCurrency.symbol}
                                  </InputAdornment>
                              }
                              placeholder={'Enter amount in ' + selectedCurrency.name.toUpperCase()}
                              value={formik.values.fiatAmount}
                              onChange={formik.handleChange}
                          />
                      </Item>
                      <Item>
                          <TextField
                              id="currency"
                              name="currency"
                              select
                              label="Fiat currency"
                              helperText="Select fiat currency"
                              value={formik.values.currency}
                              onChange={(event: any) => {
                                  formik.handleChange(event);
                                  handleCurrencyChange(event.target.value);
                              }}
                          >
                              {currencies.map((currency) => (
                                  <MenuItem key={currency.name} value={currency.symbol}>{currency.symbol}</MenuItem>
                              ))}
                          </TextField>
                      </Item>
                      <Item>
                          { estimatedSats > 0 &&
                          <Typography variant="body2" component="div">
                              Estimated amount: { estimatedSats } &nbsp;
                              <i className="fak fa-satoshisymbol-solidtilt" />
                          </Typography>}
                      </Item>
                      <Item>
                          <Button sx={{ fontWeight: 'bold' }} variant="contained" type="submit">Convert!</Button>
                      </Item>
                      <Item>
                          <PriceReceipt
                              bitcoinPrice={bitcoinPrice}
                              currencySymbol={selectedCurrency.symbol}
                              fiatAmount={formik.values.fiatAmount}
                              satsAmount={estimatedSats}
                          />
                      </Item>
                  </Stack>
              </form>
          </CardContent>
      </Card>
    );
};

export const init = () => {
    ReactDOM.render(<FiatToSatsCalculator />, document.getElementById('uselessshit-calculator') as HTMLElement);
};