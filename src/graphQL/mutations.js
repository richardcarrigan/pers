import { gql } from '@apollo/client';

export const ADD_ACCOUNT = gql`
  mutation AddAccount($name: String!, $balance: Float!, $userId: String!) {
    addAccount(name: $name, balance: $balance, userId: $userId) {
      _id
      balance
      name
      transactions {
        amount
        description
        startDate
        type
      }
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
mutation UpdateAccount($accountId: ID!, $name: String!, $balance: Float!, $transactions: [TransactionInput]!) {
  updateAccount(accountId: $accountId, name: $name, balance: $balance, transactions: $transactions) {
    _id
    balance
    name
    transactions {
      amount
      description
      startDate
      type
    }
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
