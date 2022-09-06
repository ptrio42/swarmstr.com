import {jsPDF} from "jspdf";
import {useState} from "react";
import {LoadingAnimation} from "../LoadingAnimation/LoadingAnimation";
import React from "react";
import Button from "@mui/material/Button";

interface PriceReceiptProps {
    bitcoinPrice: number;
    currencySymbol: string;
    fiatAmount: number;
    satsAmount: number;
}

export const PriceReceipt = ({ bitcoinPrice, currencySymbol, fiatAmount, satsAmount }: PriceReceiptProps) => {
    const receipt = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2]
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleIsLoading = (isLoading: boolean) => {
        setIsLoading(isLoading);
    };

    const downloadReceipt = async () => {
        handleIsLoading(true);
        receipt.setFont('Merriweather');

        const imageData: any = new Image();
        imageData.src = process.env.PUBLIC_URL + '/images/bitcoin.png';

        receipt.addImage({
            imageData,
            x: 1.5,
            y: 0.175,
            width: 0.5,
            height: 0.5,
        });
        receipt.setFontSize(16);
        receipt.text('Bitcoin Purchase', 1.75, 0.95, { align: 'center' });

        receipt.setFontSize(14);
        receipt.text(`${satsAmount.toLocaleString('en-US')} sats`, 1.75, 1.25, { align: 'center' });
        receipt.text(`at ${currencySymbol}${bitcoinPrice}`, 1.75, 1.45, { align: 'center' });
        receipt.text(`~ ${currencySymbol}${fiatAmount}`, 1.75, 1.65, { align: 'center' });
        receipt.text(`${new Date().toLocaleDateString('en-US')}`, 1.75, 1.85, { align: 'center' });

        handleIsLoading(false);
        receipt.save('receipt.pdf')
    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                onClick={downloadReceipt}
                disabled={satsAmount === 0 || bitcoinPrice === 0 || fiatAmount === 0}
                color="secondary"
            >Get Receipt!</Button>
            <LoadingAnimation isLoading={isLoading} />
        </React.Fragment>
    );
};