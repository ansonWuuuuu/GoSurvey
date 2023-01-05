import * as React from 'react';
import { useState } from 'react';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, Card, CardHeader, CardMedia, CardContent, CardActions, Icon, Modal, TextField, InputAdornment, FormControl, InputLabel, OutlinedInput, FilledInput, FormHelperText } from '@mui/material'
import styledCom from 'styled-components';
import { styled, alpha } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { display } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSurvey } from "./hooks/useSurvey";
import mongoose from 'mongoose';


const BlueBackground = styledCom.div`
    width: 100vh;
    height: 100vh;
    background-color: #03a9f4;
`;

const PaperHolder = styledCom.div`
    background: #1A4645;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
`;

const Login = () => {
    const {
        me,
        setMe,
        signedIn,
        setSignedIn,
        ID,
        setID,
        verifyId_query,
        verifyPassword_query,
        signUp_mut,
        createSurvey_mut,
        createSurveyQuestion_mut,
        createAnswer_mut,
        posts_query,
    } = useSurvey();

    const navigate = useNavigate()
    const location = useLocation()

    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showComfirmPassword, setShowComfirmPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowComfirmPassword = () => setShowComfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // 要不要進入輸入密碼環節
    const [valid, setValid] = React.useState(false);
    // 是否在註冊帳號
    const [signUp, setSignUp] = React.useState(false);
    // 輸入登入時的密碼
    const [password, setPassword] = React.useState('');
    // 註冊帳號時的新密碼
    const [newPassword, setNewPassword] = React.useState('');
    // 註冊帳號時確認密碼
    const [comfirmPassword, setComfirmPassword] = React.useState('');
    // 輸入userID判斷是否有註冊過
    const [userId, setUserId] = React.useState("");
    // 註冊帳號時的名稱
    const [username, setUsername] = React.useState("");
    // 是否註冊過
    const [loginExistedErr, setLoginExistedErr] = React.useState('');
    // 名字不可為空
    const [signUpNameErr, setSignUpNameErr] = React.useState('');
    // 登入時密碼錯誤
    const [loginPasswordErr, setLoginPasswordErr] = React.useState('');
    // 註冊帳號時判斷userID是否已經存在
    const [signUpExistedErr, setSignUpExistedErr] = React.useState('');
    // 註冊帳號時的密碼錯誤
    const [signUpPasswordErr, setSignUpPasswordErr] = React.useState('');

    const clearAllErrorMsg = () => {
        setLoginExistedErr('')
        setLoginPasswordErr('')
        setSignUpExistedErr('')
        setSignUpPasswordErr('')

        setUserId('')
    }

    const verifyCreate = async () => {
        if (userId === '') { setSignUpExistedErr('ID不可為空'); return }
        if (username.length === 0) { setSignUpNameErr('名稱不可為空'); return }
        if (newPassword.length < 6) { setSignUpPasswordErr('密碼長度至少為6'); return }
        if (comfirmPassword !== newPassword) { setSignUpPasswordErr('請再次確認密碼'); return }

        const newIdAC = await verifyId_query({
            variables: {
                userId: userId
            }
        })
        console.log(newIdAC.data)
        if (newIdAC.data.verifyId === false) {
            const newUserAC = await signUp_mut({
                variables: {
                    id: userId,
                    name: username,
                    password: newPassword,
                }
            })
            setSignUp(false);
            setNewPassword('');
            setComfirmPassword('');
            clearAllErrorMsg();
        }
        else {
            setSignUpExistedErr('ID已存在')
            return
        }
    }

    const verifyUser = async () => {
        if (userId === '') {
            setLoginExistedErr('請輸入您的ID')
            return;
        }
        const accepted = await verifyId_query({
            variables: {
                userId: userId
            }
        });
        if (accepted.data.verifyId === false) {
            setLoginExistedErr('您尚未註冊')
            console.log(loginExistedErr)
        }
        else {
            setID(userId);
            setValid(true);
            clearAllErrorMsg();
        }
    }

    const verifyPassword = async () => {
        const passwordAC = await verifyPassword_query({
            variables: {
                userId: ID,
                password: password
            }
        })
        console.log(passwordAC.data)
        if (passwordAC.data.verifyPassword === true) {
            setSignedIn(true)
            clearAllErrorMsg()
            if (location.pathname === '/') { navigate(`/home/${ID}`) }
        }
        else {
            setLoginPasswordErr('密碼錯誤')
        }
    }

    const enterID =
        <>
            <Box width='100%' justifyContent='center' display='flex' paddingBottom='10px'>
                <TextField label="User ID" variant="filled" error={loginExistedErr !== ''} helperText={loginExistedErr} value={userId} onChange={(e) => { setUserId(e.target.value) }} />
            </Box>
            <Box width='100%' justifyContent='center' display='flex'>
                <Button variant="outlined" onClick={() => { clearAllErrorMsg(); setSignUp(true); }}>註冊帳號</Button>
                <Button variant="contained" onClick={() => { verifyUser() }}>下一步</Button>
            </Box>
        </>

    // const enterID = (
    //     <>
    //         <Box width='100%' justifyContent='center' display='flex' paddingBottom='10px'>
    //             <TextField label="User ID" variant="filled" />
    //         </Box>
    //         <Box width='100%' justifyContent='center' display='flex'>
    //             <Button variant="outlined" onClick={() => { setSignUp(true) }}>sign up</Button>
    //             <Button variant="contained" onClick={() => { setValid(true) }}>next</Button>
    //         </Box>
    //     </>
    // )

    const enterPassword = (
        <>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <FilledInput
                    error={loginPasswordErr !== ''}
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={(e) => { setPassword(e.target.value); console.log(password) }}
                    label="Password"
                />
                <FormHelperText error={loginPasswordErr !== ''}>{loginPasswordErr}</FormHelperText>
            </FormControl>
            <Box width='100%' justifyContent='center' display='flex'>
                <Button variant="outlined" onClick={() => { clearAllErrorMsg(); setValid(false); }}>上一步</Button>
                <Button variant="contained"
                    onClick={() => {
                        verifyPassword();
                        posts_query();
                    }}
                >登入</Button>
            </Box>
        </>
    )

    const signUpPage = (

        <>
            <Box width='100%' height='55px' justifyContent='center' display='flex' paddingBottom='10px'>
                <TextField sx={{ m: 1, width: '100%' }} size='small' value={userId} error={signUpExistedErr !== ''} helperText={signUpExistedErr} label="New User ID" variant="filled" onChange={(e) => { setUserId(e.target.value); console.log(`userId: ${userId}`) }} />
            </Box>
            <Box width='100%' height='55px' justifyContent='center' display='flex' paddingBottom='10px'>
                <TextField sx={{ m: 1, width: '100%' }} size='small' defaultValue='' error={signUpNameErr !== ''} helperText={signUpNameErr} label="New User Name" variant="filled" onChange={(e) => { setUsername(e.target.value); console.log(`username: ${username}`) }} />
            </Box>
            <Box width='100%' height='55px' justifyContent='center' display='flex' flexWrap='wrap' paddingBottom='10px'>
                <FormControl sx={{ m: 1, width: '100%' }} size='small' variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Enter password</InputLabel>
                    <FilledInput
                        id="outlined-adornment-newPassword"
                        error={signUpPasswordErr !== ''}
                        type={showNewPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowNewPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        onChange={(e) => { setNewPassword(e.target.value); console.log(newPassword) }}
                        label="Password"
                    />
                    <FormHelperText error={signUpPasswordErr !== ''}>{signUpPasswordErr}</FormHelperText>
                </FormControl>
            </Box>
            <Box width='100%' height='55px' justifyContent='center' display='flex' flexWrap='wrap' paddingBottom='10px'>
                <FormControl sx={{ m: 1, width: '100%' }} size='small' variant="outlined" >
                    <InputLabel htmlFor="outlined-adornment-password" >Comfirm password</InputLabel>
                    <FilledInput
                        id="outlined-adornment-comfirmPassword"
                        error={signUpPasswordErr !== ''}
                        type={showComfirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowComfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showComfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        onChange={(e) => { setComfirmPassword(e.target.value); console.log(comfirmPassword) }}
                        label="Password"
                    />
                    <FormHelperText error={signUpPasswordErr !== ''}>{signUpPasswordErr}</FormHelperText>
                </FormControl>
            </Box>
            <Box width='100%' justifyContent='center' display='flex'>
                <Button variant="outlined" onClick={() => { clearAllErrorMsg(); setSignUp(false); }}>取消</Button>
                <Button variant="contained" onClick={verifyCreate}>創建</Button>
            </Box>
            {/* <Box width='100%' justifyContent='center' display='flex' flexWrap='wrap'>
                <Typography width='100%' display='flex' justifyContent='center' color='red'>
                    {error}
                </Typography>
            </Box> */}
        </>
    )

    const title = signUp ? '註冊新帳號' : valid ? '輸入密碼' : '輸入使用者ID'
    const boxHeight = signUp ? 500 : 250
    setSignedIn(false)
    return (
        <PaperHolder>
            <Box sx={{
                width: 400, height: 100, position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
            }} display='flex' flexWrap='wrap' justifyContent='center' alignContent='space-around'>
                <Box>
                <Typography
                    variant="h4"
                    noWrap
                    component="a"
                    sx={{
                        width: '100%',
                        display: {md: 'flex' , justifyContent: 'center'},
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'white',
                        textDecoration: 'none',
                    }}
                >
                    {"Go Survey"}
                </Typography>
                </Box>
            </Box>
            <Box sx={{
                width: 400, height: boxHeight, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#CEDBD8', borderRadius: 3, boxShadow: 1
            }} display='flex' flexWrap='wrap' justifyContent='center' alignContent='space-around'>
                <Box width='100%' justifyContent='center' display='flex'>
                    <h2 id="parent-modal-title">{title}</h2>
                </Box>
                {/* <Box width='100%' justifyContent='center' display='flex' paddingBottom='10px'>
                    <TextField label="User Name" variant="filled" />
                </Box> */}
                {signUp ? signUpPage : (valid ? enterPassword : enterID)}
            </Box>
        </PaperHolder>
    )
}

export default Login;
