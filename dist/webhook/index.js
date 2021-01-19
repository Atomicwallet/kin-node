"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignTransactionHandler = exports.InvoiceError = exports.RejectionReason = exports.SignTransactionResponse = exports.SignTransactionRequest = exports.EventsHandler = exports.AGORA_USER_PASSKEY_HEADER = exports.AGORA_USER_ID_HEADER = exports.AGORA_HMAC_HEADER = void 0;
var stellar_base_1 = require("stellar-base");
var hash_js_1 = require("hash.js");
var web3_js_1 = require("@solana/web3.js");
var model_pb_1 = require("@kinecosystem/agora-api/node/common/v3/model_pb");
var __1 = require("..");
exports.AGORA_HMAC_HEADER = "X-Agora-HMAC-SHA256".toLowerCase();
exports.AGORA_USER_ID_HEADER = "X-Agora-User-Id".toLowerCase();
exports.AGORA_USER_PASSKEY_HEADER = "X-Agora-User-Passkey".toLowerCase();
function EventsHandler(callback, secret) {
    return function (req, resp, next) {
        if (secret) {
            if (!verifySignature(req.headers, JSON.stringify(req.body), secret)) {
                resp.sendStatus(401);
                return;
            }
        }
        try {
            var events = req.body;
            if (events.length == undefined || events.length == 0) {
                resp.sendStatus(400);
                return;
            }
            events.forEach(function (event) {
                if (!event.transaction_event.tx_id && event.transaction_event.tx_hash) {
                    event.transaction_event.tx_id = event.transaction_event.tx_hash;
                }
            });
            callback(events);
            resp.sendStatus(200);
        }
        catch (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    };
}
exports.EventsHandler = EventsHandler;
var SignTransactionRequest = /** @class */ (function () {
    function SignTransactionRequest(payments, kinVersion, networkPassphrase, envelope, transaction, userId, userPassKey) {
        this.userId = userId;
        this.userPassKey = userPassKey;
        this.payments = payments;
        this.envelope = envelope;
        this.solanaTransaction = transaction;
        this.networkPassphrase = networkPassphrase;
        this.kinVersion = kinVersion;
    }
    /**
     * @deprecated - Use `txId()` instead.
     *
     *
     * Returns the transaction hash of a stellar transaction,
     * or the signature of a solana transaction.
     */
    SignTransactionRequest.prototype.txHash = function () {
        var id = this.txId();
        if (!id) {
            throw new Error("this transaction has no hash");
        }
        return id;
    };
    SignTransactionRequest.prototype.txId = function () {
        if (this.solanaTransaction) {
            return this.solanaTransaction.signature;
        }
        if (this.envelope) {
            return stellar_base_1.TransactionBuilder.fromXDR(this.envelope, this.networkPassphrase).hash();
        }
    };
    return SignTransactionRequest;
}());
exports.SignTransactionRequest = SignTransactionRequest;
var SignTransactionResponse = /** @class */ (function () {
    function SignTransactionResponse(envelope, networkPassphrase) {
        this.rejected = false;
        this.invoiceErrors = [];
        this.envelope = envelope;
        this.networkPassphrase = networkPassphrase;
    }
    SignTransactionResponse.prototype.isRejected = function () {
        return this.rejected;
    };
    SignTransactionResponse.prototype.sign = function (key) {
        if (this.envelope) {
            var builder = stellar_base_1.TransactionBuilder.fromXDR(this.envelope, this.networkPassphrase);
            builder.sign(key.kp);
            this.signedEnvelope = builder.toEnvelope();
        }
    };
    SignTransactionResponse.prototype.reject = function () {
        this.rejected = true;
    };
    SignTransactionResponse.prototype.markAlreadyPaid = function (idx) {
        this.reject();
        this.invoiceErrors.push({
            operation_index: idx,
            reason: RejectionReason.AlreadyPaid,
        });
    };
    SignTransactionResponse.prototype.markWrongDestination = function (idx) {
        this.reject();
        this.invoiceErrors.push({
            operation_index: idx,
            reason: RejectionReason.WrongDestination,
        });
    };
    SignTransactionResponse.prototype.markSkuNotFound = function (idx) {
        this.reject();
        this.invoiceErrors.push({
            operation_index: idx,
            reason: RejectionReason.SkuNotFound,
        });
    };
    return SignTransactionResponse;
}());
exports.SignTransactionResponse = SignTransactionResponse;
var RejectionReason;
(function (RejectionReason) {
    RejectionReason["None"] = "";
    RejectionReason["AlreadyPaid"] = "already_paid";
    RejectionReason["WrongDestination"] = "wrong_destination";
    RejectionReason["SkuNotFound"] = "sku_not_found";
})(RejectionReason = exports.RejectionReason || (exports.RejectionReason = {}));
var InvoiceError = /** @class */ (function () {
    function InvoiceError() {
        this.operation_index = 0;
        this.reason = RejectionReason.None;
    }
    return InvoiceError;
}());
exports.InvoiceError = InvoiceError;
function SignTransactionHandler(env, callback, secret) {
    var networkPassphrase;
    switch (env) {
        case __1.Environment.Test:
            networkPassphrase = __1.NetworkPasshrase.Test;
            break;
        case __1.Environment.Prod:
            networkPassphrase = __1.NetworkPasshrase.Prod;
            break;
    }
    return function (req, resp, next) {
        if (secret) {
            if (!verifySignature(req.headers, JSON.stringify(req.body), secret)) {
                resp.sendStatus(401);
                return;
            }
        }
        var signRequest;
        var signResponse;
        try {
            var reqBody = req.body;
            var userId = void 0;
            if (req.headers[exports.AGORA_USER_ID_HEADER] && req.headers[exports.AGORA_USER_ID_HEADER].length > 0) {
                userId = req.headers[exports.AGORA_USER_ID_HEADER];
            }
            var userPassKey = void 0;
            if (req.headers[exports.AGORA_USER_PASSKEY_HEADER] && req.headers[exports.AGORA_USER_PASSKEY_HEADER].length > 0) {
                userPassKey = req.headers[exports.AGORA_USER_PASSKEY_HEADER];
            }
            var invoiceList = void 0;
            if (reqBody.invoice_list) {
                invoiceList = model_pb_1.InvoiceList.deserializeBinary(Buffer.from(reqBody.invoice_list, "base64"));
            }
            var kinVersion = (reqBody.kin_version ? reqBody.kin_version : 3);
            if (kinVersion === 4) {
                if (!reqBody.solana_transaction || typeof reqBody.solana_transaction != "string") {
                    resp.sendStatus(400);
                    return;
                }
                var txBytes = Buffer.from(reqBody.solana_transaction, "base64");
                var tx = web3_js_1.Transaction.from(txBytes);
                var payments = __1.paymentsFromTransaction(tx, invoiceList);
                signRequest = new SignTransactionRequest(payments, 4, undefined, undefined, tx, userId, userPassKey);
                signResponse = new SignTransactionResponse();
            }
            else {
                if (!reqBody.envelope_xdr || typeof reqBody.envelope_xdr != "string") {
                    resp.sendStatus(400);
                    return;
                }
                var envelope = stellar_base_1.xdr.TransactionEnvelope.fromXDR(Buffer.from(reqBody.envelope_xdr, "base64"));
                var payments = __1.paymentsFromEnvelope(envelope, __1.TransactionType.Spend, invoiceList, kinVersion);
                signRequest = new SignTransactionRequest(payments, kinVersion, networkPassphrase, envelope, undefined, userId, userPassKey);
                signResponse = new SignTransactionResponse(envelope, networkPassphrase);
            }
        }
        catch (err) {
            resp.sendStatus(400);
            return;
        }
        try {
            callback(signRequest, signResponse);
            if (signResponse.isRejected() || (signResponse.envelope && !signResponse.signedEnvelope)) {
                resp.status(403).send({
                    invoice_errors: signResponse.invoiceErrors,
                });
            }
            else {
                if (signResponse.envelope) {
                    resp.status(200).send({
                        envelope_xdr: signResponse.signedEnvelope.toXDR("base64"),
                    });
                }
                else {
                    resp.status(200).send({});
                }
            }
        }
        catch (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    };
}
exports.SignTransactionHandler = SignTransactionHandler;
function verifySignature(headers, body, secret) {
    var _a;
    if (!headers[exports.AGORA_HMAC_HEADER] || ((_a = headers[exports.AGORA_HMAC_HEADER]) === null || _a === void 0 ? void 0 : _a.length) == 0) {
        return false;
    }
    var rawSecret = Buffer.from(secret, "utf-8");
    var actual = Buffer.from(headers[exports.AGORA_HMAC_HEADER], 'base64').toString('hex');
    var expected = hash_js_1.hmac(hash_js_1.sha256, rawSecret).update(body).digest('hex');
    return actual == expected;
}
