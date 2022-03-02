const {gql} = require("apollo-server-express");

//TypeDefs
const userTypeDefs = require("../userTypes");

const typeDefs = gql`
    scalar Date
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
`;

module.exports = [
    typeDefs,
    userTypeDefs
]