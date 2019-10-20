import React from 'react'

import { 
    renderApollo, cleanup, fireEvent, waitForElement 
} from '../../test-utils'

import BookTrips, { BOOK_TRIPS, GET_LAUNCH } from '../book-trips'

const mockLaunch = {
    __typename: 'Launch',
    id: 1,
    isBooked: true,
    rocket: { id: 1, name: 'tester', },
    mission: { name: 'test mission', missionPatch: '/' }
}

describe('book trips', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        const { getByTestId } = renderApollo(<BookTrips cartItems={[]} />)
        expect(getByTestId('book-button')).toBeTruthy()
    })

    it('completes mutation and shows message', () => {
        let mocks = [
            {
                request: { query: BOOK_TRIPS, variables: { launchIds: [1] } },
                result: {
                    data: {
                        bookTrips: [{ success: true, message: 'success!', launches: [] }],
                    },
                },
            },
            {
                request: { query: GET_LAUNCH, variables: { launchId: 1 } },
                result: { data: { launch: mockLaunch } },
            },
        ]

        const { getByTestId } = renderApollo(
            <BookTrips cartItems={[1]} />,
            { mocks, addTypename: false },
        )

        fireEvent.click(getByTestId('book-button'))

        waitForElement(() => getByTestId('message'))
    })
})
