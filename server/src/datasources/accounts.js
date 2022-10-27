const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Accounts extends MongoDataSource {
  // Create methods
  async addAccount(name, balance) {
    const result = await this.collection.insertOne({
      name,
      balance
    });
    return await this.findOneById(result.insertedId);
  }

  // Read methods
  async getAccounts() {
    return await this.findByFields({});
  }

  async getAccount(accountId) {
    return await this.findOneById(accountId);
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
