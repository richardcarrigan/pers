import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
  }

  return isAuthenticated && children;
};

export default PrivateRoute;
