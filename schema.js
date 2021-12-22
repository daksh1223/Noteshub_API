const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL's schema language
module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    Notes: [Note!]!
    favorites: [Note!]
  }
  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
  }
  type Notefeed{
    notes:[Note!]!
    hasNextPage: Boolean!
    cursor: String
  }
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
    user(username: String!): User
    users: [User!]!
    me: User!
    noteFeed(cursor:String):Notefeed
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, password: String!, email: String!): String!
    signIn(username: String!, password: String!, email: String!): String!
    toggleFavorite(id: ID!): Note!
  }
`;
