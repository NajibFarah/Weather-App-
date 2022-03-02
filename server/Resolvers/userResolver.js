const bcrypt = require("bcrypt");
const {combineResolvers} = require("graphql-resolvers");
//Model
const {User} = require("../Model/userModel");
//Authorization
const {isAuthenticated} = require("../Authorizations/Authorize");


module.exports = {
    Query: {
        getUser: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const user = await User.findOne({
                _id: reqUserInfo._id
            });
            if (!user) throw new Error("Use not found!");
            return user
        })
    },
    Mutation: {
        signup: async (_, {input}) => {
            const user = await User.findOne({
                email: input.email
            });
            if (user) throw new Error("User already registered!");
            const newUser = new User({
                name: input.name,
                email: input.email,
                password: input.password
            });
            newUser.password = await bcrypt.hash(newUser.password, 12);
            const result = await newUser.save();
            const token = result.generateJWT();
            let expire = new Date();
            expire.setDate(expire.getDate() + 30);
            return {
                message: "User register successful!",
                success: true,
                token,
                expiresIn: expire
            }
        },
        login: async (_, {input}) => {
            const user = await User.findOne({
                email: input.email
            }).select("+password");
            if (!user) throw new Error("Email or password is wrong!");
            const validUser = await bcrypt.compare(input.password, user.password);
            if (!validUser) throw new Error("Email or password is wrong!");
            const token = user.generateJWT();
            let expire = new Date();
            expire.setDate(expire.getDate() + 30);
            return {
                message: "Login successful!",
                token,
                expiresIn: expire,
                success: true
            }
        },
        updateLocation: combineResolvers(isAuthenticated, async (_, {location}, {reqUserInfo}) => {
            const result = await User.findByIdAndUpdate(reqUserInfo._id, {location}, {new: true});
            if (!result) throw new Error("User not found!");
            return {
                message: "Location Updated successfully!",
                success: true,
                location: result.location
            }
        })
    }
}