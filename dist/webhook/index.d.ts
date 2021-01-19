/// <reference types="node" />
import express from "express";
import { xdr } from "stellar-base";
import { Transaction as SolanaTransaction } from "@solana/web3.js";
import commonpb from "@kinecosystem/agora-api/node/common/v3/model_pb";
import { PrivateKey, Environment, ReadOnlyPayment } from "..";
export declare const AGORA_HMAC_HEADER: string;
export declare const AGORA_USER_ID_HEADER: string;
export declare const AGORA_USER_PASSKEY_HEADER: string;
export interface Event {
    transaction_event: {
        kin_version: number;
        tx_id?: string;
        /**
         * @deprecated - Use `tx_id` instead.
         */
        tx_hash?: string;
        invoice_list?: commonpb.InvoiceList;
        stellar_event?: {
            envelope_xdr: string;
            result_xdr: string;
        };
        solana_event?: {
            transaction: string;
            tx_error?: string;
            tx_error_raw?: string;
        };
    };
}
export declare function EventsHandler(callback: (events: Event[]) => void, secret?: string): express.RequestHandler<any>;
export declare class SignTransactionRequest {
    userId?: string;
    userPassKey?: string;
    payments: ReadOnlyPayment[];
    envelope?: xdr.TransactionEnvelope;
    solanaTransaction?: SolanaTransaction;
    networkPassphrase?: string;
    kinVersion: number;
    constructor(payments: ReadOnlyPayment[], kinVersion: number, networkPassphrase?: string, envelope?: xdr.TransactionEnvelope, transaction?: SolanaTransaction, userId?: string, userPassKey?: string);
    /**
     * @deprecated - Use `txId()` instead.
     *
     *
     * Returns the transaction hash of a stellar transaction,
     * or the signature of a solana transaction.
     */
    txHash(): Buffer;
    txId(): Buffer | undefined;
}
export declare class SignTransactionResponse {
    rejected: boolean;
    envelope?: xdr.TransactionEnvelope;
    signedEnvelope: xdr.TransactionEnvelope | undefined;
    invoiceErrors: InvoiceError[];
    networkPassphrase?: string;
    constructor(envelope?: xdr.TransactionEnvelope, networkPassphrase?: string);
    isRejected(): boolean;
    sign(key: PrivateKey): void;
    reject(): void;
    markAlreadyPaid(idx: number): void;
    markWrongDestination(idx: number): void;
    markSkuNotFound(idx: number): void;
}
export declare enum RejectionReason {
    None = "",
    AlreadyPaid = "already_paid",
    WrongDestination = "wrong_destination",
    SkuNotFound = "sku_not_found"
}
export declare class InvoiceError {
    operation_index: number;
    reason: RejectionReason;
    constructor();
}
export declare function SignTransactionHandler(env: Environment, callback: (req: SignTransactionRequest, resp: SignTransactionResponse) => void, secret?: string): express.RequestHandler<any>;
