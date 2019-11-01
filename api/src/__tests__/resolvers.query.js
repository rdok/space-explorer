const resolvers = require('../resolvers')

describe('[Query.launches]', () => {

    const mockedContext = {
        dataSources: { 
            launchAPI: { getAll: jest.fn() }
        }
    }

    const { getAll } = mockedContext.dataSources.launchAPI

    it('queries launches', async() => {

        getAll.mockReturnValueOnce( [ { id: 999, cursor: 'foo' } ] )

        const response = await resolvers.Query.launches( null, {}, mockedContext )

        expect( response ).toEqual({
            cursor: 'foo',
            hasMore: false,
            launches: [ { id: 999, cursor: 'foo' } ]
        })
    })

    it('respects pagination size', async() => {
        getAll.mockReturnValue([
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
        getAll.mockReturnValueOnce([
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
        getAll.mockReturnValue([
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

describe('[Query.launch]', () => {
    const mockedContext = {
        dataSources: {
            launchAPI: { getLaunchById: jest.fn() } 
        }
    }

    it('queries a launch by its id', async () => {
        const getLaunchById = mockedContext.dataSources.launchAPI.getLaunchById
        getLaunchById.mockReturnValueOnce({ id: 1975 })

        const response = await resolvers.Query.launch( null, { id: 1975 }, mockedContext )

        expect( response ).toEqual( { id: 1975 } )

        expect( getLaunchById ).toBeCalledWith( { launchId: 1975 } )
    })
})

describe('[Query.me]', () => {
    const mockedContext = { 
        dataSources: {
            userAPI: { findOrCreateUser: jest.fn() }
        },
        user: {}
    }

    it('may identify if no user was found in context', async() => {
        expect( await resolvers.Query.me(null, null, mockedContext ) ).toBeFalsy()
    })

    it('may return the user from userAPI', async() => {
        mockedContext.user.email = 'man@ship.space'

        mockedContext.dataSources.userAPI.findOrCreateUser
            .mockReturnValueOnce( { id: 1975 } )

        const response = await resolvers.Query.me(null, null, mockedContext )

        expect( response ).toEqual( { id: 1975 } )
    })
})
