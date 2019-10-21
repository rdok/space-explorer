import React from 'react'

import {
    renderApollo, cleanup, getByTestId, fireEvent, waitForElement, render 
} from '../../test-utils'

import Cart, { GET_CART_ITEMS } from '../cart'

describe('Cart Page', () => {

    afterEach(cleanup)

    it('renders with message for empty carts', () => {
        let mocks = [ {
            request: { query: GET_CART_ITEMS},
            result: { data: { cartItems: [] } },
        } ]

        const { getByTestId } = renderApollo(<Cart />, { mocks } )

        return waitForElement( () => getByTestId('empty-message') )
    })

    it('renders cart', () => {
        let mocks = [
            {
                request: { query: GET_CART_ITEMS },
                result: { data: { cartItems: [1] } }
            }
        ]

        const { getByTestId } = renderApollo(<Cart />, { mocks })

        return waitForElement( () => getByTestId('book-button') )
    })
})
