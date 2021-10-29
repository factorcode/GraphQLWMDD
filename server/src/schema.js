import { gql } from 'apollo-server-express'
import { filter, find, remove } from 'lodash'


const people = [
    {
        id: '1',
        firstName: 'Bill',
        lastName: 'Gates'
    },
    {
        id: '2',
        firstName: 'Steve',
        lastName: 'Jobs'
    },
    {
        id: '3',
        firstName: 'Linux',
        lastName: 'Torvalds'
    }
]

const cars = [
    {
        id: '1',
        year: '2019',
        make: 'Toyota',
        model: 'Corolla',
        price: '40000',
        personId: '1'
    },
    {
        id: '2',
        year: '2018',
        make: 'Lexus',
        model: 'LX 600',
        price: '13000',
        personId: '1'
    },
    {
        id: '3',
        year: '2017',
        make: 'Honda',
        model: 'Civic',
        price: '20000',
        personId: '1'
    },
    {
        id: '4',
        year: '2019',
        make: 'Acura ',
        model: 'MDX',
        price: '60000',
        personId: '2'
    },
    {
        id: '5',
        year: '2018',
        make: 'Ford',
        model: 'Focus',
        price: '35000',
        personId: '2'
    },
    {
        id: '6',
        year: '2017',
        make: 'Honda',
        model: 'Pilot',
        price: '45000',
        personId: '2'
    },
    {
        id: '7',
        year: '2019',
        make: 'Volkswagen',
        model: 'Golf',
        price: '40000',
        personId: '3'
    },
    {
        id: '8',
        year: '2018',
        make: 'Kia',
        model: 'Sorento',
        price: '45000',
        personId: '3'
    },
    {
        id: '9',
        year: '2017',
        make: 'Volvo',
        model: 'XC40',
        price: '55000',
        personId: '3'
    }
]

const typeDefs = gql`

  type Person {
    id: String!
    firstName: String
    lastName: String
  }
  
  type Car {
    id: String!
    year: Int
    make: String
    model: String
    price: Float
    personId: String
  }

  type PersonCars{
    person: Person
    car: [Car]
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: String!): Person
    car(id: String!): Car
    personCars(id: String!): PersonCars
  }

  type Mutation {
    addPerson( id:String!, firstName: String!, lastName: String! ):Person
    addCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    updatePerson( id:String!, firstName: String!, lastName: String! ): Person
    updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    removePerson( id:String! ):Person
    removeCar(id: String! ): Car    
  }  
`

const resolvers = {
    Query: {
        people: () => people,
        cars: () => cars,
        person(parent, args, context, info) { return find(people, { id: args.id }) },
        car(parent, args, context, info) { return find(cars, { id: args.id }) },
        personCars(parent, args, context, info) {
            const person = find(people, { id: args.id })
            const car = filter(cars, { personId: args.id })
            return { person, car }
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            const newPerson = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName
            }
            people.push(newPerson)
            return newPerson
        },
        addCar: (root, args) => {
            const newCar = {
                id: args.id,
                year: args.year,
                make: args.make,
                model: args.model,
                price: args.price,
                personId: args.personId
            }
            cars.push(newCar)
            return newCar
        },
        updatePerson: (root, args) => {
            const person = find(people, { id: args.id })
            if (!person) {
                throw new Error(`Person with ID=${args.id} not found!`)
            }
            person.firstName = args.firstName
            person.lastName = args.lastName
            return person
        },
        updateCar: (root, args) => {
            const car = find(cars, { id: args.id })
            if (!car) {
                throw new Error(`Car with ID=${args.id} not found!`)
            }
            car.id = args.id
            car.year = args.year
            car.make = args.make
            car.model = args.model
            car.price = args.price
            car.personId = args.personId
            return car
        },
        removePerson: (root, args) => {
            const removedPerson = find(people, { id: args.id })
            if (!removedPerson) {
                throw new Error(`Couldn't find a Person with the ID=${args.id}`)
            }
            remove(people, person => { return person.id === removedPerson.id })
            return removedPerson
        },
        removeCar: (roots, args) => {
            const removedCar = find(cars, { id: args.id })
            if (!removedCar) {
                throw new Error(`Couldn't find a Car with the ID=${args.id}`)
            }
            remove(cars, car => { return car.id === removedCar.id })
            return removedCar
        }
    }
}

export { typeDefs, resolvers }