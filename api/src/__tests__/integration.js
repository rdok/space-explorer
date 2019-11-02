const { createTestClient } = require('apollo-server-testing')
const gql = require('graphql-tag')
const nock = require('nock')

const { constructTestServer } = require('./__utils')
const { rawLaunchResponse } = require('../datasources/__tests__/launch')
const { mockedStore } = require('../datasources/__tests__/user')

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
    mutation BookTrips( $launchIds: [ID]! ) {
       bookTrips( launchIds: $launchIds ) {
           success
           message
           launches { id isBooked }
       }
    }
`

describe('Queries', () => {
    it('fetches all launches', async() => {

       expect( true ).toEqual( true)

        const { server, launchAPI, userAPI } = constructTestServer({
           context: () => ( 
              { user: { id: 17, email: 'asterdam@apollo.moon' } } 
           )
        })

        launchAPI.get = jest.fn( () => [ rawLaunchResponse ] )

        userAPI.store = mockedStore
        userAPI.store.trips.findAll.mockReturnValueOnce([
            { dataValues: { launchId: 1 } }
        ])

        const { query } = createTestClient( server )
        const response = await query( { query: GET_LAUNCHES } )
        expect( response ).toMatchSnapshot();
    })

   it('fetches single launch', async () => {
      const { server, launchAPI, userAPI } = constructTestServer( {
         context: () => ( { user: { id: 17, email: 'asterdam@apollo.moon' } } )
      } )

      launchAPI.get = jest.fn( () => [ rawLaunchResponse ] )
      userAPI.store = mockedStore
      userAPI.store.trips.findAll.mockReturnValueOnce([
         { dataValues: { launchId: 1 } }
      ])

      const { query } = createTestClient( server )
      const response = await query( {
         query: GET_LAUNCH, variables: { id: 1 } 
      } )

      expect( response ).toMatchSnapshot()
   })
})

describe('Mutations', () => {
   it('returns login token', async () => { 
      const { server, launchAPI, userAPI } = constructTestServer({
         context: () => {}
      })

      userAPI.store = mockedStore
      userAPI.store.users.findOrCreate.mockReturnValueOnce([
         { id: 17, email: 'asterdam@apollo.moon' }
      ])

      const { mutate } = createTestClient( server )
      const response = await mutate({ 
         mutation: LOGIN,
         variables: { email: 'asterdam@apollo.moon' }
      })

      expect( response.data.login).toEqual('YXN0ZXJkYW1AYXBvbGxvLm1vb24=')
   })

   it('books trips', async () => {
      const { server, launchAPI, userAPI } = constructTestServer({
         context: () => ( { user: { id: 17, email: 'asterdam@apollo.moon' } } )
      })

      launchAPI.get = jest.fn()

      launchAPI.get
         .mockReturnValueOnce( [ rawLaunchResponse ] )
         .mockReturnValueOnce( [ { ...rawLaunchResponse, flight_number: 2 } ] )

      userAPI.store = mockedStore
      userAPI.store.trips.findOrCreate
         .mockReturnValueOnce( [ { get: () => ( { launchId: 1} ) } ] )
         .mockReturnValueOnce( [ { get: () => ( { launchId: 2} ) } ] )

      userAPI.store.trips.findAll.mockReturnValue( [ {} ] )

      const { mutate } = createTestClient( server )

      const response = await mutate({
         mutation: BOOK_TRIPS,
         variables: { launchIds: [ '1', '2' ] }
      })

      expect( response ).toMatchSnapshot()
   })
})
