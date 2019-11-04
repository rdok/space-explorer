import React from 'react'
import { act } from "react-dom/test-utils"
import { render, unmountComponentAtNode } from "react-dom"
import { InMemoryCache } from 'apollo-cache-inmemory'

import { renderApollo, cleanup, waitForElement } from '../../test-utils'

import Launch, { GET_LAUNCH_DETAILS } from '../launch'

const launchStub = {
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

describe('Launch Page', () => {

    afterEach(cleanup)

    it('renders launch', async () => {
       const mocks = [ 
          {
             request: { query: GET_LAUNCH_DETAILS, variables: { launchId: 1 } },
             result: { data: { launch: launchStub } }
          } 
       ]

        const { getByText } = await renderApollo(
           <Launch launchId={1} />,
           { mocks, resolvers: {} }
        )

        await waitForElement( () => getByText( /test mission/i ) )
    })
})
