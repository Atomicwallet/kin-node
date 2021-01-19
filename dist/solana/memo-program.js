"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoProgram = exports.MemoInstruction = void 0;
var web3_js_1 = require("@solana/web3.js");
var MemoInstruction = /** @class */ (function () {
    function MemoInstruction() {
    }
    /**
     * Decode a memo instruction and retrieve the instruction params.
     */
    MemoInstruction.decodeMemo = function (instruction) {
        this.checkProgramId(instruction.programId);
        return {
            data: instruction.data.toString(),
        };
    };
    MemoInstruction.checkProgramId = function (programId) {
        if (!programId.equals(MemoProgram.programId)) {
            throw new Error('invalid instruction; programId is not MemoProgam');
        }
    };
    return MemoInstruction;
}());
exports.MemoInstruction = MemoInstruction;
var MemoProgram = /** @class */ (function () {
    function MemoProgram() {
    }
    Object.defineProperty(MemoProgram, "programId", {
        /**
         * The address of the memo program that should be used.
         * todo: lock this in, or make configurable.
         */
        get: function () {
            return new web3_js_1.PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo');
        },
        enumerable: false,
        configurable: true
    });
    MemoProgram.memo = function (params) {
        return new web3_js_1.TransactionInstruction({
            programId: this.programId,
            data: Buffer.from(params.data)
        });
    };
    return MemoProgram;
}());
exports.MemoProgram = MemoProgram;
