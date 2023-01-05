import { gql } from '@apollo/client';

const VERIFY_ID_QUERY = gql`
    query verifyId($userId: ID!) {
        verifyId(userId: $userId)
    }
`
const VERIFY_PASSWORD_QUERY = gql`
    query verifyPassword($userId: ID!, $password: String!) {
        verifyPassword(userId: $userId, password: $password) 
    }
`

const POSTS_QUERY = gql`
    query queryPosts {
        queryPosts {
            surveyId
            title
            author
            date
            question {
                questionType
                questionText
                options
                multiBound
                necessity
            }
        }
    }
`

const ANSWER_QUERY = gql`
    query queryAnswer($surveyId: ID!) {
        queryAnswer(surveyId: $surveyId) {
            userId
            surveyId
            answer {
                selection
                brief
            }
        }
    }
`

const USER_QUERY = gql`
    query queryUser($userId: ID!) {
        queryUser(userId: $userId) {
            id
            name
            surveyCreated
            surveyAnswered
            favorite
        }
    }
`

const SURVEY_QUERY = gql`
    query querySurvey($surveyId: ID!) {
        querySurvey(surveyId: $surveyId) {
            surveyId
            title
            author
            date
            question {
                questionType
                questionText
                options
                multiBound
                necessity
            }
        }
    }
`

const SURVEY_NAME_QUERY = gql`
    query querySurveyName($surveyName: String!) {
        querySurveyName(surveyName: $surveyName) {
            surveyId
            title
            author
            date
            question {
                questionType
                questionText
                options
                multiBound
                necessity
            }
        }
    }
`

export {
    VERIFY_ID_QUERY,
    VERIFY_PASSWORD_QUERY,
    POSTS_QUERY,
    ANSWER_QUERY,
    USER_QUERY,
    SURVEY_QUERY,
    SURVEY_NAME_QUERY
};
