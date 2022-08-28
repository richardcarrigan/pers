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
    addAccount: (_, { accountName }, { dataSources }) => {
      return dataSources.accounts.addAccount(accountName);
    },
    updateAccount: (_, { accountId, updatedAccountName }, { dataSources }) => {
      return dataSources.accounts.updateAccount(accountId, updatedAccountName);
    },
    deleteAccount: (_, { accountId }, { dataSources }) => {
      return dataSources.accounts.deleteAccount(accountId);
    },
    addTransaction: (
      _,
      { description, recurrence, amount, type, startDate, accountId },
      { dataSources }
    ) => {
      return dataSources.transactions.addTransaction(
        description,
        recurrence,
        amount,
        type,
        startDate,
        accountId
      );
    },
    updateTransaction: (
      _,
      { transactionId, description, recurrence, amount, type, startDate },
      { dataSources }
    ) => {
      return dataSources.transactions.updateTransaction(
        transactionId,
        description,
        recurrence,
        amount,
        type,
        startDate
      );
    }
  }
};

module.exports = resolvers;
