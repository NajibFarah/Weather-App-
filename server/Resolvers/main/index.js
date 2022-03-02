//Graphql Custom Resolvers
const {GraphQLDateTime} = require("graphql-iso-date");

//Resolvers
const userResolvers = require("../userResolver");

//Custom Resolvers
const customResolvers = {
    Date: GraphQLDateTime
}

module.exports = [
    customResolvers,
    userResolvers
]
