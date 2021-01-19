"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memo = exports.MAX_VERSION = exports.MAX_APP_INDEX = void 0;
var stellar_base_1 = require("stellar-base");
var _1 = require(".");
var magicByte = 0x1;
exports.MAX_APP_INDEX = Math.pow(2, 16) - 1;
exports.MAX_VERSION = 1;
// Memo implements the Agora memo specification.
//
// Spec: https://github.com/kinecosystem/agora-api
var Memo = /** @class */ (function () {
    function Memo(buf) {
        this.buffer = buf;
    }
    Memo.from = function (b) {
        var buf = Buffer.alloc(b.length);
        b.copy(buf);
        return new this(buf);
    };
    Memo.fromXdr = function (memo, strict) {
        if (memo.switch() != stellar_base_1.xdr.MemoType.memoHash()) {
            return undefined;
        }
        var m = Memo.from(memo.hash());
        if (!Memo.IsValid(m, strict)) {
            throw new Error("invalid memo");
        }
        return m;
    };
    Memo.fromB64String = function (s, strict) {
        var raw = Buffer.from(s, 'base64');
        var m = Memo.from(raw);
        if (!Memo.IsValid(m, strict)) {
            throw new Error("invalid memo");
        }
        return m;
    };
    Memo.new = function (version, type, appIndex, fk) {
        if (fk.length > 29) {
            throw new Error("invalid foreign key length");
        }
        if (version > 7) {
            throw new Error("invalid version");
        }
        if (type < 0) {
            throw new Error("cannot use unknown transaction type");
        }
        var b = Buffer.alloc(32);
        // encode magic byte + version
        b[0] = magicByte;
        b[0] |= version << 2;
        // encode transaction type
        b[0] |= (type & 0x7) << 5;
        b[1] = (type & 0x18) >> 3;
        // encode AppIndex
        b[1] |= (appIndex & 0x3f) << 2;
        b[2] = (appIndex & 0x3fc0) >> 6;
        b[3] = (appIndex & 0xc000) >> 14;
        if (fk.byteLength > 0) {
            b[3] |= (fk[0] & 0x3f) << 2;
            // insert the rest of the fk. since each loop references fk[n] and fk[n+1], the upper bound is offset by 3 instead of 4.
            for (var i = 4; i < 3 + fk.byteLength; i++) {
                // apply last 2-bits of current byte
                // apply first 6-bits of next byte
                b[i] = (fk[i - 4] >> 6) & 0x3;
                b[i] |= (fk[i - 3] & 0x3f) << 2;
            }
            // if the foreign key is less than 29 bytes, the last 2 bits of the FK can be included in the memo
            if (fk.byteLength < 29) {
                b[fk.byteLength + 3] = (fk[fk.byteLength - 1] >> 6) & 0x3;
            }
        }
        return new this(b);
    };
    Memo.IsValid = function (m, strict) {
        if (Number(m.buffer[0] & 0x3) != magicByte) {
            return false;
        }
        if (m.TransactionTypeRaw() == -1) {
            return false;
        }
        if (!strict) {
            return true;
        }
        if (m.Version() > exports.MAX_VERSION) {
            return false;
        }
        return m.TransactionType() >= 0 && m.TransactionType() <= _1.MAX_TRANSACTION_TYPE;
    };
    // Version returns the memo encoding version.
    Memo.prototype.Version = function () {
        return (this.buffer[0] & 0x1c) >> 2;
    };
    // TransactionType returns the type of the transaction the memo is
    // attached to.
    Memo.prototype.TransactionType = function () {
        var raw = this.TransactionTypeRaw();
        if (raw >= 0 && raw <= _1.MAX_TRANSACTION_TYPE) {
            return raw;
        }
        return _1.TransactionType.Unknown;
    };
    // TransactionTypeRaw returns the type of the transaction the memo is
    // attached to, even if it is unsupported by this implementation. It should
    // only be used as a fallback if the raw value is needed when TransactionType()
    // yieleds TransactionType.Unknown.
    Memo.prototype.TransactionTypeRaw = function () {
        return (this.buffer[0] >> 5) | (this.buffer[1] & 0x3) << 3;
    };
    // AppIndex returns the index of the app the transaction relates to.
    Memo.prototype.AppIndex = function () {
        var a = Number(this.buffer[1]) >> 2;
        var b = Number(this.buffer[2]) << 6;
        var c = Number(this.buffer[3] & 0x3) << 14;
        return a | b | c;
    };
    // ForeignKey returns an identifier in an auxiliary service that contains
    // additional information related to the transaction.
    Memo.prototype.ForeignKey = function () {
        var fk = Buffer.alloc(29);
        for (var i = 0; i < 28; i++) {
            fk[i] |= this.buffer[i + 3] >> 2;
            fk[i] |= (this.buffer[i + 4] & 0x3) << 6;
        }
        // We only have 230 bits, which results in
        // our last fk byte only having 6 'valid' bits
        fk[28] = this.buffer[31] >> 2;
        return fk;
    };
    return Memo;
}());
exports.Memo = Memo;
