import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import AddIcon from '@mui/icons-material/Add';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, FormGroup, Checkbox, FormControlLabel, TextField, Radio, RadioGroup, typographyClasses, Modal, formLabelClasses, Fab, Input } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import styledCom from 'styled-components';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { padding } from '@mui/system';
import PropTypes from 'prop-types';
import { useSurvey } from '../containers/hooks/useSurvey';
import { v4 as uuidv4 } from 'uuid';

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

const Create = () => {

    const { createSurvey_mut, createSurveyQuestion_mut, ID, createDateString, addCreated_mut } = useSurvey();

    const [emptyError, setEmptyError] = React.useState("")
    const textRef = React.useRef()

    const surveyId = uuidv4();

    let questionPrototype = {
        questionType: "brief",
        questionText: "",
        options: [],
        multiBound: [],
        necessity: false,
    }

    const optKey = uuidv4()
    let optionPrototype = {
        key: optKey,
        parent: 0,
        text: "",
        canDeleted: false,
    }

    const [questionSet, setQuestionSet] = React.useState([questionPrototype]);
    const [optionSet, setOptionSet] = React.useState([optionPrototype]);
    const [title, setTitle] = React.useState('')
    const [modalOpen, setModalOpen] = React.useState(false)

    const handleCreate = async () => {
        console.log(surveyId)
        console.log(`userId: ${ID}`);
        const newSurvey = await createSurvey_mut({
            variables: {
                surveyId: surveyId,
                title: title,
                author: ID,
                date: createDateString(),
            }
        })
        console.log("33333")
        if (!newSurvey) console.log("failed to create survey");
        addCreated_mut({
            variables: {
                userId: ID,
                surveyId: surveyId
            }
        })
        addAllQuestion(surveyId);
        setModalOpen(true)
        return;
    }

    const addAllQuestion = async (surveyId) => {
        let tmpQuestionSet = questionSet
        for (let i in questionSet) {
            let arr = optionSet.filter((element) => element.parent == i)
            arr = arr.map((element) => element.text)
            tmpQuestionSet[i].options = arr
        }
        console.log(surveyId)
        setQuestionSet(tmpQuestionSet)
        for (let ques of questionSet) {
            console.log(ques)
            const newQuestion = await createSurveyQuestion_mut({
                variables: {
                    surveyId: surveyId,
                    questionType: ques.questionType,
                    questionText: ques.questionText,
                    options: ques.options,
                    multiBound: ques.multiBound,
                    necessity: ques.necessity,
                }
            })
        }
    }

    return (
        <PaperHolder>
            <ContentPaper>
                <Box width='100%' display='flex' flexWrap='wrap' justifyContent='center'>
                    <Box width='80%' display='flex' flexWrap='wrap' justifyContent='center' marginBottom='20px'>
                        <Typography width='100%' display='flex' justifyContent='center' variant='h4' fontWeight={500}>
                            創建屬於您的問卷
                        </Typography>
                        <Divider width='100%' />
                    </Box>
                    <Box width='80%' display='flex' flexWrap='wrap' marginBottom='20px'>
                        <Typography width='100%' display='flex' variant='h6' fontWeight={400} marginBottom='10px' key="enterTitle">
                            輸入標題
                        </Typography>
                        <TextField sx={{ width: '100%' }} onChange={(e) => { setTitle(e.target.value) }} placeholder='輸入問卷標題'></TextField>
                    </Box>
                    {questionSet.map((q, idx) => {
                        console.log(optionSet)
                        return (
                            <Box width='80%' display='flex' flexWrap='wrap' key={`1-${idx}`} >
                                <Typography width='100%' display='flex' variant='h6' fontWeight={400} marginBottom='10px' key={`2-${idx}`}>
                                    問題 {idx + 1}
                                </Typography>

                                <Box width='100%' marginBottom='10px' key={`3-${idx}`}>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="題型"
                                        defaultValue="brief"
                                        size='small'
                                        onChange={(e) => {
                                            setQuestionSet([...questionSet.slice(0, idx), { ...q, questionType: e.target.value }, ...questionSet.slice(idx + 1)])
                                        }}
                                    >
                                        <MenuItem key={'單選題'} value={'single-select'}> 單選題 </MenuItem>
                                        <MenuItem key={'多選題'} value={'multi-select'}> 多選題 </MenuItem>
                                        <MenuItem key={'簡答題'} value={'brief'}> 簡答題 </MenuItem>
                                    </TextField>
                                </Box>

                                <TextField placeholder='請輸入題目敘述' multiline sx={{ width: '100%' }} rows={4} onChange={(e) => {
                                    setQuestionSet([...questionSet.slice(0, idx), { ...q, questionText: e.target.value }, ...questionSet.slice(idx + 1)])
                                }} />

                                <Box width='100%' display='flex' flexWrap='wrap'>
                                    {q.questionType === 'brief' ? <></> :
                                        <Box id='choices' sx={{ width: '100%' }} >
                                            {optionSet.filter(opt => opt.parent === idx).sort((a, b) => (a.order - b.order)).map((opt, index) => {
                                                return (
                                                    <>
                                                        <TextField sx={{ width: '80%' }} placeholder="請輸入選項內容" defaultValue={opt.text} onChange={(e) => {
                                                            const curIndex = optionSet.findIndex((element) => element.key === opt.key)
                                                            console.log(curIndex)
                                                            console.log(curIndex)
                                                            setOptionSet([...optionSet.slice(0, curIndex), { ...opt, text: e.target.value }, ...optionSet.slice(curIndex + 1)]);
                                                        }} />
                                                        <IconButton onClick={() => {
                                                            let newOption = optionPrototype;
                                                            newOption.parent = idx
                                                            newOption.canDeleted = true;
                                                            const curIndex = optionSet.findIndex((element) => element.key === opt.key)
                                                            console.log(curIndex)
                                                            setOptionSet([...optionSet.slice(0, curIndex + 1), newOption, ...optionSet.slice(curIndex + 1)]);
                                                        }}> <AddIcon /> </IconButton>
                                                        {opt.canDeleted ?
                                                            <IconButton onClick={() => {
                                                                const curIndex = optionSet.findIndex((element) => element.key === opt.key)
                                                                setOptionSet([...optionSet.slice(0, curIndex), ...optionSet.slice(curIndex + 1)]);
                                                            }}> <RemoveIcon /> </IconButton> :
                                                            <></>
                                                        }
                                                    </>)
                                            })}
                                        </Box>
                                    }
                                </Box>

                                <Box width='100%' display='flex' >
                                    <FormControlLabel control={<Checkbox checked={q.necessity || false} />} label='必填' key='必填' onChange={(e) => {
                                        setQuestionSet([...questionSet.slice(0, idx), { ...q, necessity: e.target.checked }, ...questionSet.slice(idx + 1)])
                                    }} />
                                    {q.questionType === '多選題' ?
                                        <>
                                            <TextField placeholder='min' />
                                            <TextField placeholder='max' />
                                            <Button></Button>
                                        </>
                                        : <></>
                                    }
                                </Box>

                                <Box width='100%' display='flex' justifyContent='flex-end'>
                                    <Fab color='secondary' aria-label="add" onClick={() => {
                                        let newOption = optionPrototype;
                                        newOption.parent = idx + 1;
                                        setOptionSet([...optionSet, newOption])
                                        setQuestionSet([...questionSet.slice(0, idx + 1), questionPrototype, ...questionSet.slice(idx + 1)]);
                                    }}>
                                        <AddIcon />
                                    </Fab>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <Box width='100%' display='flex' flexWrap='wrap' justifyContent='center'>
                    <Button variant="contained" onClick={handleCreate}>建立問卷</Button>
                </Box>
                <Modal
                    open={modalOpen}
                    onClose={() => { setModalOpen(false) }}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={{
                        width: 400, height: 150, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#266867'
                    }} display='flex' flexWrap='wrap' alignContent='center'>
                        <Box width='100%' display='flex' justifyContent='center' marginBottom='10px'>
                            <Typography variant='h5' width='80%' justifyContent='center' display='flex'>
                                已建立表單
                            </Typography>
                        </Box>
                        <Box width='100%' justifyContent='center' display='flex'>
                            <Button variant="contained" href={`/home/${ID}`}>回到主畫面</Button>
                        </Box>
                    </Box>
                </Modal>
            </ContentPaper>
        </PaperHolder>
    )
};

export default Create