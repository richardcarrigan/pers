import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

function Header() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <header>
      <div className="header-item">
      <h3 id='brand'><Link to='/'>Pers</Link></h3>
      </div>
      {isAuthenticated && (
        <nav className='header-item'>
          <ul>
            <li><Link to='/dashboard'>Dashboard</Link></li>
          </ul>
        </nav>
      )}
      <div className='header-item auth-container'>
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
