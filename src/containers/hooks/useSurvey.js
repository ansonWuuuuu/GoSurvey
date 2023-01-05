import { useState, useEffect, useContext, createContext } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
    SIGN_UP_MUTATION,
    CREATE_SURVEY_MUTATION,
    CREATE_QUESTION_MUTATION,
    CREATE_ANSWER_MUTATION,
    SUBMIT_ANSWER_MUTATION,
    UPDATE_SETTINGS_MUTATION,
    VERIFY_ID_QUERY,
    VERIFY_PASSWORD_QUERY,
    POSTS_QUERY,
    ANSWER_QUERY,
    SURVEY_QUERY,
    SURVEY_NAME_QUERY,
    ADD_ANSWERED_MUTATION,
    ADD_FAVORITE_MUTATION,
    ADD_CREATED_MUTATION,
} from "../../graphql";

const LOCALSTORAGE_KEY = "save-me";
const LOCALSTORAGE_CLICKED_ID = "survey-id";
const LOCALSTORAGE_LOGIN = "loginBool";
const LOCALSTORAGE_FILTERTYPE = "filterType";
const LOCALSTORAGE_SEARCH = "seachString";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
const savedLogin = localStorage.getItem(LOCALSTORAGE_LOGIN);
const savedClickedId = localStorage.getItem(LOCALSTORAGE_CLICKED_ID)
const savedFilterType = localStorage.getItem(LOCALSTORAGE_FILTERTYPE)
const savedSearch = localStorage.getItem(LOCALSTORAGE_SEARCH);

const SurveyContext = createContext({
    me: "",
    filterType: "",
    search: "",
    setSearch: ()=>{},
    signUp_mut: () => {}, 
    createSurvey_mut: () => {},
    createSurveyQuestion_mut: () => {},
    createAnswer_mut: () => {},
    submitSurveyAnswer_mut: () => {},
    updateSettings_mut: () => {},
    addFavorite_mut: () => {},
    addCreated_mut: () => {},
    addAnswered_mut: () => {},
    posts_query: () => {},
    verifyId_query: () => {},
    verifyPassword_query: () => {},
    answer_query: () => {},
    posts_data: {},
    createDateString: () => {},
    survey_query: () => {},
    surveyName_query: () => {},
});

const SurveyProvider = (props) => {
    const [me, setMe] = useState('')
    const [signedIn, setSignedIn] = useState(savedLogin)
    const [ID, setID] = useState(savedMe||'');
    const [filterType, setFilterType] = useState(savedFilterType||'')
    const [clickedId, setClickedId] = useState(savedClickedId||'')
    const [search, setSearch] = useState(savedSearch||'')
    const [signUp_mut] = useMutation(SIGN_UP_MUTATION);
    const [createSurvey_mut] = useMutation(CREATE_SURVEY_MUTATION);
    const [createSurveyQuestion_mut] = useMutation(CREATE_QUESTION_MUTATION);
    const [createAnswer_mut] = useMutation(CREATE_ANSWER_MUTATION);
    const [submitSurveyAnswer_mut] = useMutation(SUBMIT_ANSWER_MUTATION);
    const [updateSettings_mut] = useMutation(UPDATE_SETTINGS_MUTATION);
    const [addFavorite_mut] = useMutation(ADD_FAVORITE_MUTATION);
    const [addCreated_mut] = useMutation(ADD_CREATED_MUTATION);
    const [addAnswered_mut] = useMutation(ADD_ANSWERED_MUTATION);

    useEffect(() => {
        if (signedIn) {
            localStorage.setItem(LOCALSTORAGE_KEY, ID);
            localStorage.setItem(LOCALSTORAGE_LOGIN, true)
        }
        else{
            localStorage.setItem(LOCALSTORAGE_LOGIN, false)
        }
    }, [ID, signedIn]);

    useEffect(() => {
        localStorage.setItem(LOCALSTORAGE_CLICKED_ID, clickedId)
    }, [clickedId])

    useEffect(()=>{
        localStorage.setItem(LOCALSTORAGE_FILTERTYPE, filterType)
    }, [filterType])

    useEffect(()=>{
        localStorage.setItem(LOCALSTORAGE_SEARCH, search)
    }, [search])

    const [ posts_query, { loading: posts_loading, error: posts_error, data: posts_data }] = useLazyQuery(POSTS_QUERY);
    // if (!posts_loading) console.log(`posts_data:`);
    // if (!posts_loading) console.log(posts_data);
    // if (posts_error) console.log(`error: ${posts_error}`);

    // const { loading: posts_loading, error: posts_error, data: posts_data } = useQuery(POSTS_QUERY);
    // if (!posts_loading) console.log(`posts_data:`);
    // if (!posts_loading) console.log(posts_data);
    // if (posts_error) console.log(`error: ${posts_error}`);




    const [ verifyId_query, { loading: verifyId_loading, error: verifyId_error, data: verifyId_data }] = useLazyQuery(VERIFY_ID_QUERY);
    // if (!verifyId_loading) console.log(`verifyId_data:`);
    // if (!verifyId_loading) console.log(verifyId_data);
    // if (verifyId_error) console.log(verifyId_error);

    const [ verifyPassword_query, { loading: verifyPassword_loading, error: verifyPassword_error, data: verifyPassword_data }] = useLazyQuery(VERIFY_PASSWORD_QUERY);
    // if (!verifyPassword_loading) console.log(`verifyPassword_data: ${verifyPassword_data}`);
    // if (verifyPassword_error) console.log(`error: ${verifyPassword_error}`);
    
    const [ answer_query, { loading: answer_loading, error: answer_error, data: answer_data }] = useLazyQuery(ANSWER_QUERY);
    // if (!answer_loading) console.log(`answer_data: ${answer_data}`);
    // if (answer_error) console.log(`error: ${answer_error}`);
    
    const [ survey_query, { loading: survey_loading, error: survey_error, data: survey_data }] = useLazyQuery(SURVEY_QUERY);
    // if (!survey_loading) console.log(`survey_data: ${survey_data}`);
    // if (survey_error) console.log(`error: ${survey_error}`);
    
    const [ surveyName_query, { loading: surveyName_loading, error: surveyName_error, data: surveyName_data }] = useLazyQuery(SURVEY_NAME_QUERY);
    

    const createDateString = () => {
        let surveyTime = new Date()
        console.log("time :", surveyTime)
        let year = surveyTime.getFullYear().toString()
        let month = (surveyTime.getMonth() + 1).toString();
        if (month < 10) {
            month = "0" + month;
        }
        let day = (surveyTime.getDay() + 1).toString();
        if (day < 10) {
            day = "0" + day;
        }
        let hour = surveyTime.getHours().toString();
        if (hour < 10) {
            hour = "0" + hour;
        }
        let minutes = surveyTime.getMinutes().toString();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        console.log(year, month, day, hour, minutes);
        const surveyTimeString = year + "/" + month + "/" + day + "-" + hour + ":" + minutes
        console.log(surveyTimeString)
        return surveyTimeString
    }

    return (
        <SurveyContext.Provider
            value={{
                me,
                setMe,
                signedIn,
                setSignedIn,
                ID,
                setID,
                filterType,
                setFilterType,
                clickedId,
                setClickedId,
                search, 
                setSearch,
                signUp_mut,
                createSurvey_mut,
                createSurveyQuestion_mut,
                createAnswer_mut,
                submitSurveyAnswer_mut,
                updateSettings_mut,
                addFavorite_mut,
                addCreated_mut,
                addAnswered_mut,
                posts_query,
                verifyId_query,
                verifyPassword_query,
                answer_query,
                posts_data,
                createDateString,
                survey_query,
                surveyName_query,
            }}
            {...props}
        />
    )
}



const useSurvey = () => useContext(SurveyContext);

export { SurveyProvider, useSurvey };