import { xdr } from "stellar-base";
import commonpbv4 from "@kinecosystem/agora-api/node/common/v4/model_pb";
import commonpb from "@kinecosystem/agora-api/node/common/v3/model_pb";
import { Transaction } from "@solana/web3.js";
export declare class TransactionErrors {
    TxError?: Error;
    OpErrors?: Error[];
    PaymentErrors?: Error[];
}
export declare function errorsFromSolanaTx(tx: Transaction, protoError: commonpbv4.TransactionError): TransactionErrors;
export declare function errorsFromStellarTx(env: xdr.TransactionEnvelope, protoError: commonpbv4.TransactionError): TransactionErrors;
export declare function errorFromProto(protoError: commonpbv4.TransactionError): Error | undefined;
export declare function invoiceErrorFromProto(protoError: commonpb.InvoiceError): Error;
export declare function errorsFromXdr(result: xdr.TransactionResult): TransactionErrors;
export declare class TransactionFailed extends Error {
    constructor(m?: string);
}
export declare class AccountExists extends Error {
    constructor(m?: string);
}
export declare class AccountDoesNotExist extends Error {
    constructor(m?: string);
}
export declare class TransactionNotFound extends Error {
    constructor(m?: string);
}
export declare class Malformed extends Error {
    constructor(m?: string);
}
export declare class BadNonce extends Error {
    constructor(m?: string);
}
export declare class InsufficientBalance extends Error {
    constructor(m?: string);
}
export declare class InsufficientFee extends Error {
    constructor(m?: string);
}
export declare class SenderDoesNotExist extends Error {
    constructor(m?: string);
}
export declare class DestinationDoesNotExist extends Error {
    constructor(m?: string);
}
export declare class InvalidSignature extends Error {
    constructor(m?: string);
}
export declare class AlreadyPaid extends Error {
    constructor(m?: string);
}
export declare class WrongDestination extends Error {
    constructor(m?: string);
}
export declare class SkuNotFound extends Error {
    constructor(m?: string);
}
export declare class TransactionRejected extends Error {
    constructor(m?: string);
}
export declare class PayerRequired extends Error {
    constructor(m?: string);
}
export declare class NoSubsidizerError extends Error {
    constructor(m?: string);
}
export declare class AlreadySubmitted extends Error {
    constructor(m?: string);
}
export declare class NoTokenAccounts extends Error {
    constructor(m?: string);
}
export declare const nonRetriableErrors: (typeof BadNonce)[];
