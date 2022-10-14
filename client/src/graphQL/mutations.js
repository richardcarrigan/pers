import { gql } from '@apollo/client';

export const ADD_ACCOUNT = gql`
  mutation AddAccount($name: String!, $balance: Float!) {
    addAccount(name: $name, balance: $balance) {
      _id
      name
      balance
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($accountId: ID!, $updatedAccountName: String!) {
    updateAccount(
      accountId: $accountId
      updatedAccountName: $updatedAccountName
    ) {
      _id
      name
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
    $recurrence: RecurrenceOptions!
    $amount: Float!
    $type: TransactionTypes!
    $startDate: String!
    $accountId: ID!
    $displayOrder: Int!
  ) {
    addTransaction(
      description: $description
      recurrence: $recurrence
      amount: $amount
      type: $type
      startDate: $startDate
      accountId: $accountId
      displayOrder: $displayOrder
    ) {
      _id
      description
      recurrence
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
    $recurrence: RecurrenceOptions!
    $amount: Float!
    $type: TransactionTypes!
    $startDate: String!
    $displayOrder: Int!
  ) {
    updateTransaction(
      transactionId: $transactionId
      description: $description
      recurrence: $recurrence
      amount: $amount
      type: $type
      startDate: $startDate
      displayOrder: $displayOrder
    ) {
      _id
      description
      recurrence
      amount
      type
      startDate
      displayOrder
      account {
        _id
        name
      }
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
