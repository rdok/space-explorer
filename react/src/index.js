import { ApolloProvider } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom'
import Pages from './pages'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from "graphql-tag"

const cache = new InMemoryCache()
const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: { authorization: localStorage.getItem('token') }
})
const client = new ApolloClient({ cache, link })

ReactDOM.render(
    <ApolloProvider client={client}>
    </ApolloProvider>,
    document.getElementById('root')
)
