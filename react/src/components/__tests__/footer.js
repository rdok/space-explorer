import React from 'react'

import { renderApollo, cleanup } from '../../test-utils'
import Footer from '../footer'

describe('Footer', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        renderApollo(<Footer />)
    })
})
