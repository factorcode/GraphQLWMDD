import React, { useState } from "react";
import { Form, Input, Button, Select } from 'antd'
import { useMutation, useQuery } from "@apollo/client";
import { GET_PEOPLE, UPDATE_CAR, } from "../../graphQueries/queries";


const UpdateCar = (props) => {


    const [form] = Form.useForm()
    const [updateCar] = useMutation(UPDATE_CAR)
    const { loading, error, data } = useQuery(GET_PEOPLE)
    const [updatePersonId, setUpdatePersonId] = useState()

    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`
    const { Option } = Select;


    const onFinish = values => {
        const { stringYear, make, model, stringPrice } = values
        const id = props.data.id
        let year = parseInt(stringYear)
        let price = parseFloat(stringPrice)
        const personId = updatePersonId

        updateCar({
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
                updateCar: {
                    __typename: 'Car',
                    id,
                    year,
                    make,
                    model,
                    price,
                    personId
                }
            }
        })
        props.handleEditMode()
    }
    const handleSelectChange = (id) => {
        setUpdatePersonId(id)
    }

    return (
        <Form
            form={form}
            name='update-car'
            size='large'
            onFinish={onFinish}
            initialValues={{
                Year:props.data.year,
                make:props.data.make,
                model:props.data.model,
                Price:props.data.price, 
                personId: props.data.personId
            }}
        >
            <Form.Item
                name='PersonId'
                >
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
                            !form.isFieldsTouched(true) ||
                            form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    > Update Car</Button>
                )}
            </Form.Item>
            <Button onClick={props.handleEditMode}> Cancel </Button>
        </Form>
    )
}
export default UpdateCar

