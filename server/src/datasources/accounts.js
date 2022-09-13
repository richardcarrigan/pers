const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ObjectId } = require('mongodb');

class Accounts extends MongoDataSource {
  // Create methods
  addAccount(accountName) {
    const result = this.collection.insertOne({ name: accountName });
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
  updateAccount(accountId, updatedAccountName) {
    this.deleteFromCacheById(accountId);
    this.collection.updateOne(
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
  deleteAccount(accountId) {
    this.collection.deleteOne({ _id: ObjectId(accountId) });
    this.deleteFromCacheById(accountId);
    return { _id: accountId };
  }
}

module.exports = Accounts;
