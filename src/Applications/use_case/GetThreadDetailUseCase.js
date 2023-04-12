class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(id) {
    await this._threadRepository.checkThreadAvailability(id)
    const getThreadDetailById = await this._threadRepository.getDetailById(id)
    const getCommentByThread = await this._commentRepository.getDetailByThread(id)

    const mappedComments = getCommentByThread.map((comment) => {
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.deleted ? '**komentar telah dihapus**' : comment.content
      }
    })

    const object = {
      thread: getThreadDetailById,
      comment: mappedComments
    }
    return object
  }
}

module.exports = GetThreadDetailUseCase
