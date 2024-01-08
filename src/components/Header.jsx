import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Logo from '../img/pers-logo.png';

function Header() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <header id='nav-header'>
      <div className="header-item" id='nav-header-logo'>
        <Link to='/'>
          <img src={Logo} alt="Pers logo" height={32} width={32} />
        </Link>
        <Link to='/'>
          <h3 id='brand'>Pers (beta)</h3>
        </Link>
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
