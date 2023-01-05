import Create from '../components/create'
import SearchBar from '../components/searchBar'
import { useSurvey } from './hooks/useSurvey'
import LoginPage from './loginPage'

function CreatePage(input) {
    const {signedIn} = useSurvey()
    return (
        signedIn?
        <>
            <SearchBar />
            <Create type={input.type}/>
        </>:
        <LoginPage/>
    )
}
export default CreatePage