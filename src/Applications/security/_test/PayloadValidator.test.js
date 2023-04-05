const PayloadValidator = require('../PayloadValidator')

describe('PayloadValidator interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const payloadValidator = new PayloadValidator()

    // Action & Assert
    await expect(payloadValidator.validate({ hello: 'world' })).rejects.toThrowError('PAYLOAD_VALIDATOR.METHOD_NOT_IMPLEMENTED')
  })
})
