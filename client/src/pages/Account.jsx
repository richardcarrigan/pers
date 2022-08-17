import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_ACCOUNT = gql`
  query getAccount(accountId: ID!) {
    account {
      _id
      name
    }
  }
`;

export default function Account() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { accountId: id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  return (
    <div>
      <h1>Account</h1>
      {data.account._id}
    </div>
  );
}
