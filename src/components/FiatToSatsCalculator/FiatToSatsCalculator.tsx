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
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    ...theme.typography.body2
}));

export const FiatToSatsCalculator = () => {
    const [bitcoinPrice, setBitcoinPrice] = useState(0);
    const [estimatedSats, setEstimatedSats] = useState(0);

    const handleBitcoinPrice = (price: number) => {
      setBitcoinPrice(price);
    };

    const handleFiatAmountChange = (values: { fiatAmount: number }) => {
      console.log({amount: values.fiatAmount});
      const estimatedSats = parseFloat((values.fiatAmount / bitcoinPrice).toFixed(8)) * 100000000;
      setEstimatedSats(estimatedSats);
    };

    const formik = useFormik({
        initialValues: {
            fiatAmount: 0
        },
        onSubmit: (values) => {
            handleFiatAmountChange(values);
        }
    });

    return (
      <Card sx={{ maxWidth: '373px' }}>
          <CardContent>
              <Typography variant="h6" component="div">Fiat (USD) to sats converter</Typography>
              <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={2}>
                      <Item>
                          <BitcoinPrice handlePrice={handleBitcoinPrice} />
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
                                      $
                                  </InputAdornment>
                              }
                              placeholder="Enter amount in USD"
                              value={formik.values.fiatAmount}
                              onChange={formik.handleChange}
                          />
                      </Item>
                      <Item>
                          { estimatedSats > 0 && <Typography variant="body2" component="div">Estimated sats: { estimatedSats }</Typography>}
                      </Item>
                      <Item>
                          <Button sx={{ fontWeight: 'bold' }} variant="contained" type="submit">Convert!</Button>
                      </Item>
                  </Stack>
              </form>
          </CardContent>
      </Card>
    );
};