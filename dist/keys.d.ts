/// <reference types="node" />
import { Keypair } from "stellar-base";
import { PublicKey as SolanaPublicKey } from "@solana/web3.js";
export declare class PublicKey {
    buffer: Buffer;
    constructor(b: Buffer);
    static fromString(address: string): PublicKey;
    static fromBase58(address: string): PublicKey;
    toBase58(): string;
    stellarAddress(): string;
    equals(other: PublicKey): boolean;
    solanaKey(): SolanaPublicKey;
}
export declare class PrivateKey {
    kp: Keypair;
    constructor(kp: Keypair);
    static random(): PrivateKey;
    static fromString(seed: string): PrivateKey;
    static fromBase58(seed: string): PrivateKey;
    toBase58(): string;
    publicKey(): PublicKey;
    stellarSeed(): string;
    secretKey(): Buffer;
    equals(other: PrivateKey): boolean;
}
