const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Transactions extends MongoDataSource {
  // Add a new transaction to an account
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
        amount: Number(amount),
        type,
        startDate: startDateFormatted,
        account: ObjectId(accountId)
      });
      return this.findOneById(result.insertedId);
    }
  }

  // Get an array of an account's transactions
  getTransactions(accountId) {
    return this.findByFields({ account: accountId });
  }

  // Update a transaction
  updateTransaction(
    transactionId,
    description,
    recurrence,
    amount,
    type,
    startDate
  ) {
    const startDateFormatted = new Date(startDate);
    if (startDateFormatted.toString() === 'Invalid Date') {
      throw new Error('Start date is not valid');
    } else {
      this.deleteFromCacheById(transactionId);
      this.collection.updateOne(
        { _id: ObjectId(transactionId) },
        {
          $set: {
            description,
            recurrence,
            amount: Number(amount),
            type,
            startDate: startDateFormatted
          }
        }
      );
      return this.findOneById(transactionId);
    }
  }
}

module.exports = Transactions;
