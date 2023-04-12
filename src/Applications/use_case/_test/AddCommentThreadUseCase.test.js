const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const PayloadValidator = require('../../security/PayloadValidator')
const AddCommentThreadUseCase = require('../AddCommentThreadUseCase')

describe('add comment use case', () => {
  it('should orchestrating add comment use case correctly', async () => {
    const payload = {
      content: 'This is comment',
      owner: 'user-123',
      thread: 'thread-123'
    }

    const mockAddedComment = {
      id: 'comment-1234',
      content: 'This is comment',
      owner: 'user-123'
    }

    const mockCommentsRepository = new CommentsRepository()
    const mockCommentValidator = new PayloadValidator()
    const mockThreadRepository = new ThreadRepository()

    //mocking
    mockCommentsRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'comment-1234',
        content: 'This is comment',
        owner: 'user-123'
      })
    )
    mockCommentValidator.validate = jest.fn().mockReturnValue(true)
    mockThreadRepository.checkThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve())

    const addCommentThreadUseCase = new AddCommentThreadUseCase({ commentRepository: mockCommentsRepository, threadRepository: mockThreadRepository, commentValidator: mockCommentValidator })

    const actualAddingComment = await addCommentThreadUseCase.execute(payload)

    expect(actualAddingComment).toStrictEqual(mockAddedComment)
    expect(mockCommentsRepository.addComment).toBeCalledWith(payload)
    expect(mockCommentValidator.validate).toBeCalledWith(payload)
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(payload.thread)
  })
})
