import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import gql from "graphql-tag"

import Pages from './pages'
import Login from './pages/login'
import { resolvers, typeDefs } from './resolvers'
import injectStyles from './styles'

const cache = new InMemoryCache()

const uri = process.env.NODE_ENV === 'production'
   ? 'https://api.space-explorer.rdok.dev/'
   : 'http://localhost:4000/'

const link = new HttpLink({
    uri: uri,
    headers: {
        authorization: localStorage.getItem('token'),
        'client-name': 'Space Explorer [web]',
        'client-version': '1.0.0'
    }
})

const client = new ApolloClient({ cache, link, resolvers, typeDefs })

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: []
    }
})

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`

function IsLoggedIn() {
    const { data } = useQuery( IS_LOGGED_IN )
    return data.isLoggedIn ? <Pages /> : <Login />
}

injectStyles()

ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
)

