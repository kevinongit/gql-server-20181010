import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        messages(cursor: String, limit: Int): MessageConnection!
        message(id: ID!): Message!
        randomOne: Message!
    }
    extend type Mutation {
        createMessage(
            sentenceLang: String
            category: String!
            keyword: String
            orgAuthor: String
            keyPhrase: String!
            keyPhraseMeaning: String!
            sentence: String!
            sentenceMeaning: String!
        ): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(id: ID!, text: String!): Boolean!
    }

    type MessageConnection {
        edges: [Message!]!
        pageInfo: PageInfo!
    }

    type PageInfo {
        hasNextPage: Boolean!
        endCursor: String!
    }

    type Message {
        id: ID!
        sentenceLang: String!
        category: String!
        keyword: String
        orgAuthor: String
        from: User!
        keyPhrase: String!
        keyPhraseMeaning: String!
        sentence: String!
        sentenceMeaning: String!
        difficulty: Int
        createdAt: String!
        user: User!
    }

    extend type Subscription {
        messageCreated: MessageCreated!
    }

    type MessageCreated {
        message: Message!
    }
`;