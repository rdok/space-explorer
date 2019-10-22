const resolvers = require('../resolvers')

describe('[User.trips]', () => {
    const mockContext = {
        dataSources: {
            userAPI: { getLaunchIdsByUser: jest.fn() },
            launchAPI: { getLaunchesByIds: jest.fn() } 
        }
    }

    const { getLaunchIdsByUser } = mockContext.dataSources.userAPI
    const { getLaunchesByIds } = mockContext.dataSources.launchAPI

    it('gets the users trips', async() => {
        getLaunchIdsByUser.mockReturnValueOnce([ 999 ])
        getLaunchesByIds.mockReturnValueOnce([ { id: 999 } ])

        const trips = await resolvers.User.trips( null, null, mockContext )

        expect( getLaunchIdsByUser ).toBeCalled()
        expect( getLaunchesByIds ).toBeCalledWith( { launchIds: [ 999 ] } )
        expect( trips ).toEqual( [ { id: 999 } ] )
    })

    it('gets an emty array of trips if no launches were found', async () => {
        getLaunchIdsByUser.mockReturnValue([])
        getLaunchesByIds.mockReturnValue([])

        const trips = await resolvers.User.trips(null, null, mockContext)

        expect( trips ).toEqual([]) 
    })
})
