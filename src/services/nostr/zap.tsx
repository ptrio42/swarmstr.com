import React, {useCallback} from "react";
import {requestProvider, WebLNProvider} from "webln";
import NDK, {NDKEvent, zapInvoiceFromEvent} from "@nostr-dev-kit/ndk";
import {NostrEvent} from "nostr-tools";
import lightBolt11Decoder from "light-bolt11-decoder";
import {nFormatter, valueFromTag} from "../../utils/utils";

export const zapEvent = async (
        ndk: NDK,
        event: NDKEvent,
        amount: number,
        callback?: () => void,
        onError?: (error: any) => void,
        comment?: string
    ) => {
        try {
            const zapper = await ndk.zap(event, amount * 1000, {comment});
            // requestProvider()
            //     .then((webln: WebLNProvider) => {
            //         webln.sendPayment(paymentRequest)
            //             .then(() => {
            //                 console.log('zapped');
            //                 // setCurrentEvent(undefined);
            //                 callback && callback();
            //             })
            //             .catch((error) => {
            //                 onError && onError(error);
            //                 console.error(`unable to zap`);
            //                 const a = document.createElement('a');
            //                 a.href = `lightning:${paymentRequest}`;
            //                 a.click();
            //             })
            //     })
            //     .catch((error: any) => {
            //         onError && onError(error);
            //         console.error(`unable to request ln provider`)
            //         const a = document.createElement('a');
            //         a.href = `lightning:${paymentRequest}`;
            //         a.click();
            //     })
        } catch (error: any) {
            onError && onError(error);
            console.error(`problem getting zap request`, {error});

            const zapInvoice = zapInvoiceFromEvent(event);
            console.log('zapInvoice', {zapInvoice})
        }
        // ndk.zap(event, amount * 1000, {comment})
        //     .then((paymentRequest: string | null) => {
        //         console.log('zap request...', {paymentRequest});
        //         if (!paymentRequest) {
        //             onError && onError({message: 'No payment request received.'});
        //             return;
        //         }
        //
        //         requestProvider()
        //             .then((webln: WebLNProvider) => {
        //                 webln.sendPayment(paymentRequest)
        //                     .then(() => {
        //                         console.log('zapped');
        //                         // setCurrentEvent(undefined);
        //                         callback && callback();
        //                     })
        //                     .catch((error) => {
        //                         onError && onError(error);
        //                         console.error(`unable to zap`);
        //                         const a = document.createElement('a');
        //                         a.href = `lightning:${paymentRequest}`;
        //                         a.click();
        //                     })
        //             })
        //             .catch((error: any) => {
        //                 onError && onError(error);
        //                 console.error(`unable to request ln provider`)
        //                 const a = document.createElement('a');
        //                 a.href = `lightning:${paymentRequest}`;
        //                 a.click();
        //             })
        //     })
        //     .catch((error: any) => {
        //         onError && onError(error);
        //         console.error(`problem getting zap request`, {error});
        //
        //         const zapInvoice = zapInvoiceFromEvent(event);
        //         console.log('zapInvoice', {zapInvoice})
        //     })
    };

export const getZapTotal = (events: NostrEvent[]) => {
    const totalZaps = events
        .map((event: NostrEvent) => lightBolt11Decoder.decode(valueFromTag(event, 'bolt11')).sections
            .find((section: any) => section.name === 'amount').value)
        .reduce((total: number, current: number) => total + current / 1000, 0);
    return totalZaps && nFormatter(totalZaps, 1);
};

export const zapAmountFromEvent = (event: NostrEvent) => {
    const amount = lightBolt11Decoder.decode(valueFromTag(event, 'bolt11')).sections
        .find((section: any) => section.name === 'amount').value / 1000;
    return nFormatter(amount, 1);
};

export const getZapper = (event: NostrEvent) => {
    return JSON.parse(valueFromTag(event, 'description')!).pubkey;
};