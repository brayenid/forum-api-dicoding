class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(id) {
    await this._threadRepository.checkThreadAvailability(id)
    const getThreadDetailById = await this._threadRepository.getDetailById(id)
    const getCommentByThread = await this._commentRepository.getDetailByThread(id)
    const object = {
      thread: {
        ...getThreadDetailById
      },
      comment: {
        ...getCommentByThread
      }
    }

    return object
  }
}

module.exports = GetThreadDetailUseCase
