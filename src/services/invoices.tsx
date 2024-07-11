import {request} from "./request";

export const createInvoice = async (pubkey: string, name: string) => {
    const response = await request({
        url: `https://nostrich.love/create-invoice`,
        method: 'POST',
        body: {
            pubkey,
	        nip05: name
        }
    });
    return response.data;
};

export const checkName = async (name: string, domain?: string) => {
    const response = await request({
        url: `${process.env.BASE_URL}/api/check-name/${name}?domain=${domain}`,
        method: 'GET'
    });
    return response.data;
};

export const registerName = async (pubkey: string, name: string, domain?: string) => {
    const response = await request({
        url: `${process.env.BASE_URL}/api/register-name?domain=${domain}`,
        method: 'POST',
        body: {
            pubkey,
            name
        }
    });
    return response.data;
};

export const getInvoiceStatus = async (name: string, domain: string) => {
    // try {
        const response = await request({
            url: `${process.env.BASE_URL}/api/invoice-status/${name}?domain=${domain}`,
            method: 'GET'
        });
    //
    //     const { invoiceStatus } = response.data;
    //
    //     if (invoiceStatus === 'pending') {
    //         fallbackTimeout = setTimeout(getInvoiceStatus, getBackoffTime());
    //         return;
    //     } else {
    //         console.log({invoiceStatus});
    //         return { invoiceStatus };
    //     }
    // } catch (error) {
    //     console.error('error fetching status', error);
    //     fallbackTimeout = setTimeout(getInvoiceStatus, getBackoffTime());
    // }
    return response.data;
};
