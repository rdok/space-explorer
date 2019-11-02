const resolvers = require('../resolvers')

describe('[User.trips]', () => {
    const mockContext = {
        dataSources: {
            userAPI: { getLaunchIds: jest.fn() },
            launchAPI: { getByIds: jest.fn() },
        },
        user: { id: 1 }
    }

    const { getLaunchIds } = mockContext.dataSources.userAPI
    const { getByIds } = mockContext.dataSources.launchAPI

    it('uses user id from context to lookup trips', async() => {
        getLaunchIds.mockReturnValueOnce( [ 1975 ] )
        getByIds.mockReturnValueOnce( [ { id: 1975 } ] )

        const response = await resolvers.User.trips(null, null, mockContext)
        expect(response).toEqual( [ { id: 1975 } ] )
    })

    it('returns empty array if no response', async() => {
        getLaunchIds.mockReturnValueOnce([])
        getByIds.mockReturnValueOnce([])

        const response = await resolvers.User.trips(null, null, mockContext)

        expect( response ).toEqual( [ ] )
    })
})
