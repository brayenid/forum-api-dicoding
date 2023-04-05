const CommentPayloadValidator = require('../index')
const InvariantError = require('../../../../../Commons/exceptions/InvariantError')

describe('Thread payload', () => {
  it('should throw invariant error for invalid payload schema', () => {
    const payload = {
      content: '',
      owner: 'user-123',
      thread: 'thread-123'
    }
    expect(() => new CommentPayloadValidator().validate(payload)).toThrow(InvariantError)
  })
})
