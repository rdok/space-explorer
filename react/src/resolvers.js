import gql from 'graphql-tag'

export const schema = gql`
    extend type Launch {
        isInCart: Boolean!
    }
`

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        cartItems: [ID!]
    }

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation { 
        addOrRemoveFromCart(id: ID!): [Launch]
    }
`

export const resolvers = {
    Launch: {
        isInCart: (launch, _, { cache }) => {
            const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
            return cartItems.includes(launch.id)
        }
    }
}
