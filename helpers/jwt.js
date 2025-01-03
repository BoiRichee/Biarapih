var jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

function jwtSign (data) {
    return jwt.sign(data, secretKey);
}

function jwtVerify (token) {
    return jwt.verify(token, secretKey);
}

module.exports = { jwtSign, jwtVerify }