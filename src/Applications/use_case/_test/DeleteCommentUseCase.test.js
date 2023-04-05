const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const CommentsRepository = require('../../../Domains/comments/CommentsRepository')

describe('DeleteCommentUseCase', () => {
  it('should throw error if the params not contain commentId', async () => {
    const params = {}
    const deleteCommentUseCase = new DeleteCommentUseCase({})
    await expect(() => deleteCommentUseCase.execute(params)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if the params data type was not string', async () => {
    const params = {
      commentId: 123,
      threadId: true,
      owner: 'user-123'
    }
    const deleteCommentUseCase = new DeleteCommentUseCase({})
    await expect(() => deleteCommentUseCase.execute(params)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.INVALID_DATA_TYPE')
  })

  it('should orchestrating delete comment use case correctly', async () => {
    const params = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }

    const mockCommentRepository = new CommentsRepository()

    mockCommentRepository.checkCommentInThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkCommentOwnership = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository })

    await deleteCommentUseCase.execute(params)

    expect(mockCommentRepository.checkCommentInThreadAvailability).toHaveBeenCalledWith(params)
    expect(mockCommentRepository.checkCommentOwnership).toHaveBeenCalledWith(params)
    expect(mockCommentRepository.deleteComment).toHaveBeenLastCalledWith(params)
  })
})
