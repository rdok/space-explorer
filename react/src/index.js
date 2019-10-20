import { ApolloProvider } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom'
import Pages from './pages'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from "graphql-tag"
import { resolvers, typeDefs } from './resolvers'
import Login from './pages/login'

const cache = new InMemoryCache()
const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: { authorization: localStorage.getItem('token') }
})

const client = new ApolloClient({ cache, link, typeDefs, resolvers })

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: []
    }
})

ReactDOM.render(
    <ApolloProvider client={client}>
    </ApolloProvider>,
    document.getElementById('root')
)


const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`

function IsLoggedIn() {
    const { data } = useQuery( IS_LOGGED_IN )
    return data.isLoggedIn ? <Pages /> : <Login />
}
