"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = exports.PublicKey = void 0;
var stellar_base_1 = require("stellar-base");
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
// PublicKey is a blockchain agnostic representation
// of an ed25519 public key.
var PublicKey = /** @class */ (function () {
    function PublicKey(b) {
        this.buffer = b;
    }
    PublicKey.fromString = function (address) {
        if (address.length != 56) {
            throw new Error("address format not supported");
        }
        if (address[0] == "G") {
            return new PublicKey(stellar_base_1.StrKey.decodeEd25519PublicKey(address));
        }
        var decoded58 = bs58_1.default.decode(address);
        if (decoded58.length == 32) {
            return new PublicKey(decoded58);
        }
        throw new Error("address is not a public key");
    };
    PublicKey.fromBase58 = function (address) {
        var decoded58 = bs58_1.default.decode(address);
        if (decoded58.length == 32) {
            return new PublicKey(decoded58);
        }
        throw new Error("address is not a base58-encoded public key");
    };
    PublicKey.prototype.toBase58 = function () {
        return bs58_1.default.encode(this.buffer);
    };
    PublicKey.prototype.stellarAddress = function () {
        return stellar_base_1.StrKey.encodeEd25519PublicKey(this.buffer);
    };
    PublicKey.prototype.equals = function (other) {
        return this.buffer.equals(other.buffer);
    };
    PublicKey.prototype.solanaKey = function () {
        return new web3_js_1.PublicKey(this.buffer);
    };
    return PublicKey;
}());
exports.PublicKey = PublicKey;
// PrivateKey is a blockchain agnostic representation of an
// ed25519 private key.
var PrivateKey = /** @class */ (function () {
    function PrivateKey(kp) {
        this.kp = kp;
    }
    PrivateKey.random = function () {
        return new PrivateKey(stellar_base_1.Keypair.random());
    };
    PrivateKey.fromString = function (seed) {
        if (seed[0] == "S" && seed.length == 56) {
            return new PrivateKey(stellar_base_1.Keypair.fromSecret(seed));
        }
        // attempt to parse
        return new PrivateKey(stellar_base_1.Keypair.fromRawEd25519Seed(Buffer.from(seed, "hex")));
    };
    PrivateKey.fromBase58 = function (seed) {
        var decoded58 = bs58_1.default.decode(seed);
        if (decoded58.length == 32) {
            return new PrivateKey(stellar_base_1.Keypair.fromRawEd25519Seed(Buffer.from(decoded58)));
        }
        throw new Error("seed is not a valid base58-encoded secret seed");
    };
    PrivateKey.prototype.toBase58 = function () {
        return bs58_1.default.encode(this.kp.rawSecretKey());
    };
    PrivateKey.prototype.publicKey = function () {
        return new PublicKey(this.kp.rawPublicKey());
    };
    PrivateKey.prototype.stellarSeed = function () {
        return this.kp.secret();
    };
    PrivateKey.prototype.secretKey = function () {
        return Buffer.concat([this.kp.rawSecretKey(), this.kp.rawPublicKey()]);
    };
    PrivateKey.prototype.equals = function (other) {
        return this.kp.rawSecretKey().equals(other.kp.rawSecretKey());
    };
    return PrivateKey;
}());
exports.PrivateKey = PrivateKey;
