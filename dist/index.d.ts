/// <reference types="node" />
import BigNumber from "bignumber.js";
import { xdr } from "stellar-base";
import commonpb from "@kinecosystem/agora-api/node/common/v3/model_pb";
import commonpbv4 from "@kinecosystem/agora-api/node/common/v4/model_pb";
import txpbv4 from "@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb";
import { Transaction as SolanaTransaction } from "@solana/web3.js";
import { Client } from "./client";
import { TransactionErrors } from "./errors";
import { PrivateKey, PublicKey } from "./keys";
import { Memo } from "./memo";
export { Client, TransactionErrors, PublicKey, PrivateKey, Memo, };
export declare const MAX_TRANSACTION_TYPE = 3;
export declare enum TransactionType {
    Unknown = -1,
    None = 0,
    Earn = 1,
    Spend = 2,
    P2P = 3
}
export declare enum TransactionState {
    Unknown = 0,
    Success = 1,
    Failed = 2,
    Pending = 3
}
export declare function transactionStateFromProto(state: txpbv4.GetTransactionResponse.State): TransactionState;
export declare enum Commitment {
    Recent = 0,
    Single = 1,
    Root = 2,
    Max = 3
}
export declare function commitmentToProto(commitment: Commitment): commonpbv4.Commitment;
export declare enum AccountResolution {
    Exact = 0,
    Preferred = 1
}
export declare enum Environment {
    Prod = 0,
    Test = 1
}
export declare enum NetworkPasshrase {
    Prod = "Kin Mainnet ; December 2018",
    Test = "Kin Testnet ; December 2018",
    Kin2Prod = "Public Global Kin Ecosystem Network ; June 2018",
    Kin2Test = "Kin Playground Network ; June 2018"
}
export declare const KinAssetCode = "KIN";
export declare enum Kin2Issuers {
    Prod = "GDF42M3IPERQCBLWFEZKQRK77JQ65SCKTU3CW36HZVCX7XX5A5QXZIVK",
    Test = "GBC3SG6NGTSZ2OMH3FFGB7UVRQWILW367U4GSOOF4TFSZONV42UJXUH7"
}
export declare function kinToQuarks(amount: string): BigNumber;
export declare function quarksToKin(amount: BigNumber | string): string;
export declare function xdrInt64ToBigNumber(i64: xdr.Int64): BigNumber;
export interface Invoice {
    Items: InvoiceItem[];
}
export declare function invoiceToProto(invoice: Invoice): commonpb.Invoice;
export interface InvoiceItem {
    title: string;
    description?: string;
    amount: BigNumber;
    sku?: Buffer;
}
export interface Payment {
    sender: PrivateKey;
    destination: PublicKey;
    type: TransactionType;
    quarks: BigNumber;
    channel?: PrivateKey;
    subsidizer?: PrivateKey;
    invoice?: Invoice;
    memo?: string;
    dedupeId?: Buffer;
}
export interface ReadOnlyPayment {
    sender: PublicKey;
    destination: PublicKey;
    type: TransactionType;
    quarks: string;
    invoice?: Invoice;
    memo?: string;
}
export declare function paymentsFromEnvelope(envelope: xdr.TransactionEnvelope, type: TransactionType, invoiceList?: commonpb.InvoiceList, kinVersion?: number): ReadOnlyPayment[];
export declare function paymentsFromTransaction(transaction: SolanaTransaction, invoiceList?: commonpb.InvoiceList): ReadOnlyPayment[];
export declare class TransactionData {
    txId: Buffer;
    txState: TransactionState;
    payments: ReadOnlyPayment[];
    errors?: TransactionErrors;
    constructor();
}
export declare function txDataFromProto(item: txpbv4.HistoryItem, state: txpbv4.GetTransactionResponse.State): TransactionData;
export interface EarnBatch {
    sender: PrivateKey;
    channel?: PrivateKey;
    subsidizer?: PrivateKey;
    memo?: string;
    earns: Earn[];
    dedupeId?: Buffer;
}
export interface Earn {
    destination: PublicKey;
    quarks: BigNumber;
    invoice?: Invoice;
}
export interface EarnBatchResult {
    txId: Buffer;
    txError?: Error;
    earnErrors?: EarnError[];
}
export interface EarnError {
    error: Error;
    earnIndex: number;
}
