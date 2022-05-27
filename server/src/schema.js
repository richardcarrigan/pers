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
    id: ID!
    description: String!
    amount: Int!
    type: String!
    recurrence: String
    startDate: String!
    account: Account!
  }

  type Account {
    id: ID!
    name: String!
    transactions: [Transaction!]!
  }
`;

module.exports = typeDefs;
