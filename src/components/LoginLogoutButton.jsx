import { useAuth0 } from '@auth0/auth0-react';

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
        <button className='btn btn-secondary' onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>
          Log Out
        </button>
      )}

      {/* If the user is not logged in */}
      {(!isAuthenticated && !isLoading) && (
        <button className='btn btn-primary' onClick={loginWithRedirect}>Log In</button>
      )}
    </>
  )
};

export default LoginLogoutButton;
