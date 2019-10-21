import React from 'react'
import { InMemoryCache } from 'apollo-cache-inmemory'
import LogoutButton from '../logout-button'
import gql from 'graphql-tag'

import { renderApollo, cleanup, fireEvent } from '../../test-utils'

describe('logout button', () => {

    afterEach(cleanup)

    it('renders without errors', () => {
        renderApollo(<LogoutButton />)
    })

    it('completes a logout', () => {
        const cache = new InMemoryCache()
        cache.writeData({ data: { isLoggedIn: true } })
        localStorage.setItem('token', 'testTokenValue')
        const { getByTestId } = renderApollo(<LogoutButton />, { cache })

        fireEvent.click(getByTestId('logout-button'))

        const { isLoggedIn } = cache.readQuery({
            query: gql`
                query IsUserLoggedIn { 
                    isLoggedIn @client
                }
            `
        })

        expect(isLoggedIn).toBeFalsy()
        expect(localStorage.getItem('token')).toBeNull()
    })
})
