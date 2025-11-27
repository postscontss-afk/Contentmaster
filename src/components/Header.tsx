import { useContext, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../services/Auth';
import { useSiteConfig } from '../context/SiteConfigContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header: FC = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();
  const { siteName } = useSiteConfig();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear session if logout fails
      localStorage.removeItem('sessionToken');
      window.location.reload();
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Only show admin/logout if authenticated
  const showAdminControls = isAuthenticated && user;

  return (
    <AppBar 
      position="sticky"
      sx={{
        bgcolor: mode === 'dark' ? '#0A0A0A' : '#ffffff',
        color: mode === 'dark' ? '#fff' : '#111',
        boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <Toolbar>
        {/* Site Logo/Name */}
        <Box
          component={RouterLink}
          to="/"
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: mode === 'dark' ? 'linear-gradient(to right, #d32f2f 0%, #b71c1c 100%)' : 'transparent',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              mr: 1,
              border: mode === 'dark' ? 'none' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: mode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                color: mode === 'dark' ? 'white' : '#111',
              }}
            >
              {siteName.split(' ')[0]}
              <Box 
                component="span" 
                sx={{ 
                  color: mode === 'dark' ? 'white' : '#111',
                  fontWeight: 400,
                  ml: 0.5
                }}
              >
                {siteName.split(' ').slice(1).join(' ')}
              </Box>
            </Typography>
          </Box>
          
          <Chip 
            label="18+" 
            size="small"
            sx={{ 
              ml: 1, 
              bgcolor: theme => theme.palette.primary.main, 
              color: 'white', 
              fontWeight: 'bold',
              height: '22px',
              fontSize: '0.7rem'
            }} 
          />
        </Box>
        
        {/* Search Bar */}
        {!isMobile && (
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mx: 1,
              minWidth: '200px',
              maxWidth: '250px'
            }}
          >
            <TextField
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
                  color: mode === 'dark' ? '#fff' : '#111',
                  height: '36px',
                  fontSize: '0.85rem',
                  '& fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.14)',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(142, 36, 170, 0.4)' : 'rgba(0,0,0,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme => theme.palette.primary.main,
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '8px 12px',
                  '&::placeholder': {
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                    opacity: 1,
                    fontSize: '0.85rem',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <SearchIcon sx={{ 
                      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0,0,0,0.5)', 
                      fontSize: '18px' 
                    }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ 
              mr: 1,
              color: mode === 'dark' ? '#fff' : '#111',
              fontWeight: 600,
              '&:hover': {
                bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
              }
            }}
          >
            Home
          </Button>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/videos"
            sx={{ 
              mr: 1,
              color: mode === 'dark' ? '#fff' : '#111',
              fontWeight: 600,
              '&:hover': {
                bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
              }
            }}
          >
            Videos
          </Button>
          
          {/* Mobile Search Icon */}
          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/videos')}
              sx={{ 
                mr: 1,
                color: mode === 'dark' ? '#fff' : '#111',
                '&:hover': {
                  bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
                }
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          )}
          
          {/* Show admin button if authenticated */}
          {showAdminControls && (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/admin"
                startIcon={<PersonIcon />}
                sx={{ 
                  mr: 1,
                  color: mode === 'dark' ? '#fff' : '#111',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
                  }
                }}
              >
                Admin
              </Button>
              
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  color: mode === 'dark' ? '#fff' : '#111',
                  '&:hover': {
                    bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
                  } 
                }} 
                aria-label="logout"
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
          
          {/* Theme toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            sx={{ 
              ml: 1,
              color: theme => theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme => mode === 'dark' ? 'rgba(13,71,161,0.12)' : 'rgba(13,71,161,0.06)'
              }
            }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
