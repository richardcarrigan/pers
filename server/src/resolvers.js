const resolvers = {
  Query: {
    // returns an array of Transactions
    transactions: (_, __, { dataSources }) => {
      return dataSources.transactions.getTransactions();
    },
    // returns a single transaction, provided the transaction's ID
    transaction: (_, { id }, { dataSources }) => {
      return dataSources.transactions.getTransaction(id);
    },
    // returns an array of Accounts
    accounts: (_, __, { dataSources }) => {
      return dataSources.accounts.getAccounts();
    },
    // returns a single account, provided the account's ID
    account: (_, { id }, { dataSources }) => {
      return dataSources.accounts.getAccount(id);
    }
  }
};

module.exports = resolvers;
