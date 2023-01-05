import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, FormGroup, Checkbox, FormControlLabel, TextField, Radio, RadioGroup, typographyClasses, Modal } from '@mui/material'
import styledCom from 'styled-components';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { padding } from '@mui/system';
import PropTypes from 'prop-types';
import { data, useSurvey } from "../containers/hooks/useSurvey"
import { useQuery } from '@apollo/client';
import { SURVEY_QUERY } from '../graphql';

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

function Survey() {

    const { posts_data, ID, clickedId, createAnswer_mut, submitSurveyAnswer_mut, addAnswered_mut } = useSurvey();
    console.log(ID, clickedId)
    // --------------------------------useState--------------------------------

    // 判斷哪一題該填沒有填
    const [errMsg, setErrMsg] = React.useState('')

    // 送出以後跳出來的畫面
    const [modalOpen, setModalOpen] = React.useState(false)

    // 初始化應該回傳的答案，有n個題目就開n長度的陣列，每個問題有三種情況
    // 1. 單選題：答案儲存的方式會是那個選項的Label
    // 2. 多選題：假設有k個選項就開一個長度為k的陣列，每一個元素都是一個bool，true就是有被選取
    // 3. 簡答題：儲存string
    // **** 1.單選題和3.簡答題的初始化都是"noReply" ****
    const [answer, setAnswer] = React.useState([])

    const { data, loading, error } = useQuery(SURVEY_QUERY, {
        variables: { surveyId: clickedId }
    })

    let questions = data
    React.useEffect(() => {
        if (!questions) { return }
        let a = [];
        for (let i = 0; i < questions.question.length; i++) {
            if (questions.question[i].questionType === 'multi-select') {
                a.push([]);
                for (let j = 0; j < questions.question[i].options.length; j++) {
                    a[i].push(false);
                }
            }
            else { a.push('noReply') }
        }
        console.log(a)
        setAnswer(a)
    }, [data])

    console.log("clicked id: ", clickedId)
    if (loading) return <p>loading...</p>
    if (error) { console.log(error); return <p>error</p> }

    console.log(data)
    questions = data.querySurvey
    if (answer===[]) return <p>loading...</p>

    // --------------------------------FUNCTION--------------------------------

    // 單選題動作的時候要改答案
    const handleRadio = (event) => {
        console.log(event.target.name, ' ', event.target.value);
        const num = event.target.name.split('-')
        const parentIndex = num[0]
        const reply = num[1]
        let newAnswer = answer
        newAnswer[parentIndex] = event.target.value
        setAnswer(newAnswer)
        console.log(answer)
    }

    // checkBox動作的時候要去改答案
    const handleCheckbox = (event) => {
        const num = event.target.name.split('-')
        const parentIndex = num[0];
        const index = num[1];
        let newAnswer = answer;
        newAnswer[parentIndex][index] = event.target.checked
        setAnswer(newAnswer)
    }

    // 簡答題動作的時候要改答案
    const handleInput = (event) => {
        let newAnswer = answer;
        const parentIndex = event.target.name
        newAnswer[parentIndex] = event.target.value
        setAnswer(newAnswer)
    }

    const subAllAnswers = async () => {
        for (let i = 0; i < questions.question.length; i++) {
            if (questions.question[i].questionType === "brief") {
                console.log(`${i}: brief`)
                const newAnswer = await submitSurveyAnswer_mut({
                    variables: {
                        userId: ID,
                        surveyId: questions.surveyId,
                        brief: answer[i],
                        selection: [],
                    }
                })
                // console.log(newAnswer);
            } else {
                console.log(`${i}: select`)
                const newAnswer = await submitSurveyAnswer_mut({
                    variables: {
                        userId: ID,
                        surveyId: questions.surveyId,
                        brief: "",
                        selection: answer[i],
                    }
                })
                // console.log(newAnswer);
            }
        }
    }

    // 送出問卷的時候要判斷該填的有沒有填
    const handleFinish = async () => {
        console.log(answer)
        for (let i = 0; i < answer.length; i++) {
            if (questions.question[i].questionType === 'single-select' && questions.question[i].necessity === true && answer[i] === 'noReply') {
                console.log('singleWrong')
                setErrMsg('You must answer Question ' + (i + 1));
                return;
            }
            else if (questions.question[i].questionType === 'brief' && questions.question[i].necessity === true && (answer[i] === 'noReply' || answer[i] === '')) {
                console.log('answerWrong')
                setErrMsg('You must answer Question ' + (i + 1));
                return;
            }
            else if (questions.question[i].questionType === 'multi-select' && questions.question[i].multiBound !== []) {
                let trueCnt = 0;
                for (let j = 0; j < answer[i].length; j++) {
                    if (answer[i][j] === true) { trueCnt += 1; }
                }
                if (trueCnt < questions.question[i].multiBound[0] || trueCnt > questions.question[i].multiBound[1]) {
                    console.log('multipleWrong')
                    setErrMsg(`Question ${i + 1} should select ${questions[i].multiBound[0]}~${questions[i].multiBound[1]} answers`)
                    return;
                }
            }

            if (questions.question[i].questionType === 'multi-select') {
                let tmp = answer
                for (let j = 0; j < questions.question[i].options.length; j++) {
                    tmp[i][j] = +answer[i][j]
                }
                setAnswer(tmp)
            }
            else if (questions.question[i].questionType === 'single-select') {
                let tmp = answer
                let arr = []
                for (let j = 0; j < questions.question[i].options.length; j++) {
                    if (questions.question[i].options[j] === answer[i]) {
                        arr.push(1)
                    }
                    else { arr.push(0) }
                }
                tmp[i] = arr
                setAnswer(tmp)
            }
        }
        setModalOpen(true);
        console.log(answer);
        const newAnswerSet = await createAnswer_mut({
            variables: {
                userId: ID,
                surveyId: questions.surveyId,
            }
        });
        addAnswered_mut({
            variables:{
                userId: ID,
                surveyId: questions.surveyId
            }
        })
        if (!newAnswerSet) console.log("沒建立啦");
        subAllAnswers();
        return;
    }

    // --------------------------------Render各種題目--------------------------------
    const ChoiceOneAnswer = (input) => {
        const question = (input.question)
        const parentIndex = input.parentIndex
        return (
            <>
                <Box width='80%' paddingBottom='10px' paddingTop='5px'>
                    <Typography variant='body'>
                        {question.questionText}
                    </Typography>
                    <Typography variant='body2' color='red'>
                        {question.necessity === true ? '*必填' : ''}
                    </Typography>
                    <Divider width='100%' />
                </Box>
                <Box width='80%'>
                    <RadioGroup
                        name="radio-buttons-group"
                        defaultValue={!answer[parentIndex]? '': answer[parentIndex]}
                    >
                        {question.options.map((choice, index) => {
                            return (
                                <FormControlLabel control={<Radio />} value={choice} label={choice} name={parentIndex + '-' + index} key={index} onChange={handleRadio} />
                            )
                        })}
                    </RadioGroup>
                </Box>
            </>
        )
    }

    const ChoiceMultipleAnswer = (input) => {
        const question = (input.question)
        const parentIndex = input.parentIndex
        console.log(question, parentIndex)
        console.log(answer)
        return (
            <>
                <Box width='80%' paddingBottom='10px' paddingTop='5px'>
                    <Typography variant='body'>
                        {question.questionText}
                    </Typography>
                    <Typography variant='body2' color='red'>
                        {question.multiBound !== [] ? `*選取${!question.multiBound[0]? 0:question.multiBound[0]}~${!question.multiBound[1]? question.options.length:question.multiBound[1]}項` : ''}
                    </Typography>
                    <Divider width='100%' />
                </Box>
                <Box width='80%'>
                    <FormGroup>
                        {question.options.map((choice, index) => {
                            return (
                                <FormControlLabel control={<Checkbox defaultChecked = {!answer[parentIndex]? false: answer[parentIndex][index]}/>} label={choice} name={parentIndex + '-' + index} key={index} onChange={handleCheckbox} />
                            )
                        })}
                    </FormGroup>
                </Box>
            </>
        )
    }

    const ShortAnswer = (input) => {
        const question = input.question
        const parentIndex = input.parentIndex
        return (
            <>
                <Box width='80%' paddingBottom='10px' paddingTop='5px'>
                    <Typography variant='body'>
                        {question.questionText}
                    </Typography>
                    <Typography variant='body2' color='red'>
                        {question.necessity === true ? '*必填' : ''}
                    </Typography>
                    <Divider width='100%' />
                </Box>
                <Box width='80%'>
                    <TextField sx={{ width: '100%' }} defaultValue={answer[parentIndex] === 'noReply'||!answer[parentIndex] ? '' : answer[parentIndex]} multiline rows={5} placeholder='enter here' name={parentIndex.toString()} onChange={handleInput} />
                </Box>
            </>
        )
    }


    // --------------------------------RETURN--------------------------------
    return (
        <PaperHolder>
            <ContentPaper>
                {questions.question.map((question, index) => {
                    return (
                        <Box width='100%' display='flex' flexWrap='wrap' key={index} justifyContent='center' paddingBottom='10px'>
                            <Box width='80%'>
                                <Typography variant='h5' width='100%'>Question {index + 1}</Typography>
                            </Box>
                            {question.questionType === 'single-select' ? <ChoiceOneAnswer question={question} parentIndex={index} /> : question.questionType === 'multi-select' ? <ChoiceMultipleAnswer question={question} parentIndex={index} /> : <ShortAnswer question={question} parentIndex={index} />}
                        </Box>
                    )
                })}
                <Box width='100%' justifyContent='center' display='flex' flexWrap='wrap'>
                    <Button variant="contained" onClick={handleFinish}>填寫完畢！</Button>
                    <Typography width='100%' display='flex' justifyContent='center' color='red'>
                        {errMsg}
                    </Typography>
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
                                您已完成表單
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
}
export default Survey