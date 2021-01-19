"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAccount = void 0;
var hash_js_1 = require("hash.js");
var stellar_base_1 = require("stellar-base");
var __1 = require("..");
function generateTokenAccount(key) {
    return new __1.PrivateKey(stellar_base_1.Keypair.fromRawEd25519Seed(Buffer.from(hash_js_1.sha256().update(key.kp.rawSecretKey()).digest())));
}
exports.generateTokenAccount = generateTokenAccount;
