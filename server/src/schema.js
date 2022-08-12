const { gql } = require('apollo-server');

const typeDefs = gql`
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

  type Transaction {
    _id: ID!
    description: String!
    recurrence: String
    amount: Float!
    type: String!
    startDate: String!
  }

  type Account {
    _id: ID!
    name: String!
  }
`;

module.exports = typeDefs;
