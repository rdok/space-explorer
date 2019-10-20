import React from 'react'

import { render, cleanup } from '../../test-utils'
import MenuItem from '../menu-item'

describe('Menu Item', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        render(<MenuItem to="/wow" />)
    })
})
