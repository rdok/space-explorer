import React from 'react'

import { render, cleanup } from '../../test-utils'
import Button from '../button'

describe('Button', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        render(<Button>Hello World</Button>)
    })
})
