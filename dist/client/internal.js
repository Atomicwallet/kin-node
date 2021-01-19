"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Internal = exports.SubmitTransactionResult = exports.USER_AGENT = exports.DESIRED_KIN_VERSION_HEADER = exports.KIN_VERSION_HEADER = exports.USER_AGENT_HEADER = exports.SDK_VERSION = void 0;
var grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
var model_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/common/v3/model_pb"));
var account_service_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/account/v3/account_service_pb"));
var account_service_grpc_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/account/v3/account_service_grpc_pb"));
var transaction_service_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v3/transaction_service_pb"));
var transaction_service_grpc_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v3/transaction_service_grpc_pb"));
var account_service_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/account/v4/account_service_pb"));
var account_service_grpc_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/account/v4/account_service_grpc_pb"));
var airdrop_service_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/airdrop/v4/airdrop_service_pb"));
var airdrop_service_grpc_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/airdrop/v4/airdrop_service_grpc_pb"));
var model_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/common/v4/model_pb"));
var transaction_service_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb"));
var transaction_service_grpc_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v4/transaction_service_grpc_pb"));
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
var stellar_base_1 = require("stellar-base");
var __1 = require("../");
var errors_1 = require("../errors");
var retry_1 = require("../retry");
var web3_js_2 = require("@solana/web3.js");
var token_program_1 = require("../solana/token-program");
var lru_cache_1 = __importDefault(require("lru-cache"));
var utils_1 = require("./utils");
exports.SDK_VERSION = "0.2.3";
exports.USER_AGENT_HEADER = "kin-user-agent";
exports.KIN_VERSION_HEADER = "kin-version";
exports.DESIRED_KIN_VERSION_HEADER = "desired-kin-version";
exports.USER_AGENT = "KinSDK/" + exports.SDK_VERSION + " node/" + process.version;
var SERVICE_CONFIG_CACHE_KEY = "GetServiceConfig";
var SubmitTransactionResult = /** @class */ (function () {
    function SubmitTransactionResult() {
        this.TxId = Buffer.alloc(32);
    }
    return SubmitTransactionResult;
}());
exports.SubmitTransactionResult = SubmitTransactionResult;
// Internal is the low level gRPC client for Agora used by Client.
//
// The interface is _not_ stable, and should not be used. However,
// it is exported in case there is some strong reason that access
// to the underlying blockchain primitives are required.
var Internal = /** @class */ (function () {
    function Internal(config) {
        if (config.endpoint) {
            if (config.accountClient || config.txClient || config.accountClientV4 || config.airdropClientV4 || config.txClientV4) {
                throw new Error("cannot specify endpoint and clients");
            }
            var sslCreds = grpc_js_1.default.credentials.createSsl();
            this.accountClient = new account_service_grpc_pb_1.default.AccountClient(config.endpoint, sslCreds);
            this.txClient = new transaction_service_grpc_pb_1.default.TransactionClient(config.endpoint, sslCreds);
            this.accountClientV4 = new account_service_grpc_pb_2.default.AccountClient(config.endpoint, sslCreds);
            this.airdropClientV4 = new airdrop_service_grpc_pb_1.default.AirdropClient(config.endpoint, sslCreds);
            this.txClientV4 = new transaction_service_grpc_pb_2.default.TransactionClient(config.endpoint, sslCreds);
        }
        else if (config.accountClient) {
            if (!config.txClient || !config.accountClientV4 || !config.airdropClientV4 || !config.txClientV4) {
                throw new Error("must specify all gRPC clients");
            }
            this.accountClient = config.accountClient;
            this.txClient = config.txClient;
            this.accountClientV4 = config.accountClientV4;
            this.airdropClientV4 = config.airdropClientV4;
            this.txClientV4 = config.txClientV4;
        }
        else {
            throw new Error("must specify endpoint or gRPC clients");
        }
        if (config.strategies) {
            this.strategies = config.strategies;
        }
        else {
            this.strategies = [
                retry_1.limit(3),
                retry_1.nonRetriableErrors.apply(void 0, errors_1.nonRetriableErrors),
            ];
        }
        if (config.kinVersion) {
            this.kinVersion = config.kinVersion;
        }
        else {
            this.kinVersion = 3;
        }
        this.metadata = new grpc_js_1.default.Metadata();
        this.metadata.set(exports.USER_AGENT_HEADER, exports.USER_AGENT);
        this.metadata.set(exports.KIN_VERSION_HEADER, this.kinVersion.toString());
        if (config.desiredKinVersion) {
            this.metadata.set(exports.DESIRED_KIN_VERSION_HEADER, config.desiredKinVersion.toString());
        }
        // Currently only caching GetServiceConfig, so limit to 1 entry
        this.responseCache = new lru_cache_1.default({
            max: 1,
            maxAge: 24 * 60 * 60 * 1000,
        });
    }
    Internal.prototype.setKinVersion = function (kinVersion) {
        this.kinVersion = kinVersion;
        this.metadata.set(exports.KIN_VERSION_HEADER, this.kinVersion.toString());
    };
    Internal.prototype.getBlockchainVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = new transaction_service_pb_2.default.GetMinimumKinVersionRequest();
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClientV4.getMinimumKinVersion(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve(resp.getVersion());
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.createStellarAccount = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, req;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = new model_pb_1.default.StellarAccountId();
                accountId.setValue(key.publicKey().stellarAddress());
                req = new account_service_pb_1.default.CreateAccountRequest();
                req.setAccountId(accountId);
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.accountClient.createAccount(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    if (resp.getResult() == account_service_pb_1.default.CreateAccountResponse.Result.EXISTS) {
                                        reject(new errors_1.AccountExists());
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getAccountInfo = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, req;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = new model_pb_1.default.StellarAccountId();
                accountId.setValue(account.stellarAddress());
                req = new account_service_pb_1.default.GetAccountInfoRequest();
                req.setAccountId(accountId);
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.accountClient.getAccountInfo(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    if (resp.getResult() == account_service_pb_1.default.GetAccountInfoResponse.Result.NOT_FOUND) {
                                        reject(new errors_1.AccountDoesNotExist());
                                        return;
                                    }
                                    resolve(resp.getAccountInfo());
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getStellarTransaction = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var transactionHash, req;
            var _this = this;
            return __generator(this, function (_a) {
                transactionHash = new model_pb_1.default.TransactionHash();
                transactionHash.setValue(hash);
                req = new transaction_service_pb_1.default.GetTransactionRequest();
                req.setTransactionHash(transactionHash);
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClient.getTransaction(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    var data = new __1.TransactionData();
                                    data.txId = hash;
                                    switch (resp.getState()) {
                                        case transaction_service_pb_1.default.GetTransactionResponse.State.UNKNOWN: {
                                            data.txState = __1.TransactionState.Unknown;
                                            break;
                                        }
                                        case transaction_service_pb_1.default.GetTransactionResponse.State.SUCCESS: {
                                            var envelope = stellar_base_1.xdr.TransactionEnvelope.fromXDR(Buffer.from(resp.getItem().getEnvelopeXdr()));
                                            var type = __1.TransactionType.Unknown;
                                            var memo = __1.Memo.fromXdr(envelope.v0().tx().memo(), true);
                                            if (memo) {
                                                type = memo.TransactionType();
                                            }
                                            data.txState = __1.TransactionState.Success;
                                            data.payments = __1.paymentsFromEnvelope(envelope, type, resp.getItem().getInvoiceList(), _this.kinVersion);
                                            break;
                                        }
                                        default: {
                                            reject("unknown transaction state: " + resp.getState());
                                            return;
                                        }
                                    }
                                    resolve(data);
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.submitStellarTransaction = function (envelope, invoiceList) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = new transaction_service_pb_1.default.SubmitTransactionRequest();
                req.setEnvelopeXdr(envelope.toXDR());
                req.setInvoiceList(invoiceList);
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClient.submitTransaction(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    var result = new SubmitTransactionResult();
                                    result.TxId = Buffer.from(resp.getHash().getValue());
                                    switch (resp.getResult()) {
                                        case transaction_service_pb_1.default.SubmitTransactionResponse.Result.OK: {
                                            break;
                                        }
                                        case transaction_service_pb_1.default.SubmitTransactionResponse.Result.REJECTED: {
                                            reject(new errors_1.TransactionRejected());
                                            return;
                                        }
                                        case transaction_service_pb_1.default.SubmitTransactionResponse.Result.INVOICE_ERROR: {
                                            result.InvoiceErrors = resp.getInvoiceErrorsList();
                                            break;
                                        }
                                        case transaction_service_pb_1.default.SubmitTransactionResponse.Result.FAILED: {
                                            var resultXdr = stellar_base_1.xdr.TransactionResult.fromXDR(Buffer.from(resp.getResultXdr()));
                                            result.Errors = errors_1.errorsFromXdr(resultXdr);
                                            break;
                                        }
                                        default:
                                            reject("unexpected result from agora: " + resp.getResult());
                                            return;
                                    }
                                    resolve(result);
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.createSolanaAccount = function (key, commitment, subsidizer) {
        if (commitment === void 0) { commitment = __1.Commitment.Single; }
        return __awaiter(this, void 0, void 0, function () {
            var tokenAccountKey, fn;
            var _this = this;
            return __generator(this, function (_a) {
                tokenAccountKey = utils_1.generateTokenAccount(key);
                fn = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, serviceConfigResp, recentBlockhash, minBalance, subsidizerKey, tokenProgram, transaction, protoTx, req;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, Promise.all([
                                    this.getServiceConfig(),
                                    this.getRecentBlockhash(),
                                    this.getMinimumBalanceForRentExemption()
                                ])];
                            case 1:
                                _a = _b.sent(), serviceConfigResp = _a[0], recentBlockhash = _a[1], minBalance = _a[2];
                                if (!subsidizer && !serviceConfigResp.getSubsidizerAccount()) {
                                    throw new errors_1.NoSubsidizerError();
                                }
                                if (subsidizer) {
                                    subsidizerKey = subsidizer.publicKey().solanaKey();
                                }
                                else {
                                    subsidizerKey = new web3_js_1.PublicKey(Buffer.from(serviceConfigResp.getSubsidizerAccount().getValue_asU8()));
                                }
                                tokenProgram = new web3_js_1.PublicKey(Buffer.from(serviceConfigResp.getTokenProgram().getValue_asU8()));
                                transaction = new web3_js_2.Transaction({
                                    feePayer: subsidizerKey,
                                    recentBlockhash: recentBlockhash,
                                }).add(web3_js_1.SystemProgram.createAccount({
                                    fromPubkey: subsidizerKey,
                                    newAccountPubkey: tokenAccountKey.publicKey().solanaKey(),
                                    lamports: minBalance,
                                    space: token_program_1.AccountSize,
                                    programId: tokenProgram,
                                }), token_program_1.TokenProgram.initializeAccount({
                                    account: tokenAccountKey.publicKey().solanaKey(),
                                    mint: new web3_js_1.PublicKey(Buffer.from(serviceConfigResp.getToken().getValue_asU8())),
                                    owner: key.publicKey().solanaKey(),
                                }, tokenProgram), token_program_1.TokenProgram.setAuthority({
                                    account: tokenAccountKey.publicKey().solanaKey(),
                                    currentAuthority: key.publicKey().solanaKey(),
                                    newAuthority: subsidizerKey,
                                    authorityType: token_program_1.AuthorityType.CloseAccount,
                                }, tokenProgram));
                                transaction.partialSign(new web3_js_1.Account(key.secretKey()), new web3_js_1.Account(tokenAccountKey.secretKey()));
                                if (subsidizer) {
                                    transaction.partialSign(new web3_js_1.Account(subsidizer.secretKey()));
                                }
                                protoTx = new model_pb_2.default.Transaction();
                                protoTx.setValue(transaction.serialize({
                                    requireAllSignatures: false,
                                    verifySignatures: false,
                                }));
                                req = new account_service_pb_2.default.CreateAccountRequest();
                                req.setTransaction(protoTx);
                                req.setCommitment(__1.commitmentToProto(commitment));
                                return [2 /*return*/, new Promise(function (resolve, reject) {
                                        _this.accountClientV4.createAccount(req, _this.metadata, function (err, resp) {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            switch (resp.getResult()) {
                                                case account_service_pb_2.default.CreateAccountResponse.Result.EXISTS:
                                                    reject(new errors_1.AccountExists());
                                                    break;
                                                case account_service_pb_2.default.CreateAccountResponse.Result.PAYER_REQUIRED:
                                                    reject(new errors_1.PayerRequired());
                                                    break;
                                                case account_service_pb_2.default.CreateAccountResponse.Result.BAD_NONCE:
                                                    reject(new errors_1.BadNonce());
                                                    break;
                                                case account_service_pb_2.default.CreateAccountResponse.Result.OK:
                                                    resolve();
                                                    break;
                                                default:
                                                    reject(Error("unexpected result from Agora: " + resp.getResult()));
                                                    break;
                                            }
                                        });
                                    })];
                        }
                    });
                }); };
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([fn], this.strategies)).catch(function (err) {
                        return Promise.reject(err);
                    })];
            });
        });
    };
    Internal.prototype.getSolanaAccountInfo = function (account, commitment) {
        if (commitment === void 0) { commitment = __1.Commitment.Single; }
        return __awaiter(this, void 0, void 0, function () {
            var accountId, req;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = new model_pb_2.default.SolanaAccountId();
                accountId.setValue(account.buffer);
                req = new account_service_pb_2.default.GetAccountInfoRequest();
                req.setAccountId(accountId);
                req.setCommitment(__1.commitmentToProto(commitment));
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.accountClientV4.getAccountInfo(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    if (resp.getResult() === account_service_pb_2.default.GetAccountInfoResponse.Result.NOT_FOUND) {
                                        reject(new errors_1.AccountDoesNotExist());
                                        return;
                                    }
                                    resolve(resp.getAccountInfo());
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.submitSolanaTransaction = function (tx, invoiceList, commitment, dedupeId) {
        if (commitment === void 0) { commitment = __1.Commitment.Single; }
        return __awaiter(this, void 0, void 0, function () {
            var protoTx, req, attempt;
            var _this = this;
            return __generator(this, function (_a) {
                protoTx = new model_pb_2.default.Transaction();
                protoTx.setValue(tx.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                }));
                req = new transaction_service_pb_2.default.SubmitTransactionRequest();
                req.setTransaction(protoTx);
                req.setInvoiceList(invoiceList);
                req.setCommitment(__1.commitmentToProto(commitment));
                if (dedupeId) {
                    req.setDedupeId(dedupeId);
                }
                attempt = 0;
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                attempt = attempt + 1;
                                _this.txClientV4.submitTransaction(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    var result = new SubmitTransactionResult();
                                    result.TxId = Buffer.from(resp.getSignature().getValue());
                                    switch (resp.getResult()) {
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.OK: {
                                            break;
                                        }
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.ALREADY_SUBMITTED: {
                                            // If this occurs on the first attempt, it's likely due to the submission of two identical transactions
                                            // in quick succession and we should raise the error to the caller. Otherwise, it's likely that the
                                            // transaction completed successfully on a previous attempt that failed due to a transient error.
                                            if (attempt == 1) {
                                                reject(new errors_1.AlreadySubmitted());
                                                return;
                                            }
                                            break;
                                        }
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.REJECTED: {
                                            reject(new errors_1.TransactionRejected());
                                            return;
                                        }
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.PAYER_REQUIRED: {
                                            reject(new errors_1.PayerRequired());
                                            return;
                                        }
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.INVOICE_ERROR: {
                                            result.InvoiceErrors = resp.getInvoiceErrorsList();
                                            break;
                                        }
                                        case transaction_service_pb_2.default.SubmitTransactionResponse.Result.FAILED: {
                                            result.Errors = errors_1.errorsFromSolanaTx(tx, resp.getTransactionError());
                                            break;
                                        }
                                        default:
                                            reject("unexpected result from agora: " + resp.getResult());
                                            return;
                                    }
                                    resolve(result);
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getTransaction = function (id, commitment) {
        if (commitment === void 0) { commitment = __1.Commitment.Single; }
        return __awaiter(this, void 0, void 0, function () {
            var transactionId, req;
            var _this = this;
            return __generator(this, function (_a) {
                transactionId = new model_pb_2.default.TransactionId();
                transactionId.setValue(id);
                req = new transaction_service_pb_2.default.GetTransactionRequest();
                req.setTransactionId(transactionId);
                req.setCommitment(__1.commitmentToProto(commitment));
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClientV4.getTransaction(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    var data;
                                    if (resp.getItem()) {
                                        data = __1.txDataFromProto(resp.getItem(), resp.getState());
                                    }
                                    else {
                                        data = new __1.TransactionData();
                                        data.txId = id;
                                        data.txState = __1.transactionStateFromProto(resp.getState());
                                    }
                                    resolve(data);
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getServiceConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = new transaction_service_pb_2.default.GetServiceConfigRequest();
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                var cached = _this.responseCache.get(SERVICE_CONFIG_CACHE_KEY);
                                if (cached) {
                                    var resp = transaction_service_pb_2.default.GetServiceConfigResponse.deserializeBinary(Buffer.from(cached, "base64"));
                                    resolve(resp);
                                    return;
                                }
                                _this.txClientV4.getServiceConfig(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    _this.responseCache.set(SERVICE_CONFIG_CACHE_KEY, Buffer.from(resp.serializeBinary()).toString("base64"));
                                    resolve(resp);
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getRecentBlockhash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = new transaction_service_pb_2.default.GetRecentBlockhashRequest();
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClientV4.getRecentBlockhash(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve(bs58_1.default.encode(Buffer.from(resp.getBlockhash().getValue_asU8())));
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.getMinimumBalanceForRentExemption = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = new transaction_service_pb_2.default.GetMinimumBalanceForRentExemptionRequest();
                req.setSize(token_program_1.AccountSize);
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.txClientV4.getMinimumBalanceForRentExemption(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve(resp.getLamports());
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.requestAirdrop = function (publicKey, quarks, commitment) {
        if (commitment === void 0) { commitment = __1.Commitment.Single; }
        return __awaiter(this, void 0, void 0, function () {
            var accountId, req;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = new model_pb_2.default.SolanaAccountId();
                accountId.setValue(publicKey.buffer);
                req = new airdrop_service_pb_1.default.RequestAirdropRequest();
                req.setAccountId(accountId);
                req.setQuarks(quarks.toNumber());
                req.setCommitment(__1.commitmentToProto(commitment));
                return [2 /*return*/, retry_1.retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                _this.airdropClientV4.requestAirdrop(req, _this.metadata, function (err, resp) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    switch (resp.getResult()) {
                                        case (airdrop_service_pb_1.default.RequestAirdropResponse.Result.OK):
                                            resolve(Buffer.from(resp.getSignature().getValue_asU8()));
                                            return;
                                        case (airdrop_service_pb_1.default.RequestAirdropResponse.Result.NOT_FOUND):
                                            reject(new errors_1.AccountDoesNotExist());
                                            return;
                                        case (airdrop_service_pb_1.default.RequestAirdropResponse.Result.INSUFFICIENT_KIN):
                                            reject(new errors_1.InsufficientBalance());
                                            return;
                                        default:
                                            reject("unexpected result from agora: " + resp.getResult());
                                            return;
                                    }
                                });
                            });
                        }], this.strategies))];
            });
        });
    };
    Internal.prototype.resolveTokenAccounts = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var accountId, req;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = new model_pb_2.default.SolanaAccountId();
                accountId.setValue(publicKey.buffer);
                req = new account_service_pb_2.default.ResolveTokenAccountsRequest();
                req.setAccountId(accountId);
                return [2 /*return*/, retry_1.retryAsync(function () {
                        return new Promise(function (resolve, reject) {
                            _this.accountClientV4.resolveTokenAccounts(req, _this.metadata, function (err, resp) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(resp.getTokenAccountsList().map((function (tokenAccount) {
                                    return new __1.PublicKey(Buffer.from(tokenAccount.getValue_asU8()));
                                })));
                            });
                        });
                    })];
            });
        });
    };
    return Internal;
}());
exports.Internal = Internal;
