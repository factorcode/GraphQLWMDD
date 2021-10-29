import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { GET_PEOPLE_CARS } from "../graphQueries/queries";

const PersonDetail = () => {
    const { id } = useParams("id");
    const personId = String(id)
    console.log("personId", personId);
    const { loading, error, data } = useQuery(GET_PEOPLE_CARS, {
        variables: { personId },
    });
    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    console.log(data);
    const { person, car } = data.personCars


    return (

        <div className="Details">

            {person && car ?
                <>
                    <h1>Person Details</h1>

                    <h2>Name : {person.firstName} {person.lastName}</h2>
                    <div className="cars_section">
                        {
                            car.map((item) => (
                                <div className="carContainer" key={item.id}>
                                    <div className="display">
                                        <p>Make:    {item.make} </p>
                                        <p>Model:   {item.model}</p>
                                        <p>Year:    {item.year}</p>
                                        <p>Price:   {item.price} </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </> : "Loading..."}





            <div className="buttons">
                <Link to='/'>Back to Homepage</Link>
            </div>
        </div>

    )
}

export default PersonDetail