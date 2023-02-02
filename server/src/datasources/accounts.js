const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Accounts extends MongoDataSource {
  // Create methods
  async addAccount(name, balance, userId) {
    const result = await this.collection.insertOne({
      name,
      balance,
      userId
    });
    return await this.findOneById(result.insertedId);
  }

  // Read methods
  async getAccounts(userId) {
    return await this.findByFields({ userId });
  }

  async getAccount(accountId, userId) {
    return this.findByFields({ _id: accountId, userId }).then(documents => documents?.[0]);
  }

  // Update methods
  async updateAccount(accountId, name, balance) {
    await this.deleteFromCacheById(accountId);
    await this.collection.updateOne(
      { _id: ObjectId(accountId) },
      {
        $set: {
          name,
          balance
        }
      }
    );
    return await this.findOneById(accountId);
  }

  // Delete methods
  async deleteAccount(accountId) {
    await this.collection.deleteOne({ _id: ObjectId(accountId) });
    await this.deleteFromCacheById(accountId);
    return { _id: accountId };
  }
}

module.exports = Accounts;
