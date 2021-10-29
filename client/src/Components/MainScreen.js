import InputForms from "./Forms/InputForms";
import PeopleList from './Lists/PeopleList'


const MainScreen = () => {

    return (
        <div className="main">
            <div className="main-title">
                <h1>GraphQL - List Car Owners</h1>
            </div>
            <div className="main-section">
                <InputForms/>
                <PeopleList/>
            </div>
        </div>
    )
}

export default MainScreen;