const { MongoDataSource } = require('apollo-datasource-mongodb');

class Transactions extends MongoDataSource {
  getTransactions(accountId) {
    return accountId
      ? this.findByFields({ account: accountId })
      : this.findByFields({});
  }

  getTransaction(transactionId) {
    return this.findOneById(transactionId);
  }
}

module.exports = Transactions;
