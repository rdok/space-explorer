import React from 'react'

import {
    renderApollo, cleanup, waitForElement,
} from '../../test-utils'

import CartItem, { GET_LAUNCH } from '../cart-item'

const mockLaunch = {
    __typename: 'Launch',
    id: 1,
    isBooked: true,
    rocket: { id: 1, name: 'tester', },
    mission: { name: 'test mission', missionPatch: '/', },
}

describe('cart item', () => {

    afterEach(cleanup)

    it('queries item and renders without error', () => {
        let mocks = [
            {
                request: { query: GET_LAUNCH, variables: { launchId: 1 } },
                result: { data: { launch: mockLaunch } },
            },
        ]

        const { getByText } = renderApollo(<CartItem launchId={1} />, {
            mocks,
            addTypename: false,
        })

        getByText(/loading/i)

        return waitForElement(() => getByText(/test mission/i))
    })

    it('renders with error state', () => {
        let mocks = [
            {
                request: { query: GET_LAUNCH, variables: { launchId: 1 } },
                error: new Error('aw shucks'),
            },
        ]

        const { getByText } = renderApollo(<CartItem launchId={1} />, {
            mocks, addTypename: false,
        })

        return waitForElement(() => getByText(/error: aw shucks/i))
    })
})
