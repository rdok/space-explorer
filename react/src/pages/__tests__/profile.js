import React from 'react'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'

import Profile, { GET_MY_TRIPS } from '../profile'

const mockLaunch = {
    __typename: 'Launch',
    id: 1,
    isBooked: true,
    rocket: {
        __typename: 'Rocket',
        id: 1,
        name: 'test rocket'
    },
    mission: {
        __typename: 'Mission',
        id: 1,
        name: 'test mission',
        missionPatch: '/'
    }
}

const mockUser = {
    __typename: 'User',
    id: 1,
    email: 'username@domain.io',
    trips: [mockLaunch]
}

describe('Profile Page', () => {

    afterEach(cleanup)

    it('renders profile page', async() => {
        const mocks = [{
            request: { query: GET_MY_TRIPS },
            result: { data: { me: mockUser } }
        }]

        const { getByText } = renderApollo( <Profile />, { mocks } )

        await waitForElement( () => getByText( /test mission/i ) )
    })
})
