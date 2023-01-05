import * as React from 'react';
import { InputBase, AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Paper, Card, CardHeader, CardMedia, CardContent, CardActions, Icon, CardActionArea, Snackbar } from '@mui/material'
import styledCom, { isStyledComponent } from 'styled-components';
import { styled, alpha } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import { red } from '@mui/material/colors';
import { padding } from '@mui/system';
import PropTypes from 'prop-types';
import { data, useSurvey } from "../containers/hooks/useSurvey"
import { POSTS_QUERY, USER_QUERY, SURVEY_QUERY } from "../graphql/queries"
import { useQuery } from '@apollo/client';
import ExcelJs from "exceljs";
import { useLocation, useNavigate } from 'react-router-dom';

const PaperHolder = styledCom.div`
    background: #1A4645;
    width: 100%;
    height: 88vh;
    display: flex;
    justify-content: center;
`;
const ContentPaper = styled(Paper)`
    background: #CEDBD8;
    width: 60%;
    height: auto;
    padding: 2em;
    overflow: auto;
`;

const Method = styledCom.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
`;

function Cards() {
    const { ID, filterType, answer_query, clickedId, setClickedId, survey_query, addFavorite_mut, setSearch} = useSurvey();
    setSearch('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false)
    const [fav, setFav] = React.useState([])
    const [curFilterType, setCurFilterType] = React.useState(() => {
        if (filterType === "首頁" || filterType === "") {
            return "所有調查"
        }
        return filterType
    })
    
    React.useEffect(() => {
        if (!posts_data || !user_data) { return }
        if (filterType === "首頁" || filterType === "") {
            setCurFilterType("所有調查")
            return
        }
        setCurFilterType(filterType)
    }, [filterType])

    const exportExcel = async (surveyId) => {
        // console.log(`download excel file`);
        // console.log(surveyId);

        let { data: curSurvey } = await survey_query({ variables: { surveyId: surveyId, } });
        curSurvey = curSurvey.querySurvey.question;

        let { data: allAnswers } = await answer_query({ variables: { surveyId: surveyId, } });
        allAnswers = allAnswers.queryAnswer;
        console.log(allAnswers);

        let A = [];
        let arr1 = [];
        let arr2 = [];
        let questionCnt = curSurvey.length;
        console.log(`length === ${questionCnt}`);

        for (let j = 0; j < questionCnt; j++) {
            arr1.push( { name: `question ${j+1}`} );
        }
        for (let i = 0; i < allAnswers.length; i++) {
            for (let j = 0; j < questionCnt; j++) {
                if (curSurvey[j].questionType === "brief") {
                    A.push(allAnswers[i].answer[j].brief);
                } else {
                    A.push(allAnswers[i].answer[j].selection);
                }
            }
            arr2.push(A);
        }

        const workbook = new ExcelJs.Workbook();
        const sheet = workbook.addWorksheet('answer');
    
        sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
            name: 'table名稱',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
            ref: 'A1', // 從A1開始
            columns: arr1,
            rows: arr2
        });
    
        workbook.xlsx.writeBuffer().then((content) => {
            const link = document.createElement("a");
            const blobData = new Blob([content], {
                type: "application/vnd.ms-excel;charset=utf-8;"
            });
            link.download = 'first-trial.xlsx';
            link.href = URL.createObjectURL(blobData);
            link.click();
        });
    }

    // console.log("reQuery")
    const { data, loading, error, subscribeToMore } = useQuery(POSTS_QUERY)
    const { data: userData, loading: userLoading, error: userError } = useQuery(USER_QUERY, {
        variables: { userId: ID }
    })
    let posts_data = data
    let user_data = userData
    React.useEffect(() => {
        if (!posts_data || !user_data) { return }
        let arr = []
        // console.log(user_data)
        for (let i = 0; i < posts_data.length; i++) {
            if (user_data.favorite.find(element => element === posts_data[i].surveyId))
                arr.push(true)
            else
                arr.push(false)
        }
        setFav(arr)
    }, [posts_data, user_data, filterType])
    const navigate = useNavigate()
    const location = useLocation()
    if (loading || userLoading) return <p>loading...</p>
    if (error || userError) return <p>error</p>

    posts_data = data.queryPosts
    user_data = userData.queryUser

    if (filterType === "查看您的表單") {
        posts_data = posts_data.filter((post) => user_data.surveyCreated.find(ele => ele === post.surveyId) !== undefined)
        // console.log(posts_data);
    }
    else if (filterType === "已按讚的表單") {
        posts_data = posts_data.filter((post) => user_data.favorite.find(ele => ele === post.surveyId) !== undefined)
        // console.log(posts_data);
    }

    return (
        <PaperHolder>
            <ContentPaper>
                <Method>{curFilterType}</Method>
                {posts_data.map((survey, index) => {
                    let color = index % 2 === 0 ? '#71CDC0' : '#b2dfdb'
                    return (
                        <Card key={index} sx={{ maxWidth: '100%', display: 'flex', m: 1, backgroundColor: color }}>
                            <CardActionArea onClick={() => {
                                setClickedId(survey.surveyId)
                                navigate(`/survey/${ID}/${survey.surveyId}`)
                            }}>
                                <Box sx={{ width: '80%', height: '100%', display: 'flex', flexWrap: 'wrap', flexGrow: 1, justifyContent: 'space-between' }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: '#a1887f' }} aria-label="person">
                                                {survey.author[0]}
                                            </Avatar>
                                        }
                                        title={survey.title}
                                        subheader={survey.date}
                                    />
                                    <CardActions disableSpacing>
                                        <Tooltip title={'Add to favorites'}>
                                            <IconButton
                                                aria-label="add to favorites"
                                                onMouseDown={event => event.stopPropagation()}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    console.log("Add Fav Button clicked");
                                                    const parent = index
                                                    const cur = fav.map((cur, index) => {
                                                        if (index === parent) {
                                                            return !cur
                                                        }
                                                        return cur
                                                    })
                                                    setFav(cur)
                                                    // ----------Mutation----------
                                                    addFavorite_mut({
                                                        variables:{userId: ID, surveyId: survey.surveyId}
                                                    })
                                                }}
                                                color={fav[index] ? 'error' : 'default'}>
                                                <FavoriteIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={'Share link'}>
                                            <IconButton
                                                aria-label="share"
                                                onMouseDown={event => event.stopPropagation()}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    console.log("Share Link Button clicked");
                                                    console.log(location)
                                                    let fullPath = window.location.toString()
                                                    navigator.clipboard.writeText(`${fullPath.slice(0, fullPath.length - location.pathname.length)}/survey/${ID}/${survey.surveyId}`)
                                                    setSnackbarOpen(true)
                                                }}>
                                                <ShareIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Snackbar
                                            open={snackbarOpen}
                                            onClose={() => setSnackbarOpen(false)}
                                            autoHideDuration={2000}
                                            message="Copied to clipboard"
                                        />

                                        {filterType === '查看您的表單' ?
                                            <Tooltip title={'Download Excel file'} >
                                                <IconButton
                                                    aria-label="download excel"
                                                    onMouseDown={event => event.stopPropagation()}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        // console.log("Download Excel Button clicked");
                                                        exportExcel(survey.surveyId);
                                                    }}>
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <></>
                                        }

                                    </CardActions>

                                    {/* <CardContent sx={{ width: '100%' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {su.description}
                                        </Typography>
                                    </CardContent> */}
                                </Box>
                                <Box sx={{ width: '20%', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="50"
                                        image="/static/images/cards/paella.jpg"
                                        alt="Paella dish"
                                    />
                                </Box>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </ContentPaper>
        </PaperHolder>
    )
}

export default Cards;