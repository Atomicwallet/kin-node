/// <reference types="node" />
import * as grpc from "@grpc/grpc-js";
import commonpb from "@kinecosystem/agora-api/node/common/v3/model_pb";
import accountpb from "@kinecosystem/agora-api/node/account/v3/account_service_pb";
import accountgrpc from "@kinecosystem/agora-api/node/account/v3/account_service_grpc_pb";
import transactiongrpc from "@kinecosystem/agora-api/node/transaction/v3/transaction_service_grpc_pb";
import accountpbv4 from "@kinecosystem/agora-api/node/account/v4/account_service_pb";
import accountgrpcv4 from "@kinecosystem/agora-api/node/account/v4/account_service_grpc_pb";
import airdropgrpcv4 from "@kinecosystem/agora-api/node/airdrop/v4/airdrop_service_grpc_pb";
import transactionpbv4 from "@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb";
import transactiongrpcv4 from "@kinecosystem/agora-api/node/transaction/v4/transaction_service_grpc_pb";
import { Transaction as SolanaTransaction } from "@solana/web3.js";
import { xdr } from "stellar-base";
import { PrivateKey, PublicKey, TransactionData, TransactionErrors, Commitment } from "../";
import { ShouldRetry } from "../retry";
import BigNumber from "bignumber.js";
export declare const SDK_VERSION = "0.2.3";
export declare const USER_AGENT_HEADER = "kin-user-agent";
export declare const KIN_VERSION_HEADER = "kin-version";
export declare const DESIRED_KIN_VERSION_HEADER = "desired-kin-version";
export declare const USER_AGENT: string;
export declare class SubmitTransactionResult {
    TxId: Buffer;
    InvoiceErrors?: commonpb.InvoiceError[];
    Errors?: TransactionErrors;
    constructor();
}
export interface InternalClientConfig {
    endpoint?: string;
    accountClient?: accountgrpc.AccountClient;
    txClient?: transactiongrpc.TransactionClient;
    accountClientV4?: accountgrpcv4.AccountClient;
    airdropClientV4?: airdropgrpcv4.AirdropClient;
    txClientV4?: transactiongrpcv4.TransactionClient;
    strategies?: ShouldRetry[];
    kinVersion?: number;
    desiredKinVersion?: number;
}
export declare class Internal {
    txClient: transactiongrpc.TransactionClient;
    accountClient: accountgrpc.AccountClient;
    accountClientV4: accountgrpcv4.AccountClient;
    airdropClientV4: airdropgrpcv4.AirdropClient;
    txClientV4: transactiongrpcv4.TransactionClient;
    strategies: ShouldRetry[];
    metadata: grpc.Metadata;
    kinVersion: number;
    private responseCache;
    constructor(config: InternalClientConfig);
    setKinVersion(kinVersion: number): void;
    getBlockchainVersion(): Promise<number>;
    createStellarAccount(key: PrivateKey): Promise<void>;
    getAccountInfo(account: PublicKey): Promise<accountpb.AccountInfo>;
    getStellarTransaction(hash: Buffer): Promise<TransactionData | undefined>;
    submitStellarTransaction(envelope: xdr.TransactionEnvelope, invoiceList?: commonpb.InvoiceList): Promise<SubmitTransactionResult>;
    createSolanaAccount(key: PrivateKey, commitment?: Commitment, subsidizer?: PrivateKey): Promise<void>;
    getSolanaAccountInfo(account: PublicKey, commitment?: Commitment): Promise<accountpbv4.AccountInfo>;
    submitSolanaTransaction(tx: SolanaTransaction, invoiceList?: commonpb.InvoiceList, commitment?: Commitment, dedupeId?: Buffer): Promise<SubmitTransactionResult>;
    getTransaction(id: Buffer, commitment?: Commitment): Promise<TransactionData | undefined>;
    getServiceConfig(): Promise<transactionpbv4.GetServiceConfigResponse>;
    getRecentBlockhash(): Promise<string>;
    getMinimumBalanceForRentExemption(): Promise<number>;
    requestAirdrop(publicKey: PublicKey, quarks: BigNumber, commitment?: Commitment): Promise<Buffer>;
    resolveTokenAccounts(publicKey: PublicKey): Promise<PublicKey[]>;
}
