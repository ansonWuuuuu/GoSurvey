import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import styledCom from 'styled-components';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { padding } from '@mui/system';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ExcelJs from "exceljs";
import { useSurvey } from '../containers/hooks/useSurvey';


const drawerWidth = 240;

// --------------------------------SEARCH--------------------------------
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(1)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

// --------------------------------SETTING--------------------------------
const settings = ['個人資料', '登出'];

// --------------------------------側拉選單--------------------------------
// 上半部:
const upList = ['首頁', '查看您的表單', '已按讚的表單'];
// 下半部:
const downList = ['建立您的表單'];



function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('')

    const { ID, setID, setFilterType, filterType, search, setSearch } = useSurvey()
    console.log(ID)

    const handleOpenUserMenu = (event) => {
        console.log(event.currentTarget)
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogOut = () => {
        console.log("logout")
        navigate('/')
        setFilterType('')
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleSearch = (event) => {
        console.log(searchInput)
        setSearch(searchInput)
        console.log(search)
        navigate(`/search/${ID}`)
    }

    const navigate = useNavigate()
    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerToggle}
            onKeyDown={handleDrawerToggle}
        >
            <List>
                {upList.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => { setFilterType(text); console.log(filterType); navigate(`/home/${ID}`) }}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {downList.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => { navigate(`/createSurvey/${ID}`) }}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" style={{ background: '#266867' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                                onClick={() => { navigate(`/home/${ID}`) }}
                            >
                                Go Survey
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, padding: 1 }}>
                            <IconButton onClick={handleSearch}>
                                <SearchIcon sx={{color: "white"}}/>
                            </IconButton>
                            <Search>
                                <StyledInputBase
                                    placeholder="搜尋問卷..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </Search>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
                                    <AccountCircleIcon fontSize="large" />
                                    {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" color='#795548'/> */}
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key={'profile'} onClick={() => { navigate(`/profile/${ID}`) }}>
                                    <Typography textAlign="center" component="a"
                                        sx={{
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}>
                                        個人資料
                                    </Typography>
                                </MenuItem>
                                <MenuItem key={'logOut'} onClick={handleLogOut}>
                                    <Typography textAlign="center" component="b"
                                        sx={{
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}>
                                        登出
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                >
                    {list()}
                </Drawer>
            </Box>
        </>
    );
}
export default ResponsiveAppBar;