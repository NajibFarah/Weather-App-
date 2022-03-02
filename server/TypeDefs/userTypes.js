const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getUser: User
    }
    extend type Mutation {
        signup(input: signUpInput): successInfo
        login(input: loginInput): successInfo
        updateLocation(location: String): locationInfo
    }
    input signUpInput {
        name: String
        email: String
        password: String
    }
    input loginInput {
        email: String
        password: String
    }
    type successInfo {
        message: String
        success: Boolean
        token: String
        expiresIn: Date
    }
    type locationInfo {
        message: String
        location: String
        success: Boolean
    }
    type User {
        id: ID
        name: String
        email: String
        location: String
        createdAt: Date
        updatedAt: Date
    }
`;