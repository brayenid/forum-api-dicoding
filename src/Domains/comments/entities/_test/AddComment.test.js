const AddComment = require('../AddComment')

describe('Add Comment', () => {
  it('should throw error when needed property not included', () => {
    expect(() => new AddComment({ content: '123' })).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if the payload data type is not string', () => {
    expect(
      () =>
        new AddComment({
          content: 123,
          owner: true,
          thread: 'hey'
        })
    ).toThrowError('ADD_COMMENT.INVALID_DATA_TYPE')
  })

  it('should create addComment object correctly', () => {
    const payload = {
      content: 'I like this thread',
      owner: 'brayenL',
      thread: 'hey thread'
    }

    const { content, owner, thread } = new AddComment(payload)

    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(thread).toEqual(payload.thread)
  })
})
