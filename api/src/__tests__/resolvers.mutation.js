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

    it('may identify if booking succeeded', async () => {
        bookTrips.mockReturnValueOnce( [ { launchId: 1972 } ] )

        getLaunchesByIds
            .mockReturnValueOnce( [ { id: 1972, cursor: 'apollo-csm-114' } ] )

        const bookedTrips = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 1972 ] }, mockedContext
        )

        expect( bookedTrips ).toEqual( { 
            launches: [ { cursor: 'apollo-csm-114', id: 1972 } ],
            message: 'trips booked successfully',
            success: true
        } )

        expect( bookTrips ).toBeCalledWith( { launchIds: [ 1972 ] } )
    })

    it('may identify if a trip booking failed', async () => {
        bookTrips.mockReturnValueOnce([])

        const bookedTrips = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 1972 ] }, mockedContext
        )

        expect(bookedTrips.message).toBeDefined()
        expect(bookedTrips.message).toEqual(
            `the following launches couldn't be booked: 1972`
        )
        expect(bookedTrips.success).toBeFalsy()
    })
})
