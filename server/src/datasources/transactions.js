const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Transactions extends MongoDataSource {
  // Create methods
  async addTransaction(
    description,
    recurrence,
    amount,
    type,
    startDate,
    accountId
  ) {
    const startDateFormatted = new Date(startDate);
    if (startDateFormatted.toString() === 'Invalid Date') {
      throw new Error('Start date is not valid');
    } else {
      const result = await this.collection.insertOne({
        description,
        recurrence,
        amount,
        type,
        startDate: startDateFormatted,
        account: ObjectId(accountId)
      });
      return this.findOneById(result.insertedId);
    }
  }

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
