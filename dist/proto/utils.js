"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryItem = exports.createPayment = exports.createInvoiceList = void 0;
var __1 = require("..");
var model_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/common/v3/model_pb"));
var model_pb_2 = __importDefault(require("@kinecosystem/agora-api/node/common/v4/model_pb"));
var transaction_service_pb_1 = __importDefault(require("@kinecosystem/agora-api/node/transaction/v4/transaction_service_pb"));
function createInvoiceList(params) {
    var invoiceList = new model_pb_1.default.InvoiceList();
    var invoices = [];
    params.invoices.forEach(function (invoice) {
        invoices.push(__1.invoiceToProto(invoice));
    });
    invoiceList.setInvoicesList(invoices);
    return invoiceList;
}
exports.createInvoiceList = createInvoiceList;
function createPayment(params) {
    var payment = new transaction_service_pb_1.default.HistoryItem.Payment();
    var source = new model_pb_2.default.TransactionId();
    source.setValue(params.source.buffer);
    payment.setSource(source);
    var destination = new model_pb_2.default.TransactionId();
    destination.setValue(params.destination.buffer);
    payment.setDestination(destination);
    payment.setAmount(params.amount.toNumber());
    return payment;
}
exports.createPayment = createPayment;
function createHistoryItem(params) {
    var item = new transaction_service_pb_1.default.HistoryItem();
    var txId = new model_pb_2.default.TransactionId();
    txId.setValue(params.transactionId);
    item.setTransactionId(txId);
    if (params.cursor) {
        var cursor = new transaction_service_pb_1.default.Cursor();
        cursor.setValue(params.cursor);
        item.setCursor(cursor);
    }
    if (params.stellarTxEnvelope) {
        var stellarTx = new model_pb_2.default.StellarTransaction();
        stellarTx.setEnvelopeXdr(params.stellarTxEnvelope);
        item.setStellarTransaction(stellarTx);
    }
    if (params.solanaTx) {
        var solanaTx = new model_pb_2.default.Transaction();
        solanaTx.setValue(params.solanaTx);
        item.setSolanaTransaction(solanaTx);
    }
    var payments = [];
    params.payments.forEach(function (payment) {
        payments.push(createPayment(payment));
    });
    item.setPaymentsList(payments);
    if (params.invoices.length > 0) {
        item.setInvoiceList(createInvoiceList({ invoices: params.invoices }));
    }
    return item;
}
exports.createHistoryItem = createHistoryItem;
