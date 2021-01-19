import { PublicKey as SolanaPublicKey, TransactionInstruction } from '@solana/web3.js';
export declare const AccountSize = 165;
export declare enum Command {
    InitializeMint = 0,
    InitializeAccount = 1,
    InitializeMultisig = 2,
    Transfer = 3,
    Approve = 4,
    Revoke = 5,
    SetAuthority = 6,
    MintTo = 7,
    Burn = 8,
    CloseAccount = 9,
    FreezeAccount = 10,
    ThawAccount = 11,
    Transfer2 = 12,
    Approve2 = 13,
    MintTo2 = 14,
    Burn2 = 15
}
export declare enum AuthorityType {
    MintTokens = 0,
    FreezeAccount = 1,
    AccountHolder = 2,
    CloseAccount = 3
}
export interface InitializeAccountParams {
    account: SolanaPublicKey;
    mint: SolanaPublicKey;
    owner: SolanaPublicKey;
}
export interface TransferParams {
    source: SolanaPublicKey;
    dest: SolanaPublicKey;
    owner: SolanaPublicKey;
    amount: bigint;
}
export interface SetAuthorityParams {
    account: SolanaPublicKey;
    currentAuthority: SolanaPublicKey;
    newAuthority?: SolanaPublicKey;
    authorityType: AuthorityType;
}
export declare class TokenInstruction {
    /**
     * Decode a initialize account token instruction and retrieve the instruction params.
     */
    static decodeInitializeAccount(instruction: TransactionInstruction, tokenProgram: SolanaPublicKey): InitializeAccountParams;
    /**
     * Decode a transfer token instruction and retrieve the instruction params.
     */
    static decodeTransfer(instruction: TransactionInstruction, tokenProgram?: SolanaPublicKey): TransferParams;
    /**
     * Decode a set authority transfer
     */
    static decodeSetAuthority(instruction: TransactionInstruction, tokenProgram: SolanaPublicKey): SetAuthorityParams;
    private static checkProgramId;
    private static checkKeyLength;
    private static checkData;
}
export declare class TokenProgram {
    static get rentSysVar(): SolanaPublicKey;
    /**
     * Generate a transaction instruction that initializes an account.
     */
    static initializeAccount(params: InitializeAccountParams, tokenProgram: SolanaPublicKey): TransactionInstruction;
    /**
     * Generate a transaction instruction that transfers Kin from one account to another.
     */
    static transfer(params: TransferParams, tokenProgram: SolanaPublicKey): TransactionInstruction;
    /**
     * Generate a transaction instruction that sets the authority of an account.
     */
    static setAuthority(params: SetAuthorityParams, tokenProgram: SolanaPublicKey): TransactionInstruction;
}
