import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        users: [User!]
        user(id: ID!): User
        me: User
        messageIds: [ID!]
    }

    extend type Mutation {
        signUp(
            username: String!
            email: String!
            password: String!
        ): Token!

        signIn(login: String!, password: String!): Token!
        deleteUser(id: ID!): Boolean!
    }

    type Token {
        token: String!
    }

    type User {
        id: ID
        username: String!
        email: String!
        avatarUrl: String!
        role: String
        point: Int!
        messages: [Message!]
        messageIds: [ID!]
        description: String
    }
`