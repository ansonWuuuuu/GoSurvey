import SearchBar from '../components/searchBar'
import CardsSearch from '../components/cardsSearch'
import LoginPage from './loginPage'
import { useSurvey } from './hooks/useSurvey'

const SearchPage = () => {
    const {signedIn} = useSurvey()
    console.log(signedIn)
    return (
        signedIn?
            <>
                <SearchBar />
                <CardsSearch />
            </>:
            <LoginPage/>
    )
}
export default SearchPage