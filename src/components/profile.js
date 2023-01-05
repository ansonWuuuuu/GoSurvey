import * as React from 'react';
import { useState } from 'react';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, Card, CardHeader, CardMedia, CardContent, CardActions, Icon, Modal, TextField, InputAdornment, FormControl, InputLabel, OutlinedInput, FilledInput, FormHelperText } from '@mui/material'
import styledCom from 'styled-components';
import { styled, alpha} from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { red } from '@mui/material/colors';
import { useSurvey } from '../containers/hooks/useSurvey';
import { USER_QUERY } from '../graphql';
import { useQuery } from '@apollo/client';

const PaperHolder = styledCom.div`
    background: #CEDBD8;
    width: 100%;
    height: 88vh;
    display: flex;
    justify-content: center;
`;
const ContentPaper = styled(Paper)`
    width: 60%;
    height: auto;
    padding: 2em;
    overflow: auto;
`;

// ----------------------TODO: 用hook取得資訊 / 查看別人的資料Query----------------------

function Profile() {
    const [modalOpen, setModalOpen] = React.useState(false)
    const [nameErr, setNameErr] = React.useState('')
    const [oldPasswordErr, setOldPasswordErr] = React.useState('')
    const [newPasswordErr, setNewPasswordErr] = React.useState('')

    const [newName, setNewName] = React.useState('')
    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [comfirmPassword, setComfirmPassword] = React.useState('')

    const [showOldPassword, setShowOldPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showComfirmPassword, setShowComfirmPassword] = React.useState(false);

    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowComfirmPassword = () => setShowComfirmPassword((show) => !show);

    const {verifyPassword_query, updateSettings_mut, ID} = useSurvey()

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleOpen = () => {
        setModalOpen(true)
    }
    const handleClose = () => {
        setModalOpen(false)
        setNameErr('')
        setOldPasswordErr('')
    }

    const handleSave = async() => {
        if(newName===''){setNameErr('名稱不可為空'); return}
        const oldPasswordAC = await verifyPassword_query({
            variables: {
                userId: ID,
                password: oldPassword
            }
        })
        if(oldPasswordAC.data.verifyPassword===false){
            setOldPasswordErr('密碼錯誤')
            return
        }
        if(newPassword.length < 6) {setNewPasswordErr('密碼長度必須大於6'); return}
        if(newPassword!==comfirmPassword){
            setNewPasswordErr('請再次確認密碼');
            return
        }
        const updatedUser = await updateSettings_mut({
            variables: {
                id: ID,
                name: newName,
                newPassword: newPassword
            }
        })
        console.log(updatedUser)
    }

    const {data, loading, error, subscribeToMore} = useQuery(USER_QUERY,{
        variables:{
            userId: ID
        }
    })
    console.log(error)
    if(loading) return <p>loading</p>
    if(error) return <p>error</p>

    console.log(data)
    let user = data.queryUser
    return (
        <PaperHolder>
            <ContentPaper>
                <Box width='100%' height='100%' display='flex' flexWrap='wrap' alignContent='flex-start'>
                    <Box width='100%' height='40%' display='flex' flexWrap='wrap' margin='20px'>
                        <Box width='100%' display='flex' justifyContent='center' margin='10px'>
                            <Avatar sx={{ bgcolor: '#a1887f', width: 80, height: 80, fontSize: 40}} aria-label="person">
                                {user.id[0]}
                            </Avatar>
                        </Box>
                        <Box width='100%' display='flex' justifyContent='center'>
                            <Typography variant='h5' gutterBottom>
                                {user.name}'s profile
                            </Typography>
                        </Box>
                        <Divider variant='middle' style={{ width: '100%' }} />
                    </Box>
                    <Box width='100%' display='flex' flexWrap='wrap' justifyContent='center'>
                        <Box width='51%' display='flex'>
                            <Box flexGrow='1'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    已上傳問卷數：
                                </Typography>
                            </Box>
                            <Box flexGrow='0'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    {user.surveyCreated.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box width='51%' display='flex'>
                            <Box flexGrow='1'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    已填寫問卷數：
                                </Typography>
                            </Box>
                            <Box flexGrow='0'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    {user.surveyAnswered.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box width='51%' display='flex'>
                            <Box flexGrow='1'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    已按讚問卷數：
                                </Typography>
                            </Box>
                            <Box flexGrow='0'>
                                <Typography variant='body1' gutterBottom flexGrow='1'>
                                    {user.favorite.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box width='51%' display='flex' justifyContent='center'>
                            <Button variant="contained" onClick={handleOpen} sx={{bgcolor: '#2196f3'}}>Settings</Button>
                        </Box>
                        <Modal
                            open={modalOpen}
                            onClose={handleClose}
                            aria-labelledby="parent-modal-title"
                            aria-describedby="parent-modal-description"
                        >
                            <Box sx={{
                                width: 400, height: 500, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#CEDBD8'
                            }}>
                                <Box width='100%' justifyContent='center' display='flex'>
                                    <h2 id="parent-modal-title">設定您的帳號</h2>
                                </Box>
                                <Box width='100%' height='60px' justifyContent='center' display='flex' paddingBottom='10px'>
                                    <TextField sx={{width:'100%', m:1}} size='small' label="New User Name" variant="filled" error={nameErr !== ''} helperText={nameErr} onChange={(e)=>{setNewName(e.target.value)}}/>
                                </Box>
                                <Box width='100%' height='60px' justifyContent='center' display='flex' flexWrap='wrap' paddingBottom='10px'>
                                    <FormControl sx={{ m: 1, width: '100%' }} size='small' variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password" >Old password</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-oldPassword"
                                            error={oldPasswordErr !== ''}
                                            type={showOldPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowOldPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showComfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            onChange={(e) => { setOldPassword(e.target.value); }}
                                            label="Password"
                                        />
                                        <FormHelperText error={oldPasswordErr !== ''}>{oldPasswordErr}</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box width='100%' height='60px' justifyContent='center' display='flex' flexWrap='wrap' paddingBottom='10px'>
                                    <FormControl sx={{ m: 1, width: '100%' }} size='small' variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password" >New password</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-newPassword"
                                            error={newPasswordErr !== ''}
                                            type={showNewPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showComfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            onChange={(e) => { setNewPassword(e.target.value); }}
                                            label="Password"
                                        />
                                        <FormHelperText error={newPasswordErr !== ''}>{newPasswordErr}</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box width='100%' height='60px' justifyContent='center' display='flex' flexWrap='wrap' paddingBottom='10px'>
                                    <FormControl sx={{ m: 1, width: '100%' }} size='small' variant="outlined" >
                                        <InputLabel htmlFor="outlined-adornment-password" >Confirm password</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-comfirmPassword"
                                            error={newPasswordErr !== ''}
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
                                            onChange={(e) => { setComfirmPassword(e.target.value); }}
                                            label="Password"
                                        />
                                        <FormHelperText error={newPasswordErr !== ''}>{newPasswordErr}</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box width='100%' justifyContent='center' display='flex'>
                                    <Button variant="outlined" onClick={handleClose}>取消</Button>
                                    <Button variant="contained" onClick={handleSave}>儲存</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                </Box>
            </ContentPaper>
        </PaperHolder>
    )
}

export default Profile