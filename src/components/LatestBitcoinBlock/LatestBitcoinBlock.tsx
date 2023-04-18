import {useEffect, useState} from "react";
import {getBitcoinLatestBlock} from "../../services/bitcoinLatestBlock";
import {AccessTime} from "@mui/icons-material";
import {Box} from "@mui/material";
import React from 'react';

interface LatestBitcoinBlockProps {
    handleBlock?: (value: number) => void
}

export const LatestBitcoinBlock = ({ handleBlock } : LatestBitcoinBlockProps) => {
    const [latestBlock, setLatestBlock] = useState(0);

    useEffect(() => {
        const fetchLatestBlock = async () => {

            const latestBlock = await getBitcoinLatestBlock();
            setLatestBlock(latestBlock);
            handleBlock && handleBlock(latestBlock);
        };

        fetchLatestBlock()
            .catch(console.error);
    }, []);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}><AccessTime />{ latestBlock }</Box>
    );
};