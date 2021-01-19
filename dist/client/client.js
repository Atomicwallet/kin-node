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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var grpc_js_1 = require("@grpc/grpc-js");
var hash_js_1 = __importDefault(require("hash.js"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var stellar_base_1 = require("stellar-base");
var lru_cache_1 = __importDefault(require("lru-cache"));
var web3_js_1 = require("@solana/web3.js");
var model_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/common/v3/model_pb"));
var __1 = require("../");
var _1 = require("./");
var errors_1 = require("../errors");
var retry_1 = require("../retry");
var memo_program_1 = require("../solana/memo-program");
var token_program_1 = require("../solana/token-program");
var defaultRetryConfig = {
    maxRetries: 5,
    minDelaySeconds: 0.5,
    maxDelaySeconds: 10,
    maxNonceRefreshes: 3,
};
// Maximum size taken from: https://github.com/solana-labs/solana/blob/39b3ac6a8d29e14faa1de73d8b46d390ad41797b/sdk/src/packet.rs#L9-L13
var maxTxSize = 1232;
// Client is the primary class that should be used for interacting with kin.
//
// Client abstracts away the underlying blockchain implementations, allowing for
// easier upgrades in the future.
var Client = /** @class */ (function () {
    function Client(env, conf) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (conf === null || conf === void 0 ? void 0 : conf.endpoint) {
            if (conf === null || conf === void 0 ? void 0 : conf.internal) {
                throw new Error("cannot specify both endpoint and internal client");
            }
            if ((conf === null || conf === void 0 ? void 0 : conf.accountClient) || (conf === null || conf === void 0 ? void 0 : conf.txClient) || (conf === null || conf === void 0 ? void 0 : conf.accountClientV4) || (conf === null || conf === void 0 ? void 0 : conf.airdropClientV4) || (conf === null || conf === void 0 ? void 0 : conf.txClientV4)) {
                throw new Error("cannot specify both endpoint and gRPC clients");
            }
        }
        else if (conf === null || conf === void 0 ? void 0 : conf.internal) {
            if ((conf === null || conf === void 0 ? void 0 : conf.accountClient) || (conf === null || conf === void 0 ? void 0 : conf.txClient) || (conf === null || conf === void 0 ? void 0 : conf.accountClientV4) || (conf === null || conf === void 0 ? void 0 : conf.airdropClientV4) || (conf === null || conf === void 0 ? void 0 : conf.txClientV4)) {
                throw new Error("cannot specify both internal and gRPC clients");
            }
        }
        else if (((conf === null || conf === void 0 ? void 0 : conf.accountClient) == undefined) !== ((conf === null || conf === void 0 ? void 0 : conf.txClient) == undefined) ||
            ((conf === null || conf === void 0 ? void 0 : conf.accountClient) == undefined) !== ((conf === null || conf === void 0 ? void 0 : conf.accountClientV4) == undefined) ||
            ((conf === null || conf === void 0 ? void 0 : conf.accountClient) == undefined) !== ((conf === null || conf === void 0 ? void 0 : conf.airdropClientV4) == undefined) ||
            ((conf === null || conf === void 0 ? void 0 : conf.accountClient) == undefined) !== ((conf === null || conf === void 0 ? void 0 : conf.txClientV4) == undefined)) {
            throw new Error("either all or none of the gRPC clients must be set");
        }
        if (conf === null || conf === void 0 ? void 0 : conf.kinVersion) {
            this.kinVersion = conf.kinVersion;
        }
        else {
            this.kinVersion = 3;
        }
        var defaultEndpoint;
        switch (env) {
            case __1.Environment.Test:
                this.networkPassphrase = __1.NetworkPasshrase.Test;
                defaultEndpoint = "api.agorainfra.dev:443";
                if (this.kinVersion === 2) {
                    this.networkPassphrase = __1.NetworkPasshrase.Kin2Test;
                    this.issuer = __1.Kin2Issuers.Test;
                }
                else if (this.kinVersion == 3) {
                    this.networkPassphrase = __1.NetworkPasshrase.Test;
                }
                break;
            case __1.Environment.Prod:
                defaultEndpoint = "api.agorainfra.net:443";
                if (this.kinVersion === 2) {
                    this.networkPassphrase = __1.NetworkPasshrase.Kin2Prod;
                    this.issuer = __1.Kin2Issuers.Prod;
                }
                else if (this.kinVersion == 3) {
                    this.networkPassphrase = __1.NetworkPasshrase.Prod;
                }
                break;
            default:
                throw new Error("unsupported env:" + env);
        }
        this.env = env;
        if (conf) {
            this.appIndex = conf.appIndex;
            this.whitelistKey = conf.whitelistKey;
        }
        this.retryConfig = defaultRetryConfig;
        if ((_a = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _a === void 0 ? void 0 : _a.maxRetries) {
            this.retryConfig.maxRetries = (_b = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _b === void 0 ? void 0 : _b.maxRetries;
        }
        if ((_c = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _c === void 0 ? void 0 : _c.minDelaySeconds) {
            this.retryConfig.minDelaySeconds = (_d = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _d === void 0 ? void 0 : _d.minDelaySeconds;
        }
        if ((_e = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _e === void 0 ? void 0 : _e.maxDelaySeconds) {
            this.retryConfig.maxDelaySeconds = (_f = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _f === void 0 ? void 0 : _f.maxDelaySeconds;
        }
        if ((_g = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _g === void 0 ? void 0 : _g.maxNonceRefreshes) {
            this.retryConfig.maxNonceRefreshes = (_h = conf === null || conf === void 0 ? void 0 : conf.retryConfig) === null || _h === void 0 ? void 0 : _h.maxNonceRefreshes;
        }
        if ((conf === null || conf === void 0 ? void 0 : conf.defaultCommitment) !== undefined) {
            this.defaultCommitment = conf === null || conf === void 0 ? void 0 : conf.defaultCommitment;
        }
        else {
            this.defaultCommitment = __1.Commitment.Single;
        }
        this.accountCache = new lru_cache_1.default({
            max: 500,
            maxAge: 5 * 60 * 1000,
        });
        if (conf === null || conf === void 0 ? void 0 : conf.internal) {
            this.internal = conf.internal;
            return;
        }
        var internalConf = {
            endpoint: conf === null || conf === void 0 ? void 0 : conf.endpoint,
            accountClient: conf === null || conf === void 0 ? void 0 : conf.accountClient,
            txClient: conf === null || conf === void 0 ? void 0 : conf.txClient,
            kinVersion: this.kinVersion,
            desiredKinVersion: conf === null || conf === void 0 ? void 0 : conf.desiredKinVersion,
        };
        if (!internalConf.endpoint && !internalConf.accountClient && !internalConf.endpoint) {
            internalConf.endpoint = defaultEndpoint;
        }
        var retryConfig = Object.assign({}, defaultRetryConfig);
        if (conf && conf.retryConfig) {
            retryConfig = conf.retryConfig;
        }
        internalConf.strategies = [
            retry_1.nonRetriableErrors.apply(void 0, errors_1.nonRetriableErrors),
            retry_1.limit(retryConfig.maxRetries),
            retry_1.backoffWithJitter(retry_1.binaryExpotentialDelay(retryConfig.minDelaySeconds), retryConfig.maxDelaySeconds, 0.1),
        ];
        this.internal = new _1.InternalClient(internalConf);
    }
    // createAccount creates a new Kin account.
    //
    // Promise.reject(new AccountExists()) is called if
    // the account already exists.
    Client.prototype.createAccount = function (key, commitment, subsidizer) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (this.kinVersion) {
                    case 2:
                    case 3:
                        return [2 /*return*/, this.internal.createStellarAccount(key)
                                .catch(function (err) {
                                if (err.code && err.code === grpc_js_1.status.FAILED_PRECONDITION) {
                                    _this.kinVersion = 4;
                                    _this.internal.setKinVersion(4);
                                    return retry_1.retryAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, this.internal.createSolanaAccount(key, commitment, subsidizer)];
                                        });
                                    }); }, retry_1.limit(_this.retryConfig.maxNonceRefreshes), retry_1.retriableErrors(errors_1.BadNonce));
                                }
                                return Promise.reject(err);
                            })];
                    case 4:
                        return [2 /*return*/, retry_1.retryAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.internal.createSolanaAccount(key, commitment, subsidizer)];
                                });
                            }); }, retry_1.limit(this.retryConfig.maxNonceRefreshes), retry_1.retriableErrors(errors_1.BadNonce))];
                    default:
                        return [2 /*return*/, Promise.reject("unsupported kin version: " + this.kinVersion)];
                }
                return [2 /*return*/];
            });
        });
    };
    // getBalance retrieves the balance for an account.
    //
    // Promise.reject(new AccountDoesNotExist()) is called if
    // the specified account does not exist.
    Client.prototype.getBalance = function (account, commitment, accountResolution) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        if (accountResolution === void 0) { accountResolution = __1.AccountResolution.Preferred; }
        return __awaiter(this, void 0, void 0, function () {
            var solanaFn;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.kinVersion > 4 || this.kinVersion < 2) {
                    return [2 /*return*/, Promise.reject("unsupported kin version: " + this.kinVersion)];
                }
                solanaFn = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.internal.getSolanaAccountInfo(account, commitment)
                                .then(function (info) { return new bignumber_js_1.default(info.getBalance()); })
                                .catch(function (err) {
                                if (err instanceof errors_1.AccountDoesNotExist) {
                                    if (accountResolution == __1.AccountResolution.Preferred) {
                                        return _this.getTokenAccounts(account)
                                            .then(function (accounts) {
                                            if (accounts.length > 0) {
                                                return _this.internal.getSolanaAccountInfo(accounts[0], commitment)
                                                    .then(function (info) { return new bignumber_js_1.default(info.getBalance()); });
                                            }
                                            return Promise.reject(err);
                                        });
                                    }
                                }
                                return Promise.reject(err);
                            })];
                    });
                }); };
                if (this.kinVersion < 4) {
                    return [2 /*return*/, this.internal.getAccountInfo(account)
                            .then(function (info) { return new bignumber_js_1.default(info.getBalance()); })
                            .catch(function (err) {
                            if (err.code && err.code === grpc_js_1.status.FAILED_PRECONDITION) {
                                _this.kinVersion = 4;
                                _this.internal.setKinVersion(4);
                                return solanaFn();
                            }
                            return Promise.reject(err);
                        })];
                }
                return [2 /*return*/, solanaFn()];
            });
        });
    };
    // getTransaction retrieves the TransactionData for a txId.
    //
    // If no transaction data currently exists, Promise.resolve(undefined)
    // is called. In this state, the transaction may or may not resolve in
    // the future, it is simply unknown _at this time_.
    Client.prototype.getTransaction = function (txId, commitment) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (this.kinVersion) {
                    case 2:
                    case 3:
                        return [2 /*return*/, this.internal.getStellarTransaction(txId)];
                    case 4:
                        return [2 /*return*/, this.internal.getTransaction(txId, commitment)];
                    default:
                        return [2 /*return*/, Promise.reject("unsupported kin version: " + this.kinVersion)];
                }
                return [2 /*return*/];
            });
        });
    };
    // submitPayment submits a payment.
    //
    // If the payment has an invoice, an app index _must_ be set.
    // If the payment has a memo, an invoice cannot also be provided.
    Client.prototype.submitPayment = function (payment, commitment, senderResolution, destinationResolution) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        if (senderResolution === void 0) { senderResolution = __1.AccountResolution.Preferred; }
        if (destinationResolution === void 0) { destinationResolution = __1.AccountResolution.Preferred; }
        return __awaiter(this, void 0, void 0, function () {
            var result, signers, memo, invoiceList, fk, serialized, kinMemo, asset, quarksConversion, op;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.kinVersion > 4 || this.kinVersion < 2) {
                            return [2 /*return*/, Promise.reject("unsupported kin version: " + this.kinVersion)];
                        }
                        if (payment.invoice && !this.appIndex) {
                            return [2 /*return*/, Promise.reject("cannot submit payment with invoices without an app index")];
                        }
                        if (!(this.kinVersion === 4)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.submitPaymentWithResolution(payment, commitment, senderResolution, destinationResolution)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        signers = void 0;
                        if (payment.channel && !payment.channel.equals(payment.sender)) {
                            signers = [payment.channel, payment.sender];
                        }
                        else {
                            signers = [payment.sender];
                        }
                        memo = void 0;
                        invoiceList = void 0;
                        if (payment.memo) {
                            memo = stellar_base_1.Memo.text(payment.memo);
                        }
                        else if (this.appIndex) {
                            fk = Buffer.alloc(29);
                            if (payment.invoice) {
                                invoiceList = new model_pb_1.default.InvoiceList();
                                invoiceList.addInvoices(__1.invoiceToProto(payment.invoice));
                                serialized = invoiceList.serializeBinary();
                                fk = Buffer.from(hash_js_1.default.sha224().update(serialized).digest('hex'), "hex");
                            }
                            kinMemo = __1.Memo.new(1, payment.type, this.appIndex, fk);
                            memo = new stellar_base_1.Memo(stellar_base_1.MemoHash, kinMemo.buffer);
                        }
                        asset = void 0;
                        quarksConversion = void 0;
                        if (this.kinVersion === 2) {
                            asset = new stellar_base_1.Asset(__1.KinAssetCode, this.issuer);
                            quarksConversion = 1e5;
                        }
                        else {
                            asset = stellar_base_1.Asset.native();
                            // In Kin, the base currency has been 'scaled' by
                            // a factor of 100 from stellar. That is, 1 Kin is 100x
                            // 1 XLM, and the minimum amount is 1e-5 instead of 1e-7.
                            //
                            // Since js-stellar's amount here is an XLM (equivalent to Kin),
                            // we need to convert it to a quark (divide by 1e5), and then also
                            // account for the 100x scaling factor. 1e5 / 100 = 1e7.
                            quarksConversion = 1e7;
                        }
                        op = stellar_base_1.Operation.payment({
                            source: payment.sender.publicKey().stellarAddress(),
                            destination: payment.destination.stellarAddress(),
                            asset: asset,
                            amount: payment.quarks.dividedBy(quarksConversion).toFixed(7),
                        });
                        return [4 /*yield*/, this.signAndSubmit(signers, [op], memo, invoiceList)
                                .catch(function (err) {
                                if (err.code && err.code === grpc_js_1.status.FAILED_PRECONDITION) {
                                    _this.kinVersion = 4;
                                    _this.internal.setKinVersion(4);
                                    return _this.submitPaymentWithResolution(payment, commitment, senderResolution, destinationResolution);
                                }
                                return Promise.reject(err);
                            })];
                    case 3:
                        // TODO: handle version
                        result = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (result.Errors && result.Errors.PaymentErrors) {
                            if (result.Errors.PaymentErrors.length != 1) {
                                return [2 /*return*/, Promise.reject(new Error("invalid number of payemnt errors. expected 0 or 1"))];
                            }
                            return [2 /*return*/, Promise.reject(result.Errors.PaymentErrors[0])];
                        }
                        if (result.Errors && result.Errors.TxError) {
                            return [2 /*return*/, Promise.reject(result.Errors.TxError)];
                        }
                        if (result.InvoiceErrors && result.InvoiceErrors.length > 0) {
                            if (result.InvoiceErrors.length != 1) {
                                return [2 /*return*/, Promise.reject(new Error("invalid number of invoice errors. expected 0 or 1"))];
                            }
                            switch (result.InvoiceErrors[0].getReason()) {
                                case model_pb_1.default.InvoiceError.Reason.ALREADY_PAID:
                                    return [2 /*return*/, Promise.reject(new errors_1.AlreadyPaid())];
                                case model_pb_1.default.InvoiceError.Reason.WRONG_DESTINATION:
                                    return [2 /*return*/, Promise.reject(new errors_1.WrongDestination())];
                                case model_pb_1.default.InvoiceError.Reason.SKU_NOT_FOUND:
                                    return [2 /*return*/, Promise.reject(new errors_1.SkuNotFound())];
                                default:
                                    return [2 /*return*/, Promise.reject(new Error("unknown invoice error"))];
                            }
                        }
                        return [2 /*return*/, Promise.resolve(result.TxId)];
                }
            });
        });
    };
    // submitEarnBatch submits a batch of earns in a single transaction.
    //
    // EarnBatch is limited to 15 earns, which is roughly the max number of 
    // transfers that can fit inside a Solana transaction.
    Client.prototype.submitEarnBatch = function (batch, commitment, senderResolution, destinationResolution) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        if (senderResolution === void 0) { senderResolution = __1.AccountResolution.Preferred; }
        if (destinationResolution === void 0) { destinationResolution = __1.AccountResolution.Preferred; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, r, i, submitResult, serviceConfig, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.kinVersion !== 4 && this.kinVersion !== 3 && this.kinVersion !== 2) {
                            return [2 /*return*/, Promise.reject("unsupported kin version: " + this.kinVersion)];
                        }
                        if (batch.earns.length === 0) {
                            return [2 /*return*/, Promise.reject(new Error("An EarnBatch must contain at least 1 earn."))];
                        }
                        if (batch.earns.length > 15) {
                            return [2 /*return*/, Promise.reject(new Error("An EarnBatch must not contain more than 15 earns."))];
                        }
                        if (batch.memo) {
                            for (_i = 0, _a = batch.earns; _i < _a.length; _i++) {
                                r = _a[_i];
                                if (r.invoice) {
                                    return [2 /*return*/, Promise.reject(new Error("cannot have invoice set when memo is set"))];
                                }
                            }
                        }
                        else {
                            if (batch.earns[0].invoice && !this.appIndex) {
                                return [2 /*return*/, Promise.reject(new Error("cannot submit earn batch without an app index"))];
                            }
                            for (i = 0; i < batch.earns.length - 1; i++) {
                                if ((batch.earns[i].invoice == undefined) != (batch.earns[i + 1].invoice == undefined)) {
                                    return [2 /*return*/, Promise.reject(new Error("either all or none of the earns should have an invoice set"))];
                                }
                            }
                        }
                        if (!(this.kinVersion === 2 || this.kinVersion === 3)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.submitSingleEarnBatch(batch)];
                    case 1:
                        submitResult = _b.sent();
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, this.internal.getServiceConfig()];
                    case 3:
                        serviceConfig = _b.sent();
                        if (!serviceConfig.getSubsidizerAccount() && !batch.subsidizer) {
                            return [2 /*return*/, Promise.reject(new errors_1.NoSubsidizerError())];
                        }
                        return [4 /*yield*/, this.submitEarnBatchWithResolution(batch, serviceConfig, commitment, senderResolution, destinationResolution)];
                    case 4:
                        submitResult = _b.sent();
                        _b.label = 5;
                    case 5:
                        result = {
                            txId: submitResult.TxId,
                        };
                        if (submitResult.Errors) {
                            result.txError = submitResult.Errors.TxError;
                            if (submitResult.Errors.PaymentErrors && submitResult.Errors.PaymentErrors.length > 0) {
                                result.earnErrors = new Array();
                                submitResult.Errors.PaymentErrors.forEach(function (error, i) {
                                    if (error) {
                                        result.earnErrors.push({
                                            error: error,
                                            earnIndex: i,
                                        });
                                    }
                                });
                            }
                        }
                        else if (submitResult.InvoiceErrors && submitResult.InvoiceErrors.length > 0) {
                            result.txError = new errors_1.TransactionRejected();
                            result.earnErrors = new Array(submitResult.InvoiceErrors.length);
                            submitResult.InvoiceErrors.forEach(function (invoiceError, i) {
                                result.earnErrors[i] = {
                                    error: errors_1.invoiceErrorFromProto(invoiceError),
                                    earnIndex: invoiceError.getOpIndex(),
                                };
                            });
                        }
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    // resolveTokenAccounts resolves the token accounts ovned by the specified account on kin 4.
    Client.prototype.resolveTokenAccounts = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.kinVersion !== 4) {
                    return [2 /*return*/, Promise.reject("`resolveTokenAccounts` is only available on Kin 4")];
                }
                return [2 /*return*/, this.getTokenAccounts(account)];
            });
        });
    };
    // requestAirdrop requests an airdrop of Kin to a Kin account. Only available on Kin 4 on the test environment.
    Client.prototype.requestAirdrop = function (publicKey, quarks, commitment) {
        if (commitment === void 0) { commitment = this.defaultCommitment; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.env !== __1.Environment.Test) {
                    return [2 /*return*/, Promise.reject("`requestAirdrop` is only available on the test environment")];
                }
                return [2 /*return*/, this.internal.requestAirdrop(publicKey, quarks, commitment)];
            });
        });
    };
    Client.prototype.submitPaymentWithResolution = function (payment, commitment, senderResolution, destinationResolution) {
        if (senderResolution === void 0) { senderResolution = __1.AccountResolution.Preferred; }
        if (destinationResolution === void 0) { destinationResolution = __1.AccountResolution.Preferred; }
        return __awaiter(this, void 0, void 0, function () {
            var serviceConfig, result, transferSender, resubmit, tokenAccounts, tokenAccounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.internal.getServiceConfig()];
                    case 1:
                        serviceConfig = _a.sent();
                        if (!serviceConfig.getSubsidizerAccount() && !payment.subsidizer) {
                            return [2 /*return*/, Promise.reject(new errors_1.NoSubsidizerError())];
                        }
                        return [4 /*yield*/, this.submitSolanaPayment(payment, serviceConfig, commitment)];
                    case 2:
                        result = _a.sent();
                        if (!(result.Errors && result.Errors.TxError instanceof errors_1.AccountDoesNotExist)) return [3 /*break*/, 8];
                        transferSender = undefined;
                        resubmit = false;
                        if (!(senderResolution == __1.AccountResolution.Preferred)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getTokenAccounts(payment.sender.publicKey())];
                    case 3:
                        tokenAccounts = _a.sent();
                        if (tokenAccounts.length > 0) {
                            transferSender = tokenAccounts[0];
                            resubmit = true;
                        }
                        _a.label = 4;
                    case 4:
                        if (!(destinationResolution == __1.AccountResolution.Preferred)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getTokenAccounts(payment.destination)];
                    case 5:
                        tokenAccounts = _a.sent();
                        if (tokenAccounts.length > 0) {
                            payment.destination = tokenAccounts[0];
                            resubmit = true;
                        }
                        _a.label = 6;
                    case 6:
                        if (!resubmit) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.submitSolanaPayment(payment, serviceConfig, commitment, transferSender)];
                    case 7:
                        result = _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    Client.prototype.submitSolanaPayment = function (payment, serviceConfig, commitment, transferSender) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenProgram, subsidizerKey, signers, instructions, invoiceList, fk, serialized, kinMemo, sender, tx;
            var _a;
            return __generator(this, function (_b) {
                tokenProgram = new __1.PublicKey(Buffer.from(serviceConfig.getTokenProgram().getValue_asU8()));
                if (payment.subsidizer) {
                    subsidizerKey = payment.subsidizer.publicKey().solanaKey();
                    signers = [payment.subsidizer, payment.sender];
                }
                else {
                    subsidizerKey = new web3_js_1.PublicKey(Buffer.from(serviceConfig.getSubsidizerAccount().getValue_asU8()));
                    signers = [payment.sender];
                }
                instructions = [];
                invoiceList = undefined;
                if (payment.memo) {
                    instructions.push(memo_program_1.MemoProgram.memo({ data: payment.memo }));
                }
                else if (this.appIndex) {
                    fk = Buffer.alloc(29);
                    if (payment.invoice) {
                        invoiceList = new model_pb_1.default.InvoiceList();
                        invoiceList.addInvoices(__1.invoiceToProto(payment.invoice));
                        serialized = invoiceList.serializeBinary();
                        fk = Buffer.from(hash_js_1.default.sha224().update(serialized).digest('hex'), "hex");
                    }
                    kinMemo = __1.Memo.new(1, payment.type, this.appIndex, fk);
                    instructions.push(memo_program_1.MemoProgram.memo({ data: kinMemo.buffer.toString("base64") }));
                }
                if (transferSender) {
                    sender = transferSender;
                }
                else {
                    sender = payment.sender.publicKey();
                }
                instructions.push(token_program_1.TokenProgram.transfer({
                    source: sender.solanaKey(),
                    dest: payment.destination.solanaKey(),
                    owner: payment.sender.publicKey().solanaKey(),
                    amount: BigInt(payment.quarks)
                }, tokenProgram.solanaKey()));
                tx = (_a = new web3_js_1.Transaction({
                    feePayer: subsidizerKey,
                })).add.apply(_a, instructions);
                return [2 /*return*/, this.signAndSubmitSolanaTx(signers, tx, commitment, invoiceList, payment.dedupeId)];
            });
        });
    };
    Client.prototype.submitEarnBatchWithResolution = function (batch, serviceConfig, commitment, senderResolution, destinationResolution) {
        if (senderResolution === void 0) { senderResolution = __1.AccountResolution.Preferred; }
        if (destinationResolution === void 0) { destinationResolution = __1.AccountResolution.Preferred; }
        return __awaiter(this, void 0, void 0, function () {
            var result, transferSender, resubmit, tokenAccounts, i, tokenAccounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.submitSolanaEarnBatch(batch, serviceConfig, commitment)];
                    case 1:
                        result = _a.sent();
                        if (!(result.Errors && result.Errors.TxError instanceof errors_1.AccountDoesNotExist)) return [3 /*break*/, 9];
                        transferSender = undefined;
                        resubmit = false;
                        if (!(senderResolution == __1.AccountResolution.Preferred)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getTokenAccounts(batch.sender.publicKey())];
                    case 2:
                        tokenAccounts = _a.sent();
                        if (tokenAccounts.length > 0) {
                            transferSender = tokenAccounts[0];
                            resubmit = true;
                        }
                        _a.label = 3;
                    case 3:
                        if (!(destinationResolution == __1.AccountResolution.Preferred)) return [3 /*break*/, 7];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < batch.earns.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getTokenAccounts(batch.earns[i].destination)];
                    case 5:
                        tokenAccounts = _a.sent();
                        if (tokenAccounts.length > 0) {
                            batch.earns[i].destination = tokenAccounts[0];
                            resubmit = true;
                        }
                        _a.label = 6;
                    case 6:
                        i += 1;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!resubmit) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.submitSolanaEarnBatch(batch, serviceConfig, commitment, transferSender)];
                    case 8:
                        result = _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    Client.prototype.submitSolanaEarnBatch = function (batch, serviceConfig, commitment, transferSender) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenProgram, subsidizerId, signers, sender, instructions, invoiceList, fk, serialized, kinMemo, tx;
            var _a;
            return __generator(this, function (_b) {
                tokenProgram = new web3_js_1.PublicKey(serviceConfig.getTokenProgram().getValue_asU8());
                if (batch.subsidizer) {
                    subsidizerId = batch.subsidizer.publicKey().solanaKey();
                    signers = [batch.subsidizer, batch.sender];
                }
                else {
                    subsidizerId = new web3_js_1.PublicKey(serviceConfig.getSubsidizerAccount().getValue_asU8());
                    signers = [batch.sender];
                }
                if (transferSender) {
                    sender = transferSender;
                }
                else {
                    sender = batch.sender.publicKey();
                }
                instructions = [];
                if (batch.memo) {
                    instructions.push(memo_program_1.MemoProgram.memo({ data: batch.memo }));
                }
                else if (this.appIndex) {
                    invoiceList = new model_pb_1.default.InvoiceList();
                    batch.earns.forEach(function (earn) {
                        if (earn.invoice) {
                            invoiceList.addInvoices(__1.invoiceToProto(earn.invoice));
                        }
                    });
                    fk = Buffer.alloc(29);
                    if (invoiceList.getInvoicesList().length > 0) {
                        if (invoiceList.getInvoicesList().length != batch.earns.length) {
                            return [2 /*return*/, Promise.reject(new Error("either all or none of the earns should have an invoice"))];
                        }
                        serialized = invoiceList.serializeBinary();
                        fk = Buffer.from(hash_js_1.default.sha224().update(serialized).digest('hex'), "hex");
                    }
                    else {
                        invoiceList = undefined;
                    }
                    kinMemo = __1.Memo.new(1, __1.TransactionType.Earn, this.appIndex, fk);
                    instructions.push(memo_program_1.MemoProgram.memo({ data: kinMemo.buffer.toString("base64") }));
                }
                batch.earns.forEach(function (earn) {
                    instructions.push(token_program_1.TokenProgram.transfer({
                        source: sender.solanaKey(),
                        dest: earn.destination.solanaKey(),
                        owner: batch.sender.publicKey().solanaKey(),
                        amount: BigInt(earn.quarks),
                    }, tokenProgram));
                });
                tx = (_a = new web3_js_1.Transaction({
                    feePayer: subsidizerId,
                })).add.apply(_a, instructions);
                return [2 /*return*/, this.signAndSubmitSolanaTx(signers, tx, commitment, invoiceList, batch.dedupeId)];
            });
        });
    };
    Client.prototype.submitSingleEarnBatch = function (batch) {
        return __awaiter(this, void 0, void 0, function () {
            var signers, ops, asset, quarksConversion, _i, _a, e, memo, invoiceList, _b, _c, r, fk, serialized, kinMemo, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (batch.channel && !batch.channel.equals(batch.sender)) {
                            signers = [batch.channel, batch.sender];
                        }
                        else {
                            signers = [batch.sender];
                        }
                        ops = [];
                        if (this.kinVersion === 2) {
                            asset = new stellar_base_1.Asset(__1.KinAssetCode, this.issuer);
                            quarksConversion = 1e5;
                        }
                        else {
                            asset = stellar_base_1.Asset.native();
                            // In Kin, the base currency has been 'scaled' by
                            // a factor of 100 from stellar. That is, 1 Kin is 100x
                            // 1 XLM, and the minimum amount is 1e-5 instead of 1e-7.
                            //
                            // Since js-stellar's amount here is an XLM (equivalent to Kin),
                            // we need to convert it to a quark (divide by 1e5), and then also
                            // account for the 100x scaling factor. 1e5 / 100 = 1e7.
                            quarksConversion = 1e7;
                        }
                        for (_i = 0, _a = batch.earns; _i < _a.length; _i++) {
                            e = _a[_i];
                            ops.push(stellar_base_1.Operation.payment({
                                source: batch.sender.publicKey().stellarAddress(),
                                destination: e.destination.stellarAddress(),
                                asset: asset,
                                amount: e.quarks.dividedBy(quarksConversion).toFixed(7),
                            }));
                        }
                        if (batch.memo) {
                            memo = stellar_base_1.Memo.text(batch.memo);
                        }
                        else if (this.appIndex) {
                            invoiceList = new model_pb_1.default.InvoiceList();
                            for (_b = 0, _c = batch.earns; _b < _c.length; _b++) {
                                r = _c[_b];
                                if (r.invoice) {
                                    invoiceList.addInvoices(__1.invoiceToProto(r.invoice));
                                }
                            }
                            fk = Buffer.alloc(29);
                            if (invoiceList.getInvoicesList().length > 0) {
                                if (invoiceList.getInvoicesList().length != batch.earns.length) {
                                    return [2 /*return*/, Promise.reject(new Error("either all or none of the earns should have an invoice"))];
                                }
                                serialized = invoiceList.serializeBinary();
                                fk = Buffer.from(hash_js_1.default.sha224().update(serialized).digest('hex'), "hex");
                            }
                            else {
                                invoiceList = undefined;
                            }
                            kinMemo = __1.Memo.new(1, __1.TransactionType.Earn, this.appIndex, fk);
                            memo = new stellar_base_1.Memo(stellar_base_1.MemoHash, kinMemo.buffer);
                        }
                        return [4 /*yield*/, this.signAndSubmit(signers, ops, memo, invoiceList)];
                    case 1:
                        result = _d.sent();
                        if (result.InvoiceErrors) {
                            return [2 /*return*/, Promise.reject(new Error("unexpected invoice errors present"))];
                        }
                        return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    Client.prototype.signAndSubmitSolanaTx = function (signers, tx, commitment, invoiceList, dedupeId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, fn;
            var _this = this;
            return __generator(this, function (_a) {
                fn = function () { return __awaiter(_this, void 0, void 0, function () {
                    var blockhash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.internal.getRecentBlockhash()];
                            case 1:
                                blockhash = _a.sent();
                                tx.recentBlockhash = blockhash;
                                tx.partialSign.apply(tx, signers.map(function (signer) { return new web3_js_1.Account(signer.secretKey()); }));
                                return [4 /*yield*/, this.internal.submitSolanaTransaction(tx, invoiceList, commitment, dedupeId)];
                            case 2:
                                result = _a.sent();
                                if (result.Errors && result.Errors.TxError instanceof errors_1.BadNonce) {
                                    return [2 /*return*/, Promise.reject(new errors_1.BadNonce())];
                                }
                                return [2 /*return*/, result];
                        }
                    });
                }); };
                return [2 /*return*/, retry_1.retryAsync(fn, retry_1.limit(this.retryConfig.maxNonceRefreshes), retry_1.retriableErrors(errors_1.BadNonce)).catch(function (err) {
                        if (err instanceof errors_1.BadNonce) {
                            return Promise.resolve(result);
                        }
                        return Promise.reject(err);
                    })];
            });
        });
    };
    Client.prototype.signAndSubmit = function (signers, operations, memo, invoiceList) {
        return __awaiter(this, void 0, void 0, function () {
            var accountInfo, offset, result, fn;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.internal.getAccountInfo(signers[0].publicKey())];
                    case 1:
                        accountInfo = _a.sent();
                        offset = new bignumber_js_1.default(0);
                        fn = function () { return __awaiter(_this, void 0, void 0, function () {
                            var sequence, builder, _i, operations_1, op, tx, signed, _a, signers_1, s;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        sequence = new bignumber_js_1.default(accountInfo.getSequenceNumber()).plus(offset);
                                        builder = new stellar_base_1.TransactionBuilder(new stellar_base_1.Account(signers[0].publicKey().stellarAddress(), sequence.toString()), {
                                            fee: "100",
                                            networkPassphrase: this.networkPassphrase,
                                            v1: false,
                                        });
                                        builder.setTimeout(3600);
                                        for (_i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
                                            op = operations_1[_i];
                                            builder.addOperation(op);
                                        }
                                        if (memo) {
                                            builder.addMemo(memo);
                                        }
                                        tx = builder.build();
                                        tx.sign.apply(tx, signers.map(function (s) { return s.kp; }));
                                        if (this.whitelistKey) {
                                            signed = false;
                                            for (_a = 0, signers_1 = signers; _a < signers_1.length; _a++) {
                                                s = signers_1[_a];
                                                if (s.equals(this.whitelistKey)) {
                                                    signed = true;
                                                }
                                            }
                                            if (!signed) {
                                                tx.sign(this.whitelistKey.kp);
                                            }
                                        }
                                        return [4 /*yield*/, this.internal.submitStellarTransaction(tx.toEnvelope(), invoiceList)];
                                    case 1:
                                        result = _b.sent();
                                        if (result.Errors && result.Errors.TxError instanceof errors_1.BadNonce) {
                                            offset = offset.plus(1);
                                            return [2 /*return*/, Promise.reject(new errors_1.BadNonce())];
                                        }
                                        return [2 /*return*/, result];
                                }
                            });
                        }); };
                        return [2 /*return*/, retry_1.retryAsync(fn, retry_1.limit(this.retryConfig.maxNonceRefreshes), retry_1.retriableErrors(errors_1.BadNonce)).catch(function (err) {
                                if (err instanceof errors_1.BadNonce) {
                                    return Promise.resolve(result);
                                }
                                return Promise.reject(err);
                            })];
                }
            });
        });
    };
    Client.prototype.getTokenAccounts = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, fn;
            var _this = this;
            return __generator(this, function (_a) {
                cached = this.getTokensFromCache(key);
                if (cached.length > 0) {
                    return [2 /*return*/, Promise.resolve(cached)];
                }
                fn = function () { return __awaiter(_this, void 0, void 0, function () {
                    var tokenAccounts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.internal.resolveTokenAccounts(key)];
                            case 1:
                                tokenAccounts = _a.sent();
                                if (tokenAccounts.length == 0) {
                                    return [2 /*return*/, Promise.reject(new errors_1.NoTokenAccounts())];
                                }
                                this.setTokenAccountsInCache(key, tokenAccounts);
                                return [2 /*return*/, tokenAccounts];
                        }
                    });
                }); };
                return [2 /*return*/, retry_1.retryAsync(fn, retry_1.limit(this.retryConfig.maxRetries), retry_1.backoffWithJitter(retry_1.binaryExpotentialDelay(this.retryConfig.minDelaySeconds), this.retryConfig.maxDelaySeconds, 0.1)).catch(function (err) {
                        if (err instanceof errors_1.NoTokenAccounts) {
                            return Promise.resolve([]);
                        }
                        return Promise.reject(err);
                    })];
            });
        });
    };
    Client.prototype.setTokenAccountsInCache = function (key, tokenAccounts) {
        this.accountCache.set(key.toBase58(), tokenAccounts.map(function (tokenAccount) {
            return tokenAccount.toBase58();
        }).join(','));
    };
    Client.prototype.getTokensFromCache = function (key) {
        var val = this.accountCache.get(key.toBase58());
        if (val) {
            return val.split(',').map(function (encodedKey) {
                return __1.PublicKey.fromBase58(encodedKey);
            });
        }
        else {
            return [];
        }
    };
    return Client;
}());
exports.Client = Client;
