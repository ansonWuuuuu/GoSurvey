import { gql } from '@apollo/client';

const SIGN_UP_MUTATION = gql`
    mutation signUp($id: ID!, $name: String!, $password: String!) {
        signUp(id: $id, name: $name, password: $password) {
          id
          name
          passwordHash
          surveyCreated
          surveyAnswered
          favorite
        }
    }
`

const CREATE_SURVEY_MUTATION = gql`
    mutation createSurvey($surveyId: ID!, $title: String!, $author: ID!, $date: String!) {
        createSurvey(surveyId: $surveyId, title: $title, author: $author, date: $date) {
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
const CREATE_QUESTION_MUTATION = gql`
    mutation createSurveyQuestion(
        $surveyId: ID!,
        $questionType: String!,
        $questionText: String!,
        $options:[String]!,
        $multiBound: [Int]!,
        $necessity: Boolean!
    ) {
        createSurveyQuestion(
            surveyId: $surveyId,
            questionType: $questionType,
            questionText: $questionText,
            options: $options,
            multiBound: $multiBound,
            necessity: $necessity
        ) {
            questionType
            questionText
            options
            multiBound
            necessity
        }
    }
`


const CREATE_ANSWER_MUTATION = gql`
    mutation createAnswer($userId: ID!, $surveyId: ID!) {
        createAnswer(userId: $userId, surveyId: $surveyId) {
            userId
            surveyId
            answer {
                selection
                brief
            }
        }
    }
`

const SUBMIT_ANSWER_MUTATION = gql`
    mutation submitSurveyAnswer($userId: ID!, $surveyId: ID!, $selection: [Int]!, $brief: String) {
        submitSurveyAnswer(userId: $userId, surveyId: $surveyId, selection: $selection, brief: $brief) {
            selection
            brief
        }
    }
`

const UPDATE_SETTINGS_MUTATION = gql`
    mutation updateSettings($id: ID!, $name: String!, $newPassword: String!) {
        updateSettings(id: $id, name: $name, newPassword: $newPassword) {
            id
            name
            passwordHash
            surveyCreated
            surveyAnswered
            favorite
        }
    }
`

const ADD_FAVORITE_MUTATION = gql`
    mutation addFavorite($userId: ID!, $surveyId: ID!) {
        addFavorite(userId: $userId, surveyId: $surveyId) {
            id
            name
            passwordHash
            surveyCreated
            surveyAnswered
            favorite
        }
    }
`
const ADD_CREATED_MUTATION = gql`
    mutation addCreated($userId: ID!, $surveyId: ID!) {
        addCreated(userId: $userId, surveyId: $surveyId) {
            id
            name
            passwordHash
            surveyCreated
            surveyAnswered
            favorite
        }
    }
`
const ADD_ANSWERED_MUTATION = gql`
    mutation addAnswered($userId: ID!, $surveyId: ID!) {
        addAnswered(userId: $userId, surveyId: $surveyId) {
            id
            name
            passwordHash
            surveyCreated
            surveyAnswered
            favorite
        }
    }
`

export { 
    SIGN_UP_MUTATION, 
    CREATE_SURVEY_MUTATION, 
    CREATE_QUESTION_MUTATION, 
    CREATE_ANSWER_MUTATION,
    SUBMIT_ANSWER_MUTATION,
    UPDATE_SETTINGS_MUTATION,
    ADD_FAVORITE_MUTATION,
    ADD_CREATED_MUTATION,
    ADD_ANSWERED_MUTATION,
};
