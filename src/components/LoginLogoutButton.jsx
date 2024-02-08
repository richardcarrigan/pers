import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

const LoginLogoutButton = () => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
  } = useAuth0();

  return (
    <>
      {/* If the user is logged in */}
      {(isAuthenticated && !isLoading) && (
        <Button variant='outlined' onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>Log Out</Button>
      )}

      {/* If the user is not logged in */}
      {(!isAuthenticated && !isLoading) && (
        <Button variant='contained' onClick={loginWithRedirect}>Log In</Button>
      )}
    </>
  )
};

export default LoginLogoutButton;
