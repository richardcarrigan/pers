const resolvers = {
  Query: {
    // returns an array of Transactions
    transactions: (_, __, { dataSources }) => {
      return dataSources.Transactions.getTransactions();
    },
    // returns a single transaction, provided the transaction's ID
    transaction: (_, { id }, { dataSources }) => {
      return dataSources.Transactions.getTransaction(id);
    },
    // returns an array of Accounts
    accounts: (_, __, { dataSources }) => {
      return dataSources.Accounts.getAccounts();
    },
    // returns a single account, provided the account's ID
    account: (_, { id }, { dataSources }) => {
      return dataSources.Accounts.getAccount(id);
    }
  }
};

module.exports = resolvers;
