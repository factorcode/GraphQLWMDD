import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Select } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { GET_PEOPLE, ADD_PERSON, ADD_CAR, GET_CARS } from "../../graphQueries/queries";




const InputForms = () => {

    // Name Form Variables
    const [personId, setPersonId] = useState(uuidv4)
    const [personForm] = Form.useForm()
    const [addPerson] = useMutation(ADD_PERSON)
    const [personExists, setPersonExists] = useState(false);

    const { loading, error, data } = useQuery(GET_PEOPLE);

    const onPersonFinish = values => {
        const { firstName, lastName } = values

        let id = personId
        addPerson({
            variables: {
                id,
                firstName,
                lastName
            },
            optimisticResponse: {
                __typename: 'Mutation',
                addPerson: {
                    __typename: 'Person',
                    id,
                    firstName,
                    lastName
                }
            },
            update: (proxy, { data: { addPerson } }) => {
                const data = proxy.readQuery({ query: GET_PEOPLE })
                proxy.writeQuery({
                    query: GET_PEOPLE,
                    data: {
                        ...data,
                        people: [...data.people, addPerson]

                    }
                })
            }
        })
    }

    // Car Form Variables

    const { Option } = Select;
    const [carId] = useState(uuidv4)
    const [carForm] = Form.useForm()

    const [addCar] = useMutation(ADD_CAR)

    const handleSelectChange = (personId) => {
        setPersonId(personId)
    }

    const onCarsFinish = values => {
        const { Year, make, model, Price } = values
        const year = parseInt(Year)
        const price = parseFloat(Price)

        let id = carId;
        addCar({
            variables: {
                id,
                year,
                make,
                model,
                price,
                personId
            },
            optimisticResponse: {
                __typename: 'Mutation',
                addCar: {
                    __typename: 'Car',
                    id,
                    year,
                    make,
                    model,
                    price,
                    personId
                }
            },
            update: (proxy, { data: { addCar } }) => {
                const data = proxy.readQuery({ query: GET_CARS })
                if (data) {
                    proxy.writeQuery({
                        query: GET_CARS,
                        data: {
                            ...data,
                            cars: [...data.cars, addCar]
                        }
                    })
                }

            }
        })
    }



    useEffect(() => {
        if (data && data.people && data.people.length > 0) {
            setPersonExists(true);
        }
    }, [data])


    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`
    return (
        <div className="input-form">
            <div className="person-form">

                {/* PERSON FORM STARTS */}

                <Form
                    form={personForm}
                    name='add-person'
                    layout='inline'
                    size='large'
                    onFinish={onPersonFinish}
                >
                    <Form.Item
                        name='firstName'
                        rules={[{ required: true, message: 'First name is a required field! ' }]} >
                        <Input placeholder='i.e. John' />
                    </Form.Item>
                    <Form.Item
                        name='lastName'
                        rules={[{ required: true, message: 'Last name is a required field! ' }]} >
                        <Input placeholder='i.e. Doe' />
                    </Form.Item>
                    <Form.Item shouldUpdate={true}>
                        {() => (
                            <Button
                                type='primary'
                                htmlType='submit'
                                disabled={
                                    (!personForm.isFieldTouched('firstName') && !personForm.isFieldTouched('lastName')) ||
                                    personForm.getFieldsError().filter(({ errors }) => errors.length).length
                                }
                            > Add Person</Button>
                        )}
                    </Form.Item>
                </Form>

                {/* PERSON FORM END */}


            </div>
            {personExists ?
                <div className="cars-form">
                    {/* CAR FORMS START */}
                    <Form
                        form={carForm}
                        name='add-car'
                        size='large'
                        onFinish={onCarsFinish}
                    >
                        <Form.Item
                            name='PersonId'
                            rules={[{ required: true, message: 'Please select the person from list!' }]} >
                            <Select
                                style={{ width: 200 }}
                                onChange={handleSelectChange}
                                placeholder="Select Name"
                            >
                                {
                                    data.people.map(({ id, firstName, lastName }) => (
                                        <Option key={id} value={`${id}`}>{firstName} {lastName}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='Year'
                            rules={[{ required: true, message: 'Year is a required field!' }]} >
                            <Input type='number' min='1800' max='2021' placeholder='Year (2000)' />
                        </Form.Item>
                        <Form.Item
                            name='make'
                            rules={[{ required: true, message: 'Make is a required field!' }]} >
                            <Input placeholder='Make (BMW)' />
                        </Form.Item>
                        <Form.Item
                            name='model'
                            rules={[{ required: true, message: 'Model is a required field!' }]} >
                            <Input placeholder='Model (M4)' />
                        </Form.Item>
                        <Form.Item
                            name='Price'
                            rules={[{ required: true, message: 'Price is a required field!!' }]} >
                            <Input type='number' min='0' placeholder='Price (50,000)' />
                        </Form.Item>

                        <Form.Item shouldUpdate={true}>
                            {() => (
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    disabled={
                                        !carForm.isFieldsTouched(true) ||
                                        carForm.getFieldsError().filter(({ errors }) => errors.length).length
                                    }
                                > Add Car</Button>
                            )}
                        </Form.Item>
                    </Form>

                    {/* CAR FORMS END */}
                </div>
                :
                "No person added. Add person to associate cars."
            }

        </div>
    )
}
export default InputForms