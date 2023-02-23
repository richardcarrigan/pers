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
    accountId,
    displayOrder
  ) {
      const result = await this.collection.insertOne({
        description,
        recurrence,
        amount: Number(amount),
        type,
        startDate: new Date(Number(startDate)),
        account: ObjectId(accountId),
        displayOrder
      });
      return await this.findOneById(result.insertedId);
  }

  // Get an array of an account's transactions
  async getTransactions(accountId) {
    return await this.findByFields({ account: accountId });
  }

  // Update a transaction
  async updateTransaction(
    transactionId,
    description,
    recurrence,
    amount,
    type,
    startDate,
    displayOrder
  ) {
      await this.deleteFromCacheById(transactionId);
      await this.collection.updateOne(
        { _id: ObjectId(transactionId) },
        {
          $set: {
            description,
            recurrence,
            amount: Number(amount),
            type,
        startDate: new Date(Number(startDate)),
            displayOrder
          }
        }
      );
      return await this.findOneById(transactionId);
  }

  // Delete a transaction
  async deleteTransaction(transactionId) {
    await this.collection.deleteOne({ _id: ObjectId(transactionId) });
    await this.deleteFromCacheById(transactionId);
    return { _id: transactionId };
  }
}

module.exports = Transactions;
