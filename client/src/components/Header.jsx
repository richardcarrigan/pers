import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

function Header() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <header>
      <Link to='/'>
        <h3 id='brand'>Pers.io</h3>
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <div id='greeting'>{`Hi, ${user.given_name || user.name}!`}</div>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}

export default Header;
