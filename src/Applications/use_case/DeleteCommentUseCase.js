class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute(payload) {
    this._validatePayload(payload)
    await this._commentRepository.checkCommentInThreadAvailability(payload)
    await this._commentRepository.checkCommentOwnership(payload)
    await this._commentRepository.deleteComment(payload)
  }

  _validatePayload(payload) {
    const { commentId, threadId, owner } = payload
    if (!commentId || !threadId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.INVALID_DATA_TYPE')
    }
  }
}

module.exports = DeleteCommentUseCase
