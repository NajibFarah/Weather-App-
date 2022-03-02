const {ApolloServer} = require("apollo-server-express");
const typeDefs = require("./TypeDefs/main");
const resolvers = require("./Resolvers/main");

//Authorizations
const {Token} = require("./Authorizations/Token");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const contextObj = {}
        if (req) {
            await Token(req);
            contextObj.reqUserInfo = req.user
        }
        return contextObj;
    },
});

module.exports = apolloServer;