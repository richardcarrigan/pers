const resolvers = {
  Query: {
    // returns an array of Accounts
    accounts: (_, __, { dataSources }) => {
      return dataSources.accounts.getAccounts();
    },
    // returns a single account, provided the account's ID
    account: (_, { id }, { dataSources }) => {
      return dataSources.accounts.getAccount(id);
    },
    // returns an array of Transactions
    transactions: (_, __, { dataSources }) => {
      return dataSources.transactions.getTransactions();
    },
    // returns a single transaction, provided the transaction's ID
    transaction: (_, { id }, { dataSources }) => {
      return dataSources.transactions.getTransaction(id);
    }
  },
  Account: {
    transactions(parent, __, { dataSources }) {
      return dataSources.transactions.getTransactions(parent._id);
    }
  },
  Transaction: {
    account(parent, __, { dataSources }) {
      return dataSources.accounts.getAccount(parent.account);
    }
  }
};

module.exports = resolvers;
