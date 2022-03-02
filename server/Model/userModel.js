const {Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");
//StringBase
const {stringToBase64} = require("../Middlewares/base");

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
    },
    password: {
        type: String,
        select: false
    },
    location: String
}, {timestamps: true});

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        info: stringToBase64(this.email),
    }, process.env.JWT_SECRET_KEY, {expiresIn: "30d"});
    return token;
};
module.exports.User = model('User', userSchema);