import React from 'react'

import { render, cleanup } from '../../test-utils'
import Loading from '../loading'

describe('Loading', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        render(<Loading />)
    })
})
