import React from 'react'

import { render, cleanup } from '../../test-utils.js'
import PageContainer from '../page-container'

describe('Page Container', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        render(<PageContainer />)
    })
})
