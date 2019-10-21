import React from 'react'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { 
    renderApollo, cleanup, getByTestId, fireEvent, waitForElement, render 
} from '../../test-utils'

import ActionButton, {
    GET_LAUNCH_DETAILS, CANCEL_TRIP, TOGGLE_CART
} from '../action-button'

import { GET_CART_ITEMS } from '../../pages/cart'

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

describe('action button', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        const { getByTestId } = renderApollo(<ActionButton />)
        expect(getByTestId('action-button')).toBeTruthy()
    })

    it('renders add to cart label by default', () => {
        const { getByText, container } = renderApollo(<ActionButton />)
        getByText(/add to cart/i)
    })

    it('renders remove from cart label', () => {
        const { getByText, container } = renderApollo(<ActionButton />)
        renderApollo(<ActionButton isInCart={true} />, { container })
        getByText(/remove from cart/i)
    })

    it('renders cancel trip label', () => {
        const { getByText, container } = renderApollo(<ActionButton />)
        renderApollo(<ActionButton isBooked={true} />, { container })
        getByText(/cancel this trip/i)
    })

    it('fires correct mutation with variables', async() => {
        const cache = new InMemoryCache()
        cache.writeQuery({
            query: GET_CART_ITEMS,
            data: { cartItems: [1] }
        })

        let mocks = [
            {
                request: { query: TOGGLE_CART, variables: { launchId: 1 } },
                result: { data: { addOrRemoveFromCart: true } }
            },
            {
                request: { query: GET_LAUNCH_DETAILS, variables: { launchId: 1 } },
                result: { data: { launch: mockLaunch } }
            }
        ]

        const { getByTestId, container, debug } = renderApollo(
            <ActionButton id={1} isBooked={false} />, {
                mocks, cache, resolvers: {}
            }
        )

        fireEvent.click(getByTestId('action-button'))
        await waitForElement(() => getByTestId('action-button'))
    })
})
