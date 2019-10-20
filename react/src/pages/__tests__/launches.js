import React from 'react'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'
import Launches, { GET_LAUNCHES } from '../launches'

const mockLaunch = {
    __typename: 'Launch',
    id: 1,
    isBooked: true,
    rocket: {
        __typename: 'Rocket',
        id: 1,
        name: 'tester',
        type: 'test'
    },
    mission: {
        __typename: 'Mission',
        id: 1,
        name: 'test mission',
        missionPatch: '/'
    },
    site: 'earth',
    isInCart: false
}

describe('Launches Page', () => {

    afterEach(cleanup)

    it('renders launches', async () => {
        const cache = new InMemoryCache({ addTypename: false })
        const mocks = [
            {
                request: { query: GET_LAUNCHES },
                result: {
                    data: {
                        launches: {
                            cursor: '123',
                            hasMore: true,
                            launches: [mockLaunch]
                        }
                    }
                }
            }
        ]

        const { getByText } = await renderApollo(<Launches />, { mocks, cache })

        await waitForElement( () => getByText(/test mission/i ) )
    })
})
