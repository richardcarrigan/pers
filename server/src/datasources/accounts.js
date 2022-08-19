const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Accounts extends MongoDataSource {
  // Create methods
  async addAccount(accountName) {
    const result = await this.collection.insertOne({ name: accountName });
    return this.findOneById(result.insertedId);
  }

  // Read methods
  getAccounts() {
    return this.findByFields({});
  }

  getAccount(accountId) {
    return this.findOneById(accountId);
  }

  // Update methods
  async updateAccount(accountId, updatedAccountName) {
    this.deleteFromCacheById(accountId);
    await this.collection.updateOne(
      { _id: ObjectId(accountId) },
      {
        $set: {
          name: updatedAccountName
        }
      }
    );
    return this.findOneById(accountId);
  }

  // Delete methods
  async deleteAccount(accountId) {
    await this.collection.deleteOne({ _id: ObjectId(accountId) });
    this.deleteFromCacheById(accountId);
    return accountId;
  }
}

module.exports = Accounts;
