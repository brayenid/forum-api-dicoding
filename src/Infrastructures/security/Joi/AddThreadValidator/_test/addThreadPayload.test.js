const ThreadPayloadValidator = require('../index')
const InvariantError = require('../../../../../Commons/exceptions/InvariantError')
describe('Thread payload', () => {
  it('should throw invariant error for invalid payload schema', () => {
    const payload = {
      title: '',
      body: 'this is body',
      owner: 'user-123'
    }
    expect(() => new ThreadPayloadValidator().validate(payload)).toThrow(InvariantError)
  })
})
