/* istanbul ignore file */
const UsersTableTestHelper = require('./UsersTableTestHelper')
const Jwt = require('@hapi/jwt')

const ServerTestHelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    await UsersTableTestHelper.addUser(payloadUser)
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY)
  },
  async getAccessTokenDifferentUser() {
    const payloadUser = {
      id: 'user-124',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    await UsersTableTestHelper.addUser(payloadUser)
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY)
  }
}

module.exports = ServerTestHelper
