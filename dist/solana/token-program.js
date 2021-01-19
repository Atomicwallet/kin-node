"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProgram = exports.TokenInstruction = exports.AuthorityType = exports.Command = exports.AccountSize = void 0;
var web3_js_1 = require("@solana/web3.js");
// Reference: https://github.com/solana-labs/solana-program-library/blob/11b1e3eefdd4e523768d63f7c70a7aa391ea0d02/token/program/src/state.rs#L125
exports.AccountSize = 165;
var Command;
(function (Command) {
    Command[Command["InitializeMint"] = 0] = "InitializeMint";
    Command[Command["InitializeAccount"] = 1] = "InitializeAccount";
    Command[Command["InitializeMultisig"] = 2] = "InitializeMultisig";
    Command[Command["Transfer"] = 3] = "Transfer";
    Command[Command["Approve"] = 4] = "Approve";
    Command[Command["Revoke"] = 5] = "Revoke";
    Command[Command["SetAuthority"] = 6] = "SetAuthority";
    Command[Command["MintTo"] = 7] = "MintTo";
    Command[Command["Burn"] = 8] = "Burn";
    Command[Command["CloseAccount"] = 9] = "CloseAccount";
    Command[Command["FreezeAccount"] = 10] = "FreezeAccount";
    Command[Command["ThawAccount"] = 11] = "ThawAccount";
    Command[Command["Transfer2"] = 12] = "Transfer2";
    Command[Command["Approve2"] = 13] = "Approve2";
    Command[Command["MintTo2"] = 14] = "MintTo2";
    Command[Command["Burn2"] = 15] = "Burn2";
})(Command = exports.Command || (exports.Command = {}));
var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["MintTokens"] = 0] = "MintTokens";
    AuthorityType[AuthorityType["FreezeAccount"] = 1] = "FreezeAccount";
    AuthorityType[AuthorityType["AccountHolder"] = 2] = "AccountHolder";
    AuthorityType[AuthorityType["CloseAccount"] = 3] = "CloseAccount";
})(AuthorityType = exports.AuthorityType || (exports.AuthorityType = {}));
var TokenInstruction = /** @class */ (function () {
    function TokenInstruction() {
    }
    /**
     * Decode a initialize account token instruction and retrieve the instruction params.
     */
    TokenInstruction.decodeInitializeAccount = function (instruction, tokenProgram) {
        this.checkProgramId(instruction.programId, tokenProgram);
        this.checkKeyLength(instruction.keys, 4);
        this.checkData(instruction.data, 1, Command.InitializeAccount);
        return {
            account: instruction.keys[0].pubkey,
            mint: instruction.keys[1].pubkey,
            owner: instruction.keys[2].pubkey,
        };
    };
    /**
     * Decode a transfer token instruction and retrieve the instruction params.
     */
    TokenInstruction.decodeTransfer = function (instruction, tokenProgram) {
        if (tokenProgram) {
            this.checkProgramId(instruction.programId, tokenProgram);
        }
        this.checkKeyLength(instruction.keys, 3);
        this.checkData(instruction.data, 9, Command.Transfer);
        return {
            source: instruction.keys[0].pubkey,
            dest: instruction.keys[1].pubkey,
            owner: instruction.keys[2].pubkey,
            amount: instruction.data.readBigUInt64LE(1)
        };
    };
    /**
     * Decode a set authority transfer
     */
    TokenInstruction.decodeSetAuthority = function (instruction, tokenProgram) {
        this.checkProgramId(instruction.programId, tokenProgram);
        this.checkKeyLength(instruction.keys, 2);
        if (instruction.data.length < 3) {
            throw new Error("invalid instruction data size: " + instruction.data.length);
        }
        if (instruction.data[2] == 0) {
            this.checkData(instruction.data, 3, Command.SetAuthority);
        }
        if (instruction.data[2] == 1) {
            this.checkData(instruction.data, 35, Command.SetAuthority);
        }
        return {
            account: instruction.keys[0].pubkey,
            currentAuthority: instruction.keys[1].pubkey,
            authorityType: instruction.data[1],
            newAuthority: instruction.data[2] == 1 ? new web3_js_1.PublicKey(instruction.data.slice(3)) : undefined
        };
    };
    TokenInstruction.checkProgramId = function (programId, expectedProgramId) {
        if (!programId.equals(expectedProgramId)) {
            throw new Error('invalid instruction; programId is not expected program id');
        }
    };
    TokenInstruction.checkKeyLength = function (keys, expectedLength) {
        if (keys.length !== expectedLength) {
            throw new Error("invalid instruction; found " + keys.length + " keys, expected at least " + expectedLength);
        }
    };
    TokenInstruction.checkData = function (data, expectedLength, expectedCommand) {
        if (data.length !== expectedLength) {
            throw new Error("invalid instruction data size: " + data.length);
        }
        if (data[0] !== expectedCommand) {
            throw new Error("invalid instruction data: " + data);
        }
    };
    return TokenInstruction;
}());
exports.TokenInstruction = TokenInstruction;
var TokenProgram = /** @class */ (function () {
    function TokenProgram() {
    }
    Object.defineProperty(TokenProgram, "rentSysVar", {
        get: function () {
            return new web3_js_1.PublicKey('SysvarRent111111111111111111111111111111111');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Generate a transaction instruction that initializes an account.
     */
    TokenProgram.initializeAccount = function (params, tokenProgram) {
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.account, isSigner: true, isWritable: true },
                { pubkey: params.mint, isSigner: false, isWritable: false },
                { pubkey: params.owner, isSigner: false, isWritable: false },
                { pubkey: this.rentSysVar, isSigner: false, isWritable: false },
            ],
            programId: tokenProgram,
            data: Buffer.from(new Uint8Array([Command.InitializeAccount])),
        });
    };
    /**
     * Generate a transaction instruction that transfers Kin from one account to another.
     */
    TokenProgram.transfer = function (params, tokenProgram) {
        var b = Buffer.alloc(9);
        b.writeUInt8(Command.Transfer, 0);
        b.writeBigUInt64LE(params.amount, 1);
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.source, isSigner: false, isWritable: true },
                { pubkey: params.dest, isSigner: false, isWritable: true },
                { pubkey: params.owner, isSigner: true, isWritable: true },
            ],
            programId: tokenProgram,
            data: b,
        });
    };
    /**
     * Generate a transaction instruction that sets the authority of an account.
     */
    TokenProgram.setAuthority = function (params, tokenProgram) {
        var b;
        if (params.newAuthority) {
            b = Buffer.alloc(35);
        }
        else {
            b = Buffer.alloc(3);
        }
        b.writeUInt8(Command.SetAuthority, 0);
        b.writeUInt8(params.authorityType, 1);
        if (params.newAuthority) {
            b.writeUInt8(1, 2);
            b.fill(params.newAuthority.toBuffer(), 3);
        }
        else {
            b.writeUInt8(0, 2);
        }
        return new web3_js_1.TransactionInstruction({
            keys: [
                { pubkey: params.account, isSigner: false, isWritable: true },
                { pubkey: params.currentAuthority, isSigner: true, isWritable: false },
            ],
            programId: tokenProgram,
            data: b,
        });
    };
    return TokenProgram;
}());
exports.TokenProgram = TokenProgram;
