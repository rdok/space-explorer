const UserAPI = require('../user')

const store = {
    users: {
        findOrCreate: jest.fn(),
        findAll: jest.fn()
    },
    trips: {
        findOrCreate: jest.fn(),
        destroy: jest.fn(),
        findAll: jest.fn()
    }
}

module.exports.mockedStore = store

const userAPI = new UserAPI( { store: store } )

userAPI.initialize( 
    { context: { user: { id: 2012, email: 'armstrong@moon.space' } } }
)

describe('[UserAPI.findOrCreateUser]', () => {
    it('it handles failed user lookup', async () => {
        const response = await userAPI.findOrCreateUser( { email: '2077' } )

        expect( response ).toEqual( null )
    })

    it('finds or creates a user', async () => {
        store.users.findOrCreate.mockReturnValueOnce( [ { id: 2077 } ] )

        const response = await userAPI
            .findOrCreateUser( { email: 'armstrong@moon.space' } )

        expect( response ).toEqual( { id: 2077 } )

        expect( store.users.findOrCreate ).toBeCalledWith({
            where: { email: 'armstrong@moon.space' }
        })
    })

    it('handles failed user lookup/creation', async () => {
        const response = await userAPI.findOrCreateUser( { email: 'invalid' } )

        expect( response ).toEqual( null )
    })
})

describe('[UserAPI.bookTrip]', () => {
    it('may find or book a trip', async () => {
        store.trips.findOrCreate
            .mockReturnValueOnce( [ { get: () => 'Project Apollo' } ] )

        const response = await userAPI.bookTrip( { launchId: 1 } )

        expect( response ).toBeTruthy()

        expect( store.trips.findOrCreate ).toBeCalledWith({
            where: { launchId: 1, userId: 2012 }
        })
    })
})

describe('[UserAPI.bookTrips]', () => {
    it('may find or book many trips', async () => {
        store.trips.findOrCreate
            .mockReturnValueOnce( [ { get: () => 'Project Apollo' } ] )

        store.trips.findOrCreate
            .mockReturnValueOnce( [ { get: () => 'Vostok 1' } ] )

        const response = await userAPI
            .bookTrips( { launchIds: [ 1969, 1961 ] } )

        expect( response ).toEqual( [
            'Project Apollo',
            'Vostok 1'
        ] )
    })
})

describe('[UserAPI.cancelTrip]', () => {
    it('may cancel a trip', async () => {
        store.trips.destroy.mockReturnValueOnce('Project Apollo')

        const response = await userAPI
            .cancelTrip( { launchId: 1969 } )

        expect( response ).toEqual(true)

        expect( store.trips.destroy )
            .toBeCalledWith( { where: { userId: 2012, launchId: 1969 } } )
    })
})

describe('[UserAPI.getLauchIdsByUser]', () => {
    it('may find the launches of the current user', async () => {
        const args = { userId: 2012 }
        const launches = [
            { dataValues: { launchId: 1969 } },
            { dataValues: { launchId: 1961 } },
        ]
        store.trips.findAll.mockReturnValueOnce( launches )

        const response = await userAPI.getLaunchIdsByUser( args )

        expect( response ).toEqual( [ 1969, 1961 ] )
        expect( store.trips.findAll ).toBeCalledWith({ where: args })
    })

    it('handles response with no launches for the current user', async () => {
        const args = { userId: 2012 }

        const response = await userAPI.getLaunchIdsByUser( args )

        expect( response ).toEqual( [] )
    })
})
