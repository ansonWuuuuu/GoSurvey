import SearchBar from '../components/searchBar'
import Profile from '../components/profile'
import LoginPage from './loginPage'
import { useSurvey } from './hooks/useSurvey'

const UserInfo = () => {
    const {signedIn} = useSurvey()
    return (
        signedIn?
        <>
            <SearchBar />
            <Profile/>
        </>:
        <LoginPage/>
    )
}
export default UserInfo