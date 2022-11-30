import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
  }

  return isAuthenticated && children;
};

export default PrivateRoute;
