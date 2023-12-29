import { gql } from '@apollo/client';

export const ADD_ACCOUNT = gql`
  mutation AddAccount($name: String!, $balance: Float!, $userId: String!) {
    addAccount(name: $name, balance: $balance, userId: $userId) {
      _id
      name
      balance
      userId
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($accountId: ID!, $name: String!, $balance: Float!) {
    updateAccount(accountId: $accountId, name: $name, balance: $balance) {
      _id
      name
      balance
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId) {
      _id
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction(
    $description: String!
    $amount: Float!
    $type: TransactionTypes!
    $startDate: String!
    $accountId: ID!
    $displayOrder: Int!
  ) {
    addTransaction(
      description: $description
      amount: $amount
      type: $type
      startDate: $startDate
      accountId: $accountId
      displayOrder: $displayOrder
    ) {
      _id
      description
      amount
      type
      startDate
      displayOrder
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation updateTransaction(
    $transactionId: ID!
    $description: String!
    $amount: Float!
    $type: TransactionTypes!
    $startDate: String!
    $displayOrder: Int!
  ) {
    updateTransaction(
      transactionId: $transactionId
      description: $description
      amount: $amount
      type: $type
      startDate: $startDate
      displayOrder: $displayOrder
    ) {
      _id
      description
      amount
      type
      startDate
      displayOrder
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId) {
      _id
    }
  }
`;
