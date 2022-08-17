import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_ACCOUNT = gql`
  query getAccount($id: ID!) {
    account(id: $id) {
      _id
      name
    }
  }
`;

export default function Account() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  return (
    <div>
      <h1>{data.account.name}</h1>
      {data.account._id}
    </div>
  );
}
