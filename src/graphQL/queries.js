import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!) {
    accounts(userId: $userId) {
      _id
      balance
      name
    }
  }
`;

export const GET_ACCOUNT = gql`
  query GetAccount($id: ID!, $userId: String!) {
    account(id: $id, userId: $userId) {
      _id
      balance
      name
      transactions {
        startDate
        description
        amount
        type
      }
    }
  }
`;
