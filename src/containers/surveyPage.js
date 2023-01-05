import SearchBar from '../components/searchBar'
import Survey from '../components/survey'
import { useSurvey } from './hooks/useSurvey';
import LoginPage from './loginPage';

function SurveyPage() {
    const {signedIn} = useSurvey()
    return (
        signedIn?
        <>
            <SearchBar />
            <Survey />
        </>:
        <LoginPage/>
    )
}

export default SurveyPage;