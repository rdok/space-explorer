import React from 'react'

import { render, cleanup } from '../../test-utils'
import LoginForm from '../login-form'

describe('Login Form', () => {
    afterEach(cleanup)

    it('renders without error', () => {
        render(<LoginForm />)
    })
})
