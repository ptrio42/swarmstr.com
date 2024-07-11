import {nip19} from 'nostr-tools';
import {Config} from "../../src/resources/Config";
import {request} from "../../src/services/request";

export const ZebedeePaymentProcessor = () => {

}

export const getInvoice = async () => {};

const requestCharge = async (body: any) => {
    try {
        const response = await request({
            method: 'POST',
            body,
            url: 'https://api.zebedee.io/v0/charges',
            maxRedirects: 1,
        }, {
            'Content-Type': 'application/json',
            // 'Accept': 'application/json',
            // @ts-ignore
            'apikey': process.env.ZEBEDEE_API_KEY
        });
        return response;
    } catch (e) {
        console.error('ZebedeePaymentProcessor.tsx: error', e)
        throw e;
    }
};

export const createInvoice = async (pool: any, amount: number, pubkey: string, nip05: string, domain?: string, description?: string, requestId?: string) => {
    // Convert the pubkey to hex if needed
    pubkey = new RegExp(/(npub)/).test(pubkey) ? nip19.decode(pubkey).data as string : pubkey;
    // nip05 handle to lower case
    nip05 = nip05.toLowerCase();
    if (!domain) domain = Config.NOSTR_ADDRESS_AVAILABLE_DOMAINS[0].name;

    // Check if there's already a pending invoice for this nip05
    const existingInvoice = await pool.query('SELECT * FROM invoices WHERE nip05 = $1 AND status = $2 AND domain = $3', [nip05, 'pending', domain]);
    if (existingInvoice) {
        // If there's already an invoice for this pubkey check if it isn't expired
        const currentDate = Date.now();
        const invoiceExpirationDate = new Date(existingInvoice.expiresAt).getTime();
        // If the invoice didn't expire return it
        if (currentDate < invoiceExpirationDate) {
            return existingInvoice;
        }
        // If the invoice expired, delete it
        try {
            await pool.query('DELETE FROM invoices WHERE nip05 = $1 AND status = $2 AND domain = $3', [nip05, 'pending', domain]);
        } catch (error) {
            throw error;
        }
    }

    // console.log('ZebedeePaymentProcessor.tsx: ', `${process.env.BASE_URL}/api/update-invoice?domain=${domain}`)

    const body = {
        amount: amount.toString(),
        description,
        internalId: requestId,
        callbackUrl: `${process.env.BASE_URL}/api/update-invoice?domain=${domain}`
    };

    const {
        data: {
            data: {
                id,
                invoice,
                expiresAt,
                status,
                // amount
            }
        }
    } = await requestCharge(body);
    console.log({id, invoice, expiresAt, status})

    const res = await pool.query('INSERT INTO invoices (id, pubkey, domain, nip05, status, bolt11, expires_at, confirmed_at, amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [
        id,
        pubkey,
        domain as string,
        nip05,
        status,
        invoice.request,
        Date.parse(expiresAt),
        0,
        amount / 1000,
    ]);
    return res.rows[0];
};

export const updateInvoice = async (pool: any, invoiceId: string, amount: string, expiresAt: string, status: string, confirmedAt: string) => {
    // await pool.query('UPDATE invoices SET status = $1, amount')
};