import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query getAccounts {
    accounts {
      _id
      balance
      name
    }
  }
`;

export const GET_ACCOUNT = gql`
  query getAccount($id: ID!) {
    account(id: $id) {
      _id
      balance
      name
      transactions {
        _id
        startDate
        description
        amount
        type
        recurrence
        displayOrder
      }
    }
  }
`;
