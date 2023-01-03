const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.SECRET_KEY

const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  })
}

const validateToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}

const decode = (token) => {
  return jwt.decode(token)
}

module.exports = {
  signToken,
  validateToken,
  decode,
}
