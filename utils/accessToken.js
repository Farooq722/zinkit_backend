const jwt = require("jsonwebtoken");

const accessToken = (userId) => {
    const token =  jwt.sign({id: userId}, process.env.SECRET_KEY_ACCESS, {expiresIn: '5h'})

    return token;
}

module.exports = accessToken;