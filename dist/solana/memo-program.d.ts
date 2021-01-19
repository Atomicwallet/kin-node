import { PublicKey as SolanaPublicKey, TransactionInstruction } from '@solana/web3.js';
export interface MemoParams {
    data: string;
}
export declare class MemoInstruction {
    /**
     * Decode a memo instruction and retrieve the instruction params.
     */
    static decodeMemo(instruction: TransactionInstruction): MemoParams;
    static checkProgramId(programId: SolanaPublicKey): void;
}
export declare class MemoProgram {
    /**
     * The address of the memo program that should be used.
     * todo: lock this in, or make configurable.
     */
    static get programId(): SolanaPublicKey;
    static memo(params: MemoParams): TransactionInstruction;
}
