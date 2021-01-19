/// <reference types="node" />
import { xdr } from "stellar-base";
import { TransactionType } from ".";
export declare const MAX_APP_INDEX: number;
export declare const MAX_VERSION = 1;
export declare class Memo {
    buffer: Buffer;
    constructor(buf: Buffer);
    static from(b: Buffer): Memo;
    static fromXdr(memo: xdr.Memo, strict: boolean): Memo | undefined;
    static fromB64String(s: string, strict: boolean): Memo | undefined;
    static new(version: number, type: TransactionType, appIndex: number, fk: Buffer): Memo;
    static IsValid(m: Memo, strict?: boolean): boolean;
    Version(): number;
    TransactionType(): TransactionType;
    TransactionTypeRaw(): TransactionType;
    AppIndex(): number;
    ForeignKey(): Buffer;
}
