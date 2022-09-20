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
    displayOrder: Int!
    account: Account!
  }

  type Query {
    "Query to get accounts array"
    accounts: [Account]
    "Get a single account, provided the account's ID"
    account(id: ID!): Account
  }

  type Mutation {
    addAccount(accountName: String!): Account

    updateAccount(accountId: ID!, updatedAccountName: String!): Account

    deleteAccount(accountId: ID!): Account

    addTransaction(
      description: String!
      recurrence: RecurrenceOptions!
      amount: Float!
      type: TransactionTypes!
      startDate: String!
      accountId: ID!
      displayOrder: Int!
    ): Transaction

    updateTransaction(
      transactionId: ID!
      description: String!
      recurrence: RecurrenceOptions!
      amount: Float!
      type: TransactionTypes!
      startDate: String!
      displayOrder: Int!
    ): Transaction

    deleteTransaction(transactionId: ID!): Transaction
  }
`;

module.exports = typeDefs;
