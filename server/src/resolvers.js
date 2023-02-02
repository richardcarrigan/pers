const resolvers = {
  Query: {
    // returns an array of Accounts
    accounts: (_, { userId }, { dataSources }) => {
      return dataSources.accounts.getAccounts(userId);
    },
    // returns a single account, provided the account's ID
    account: (_, { id, userId }, { dataSources }) => {
      return dataSources.accounts.getAccount(id, userId);
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
  },
  Mutation: {
    addAccount: (_, { name, balance, userId }, { dataSources }) => {
      return dataSources.accounts.addAccount(name, balance, userId);
    },
    updateAccount: (_, { accountId, name, balance }, { dataSources }) => {
      return dataSources.accounts.updateAccount(accountId, name, balance);
    },
    deleteAccount: async (_, { accountId }, { dataSources }) => {
      const transactions = await dataSources.transactions.getTransactions(
        accountId
      );
      transactions.forEach(transaction =>
        dataSources.transactions.deleteTransaction(transaction._id)
      );

      return dataSources.accounts.deleteAccount(accountId);
    },
    addTransaction: (
      _,
      {
        description,
        recurrence,
        amount,
        type,
        startDate,
        accountId,
        displayOrder
      },
      { dataSources }
    ) => {
      return dataSources.transactions.addTransaction(
        description,
        recurrence,
        amount,
        type,
        startDate,
        accountId,
        displayOrder
      );
    },
    updateTransaction: (
      _,
      {
        transactionId,
        description,
        recurrence,
        amount,
        type,
        startDate,
        displayOrder
      },
      { dataSources }
    ) => {
      return dataSources.transactions.updateTransaction(
        transactionId,
        description,
        recurrence,
        amount,
        type,
        startDate,
        displayOrder
      );
    },
    deleteTransaction: (_, { transactionId }, { dataSources }) => {
      return dataSources.transactions.deleteTransaction(transactionId);
    }
  }
};

module.exports = resolvers;
