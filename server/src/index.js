const { ApolloServer } = require('apollo-server')
const schema = require('./schema')

const server = new ApolloServer({ schema })
