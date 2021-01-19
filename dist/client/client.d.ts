/// <reference types="node" />
import BigNumber from "bignumber.js";
import LRUCache from 'lru-cache';
import accountgrpc from "@kinecosystem/agora-api/node/account/v3/account_service_grpc_pb";
import transactiongrpc from "@kinecosystem/agora-api/node/transaction/v3/transaction_service_grpc_pb";
import accountgrpcv4 from "@kinecosystem/agora-api/node/account/v4/account_service_grpc_pb";
import airdropgrpcv4 from "@kinecosystem/agora-api/node/airdrop/v4/airdrop_service_grpc_pb";
import transactiongrpcv4 from "@kinecosystem/agora-api/node/transaction/v4/transaction_service_grpc_pb";
import { AccountResolution, Commitment, EarnBatch, EarnBatchResult, Environment, Payment, PrivateKey, PublicKey, TransactionData } from "../";
import { InternalClient } from "./";
export interface ClientConfig {
    endpoint?: string;
    internal?: InternalClient;
    accountClient?: accountgrpc.AccountClient;
    txClient?: transactiongrpc.TransactionClient;
    accountClientV4?: accountgrpcv4.AccountClient;
    airdropClientV4?: airdropgrpcv4.AirdropClient;
    txClientV4?: transactiongrpcv4.TransactionClient;
    appIndex?: number;
    retryConfig?: RetryConfig;
    whitelistKey?: PrivateKey;
    kinVersion?: number;
    desiredKinVersion?: number;
    defaultCommitment?: Commitment;
}
export interface RetryConfig {
    maxRetries: number;
    minDelaySeconds: number;
    maxDelaySeconds: number;
    maxNonceRefreshes: number;
}
export declare class Client {
    internal: InternalClient;
    networkPassphrase?: string;
    retryConfig: RetryConfig;
    appIndex?: number;
    whitelistKey?: PrivateKey;
    kinVersion: number;
    env: Environment;
    issuer?: string;
    defaultCommitment: Commitment;
    accountCache: LRUCache<string, string>;
    constructor(env: Environment, conf?: ClientConfig);
    createAccount(key: PrivateKey, commitment?: Commitment, subsidizer?: PrivateKey): Promise<void>;
    getBalance(account: PublicKey, commitment?: Commitment, accountResolution?: AccountResolution): Promise<BigNumber>;
    getTransaction(txId: Buffer, commitment?: Commitment): Promise<TransactionData | undefined>;
    submitPayment(payment: Payment, commitment?: Commitment, senderResolution?: AccountResolution, destinationResolution?: AccountResolution): Promise<Buffer>;
    submitEarnBatch(batch: EarnBatch, commitment?: Commitment, senderResolution?: AccountResolution, destinationResolution?: AccountResolution): Promise<EarnBatchResult>;
    resolveTokenAccounts(account: PublicKey): Promise<PublicKey[]>;
    requestAirdrop(publicKey: PublicKey, quarks: BigNumber, commitment?: Commitment): Promise<Buffer>;
    private submitPaymentWithResolution;
    private submitSolanaPayment;
    private submitEarnBatchWithResolution;
    private submitSolanaEarnBatch;
    private submitSingleEarnBatch;
    private signAndSubmitSolanaTx;
    private signAndSubmit;
    private getTokenAccounts;
    private setTokenAccountsInCache;
    private getTokensFromCache;
}
