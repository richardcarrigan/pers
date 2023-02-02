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
    balance: Float!
    name: String!
    transactions: [Transaction]!
    userId: String!
  }

  type DeleteAccountPayload {
    _id: ID!
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

  type DeleteTransactionPayload {
    _id: ID!
  }

  type Query {
    "Query to get accounts array"
    accounts(userId: String!): [Account]
    "Get a single account, provided the account's ID"
    account(id: ID!, userId: String!): Account
  }

  type Mutation {
    addAccount(name: String!, balance: Float!, userId: String!): Account

    updateAccount(accountId: ID!, name: String!, balance: Float!): Account

    deleteAccount(accountId: ID!): DeleteAccountPayload

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

    deleteTransaction(transactionId: ID!): DeleteTransactionPayload
  }
`;

module.exports = typeDefs;
