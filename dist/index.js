"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.txDataFromProto = exports.TransactionData = exports.paymentsFromTransaction = exports.paymentsFromEnvelope = exports.invoiceToProto = exports.xdrInt64ToBigNumber = exports.quarksToKin = exports.kinToQuarks = exports.Kin2Issuers = exports.KinAssetCode = exports.NetworkPasshrase = exports.Environment = exports.AccountResolution = exports.commitmentToProto = exports.Commitment = exports.transactionStateFromProto = exports.TransactionState = exports.TransactionType = exports.MAX_TRANSACTION_TYPE = exports.Memo = exports.PrivateKey = exports.PublicKey = exports.TransactionErrors = exports.Client = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var stellar_base_1 = require("stellar-base");
var model_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/common/v3/model_pb"));
var model_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/common/v4/model_pb"));
var transaction_service_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb"));
var web3_js_1 = require("@solana/web3.js");
var client_1 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
var errors_1 = require("./errors");
Object.defineProperty(exports, "TransactionErrors", { enumerable: true, get: function () { return errors_1.TransactionErrors; } });
var keys_1 = require("./keys");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return keys_1.PrivateKey; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return keys_1.PublicKey; } });
var memo_1 = require("./memo");
Object.defineProperty(exports, "Memo", { enumerable: true, get: function () { return memo_1.Memo; } });
var memo_program_1 = require("./solana/memo-program");
var token_program_1 = require("./solana/token-program");
exports.MAX_TRANSACTION_TYPE = 3;
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Unknown"] = -1] = "Unknown";
    TransactionType[TransactionType["None"] = 0] = "None";
    TransactionType[TransactionType["Earn"] = 1] = "Earn";
    TransactionType[TransactionType["Spend"] = 2] = "Spend";
    TransactionType[TransactionType["P2P"] = 3] = "P2P";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var TransactionState;
(function (TransactionState) {
    TransactionState[TransactionState["Unknown"] = 0] = "Unknown";
    TransactionState[TransactionState["Success"] = 1] = "Success";
    TransactionState[TransactionState["Failed"] = 2] = "Failed";
    TransactionState[TransactionState["Pending"] = 3] = "Pending";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
function transactionStateFromProto(state) {
    switch (state) {
        case transaction_service_pb_1.default.GetTransactionResponse.State.SUCCESS:
            return TransactionState.Success;
        case transaction_service_pb_1.default.GetTransactionResponse.State.FAILED:
            return TransactionState.Failed;
        case transaction_service_pb_1.default.GetTransactionResponse.State.PENDING:
            return TransactionState.Pending;
        default:
            return TransactionState.Unknown;
    }
}
exports.transactionStateFromProto = transactionStateFromProto;
// Commitment is used to indicate to Solana nodes which bank state to query.
// See: https://docs.solana.com/apps/jsonrpc-api#configuring-state-commitment
var Commitment;
(function (Commitment) {
    // The node will query its most recent block.
    Commitment[Commitment["Recent"] = 0] = "Recent";
    // The node will query the most recent block that has been voted on by supermajority of the cluster.
    Commitment[Commitment["Single"] = 1] = "Single";
    // The node will query the most recent block having reached maximum lockout on this node.
    Commitment[Commitment["Root"] = 2] = "Root";
    // The node will query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout.
    Commitment[Commitment["Max"] = 3] = "Max";
})(Commitment = exports.Commitment || (exports.Commitment = {}));
function commitmentToProto(commitment) {
    switch (commitment) {
        case Commitment.Single:
            return model_pb_2.default.Commitment.SINGLE;
        case Commitment.Recent:
            return model_pb_2.default.Commitment.RECENT;
        case Commitment.Root:
            return model_pb_2.default.Commitment.ROOT;
        case Commitment.Max:
            return model_pb_2.default.Commitment.MAX;
        default:
            throw new Error("unexpected commitment value: " + commitment);
    }
}
exports.commitmentToProto = commitmentToProto;
// AccountResolution is used to indicate which type of account resolution should be used if a transaction on Kin 4 fails due to 
// an account being unavailable.
var AccountResolution;
(function (AccountResolution) {
    // No account resolution will be used.
    AccountResolution[AccountResolution["Exact"] = 0] = "Exact";
    // When used for a sender key, in a payment or earn request, if Agora is able to resolve the original sender public key to 
    // a set of token accounts, the original sender will be used as the owner in the Solana transfer instruction and the first
    // resolved token account will be used as the sender.
    //
    // When used for a destination key in a payment or earn request, if Agora is able to resolve the destination key to a set 
    // of token accounts, the first resolved token account will be used as the destination in the Solana transfer instruction.
    AccountResolution[AccountResolution["Preferred"] = 1] = "Preferred";
})(AccountResolution = exports.AccountResolution || (exports.AccountResolution = {}));
// Environment specifies the desired Kin environment to use.
var Environment;
(function (Environment) {
    Environment[Environment["Prod"] = 0] = "Prod";
    Environment[Environment["Test"] = 1] = "Test";
})(Environment = exports.Environment || (exports.Environment = {}));
var NetworkPasshrase;
(function (NetworkPasshrase) {
    NetworkPasshrase["Prod"] = "Kin Mainnet ; December 2018";
    NetworkPasshrase["Test"] = "Kin Testnet ; December 2018";
    NetworkPasshrase["Kin2Prod"] = "Public Global Kin Ecosystem Network ; June 2018";
    NetworkPasshrase["Kin2Test"] = "Kin Playground Network ; June 2018";
})(NetworkPasshrase = exports.NetworkPasshrase || (exports.NetworkPasshrase = {}));
exports.KinAssetCode = "KIN";
var KinAssetCodeBuffer = Buffer.from([75, 73, 78, 0]);
var Kin2Issuers;
(function (Kin2Issuers) {
    Kin2Issuers["Prod"] = "GDF42M3IPERQCBLWFEZKQRK77JQ65SCKTU3CW36HZVCX7XX5A5QXZIVK";
    Kin2Issuers["Test"] = "GBC3SG6NGTSZ2OMH3FFGB7UVRQWILW367U4GSOOF4TFSZONV42UJXUH7";
})(Kin2Issuers = exports.Kin2Issuers || (exports.Kin2Issuers = {}));
// kinToQuarks converts a string representation of kin
// to the quark value.
//
// If the provided kin amount contains more than 5 decimal
// places (i.e. an inexact number of quarks), additional
// decimal places will be ignored.
//
// For example, passing in a value of "0.000009" will result
// in a value of 0 quarks being returned.
//
function kinToQuarks(amount) {
    var b = new bignumber_js_1.default(amount).decimalPlaces(5, bignumber_js_1.default.ROUND_DOWN);
    return b.multipliedBy(1e5);
}
exports.kinToQuarks = kinToQuarks;
function quarksToKin(amount) {
    return new bignumber_js_1.default(amount).dividedBy(1e5).toString();
}
exports.quarksToKin = quarksToKin;
function xdrInt64ToBigNumber(i64) {
    var amount = bignumber_js_1.default.sum(new bignumber_js_1.default(i64.high).multipliedBy(Math.pow(2, 32)), new bignumber_js_1.default(i64.low));
    return amount;
}
exports.xdrInt64ToBigNumber = xdrInt64ToBigNumber;
function protoToInvoice(invoice) {
    var result = {
        Items: invoice.getItemsList().map(function (x) {
            var item = {
                title: x.getTitle(),
                amount: new bignumber_js_1.default(x.getAmount()),
            };
            if (x.getDescription()) {
                item.description = x.getDescription();
            }
            if (x.getSku()) {
                item.sku = Buffer.from(x.getSku());
            }
            return item;
        })
    };
    return result;
}
function invoiceToProto(invoice) {
    var result = new model_pb_1.default.Invoice();
    result.setItemsList(invoice.Items.map(function (x) {
        var item = new model_pb_1.default.Invoice.LineItem();
        item.setTitle(x.title);
        item.setAmount(x.amount.toString());
        if (x.description) {
            item.setDescription(x.description);
        }
        if (x.sku) {
            item.setSku(x.sku);
        }
        return item;
    }));
    return result;
}
exports.invoiceToProto = invoiceToProto;
function paymentsFromEnvelope(envelope, type, invoiceList, kinVersion) {
    var payments = [];
    if (!kinVersion) {
        kinVersion = 3;
    }
    if (invoiceList && invoiceList.getInvoicesList().length != envelope.v0().tx().operations().length) {
        throw new Error("provided invoice count does not match op count");
    }
    envelope.v0().tx().operations().map(function (op, i) {
        // Currently we only support payment operations in this RPC.
        //
        // We could potentially expand this to CreateAccount functions,
        // as well as merge account. However, GetTransaction() is primarily
        // only used for payments
        if (op.body().switch() != stellar_base_1.xdr.OperationType.payment()) {
            return;
        }
        if (kinVersion === 2) {
            var assetName = op.body().paymentOp().asset().switch().name;
            if (assetName !== "assetTypeCreditAlphanum4" ||
                !op.body().paymentOp().asset().alphaNum4().assetCode().equals(KinAssetCodeBuffer)) {
                // Only Kin payment operations are supported in this RPC.
                return;
            }
        }
        var sender;
        if (op.sourceAccount()) {
            sender = new keys_1.PublicKey(op.sourceAccount().ed25519());
        }
        else {
            sender = new keys_1.PublicKey(envelope.v0().tx().sourceAccountEd25519());
        }
        var quarks;
        if (kinVersion === 2) {
            // The smallest denomination on Kin 2 is 1e-7, which is smaller than quarks (1e-5) by 1e2. Therefore, when
            // parsing envelope amounts, we divide by 1e2 to get the amount in quarks.
            quarks = xdrInt64ToBigNumber(op.body().paymentOp().amount()).dividedBy(1e2).toString();
        }
        else {
            quarks = xdrInt64ToBigNumber(op.body().paymentOp().amount()).toString();
        }
        var p = {
            sender: sender,
            destination: new keys_1.PublicKey(op.body().paymentOp().destination().ed25519()),
            quarks: quarks,
            type: type,
        };
        if (invoiceList) {
            p.invoice = protoToInvoice(invoiceList.getInvoicesList()[i]);
        }
        else if (envelope.v0().tx().memo().switch() === stellar_base_1.xdr.MemoType.memoText()) {
            p.memo = envelope.v0().tx().memo().text().toString();
        }
        payments.push(p);
    });
    return payments;
}
exports.paymentsFromEnvelope = paymentsFromEnvelope;
function paymentsFromTransaction(transaction, invoiceList) {
    var payments = [];
    var transferStartIndex = 0;
    var agoraMemo;
    var textMemo;
    if (transaction.instructions[0].programId.equals(memo_program_1.MemoProgram.programId)) {
        var memoParams = memo_program_1.MemoInstruction.decodeMemo(transaction.instructions[0]);
        transferStartIndex = 1;
        try {
            agoraMemo = memo_1.Memo.fromB64String(memoParams.data, false);
        }
        catch (e) {
            // not a valid agora memo
            textMemo = memoParams.data;
        }
    }
    var transferCount = transaction.instructions.length - transferStartIndex;
    if (invoiceList && (invoiceList === null || invoiceList === void 0 ? void 0 : invoiceList.getInvoicesList().length) !== transferCount) {
        throw new Error("number of invoices does not match number of payments");
    }
    transaction.instructions.slice(transferStartIndex).forEach(function (instruction, i) {
        var transferParams;
        try {
            transferParams = token_program_1.TokenInstruction.decodeTransfer(instruction);
        }
        catch (error) {
            return;
        }
        var p = {
            sender: new keys_1.PublicKey(transferParams.source.toBuffer()),
            destination: new keys_1.PublicKey(transferParams.dest.toBuffer()),
            type: agoraMemo ? agoraMemo.TransactionType() : TransactionType.Unknown,
            quarks: transferParams.amount.toString(),
        };
        if (invoiceList) {
            p.invoice = protoToInvoice(invoiceList.getInvoicesList()[i]);
        }
        else if (textMemo) {
            p.memo = textMemo;
        }
        payments.push(p);
    });
    return payments;
}
exports.paymentsFromTransaction = paymentsFromTransaction;
// TransactionData contains both metadata and payment data related to
// a blockchain transaction.
var TransactionData = /** @class */ (function () {
    function TransactionData() {
        this.txId = Buffer.alloc(0);
        this.txState = TransactionState.Unknown;
        this.payments = new Array();
    }
    return TransactionData;
}());
exports.TransactionData = TransactionData;
function txDataFromProto(item, state) {
    var _a;
    var data = new TransactionData();
    data.txId = Buffer.from(item.getTransactionId().getValue());
    data.txState = transactionStateFromProto(state);
    var invoiceList = item.getInvoiceList();
    if (invoiceList && invoiceList.getInvoicesList().length !== item.getPaymentsList().length) {
        throw new Error("number of invoices does not match number of payments");
    }
    var txType = TransactionType.Unknown;
    var stringMemo;
    if (item.getSolanaTransaction()) {
        var val = item.getSolanaTransaction().getValue_asU8();
        var solanaTx = web3_js_1.Transaction.from(Buffer.from(val));
        if (solanaTx.instructions[0].programId.equals(memo_program_1.MemoProgram.programId)) {
            var memoParams = memo_program_1.MemoInstruction.decodeMemo(solanaTx.instructions[0]);
            var agoraMemo = void 0;
            try {
                agoraMemo = memo_1.Memo.fromB64String(memoParams.data, false);
                txType = agoraMemo.TransactionType();
            }
            catch (e) {
                // not a valid agora memo
                stringMemo = memoParams.data;
            }
        }
        if (item.getTransactionError()) {
            data.errors = errors_1.errorsFromSolanaTx(solanaTx, item.getTransactionError());
        }
    }
    else if ((_a = item.getStellarTransaction()) === null || _a === void 0 ? void 0 : _a.getEnvelopeXdr()) {
        var envelope = stellar_base_1.xdr.TransactionEnvelope.fromXDR(Buffer.from(item.getStellarTransaction().getEnvelopeXdr()));
        var agoraMemo = memo_1.Memo.fromXdr(envelope.v0().tx().memo(), true);
        if (agoraMemo) {
            txType = agoraMemo.TransactionType();
        }
        else if (envelope.v0().tx().memo().switch() === stellar_base_1.xdr.MemoType.memoText()) {
            stringMemo = envelope.v0().tx().memo().text().toString();
        }
        if (item.getTransactionError()) {
            data.errors = errors_1.errorsFromStellarTx(envelope, item.getTransactionError());
        }
    }
    else {
        // This case *shouldn't* happen since either a solana or stellar should be set
        throw new Error("invalid transaction");
    }
    var payments = [];
    item.getPaymentsList().forEach(function (payment, i) {
        var p = {
            sender: new keys_1.PublicKey(Buffer.from(payment.getSource().getValue_asU8())),
            destination: new keys_1.PublicKey(Buffer.from(payment.getDestination().getValue_asU8())),
            quarks: new bignumber_js_1.default(payment.getAmount()).toString(),
            type: txType
        };
        if (item.getInvoiceList()) {
            p.invoice = protoToInvoice(item.getInvoiceList().getInvoicesList()[i]);
        }
        else if (stringMemo) {
            p.memo = stringMemo;
        }
        payments.push(p);
    });
    data.payments = payments;
    return data;
}
exports.txDataFromProto = txDataFromProto;
