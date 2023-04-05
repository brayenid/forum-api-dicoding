const PayloadValidator = require('../../../../Applications/security/PayloadValidator')
const CommentPayloadSchema = require('./schema')
const InvariantError = require('../../../../Commons/exceptions/InvariantError')

class CommentPayloadValidator extends PayloadValidator {
  validate(payload) {
    const result = CommentPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error)
    }
  }
}

module.exports = CommentPayloadValidator
