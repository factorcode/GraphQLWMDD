import { Card } from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CARS, GET_PEOPLE, REMOVE_CAR, REMOVE_PERSON } from "../../graphQueries/queries";
import UpdatePerson from "../Forms/UpdatePerson";
import CarsList from "../Lists/CarsList"
import { Link } from "react-router-dom";
import { filter } from "lodash";

const PersonCard = ({ id, firstName, lastName }) => {

    const [editMode, setEditMode] = useState(false)

    const [removePerson] = useMutation(REMOVE_PERSON)
    const [removeCar] = useMutation(REMOVE_CAR)
    const { allCars } = useQuery(GET_CARS)

    const handleEditMode = () => {
        setEditMode(!editMode)
    }

    const RemovePerson = () => {

        removePerson({
            variables: {
                id
            },
            optimisticResponse: {
                __typename: 'Mutation',
                removePerson: {
                    __typename: 'Person',
                    id,
                    firstName,
                    lastName
                }
            },
            update: (proxy, { data: { removePerson } }) => {
                const { people } = proxy.readQuery({ query: GET_PEOPLE })
                proxy.writeQuery({
                    query: GET_PEOPLE,
                    data: {
                        people: filter(people, person => { return person.id !== removePerson.id })
                    }
                })
            }
        });

        const deleteCar = (car) => {
            const { id, year, make, model, price, personId } = car
            removeCar({
                variables: {
                    id
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    removeCar: {
                        __typename: 'Car',
                        id,
                        year,
                        make,
                        model,
                        price,
                        personId
                    }
                },
                update: (proxy, { data: { removeCar } }) => {
                    const { cars } = proxy.readQuery({ query: GET_CARS })
                    proxy.writeQuery({
                        query: GET_CARS,
                        data: {
                            cars: filter(cars, car => { return car.id !== removeCar.id })
                        }
                    })
                }
            })

        }

        if (allCars) {
            const deleteCars = allCars.cars.filter((car) => { return car.personId === id })
            deleteCars.map(car => deleteCar(car))
        }
    }

    return (
        <div className="cardLayout">
            {
                editMode ? (
                    <UpdatePerson
                        handleEditMode={handleEditMode}
                        firstName={firstName}
                        lastName={lastName}
                        id={id}
                    />
                )
                    : (
                        <Card
                            actions={[
                                <button onClick={handleEditMode}>Edit</button>,
                                <button onClick={RemovePerson}>Remove</button>
                            ]}>
                            {firstName} {lastName}
                        </Card>
                    )
            }
            <CarsList key={id} personId={id}/>
            <div className="footer">
                <Link to={`/people/${id}`}> Learn more</Link>
            </div>
        </div>
    )
}
export default PersonCard


