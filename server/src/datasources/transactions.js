const { MongoDataSource } = require('apollo-datasource-mongodb');

class Transactions extends MongoDataSource {
  getTransactions() {
    return this.findByFields({});
  }

  getTransaction(transactionId) {
    return this.findOneById(transactionId);
  }
}

module.exports = Transactions;
