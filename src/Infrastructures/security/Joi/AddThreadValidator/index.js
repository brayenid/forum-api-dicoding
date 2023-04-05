const ThreadPayloadSchema = require('./schema')
const PayloadValidator = require('../../../../Applications/security/PayloadValidator')
const InvariantError = require('../../../../Commons/exceptions/InvariantError')

class ThreadPayloadValidator extends PayloadValidator {
  validate(payload) {
    const result = ThreadPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error)
    }
  }
}

module.exports = ThreadPayloadValidator
