const resolvers = require('../resolvers')

describe('[Query.launches]', () => {
    const mockedContext = {
        dataSources: {
            launchAPI: { getAllLaunches: jest.fn() }
        }
    }

    const { getAllLaunches } = mockedContext.dataSources.launchAPI

    it('gets launches, in reversed order', async() => {
        getAllLaunches.mockReturnValueOnce( [ { id: 999, cursor: 'foo' } ] )

        const launches = await resolvers.Query.launches( null, {}, mockedContext )

        expect( launches ).toEqual({
            cursor: 'foo',
            hasMore: false,
            launches: [ { id: 999, cursor: 'foo' } ]
        })
    })

    it('respects the page size', async() => {
        getAllLaunches.mockReturnValueOnce([
            { id: 2077, cursor: 'cyberpunk' },
            { id: 2019, cursor: 'now' },
        ])

        const launches = await resolvers.Query.launches(
            null,
            { pageSize: 1 },
            mockedContext
        )

        expect( launches ).toEqual({
            cursor: 'now',
            hasMore: true,
            launches: [ { id: 2019, cursor: 'now' } ]
        })
    })

    it('respects the launch cursor', async() => {
        getAllLaunches.mockReturnValueOnce([
            { id: 2019, cursor: 'now' },
            { id: 2077, cursor: 'cyberpunk' },
        ])

        const launches = await resolvers.Query.launches(
            null,
            { after: 'cyberpunk' },
            mockedContext
        )

        expect( launches ).toEqual({
            hasMore: false,
            cursor: 'now',
            launches: [ { id: 2019, cursor: 'now' } ]
        })
    })

    it('respects both mission page size and mission cursor', async() => {
        getAllLaunches.mockReturnValueOnce([
            { id: 2019, cursor: 'now' },
            { id: 2077, cursor: 'cyberpunk' },
            { id: 2020, cursor: 'tomorrow' },
        ])

        const launches = await resolvers.Query.launches(
            null,
            { after: 'tomorrow', pageSize: 1 },
            mockedContext
        )

        expect( launches ).toEqual({
            hasMore: true,
            cursor: 'cyberpunk',
            launches: [ { id: 2077, cursor: 'cyberpunk' } ]
        })
    })
})

describe('[Query.launch]', () => {
    const mockedContext = {
        dataSources: {
            launchAPI: { getLaunchById: jest.fn() }
        }
    }

    const getLaunchById = mockedContext.dataSources.launchAPI.getLaunchById

    it('it gets the launch by it\'s id', async() => {

        getLaunchById.mockReturnValueOnce({ id: 2077 })

        const launch = await resolvers
            .Query.launch(null, { id: 2077 }, mockedContext)

        expect( getLaunchById ).toBeCalledWith( { launchId: 2077 } )
        expect( launch ).toEqual( { id: 2077 } )
    })
})

describe('[Query.me]', () => {
    const mockedContext = {
        dataSources: {
            userAPI: { findOrCreateUser: jest.fn() }
        },
        user: {}
    }

    it('may identify if no user is in context', async() => {
        const user = await resolvers.Query.me(null, null, mockedContext)

        expect(user).toBeFalsy()
    })

    it('may return the current user from userAPI', async () => {
        mockedContext.user.email = '2077@cyberpunk.net'

        const findOrCreateUser = mockedContext
            .dataSources.userAPI.findOrCreateUser

        findOrCreateUser.mockReturnValueOnce( { id: 2077 } )

        const user = await resolvers.Query.me(null, null, mockedContext)

        expect( user ).toEqual( { id: 2077 } )
    })
})
