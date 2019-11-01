const resolvers = require('../resolvers')

describe('[Query.launches]', () => {
    const mockedContext = {
        dataSources: { 
            launchAPI: { getAllLaunches: jest.fn() }
        }
    }

    const { getAllLaunches } = mockedContext.dataSources.launchAPI

    it('queries launches', async() => {

        getAllLaunches.mockReturnValueOnce( [ { id: 999, cursor: 'foo' } ] )

        const response = await resolvers.Query.launches( null, {}, mockedContext )

        expect( response ).toEqual({
            cursor: 'foo',
            hasMore: false,
            launches: [ { id: 999, cursor: 'foo' } ]
        })
    })
})
