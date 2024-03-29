import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { LeftMenuBar } from '../navigation/LeftMenuBar ';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import { Outlet, useNavigate } from 'react-router-dom';
import { Logout } from './UseNavBar';
import { DeaksModal } from "../shared/components/DeaksModal";
import { ChangePassword } from '../password/changePassword';
const logo = require("../../assets/logo.jpg");



const drawerWidth = 200;

const darkTheme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#fbd126',
    },
  },
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    backgroundColor: "white",
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
 
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
   
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: "#0c3547",
  width: "198px",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
const DrawerHeaderpart = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
 
const DrawerSidemenue = styled('Drawer')(({theme})=>({
  backgroundColor:"#0c3547",
}));

export default function NavBar() {
  const theme = useTheme();
  const navigation = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [popup, setpopup] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);

  };

  const Onlogout = () => {
    setAnchorEl(null);

    Logout().then((response) => {
      localStorage.setItem("Token", "")
      console.log(response);
      navigation("/login");
    })

  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <ThemeProvider theme={darkTheme}>
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <img style={{
                borderRadius: "20px", Height: "80px",
                width: "40px", marginRight: "10px"
              }} src={logo} alt="app logp" />
              <Typography variant="h6" noWrap component="div" style={{ flex: 1 }}>
                Deaks
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { setpopup(true) }}>Change Password</MenuItem>
                <MenuItem onClick={Onlogout}>Logout</MenuItem>

              </Menu>
              <DeaksModal
                modalOpen={popup}
                setModalOpen={setpopup}
                modalHeader="Change Password"
                width={"50%"}
              >
                <ChangePassword
                  setModalOpen={setpopup}
                />
              </DeaksModal>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <DrawerSidemenue
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',


            },
          }}
          
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose} style={{color:"white"}}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <LeftMenuBar />

        </DrawerSidemenue>
        <Main open={open}>
          <DrawerHeaderpart />
          <Outlet />
        </Main>
      </Box>
    </ProtectedRoute>
  );
}