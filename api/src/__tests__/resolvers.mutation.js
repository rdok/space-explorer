const resolvers = require('../resolvers')

const context = { 
    dataSources: { 
        userAPI: { 
            bookTrips: jest.fn(),
            cancelTrip: jest.fn(),
        },
        launchAPI: { 
            getLaunchesByIds: jest.fn(),
            getLaunchById: jest.fn() ,
        }
    } 
}
const { bookTrips } = context.dataSources.userAPI
const { getLaunchesByIds } = context.dataSources.launchAPI
const { cancelTrip } = context.dataSources.userAPI
const { getLaunchById } = context.dataSources.launchAPI


describe('[Mutation.bookTrips]', () => { 

    it('successfully books a trip', async () => {

        bookTrips.mockReturnValueOnce( [ { launchId: 1975 } ] )

        getLaunchesByIds
            .mockReturnValueOnce( [ { id: 1975, cursor: 'Project Apollo' } ] )

        const response = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 1973 ] }, context
        )

        expect( response ).toEqual({
            launches: [ { cursor: 'Project Apollo', id: 1975 } ],
            message: 'trips booked successfully',
            success: true
        })
    })

    it('may handle a failed booking trip', async () => {

        bookTrips.mockReturnValueOnce( [] )

        const response = await resolvers.Mutation.bookTrips(
            null, { launchIds: [ 2077 ] }, context
        )

        expect( response.message )
            .toEqual("the following launches couldn't be booked: 2077")
        expect( response.success ).toBeFalsy()
    })
})

describe('[Mutation.cancelTrip]', () => {

    it('may cancel a booking', async () => {
        cancelTrip.mockReturnValueOnce( true )
        getLaunchById
            .mockReturnValueOnce( { id: 2077, cursor: 'Cyberpunk' } )

        const response = await resolvers.Mutation.cancelTrip(
            null, { launchId: 2049 }, context
        )

        expect( response ).toEqual({
            success: true,
            message: 'trip canceled',
            launches: [ { id: 2077, cursor: 'Cyberpunk' } ]
        })

        expect( cancelTrip ).toBeCalledWith( { launchId: 2049 } )
    })

    it('may handle a failed booking cancelation', async () => {
        cancelTrip.mockReturnValueOnce(false)

        const response = await resolvers.Mutation.cancelTrip(
            null, { launchId: 2049 }, context 
        )

        expect( response.message ).toEqual('failed to cancel trip')
        expect( response.success ).toBeFalsy()
    })
})
