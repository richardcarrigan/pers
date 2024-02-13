import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Typography
} from '@mui/material';

import NewAccountForm from '../components/NewAccountForm';
import { GET_ACCOUNTS } from '../graphQL/queries';

const Accounts = ({ accountFormData, setAccountFormData }) => {
  const [isAccountFormVisible, setIsAccountFormVisible] = useState(false);
  const { user } = useAuth0();
  const navigate = useNavigate();

  const userId = user.sub;

  const { loading, error, data } = useQuery(GET_ACCOUNTS, { variables: { userId }});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <h1>Your Accounts</h1>
      <div className='accounts'>
        {data.accounts.map(account => {
          return (
            <Card raised={true} sx={{ minWidth: 275 }} key={account._id}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {account.name}
                </Typography>
                <Typography>
                  {
                    `Balance: ${Intl.NumberFormat('en-us', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(account.balance)}`
                  }
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/accounts/${account._id}`)}>View Transactions</Button>
              </CardActions>
            </Card>
          );
        })}
        <Fab color='secondary' aria-label='add' sx={{ position: 'fixed', bottom: '15px', right: '15px' }} onClick={() => accountModal.showModal()}><AddIcon /></Fab>
      </div>
      <NewAccountForm
        isVisible={isAccountFormVisible}
        setIsVisible={setIsAccountFormVisible}
        formData={accountFormData}
        setFormData={setAccountFormData}
      />
    </>
  );
};

export default Accounts;
