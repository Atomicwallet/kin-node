/// <reference types="node" />
import BigNumber from "bignumber.js";
import { Invoice, PublicKey } from "..";
import modelpbv3 from "@kinecosystem/agora-api/node/common/v3/model_pb";
import txpb from "@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb";
export interface InvoiceListParams {
    invoices: Invoice[];
}
export interface PaymentParams {
    source: PublicKey;
    destination: PublicKey;
    amount: BigNumber;
}
export interface HistoryItemParams {
    transactionId: Buffer;
    cursor: Buffer | undefined;
    stellarTxEnvelope: Buffer | undefined;
    solanaTx: Buffer | undefined;
    payments: PaymentParams[];
    invoices: Invoice[];
}
export declare function createInvoiceList(params: InvoiceListParams): modelpbv3.InvoiceList;
export declare function createPayment(params: PaymentParams): txpb.HistoryItem.Payment;
export declare function createHistoryItem(params: HistoryItemParams): txpb.HistoryItem;
