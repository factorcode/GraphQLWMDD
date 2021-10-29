import React from 'react'
import PersonCard from '../Layouts/PersonCard'
import { useQuery } from '@apollo/client'
import { GET_PEOPLE } from '../../graphQueries/queries'
import { List, Card } from 'antd'

const PeopleList = () => {

    const { loading, error, data } = useQuery(GET_PEOPLE)
    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    return (
        <List
        grid={{ gutter: 10, column: 1 }}
        dataSource={data.people}
        renderItem={( { id, firstName, lastName } ) => (
          <List.Item>
            <Card>
                <PersonCard key={id} id={id} firstName={firstName} lastName={lastName}/>
            </Card>
          </List.Item>
        )}
      />
    )
}
export default PeopleList