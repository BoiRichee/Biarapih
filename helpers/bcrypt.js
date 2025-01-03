const bcrypt = require("bcrypt")

// Hashing a Password
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

// Compared The Original with The Hash One
const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
}

module.exports = { hashPassword, comparePassword }