const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag')
// const nock = require('nock')

// const { constructTestServer } = require('./__utils')
// const { mockedLaunchResponse } = require('../datasources/__tests__/launch')
// const { mockedStore } = require('../datasources/__tests__/user')

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches(after: $after) {
            cursor
            hasMore
            launches {
                id
                isBooked
                rocket { name }
                mission { name missionPatch }
            }
        }
    }
`

const GET_LAUNCH = gql`
    query launch($id: ID) {
        launch(id: $id) {
            id
            isBooked
            rocket { type } 
            mission { name }
        }
    }
`

const LOGIN = gql`
    mutation login($email: String!) {
        login(email: $email)
    }
`

const BOOK_TRIPS = gql`
    mutation BookTrips($launchIds: [ID]!) {
        success
        message
        launches { id isBooked }
    }
`

describe('Queries', () => {
    it('fetches list of launches', async() => {
        /**
        const { server, launchAPI, userAPI } = constructTestServer({
            context: () => ( { user: { id: 1, email: 'man@apollo.moon' } }
        })

        launchAPI.get = jest.fn( () => [ mockedLaunchResponse ] )
        userAPI.store = mockedStore
        userAPI.store.trips.findAll.mockReturnValueOnce([
            { dataValues: { launchId: 1 } }
        ])
        */
    })
})
