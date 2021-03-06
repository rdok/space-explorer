const { ApolloServer } = require('apollo-server')
const isEmail = require('isemail')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { createStore } = require('./utils')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const internalEngineDemo = require('./engine-demo')

const store = createStore()

const dataSources = () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI( { store } )
})

let context = async( { req } ) => {
    const auth = req.headers && req.headers.authorization || ''
    const email = Buffer.from(auth, 'base64').toString('ascii')
    if ( !isEmail.validate(email) ) return { user: null }

    const users = await store.users.findOrCreate({ where: { email } })
    const user = users && users[0] || null

    return { user: { ...user.dataValues } }
}

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    dataSources,
    context,
    engine: {
        apiKey: process.env.ENGINE_API_KEY,
        ...internalEngineDemo
    }
})


if( process.env.NODE_ENV !== 'test') {
    server.listen({ port: process.env.VIRTUAL_PORT, cors: true })
        .then(({ url }) => { console.log(`Server ready at ${url}`) })
}

// Used by integration & e2e tests
module.exports = {
    dataSources,
    context,
    typeDefs,
    resolvers,
    ApolloServer,
    LaunchAPI,
    UserAPI,
    store,
    server
}
