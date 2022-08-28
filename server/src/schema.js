const { gql } = require('apollo-server');

const typeDefs = gql`
  enum RecurrenceOptions {
    none
    daily
    weekly
    monthly
  }

  enum TransactionTypes {
    income
    expense
  }

  type Account {
    _id: ID!
    name: String!
    transactions: [Transaction]!
  }

  type Transaction {
    _id: ID!
    description: String!
    recurrence: RecurrenceOptions!
    amount: Float!
    type: TransactionTypes!
    startDate: String!
    account: Account!
  }

  type Query {
    "Query to get transactions array"
    transactions: [Transaction]
    "Get a single transaction, provided the transaction's ID"
    transaction(id: ID!): Transaction
    "Query to get accounts array"
    accounts: [Account]
    "Get a single account, provided the account's ID"
    account(id: ID!): Account
  }

  type Mutation {
    addAccount(accountName: String!): Account

    updateAccount(accountId: ID!, updatedAccountName: String!): Account

    deleteAccount(accountId: ID!): ID

    addTransaction(
      description: String!
      recurrence: RecurrenceOptions!
      amount: Float!
      type: TransactionTypes!
      startDate: String!
      accountId: ID!
    ): Transaction

    updateTransaction(
      transactionId: ID!
      description: String!
      recurrence: RecurrenceOptions!
      amount: Float!
      type: TransactionTypes!
      startDate: String!
    ): Transaction
  }
`;

module.exports = typeDefs;
