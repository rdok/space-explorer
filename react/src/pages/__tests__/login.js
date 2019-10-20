import React from 'react'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import {
    renderApollo, cleanup, fireEvent, waitForElement 
} from '../../test-utils'

import Login, { LOGIN_USER } from '../login'

describe('Login Page', () => {

    afterEach(cleanup)

    it('renders login page', () => {
        renderApollo(<Login />)
    })

    it('fires login mutation and updates cache after done', async() => {
        const cache = new InMemoryCache()
        const mocks = [ {
            request: { query: LOGIN_USER, variables: { email: 'username@domain.io' } },
            result: { data: { login: 'username' } }
        } ]

        const { getByText, getByTestId } = await renderApollo(
            <Login />, {mocks, cache}
        )

        fireEvent.change( getByTestId( 'login-input' ), {
            target: { value: 'username@domain.io' }
        })

        fireEvent.click( getByText( /log in/i ) )

        await waitForElement( () => getByText( /log in/i ) )

        const { isLoggedIn } = cache.readQuery({
            query: gql`
                query IsUserLoggedIn {
                    isLoggedIn @client
                }
            `
        })

        expect(isLoggedIn).toBeTruthy()
    })
})
