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
Object.defineProperty(exports, "__esModule", { value: true });
exports.binaryExpotentialDelay = exports.expontentialDelay = exports.linearDelay = exports.constantDelay = exports.backoffWithJitter = exports.backoff = exports.nonRetriableErrors = exports.retriableErrors = exports.limit = exports.retryAsync = exports.retry = void 0;
function retry(fn) {
    var strategies = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        strategies[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retryAsync.apply(void 0, __spreadArrays([function () {
                            return new Promise(function (resolve, reject) {
                                try {
                                    resolve(fn());
                                }
                                catch (err) {
                                    reject(err);
                                }
                            });
                        }], strategies))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.retry = retry;
function retryAsync(fn) {
    var strategies = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        strategies[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var i, err_1, _a, strategies_1, s;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 1;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, fn()];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    err_1 = _b.sent();
                    _a = 0, strategies_1 = strategies;
                    _b.label = 4;
                case 4:
                    if (!(_a < strategies_1.length)) return [3 /*break*/, 7];
                    s = strategies_1[_a];
                    return [4 /*yield*/, s(i, err_1)];
                case 5:
                    if (!(_b.sent())) {
                        return [2 /*return*/, Promise.reject(err_1)];
                    }
                    _b.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.retryAsync = retryAsync;
function limit(maxAttempts) {
    return function (attempt, _) {
        return Promise.resolve(attempt < maxAttempts);
    };
}
exports.limit = limit;
function retriableErrors() {
    var errors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        errors[_i] = arguments[_i];
    }
    return function (_, err) {
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var allowed = errors_1[_i];
            if (err instanceof allowed) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    };
}
exports.retriableErrors = retriableErrors;
function nonRetriableErrors() {
    var errors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        errors[_i] = arguments[_i];
    }
    return function (_, err) {
        for (var _i = 0, errors_2 = errors; _i < errors_2.length; _i++) {
            var disallowed = errors_2[_i];
            if (err instanceof disallowed) {
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    };
}
exports.nonRetriableErrors = nonRetriableErrors;
function backoff(fn, maxDelaySeconds) {
    var _this = this;
    return function (attempt, _) { return __awaiter(_this, void 0, void 0, function () {
        var delay;
        return __generator(this, function (_a) {
            delay = Math.min(fn(attempt), maxDelaySeconds);
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, delay * 1000); })
                    .then(function () { return true; })];
        });
    }); };
}
exports.backoff = backoff;
function backoffWithJitter(fn, maxDelaySeconds, jitter) {
    var _this = this;
    if (jitter < 0.0 || jitter >= 0.25) {
        throw new Error("jitter should be [0, 0.25]");
    }
    return function (attempt, _) { return __awaiter(_this, void 0, void 0, function () {
        var delay, delayWithJitter;
        return __generator(this, function (_a) {
            delay = Math.min(fn(attempt), maxDelaySeconds);
            delayWithJitter = delay * (1 + Math.random() * jitter * 2 - jitter);
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, delayWithJitter * 1000); })
                    .then(function () { return true; })];
        });
    }); };
}
exports.backoffWithJitter = backoffWithJitter;
function constantDelay(seconds) {
    return function (_) {
        return seconds;
    };
}
exports.constantDelay = constantDelay;
function linearDelay(baseDelaySeconds) {
    return function (attempts) {
        return baseDelaySeconds * attempts;
    };
}
exports.linearDelay = linearDelay;
function expontentialDelay(baseDelaySeconds, base) {
    return function (attempts) {
        return baseDelaySeconds * Math.pow(base, attempts - 1);
    };
}
exports.expontentialDelay = expontentialDelay;
function binaryExpotentialDelay(baseDelaySeconds) {
    return expontentialDelay(baseDelaySeconds, 2);
}
exports.binaryExpotentialDelay = binaryExpotentialDelay;
