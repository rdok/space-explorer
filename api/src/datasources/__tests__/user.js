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

const userAPI = new UserAPI( { store: store } )

userAPI.initialize( 
    { context: { user: { id: 1975, email: 'armstrong@moon.space' } } }
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
