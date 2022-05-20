const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  description: String,
  amount: Number,
  type: String,
  recurrence: String,
  startDate: Date,
  accountId: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
