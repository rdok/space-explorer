const resolvers = require('../resolvers')

describe('[User.trips]', () => {
    const mockContext = {
        dataSources: {
            userAPI: { getLaunchIdsByUser: jest.fn() },
            launchAPI: { getLaunchesByIds: jest.fn() },
        },
        user: { id: 1 }
    }

    const { getLaunchIdsByUser } = mockContext.dataSources.userAPI
    const { getLaunchesByIds } = mockContext.dataSources.launchAPI

    it('uses user id from context to lookup trips', async() => {
        getLaunchIdsByUser.mockReturnValueOnce( [ 1975 ] )
        getLaunchesByIds.mockReturnValueOnce( [ { id: 1975 } ] )

        const response = await resolvers.User.trips(null, null, mockContext)
        expect(response).toEqual( [ { id: 1975 } ] )
    })

    it('returns empty array if no response', async() => {
        getLaunchIdsByUser.mockReturnValueOnce([])
        getLaunchesByIds.mockReturnValueOnce([])

        const response = await resolvers.User.trips(null, null, mockContext)

        expect( response ).toEqual( [ ] )
    })
})
