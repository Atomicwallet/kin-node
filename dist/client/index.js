"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitTransactionResult = exports.InternalClient = exports.Client = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
var internal_1 = require("./internal");
Object.defineProperty(exports, "InternalClient", { enumerable: true, get: function () { return internal_1.Internal; } });
Object.defineProperty(exports, "SubmitTransactionResult", { enumerable: true, get: function () { return internal_1.SubmitTransactionResult; } });
