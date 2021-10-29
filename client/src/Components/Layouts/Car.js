import React, { useState } from "react";
import UpdateCar from "../Forms/UpdateCar";
import { GET_CARS, REMOVE_CAR } from "../../graphQueries/queries";
import { useMutation } from "@apollo/client";
import { filter } from "lodash";

const Car = (props) => {

    let { id, year, make, model, price, personId } = props

    const [editMode, setEditMode] = useState(false)
    const [ removeCar ] = useMutation( REMOVE_CAR )

    const handleEditMode = () => {
        setEditMode(!editMode)
    }

    const RemoveCar = () => {
        year = parseInt(year)
        price = parseFloat(price)

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
                if(cars){
                    proxy.writeQuery({
                        query: GET_CARS,
                        data: {
                            cars: filter(cars, car => { return car.id !== removeCar.id })
                        }
                    })
                }                
            }
        })

    }

    return (
        <div className="">
            {
                editMode ?
                    <UpdateCar
                        handleEditMode={handleEditMode}
                        data={props} />
                    :
                    <div>
                        <p>Make     - {props.make}</p>
                        <p>Model    - {props.model}</p>
                        <p>Year     - {props.year}</p>
                        <p>Price    - {props.price}</p>
                        <div>
                            <button onClick={handleEditMode}>Edit</button>
                            <button onClick={RemoveCar}>Remove</button>
                        </div>
                    </div>
            }

        </div>
    )
}
export default Car
