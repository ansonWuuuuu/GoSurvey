import SearchBar from '../components/searchBar'
import Cards from '../components/cards'
import LoginPage from './loginPage'
import { useSurvey } from './hooks/useSurvey'

const CardsPage = () => {
    const {signedIn} = useSurvey()
    console.log(signedIn)
    return (
        signedIn?
            <>
                <SearchBar />
                <Cards />
            </>:
            <LoginPage/>
    )
}
export default CardsPage