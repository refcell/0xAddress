import { gql } from '@apollo/client'

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        dob: String!
        createdAt: Int!
    }
    input SignUpInput {
        email: String!
        firstName: String!
        lastName: String!
        dob: String!
        password: String!
    }
    input SignInInput {
        email: String!
        password: String!
    }
    type SignUpPayload {
        user: User!
    }
    type SignInPayload {
        user: User!
    }
    type Image {
        id: ID!
        email: String!
        imgblob: String!
        createdAt: Int!
    }
    input UploadImageInput {
        email: String!
        imgblob: String!
    }
    type UploadImagePayload {
        image: Image!
    }
    input FetchImagesInput {
        email: String!
    }
    type FetchImagesPayload {
        images: [Image]!
    }
    type Query {
        user(id: ID!): User!
        users: [User]!
        viewer: User
        images(email: String!): [Image]!
    }
    type Mutation {
        signUp(input: SignUpInput!): SignUpPayload!
        signIn(input: SignInInput!): SignInPayload!
        signOut: Boolean!
        uploadImage(input: UploadImageInput!): UploadImagePayload!
    }
`