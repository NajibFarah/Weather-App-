//Packages
const jwt = require("jsonwebtoken");
// Model & Base
const {User} = require('../Model/userModel');
const {base64ToString} = require("../Middlewares/base");

module.exports.Token = async (req) => {
    req.user = null;
    let token = req.headers.authorization;
    if (token) {
        token = token.split(" ")[1].trim();
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decode) {
            const email = base64ToString(decode.info);
            const userInfo = await User.findOne({
                email: email
            });
            req.user = userInfo;
        }
    }
}