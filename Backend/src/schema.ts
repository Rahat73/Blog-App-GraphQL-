export const typeDefs = `#graphql

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    published: Boolean!
    publishedAt: String!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    posts: [Post]
  }

  type Profile {
    id: ID!
    bio: String!
    createdAt: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
    posts: [Post]
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, bio: String): UserAuthPayload
    signin(email: String!, password: String!): UserAuthPayload
  }

  type UserAuthPayload {
    authError: String
    token: String
  }
`;
