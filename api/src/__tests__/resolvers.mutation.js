const resolvers = require('../resolvers')

const mockedContext = {
    dataSources:  {
        userAPI: {
            bookTrips: jest.fn(),
            cancelTrip: jest.fn(),
            findOrCreateUser: jest.fn()
        },
        launchAPI: {
            getLaunchesByIds: jest.fn(),
            getLaunchById: jest.fn()
        }
    },
    user: { id: 1972, email: 'apollo17@moon.space' }
}

describe('[Mutation.bookTrips]', () => {
    const { bookTrips } = mockedContext.dataSources.userAPI
    const { getLaunchesByIds } = mockedContext.dataSources.launchAPI

    it('may handle successfully trip booking', async () => {
        bookTrips.mockReturnValueOnce( [ { launchId: 1972 } ] )

        getLaunchesByIds
            .mockReturnValueOnce( [ { id: 1972, cursor: 'apollo-csm-114' } ] )

        const response = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 1972 ] }, mockedContext
        )

        expect( response ).toEqual( { 
            launches: [ { cursor: 'apollo-csm-114', id: 1972 } ],
            message: 'trips booked successfully',
            success: true
        } )

        expect( bookTrips ).toBeCalledWith( { launchIds: [ 1972 ] } )
    })

    it('may handle faled trip booking', async () => {
        bookTrips.mockReturnValueOnce([])

        const response = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 1972 ] }, mockedContext
        )

        expect(response.message).toBeDefined()
        expect(response.message).toEqual(
            `the following launches couldn't be booked: 1972`
        )
        expect(response.success).toBeFalsy()
    })
})

describe('[Mutation.cancelTrip', () => {
    const { cancelTrip } = mockedContext.dataSources.userAPI
    const { getLaunchById } = mockedContext.dataSources.launchAPI

    it('may handle successfull trip cancelation', async() => {
        cancelTrip.mockReturnValueOnce(true)
        getLaunchById
            .mockReturnValueOnce( { id: 1968, cursor: 'apollo-8' } )

        const response = await resolvers.Mutation.cancelTrip(
            null, { launchId: 1972 }, mockedContext
        )

        expect( response ).toEqual({
            success: true,
            message: 'trip canceled',
            launches: [ { id: 1968, cursor: 'apollo-8' } ]
        })

        expect( cancelTrip ).toBeCalledWith( { launchId: 1972 } )
    })

    it('may handle failed trip cancelation', async() => {
        cancelTrip.mockReturnValueOnce(false)

        const response = await resolvers.Mutation.cancelTrip(
            null, { launchId: 1972 }, mockedContext
        )

        expect( response.message ).toEqual('failed to cancel trip')
        expect( response.success ).toBeFalsy()
    })
})
