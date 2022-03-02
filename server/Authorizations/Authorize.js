const {skip} = require("graphql-resolvers");

module.exports.isAuthenticated = async (_, __, {reqUserInfo}) => {
    if (!reqUserInfo) throw new Error("Access Denied! Please log in to continue.");
    return skip;
}