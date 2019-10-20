import React from 'react'
import styled from 'react-emotion'
import { useApolloClient } from '@apollo/react-hooks'

import { menuItemClassName } from '../components/menu-item'
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg'

export default function LogoutButton() { 
    const client = useApolloClient()

    return (
        <StyleButton
            onClick={() => {
                client.writeData({ data: { isLoggedIn: false }})
                localStorage.clear()
            }}
        >
            <ExitIcon />
        </StyleButton>
    )
}

const StyleButton = styled('button')(menuItemClassName, {
    background: 'none',
    border: 'none',
    padding: 0
})
