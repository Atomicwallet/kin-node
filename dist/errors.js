"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonRetriableErrors = exports.NoTokenAccounts = exports.AlreadySubmitted = exports.NoSubsidizerError = exports.PayerRequired = exports.TransactionRejected = exports.SkuNotFound = exports.WrongDestination = exports.AlreadyPaid = exports.InvalidSignature = exports.DestinationDoesNotExist = exports.SenderDoesNotExist = exports.InsufficientFee = exports.InsufficientBalance = exports.BadNonce = exports.Malformed = exports.TransactionNotFound = exports.AccountDoesNotExist = exports.AccountExists = exports.TransactionFailed = exports.errorsFromXdr = exports.invoiceErrorFromProto = exports.errorFromProto = exports.errorsFromStellarTx = exports.errorsFromSolanaTx = exports.TransactionErrors = void 0;
var stellar_base_1 = require("stellar-base");
var model_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/common/v4/model_pb"));
var model_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/common/v3/model_pb"));
var token_program_1 = require("./solana/token-program");
// TransactionErrors contains the error details for a transaction.
//
var TransactionErrors = /** @class */ (function () {
    function TransactionErrors() {
    }
    return TransactionErrors;
}());
exports.TransactionErrors = TransactionErrors;
function errorsFromSolanaTx(tx, protoError) {
    var errors = new TransactionErrors();
    var err = errorFromProto(protoError);
    if (!err) {
        return errors;
    }
    errors.TxError = err;
    if (protoError.getInstructionIndex() >= 0) {
        errors.OpErrors = new Array(tx.instructions.length);
        errors.OpErrors[protoError.getInstructionIndex()] = err;
        var pIndex = protoError.getInstructionIndex();
        var pCount = 0;
        for (var i = 0; i < tx.instructions.length; i++) {
            try {
                token_program_1.TokenInstruction.decodeTransfer(tx.instructions[i]);
                pCount++;
            }
            catch (err) {
                if (i < protoError.getInstructionIndex()) {
                    pIndex--;
                }
                else if (i == protoError.getInstructionIndex()) {
                    // the errored instruction is not a payment
                    pIndex = -1;
                }
            }
        }
        if (pIndex > -1) {
            errors.PaymentErrors = new Array(pCount);
            errors.PaymentErrors[pIndex] = err;
        }
    }
    return errors;
}
exports.errorsFromSolanaTx = errorsFromSolanaTx;
function errorsFromStellarTx(env, protoError) {
    var errors = new TransactionErrors();
    var err = errorFromProto(protoError);
    if (!err) {
        return errors;
    }
    errors.TxError = err;
    if (protoError.getInstructionIndex() >= 0) {
        var ops = env.v0().tx().operations();
        errors.OpErrors = new Array(ops.length);
        errors.OpErrors[protoError.getInstructionIndex()] = err;
        var pIndex = protoError.getInstructionIndex();
        var pCount = 0;
        for (var i = 0; i < ops.length; i++) {
            if (ops[i].body().switch() === stellar_base_1.xdr.OperationType.payment()) {
                pCount++;
            }
            else if (i < protoError.getInstructionIndex()) {
                pIndex--;
            }
            else if (i == protoError.getInstructionIndex()) {
                pIndex = -1;
            }
        }
        if (pIndex > -1) {
            errors.PaymentErrors = new Array(pCount);
            errors.PaymentErrors[pIndex] = err;
        }
    }
    return errors;
}
exports.errorsFromStellarTx = errorsFromStellarTx;
function errorFromProto(protoError) {
    switch (protoError.getReason()) {
        case model_pb_1.default.TransactionError.Reason.NONE:
            return undefined;
        case model_pb_1.default.TransactionError.Reason.UNAUTHORIZED:
            return new InvalidSignature();
        case model_pb_1.default.TransactionError.Reason.BAD_NONCE:
            return new BadNonce();
        case model_pb_1.default.TransactionError.Reason.INSUFFICIENT_FUNDS:
            return new InsufficientBalance();
        case model_pb_1.default.TransactionError.Reason.INVALID_ACCOUNT:
            return new AccountDoesNotExist();
        default:
            return Error("unknown error reason: " + protoError.getReason());
    }
}
exports.errorFromProto = errorFromProto;
function invoiceErrorFromProto(protoError) {
    switch (protoError.getReason()) {
        case model_pb_2.default.InvoiceError.Reason.ALREADY_PAID:
            return new AlreadyPaid();
        case model_pb_2.default.InvoiceError.Reason.WRONG_DESTINATION:
            return new WrongDestination();
        case model_pb_2.default.InvoiceError.Reason.SKU_NOT_FOUND:
            return new SkuNotFound();
        default:
            return new Error("unknown invoice error");
    }
}
exports.invoiceErrorFromProto = invoiceErrorFromProto;
function errorsFromXdr(result) {
    var errors = new TransactionErrors();
    switch (result.result().switch()) {
        case stellar_base_1.xdr.TransactionResultCode.txSuccess():
            return errors;
        case stellar_base_1.xdr.TransactionResultCode.txMissingOperation():
            errors.TxError = new Malformed();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txBadSeq():
            errors.TxError = new BadNonce();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txBadAuth():
            errors.TxError = new InvalidSignature();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txInsufficientBalance():
            errors.TxError = new InsufficientBalance();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txInsufficientFee():
            errors.TxError = new InsufficientFee();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txNoAccount():
            errors.TxError = new SenderDoesNotExist();
            break;
        case stellar_base_1.xdr.TransactionResultCode.txFailed():
            errors.TxError = new TransactionFailed();
            break;
        default:
            errors.TxError = Error("unknown transaction result code: " + result.result().switch().value);
            break;
    }
    if (result.result().switch() != stellar_base_1.xdr.TransactionResultCode.txFailed()) {
        return errors;
    }
    errors.OpErrors = new Array(result.result().results().length);
    result.result().results().forEach(function (opResult, i) {
        switch (opResult.switch()) {
            case stellar_base_1.xdr.OperationResultCode.opInner():
                break;
            case stellar_base_1.xdr.OperationResultCode.opBadAuth():
                errors.OpErrors[i] = new InvalidSignature();
                return;
            case stellar_base_1.xdr.OperationResultCode.opNoAccount():
                errors.OpErrors[i] = new SenderDoesNotExist();
                return;
            default:
                errors.OpErrors[i] = new Error("unknown operation result code: " + opResult.switch().value);
                return;
        }
        switch (opResult.tr().switch()) {
            case stellar_base_1.xdr.OperationType.createAccount():
                switch (opResult.tr().createAccountResult().switch()) {
                    case stellar_base_1.xdr.CreateAccountResultCode.createAccountSuccess():
                        break;
                    case stellar_base_1.xdr.CreateAccountResultCode.createAccountMalformed():
                        errors.OpErrors[i] = new Malformed();
                        break;
                    case stellar_base_1.xdr.CreateAccountResultCode.createAccountAlreadyExist():
                        errors.OpErrors[i] = new AccountExists();
                        break;
                    case stellar_base_1.xdr.CreateAccountResultCode.createAccountUnderfunded():
                        errors.OpErrors[i] = new InsufficientBalance();
                        break;
                    default:
                        errors.OpErrors[i] = new Error("unknown create operation result code: " + opResult.switch().value);
                }
                break;
            case stellar_base_1.xdr.OperationType.payment():
                switch (opResult.tr().paymentResult().switch()) {
                    case stellar_base_1.xdr.PaymentResultCode.paymentSuccess():
                        break;
                    case stellar_base_1.xdr.PaymentResultCode.paymentMalformed():
                    case stellar_base_1.xdr.PaymentResultCode.paymentNoTrust():
                    case stellar_base_1.xdr.PaymentResultCode.paymentSrcNoTrust():
                    case stellar_base_1.xdr.PaymentResultCode.paymentNoIssuer():
                        errors.OpErrors[i] = new Malformed();
                        break;
                    case stellar_base_1.xdr.PaymentResultCode.paymentUnderfunded():
                        errors.OpErrors[i] = new InsufficientBalance();
                        break;
                    case stellar_base_1.xdr.PaymentResultCode.paymentSrcNotAuthorized():
                    case stellar_base_1.xdr.PaymentResultCode.paymentNotAuthorized():
                        errors.OpErrors[i] = new InvalidSignature();
                        break;
                    case stellar_base_1.xdr.PaymentResultCode.paymentNoDestination():
                        errors.OpErrors[i] = new DestinationDoesNotExist();
                        break;
                    default:
                        errors.OpErrors[i] = new Error("unknown payment operation result code: " + opResult.switch().value);
                        break;
                }
                break;
            default:
                errors.OpErrors[i] = new Error("unknown operation result at: " + i);
        }
    });
    return errors;
}
exports.errorsFromXdr = errorsFromXdr;
var TransactionFailed = /** @class */ (function (_super) {
    __extends(TransactionFailed, _super);
    function TransactionFailed(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "TransactionFailed";
        Object.setPrototypeOf(_this, TransactionFailed.prototype);
        return _this;
    }
    return TransactionFailed;
}(Error));
exports.TransactionFailed = TransactionFailed;
var AccountExists = /** @class */ (function (_super) {
    __extends(AccountExists, _super);
    function AccountExists(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "AccountExists";
        Object.setPrototypeOf(_this, AccountExists.prototype);
        return _this;
    }
    return AccountExists;
}(Error));
exports.AccountExists = AccountExists;
var AccountDoesNotExist = /** @class */ (function (_super) {
    __extends(AccountDoesNotExist, _super);
    function AccountDoesNotExist(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "AccountDoesNotExist";
        Object.setPrototypeOf(_this, AccountDoesNotExist.prototype);
        return _this;
    }
    return AccountDoesNotExist;
}(Error));
exports.AccountDoesNotExist = AccountDoesNotExist;
var TransactionNotFound = /** @class */ (function (_super) {
    __extends(TransactionNotFound, _super);
    function TransactionNotFound(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "TransactionNotFound";
        Object.setPrototypeOf(_this, TransactionNotFound.prototype);
        return _this;
    }
    return TransactionNotFound;
}(Error));
exports.TransactionNotFound = TransactionNotFound;
var Malformed = /** @class */ (function (_super) {
    __extends(Malformed, _super);
    function Malformed(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "Malformed";
        Object.setPrototypeOf(_this, Malformed.prototype);
        return _this;
    }
    return Malformed;
}(Error));
exports.Malformed = Malformed;
var BadNonce = /** @class */ (function (_super) {
    __extends(BadNonce, _super);
    function BadNonce(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "BadNonce";
        Object.setPrototypeOf(_this, BadNonce.prototype);
        return _this;
    }
    return BadNonce;
}(Error));
exports.BadNonce = BadNonce;
var InsufficientBalance = /** @class */ (function (_super) {
    __extends(InsufficientBalance, _super);
    function InsufficientBalance(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "InsufficientBalance";
        Object.setPrototypeOf(_this, InsufficientBalance.prototype);
        return _this;
    }
    return InsufficientBalance;
}(Error));
exports.InsufficientBalance = InsufficientBalance;
var InsufficientFee = /** @class */ (function (_super) {
    __extends(InsufficientFee, _super);
    function InsufficientFee(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "InsufficientFee";
        Object.setPrototypeOf(_this, InsufficientFee.prototype);
        return _this;
    }
    return InsufficientFee;
}(Error));
exports.InsufficientFee = InsufficientFee;
var SenderDoesNotExist = /** @class */ (function (_super) {
    __extends(SenderDoesNotExist, _super);
    function SenderDoesNotExist(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "SenderDoesNotExist";
        Object.setPrototypeOf(_this, SenderDoesNotExist.prototype);
        return _this;
    }
    return SenderDoesNotExist;
}(Error));
exports.SenderDoesNotExist = SenderDoesNotExist;
var DestinationDoesNotExist = /** @class */ (function (_super) {
    __extends(DestinationDoesNotExist, _super);
    function DestinationDoesNotExist(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "DestinationDoesNotExist";
        Object.setPrototypeOf(_this, DestinationDoesNotExist.prototype);
        return _this;
    }
    return DestinationDoesNotExist;
}(Error));
exports.DestinationDoesNotExist = DestinationDoesNotExist;
var InvalidSignature = /** @class */ (function (_super) {
    __extends(InvalidSignature, _super);
    function InvalidSignature(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "InvalidSignature";
        Object.setPrototypeOf(_this, InvalidSignature.prototype);
        return _this;
    }
    return InvalidSignature;
}(Error));
exports.InvalidSignature = InvalidSignature;
var AlreadyPaid = /** @class */ (function (_super) {
    __extends(AlreadyPaid, _super);
    function AlreadyPaid(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "AlreadyPaid";
        Object.setPrototypeOf(_this, AlreadyPaid.prototype);
        return _this;
    }
    return AlreadyPaid;
}(Error));
exports.AlreadyPaid = AlreadyPaid;
var WrongDestination = /** @class */ (function (_super) {
    __extends(WrongDestination, _super);
    function WrongDestination(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "WrongDestination";
        Object.setPrototypeOf(_this, WrongDestination.prototype);
        return _this;
    }
    return WrongDestination;
}(Error));
exports.WrongDestination = WrongDestination;
var SkuNotFound = /** @class */ (function (_super) {
    __extends(SkuNotFound, _super);
    function SkuNotFound(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "SkuNotFound";
        Object.setPrototypeOf(_this, SkuNotFound.prototype);
        return _this;
    }
    return SkuNotFound;
}(Error));
exports.SkuNotFound = SkuNotFound;
var TransactionRejected = /** @class */ (function (_super) {
    __extends(TransactionRejected, _super);
    function TransactionRejected(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "TransactionRejected";
        Object.setPrototypeOf(_this, TransactionRejected.prototype);
        return _this;
    }
    return TransactionRejected;
}(Error));
exports.TransactionRejected = TransactionRejected;
var PayerRequired = /** @class */ (function (_super) {
    __extends(PayerRequired, _super);
    function PayerRequired(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "PayerRequired";
        Object.setPrototypeOf(_this, PayerRequired.prototype);
        return _this;
    }
    return PayerRequired;
}(Error));
exports.PayerRequired = PayerRequired;
var NoSubsidizerError = /** @class */ (function (_super) {
    __extends(NoSubsidizerError, _super);
    function NoSubsidizerError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "NoSubsidizerError";
        Object.setPrototypeOf(_this, NoSubsidizerError.prototype);
        return _this;
    }
    return NoSubsidizerError;
}(Error));
exports.NoSubsidizerError = NoSubsidizerError;
var AlreadySubmitted = /** @class */ (function (_super) {
    __extends(AlreadySubmitted, _super);
    function AlreadySubmitted(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "AlreadySubmittedError";
        Object.setPrototypeOf(_this, AlreadySubmitted.prototype);
        return _this;
    }
    return AlreadySubmitted;
}(Error));
exports.AlreadySubmitted = AlreadySubmitted;
var NoTokenAccounts = /** @class */ (function (_super) {
    __extends(NoTokenAccounts, _super);
    function NoTokenAccounts(m) {
        var _this = _super.call(this, m) || this;
        _this.name = "NoTokenAccounts";
        Object.setPrototypeOf(_this, NoTokenAccounts.prototype);
        return _this;
    }
    return NoTokenAccounts;
}(Error));
exports.NoTokenAccounts = NoTokenAccounts;
// nonRetriableErrors contains the set of errors that should not be retried without modifications to the transaction.
exports.nonRetriableErrors = [
    AccountExists,
    AccountDoesNotExist,
    Malformed,
    SenderDoesNotExist,
    DestinationDoesNotExist,
    InsufficientBalance,
    InsufficientFee,
    TransactionRejected,
    AlreadyPaid,
    WrongDestination,
    SkuNotFound,
    BadNonce,
    AlreadySubmitted,
    NoTokenAccounts,
];
