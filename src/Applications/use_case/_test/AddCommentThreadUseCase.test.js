const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
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

    const mockedCommentsRepository = new CommentsRepository()
    mockedCommentsRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment))

    const addCommentThreadUseCase = new AddCommentThreadUseCase({ commentRepository: mockedCommentsRepository })

    const actualAddingComment = await addCommentThreadUseCase.execute(payload)

    expect(actualAddingComment).toStrictEqual(mockAddedComment)
    expect(mockedCommentsRepository.addComment).toBeCalledWith(payload)
  })
})
