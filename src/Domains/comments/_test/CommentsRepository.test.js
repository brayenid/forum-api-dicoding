const CommentsRepository = require('../CommentsRepository')

describe('Comments repository interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    const commentsRepository = new CommentsRepository()

    expect(commentsRepository.addComment({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(commentsRepository.deleteComment({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(commentsRepository.checkCommentInThreadAvailability({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(commentsRepository.checkCommentOwnership({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(commentsRepository.getDetailByThread({})).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
