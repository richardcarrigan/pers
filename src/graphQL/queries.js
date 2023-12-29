import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query getAccounts($userId: String!) {
    accounts(userId: $userId) {
      _id
      balance
      name
    }
  }
`;

export const GET_ACCOUNT = gql`
  query getAccount($id: ID!, $userId: String!) {
    account(id: $id, userId: $userId) {
      _id
      balance
      name
      transactions {
        _id
        startDate
        description
        amount
        type
        displayOrder
      }
    }
  }
`;
