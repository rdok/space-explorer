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

    it('respects pagination size', async() => {
        getAllLaunches.mockReturnValue([
            { id: 1975, cursor: 'Project Apollo' },
            { id: 2018, cursor: 'Falcon Heavy maiden flight' }
        ])

        const response = await resolvers.Query.launches(
            null, { pageSize: 1 }, mockedContext
        )

        expect( response ).toEqual({
            cursor: 'Falcon Heavy maiden flight',
            hasMore: true,
            launches: [ { id: 2018, cursor: 'Falcon Heavy maiden flight'} ]
        })
    })

    it('respects the cursor', async() => {
        getAllLaunches.mockReturnValueOnce([
            { id: 1975, cursor: 'Project Apollo' },
            { id: 2018, cursor: 'Falcon Heavy maiden flight' }
        ])

        const response = await resolvers.Query.launches(
            null,
            { after: 'Falcon Heavy maiden flight' }, 
            mockedContext
        )

        expect( response ).toEqual({
            hasMore: false,
            cursor: 'Project Apollo',
            launches: [ { id: 1975, cursor: 'Project Apollo' } ]
        })
    })

    it('respects both the cursor and page size', async() => {
        getAllLaunches.mockReturnValue([
            { id: 1975, cursor: 'Project Apollo' },
            { id: 2018, cursor: 'Falcon Heavy maiden flight' },
            { id: 2019, cursor: 'NASA cargo resupply to ISS' }
        ])

        const response = await resolvers.Query.launches(
            null,
            { after: 'NASA cargo resupply to ISS', pageSize: 1 },
            mockedContext
        )

        expect( response ).toEqual({
            cursor: 'Falcon Heavy maiden flight',
            hasMore: true,
            launches: [ { id: 2018, cursor: 'Falcon Heavy maiden flight'} ]
        })
    })
})
