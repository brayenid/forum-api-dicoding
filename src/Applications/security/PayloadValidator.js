class PayloadValidator {
  async validate({ hello }) {
    throw new Error('PAYLOAD_VALIDATOR.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = PayloadValidator
