import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

import Logo from './Logo';
import LoginLogoutButton from './LoginLogoutButton';

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  }

  return (
    <>
      <AppBar position='sticky'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Logo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Link to='/'>
              <Typography
                variant='h6'
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                Pers (beta)
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='menu'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to='/accounts'>
                    <Typography textAlign='center'>Accounts</Typography>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>

            <Logo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Link to='/'>
              <Typography
                variant='h5'
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                Pers (beta)
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/accounts');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Accounts
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <LoginLogoutButton />
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

    </>
  );
}

export default Header;
