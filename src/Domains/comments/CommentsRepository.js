class CommentsRepository {
  async addComment(payload) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment(payload) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkCommentOwnership(payload) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkCommentInThreadAvailability(payload) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getDetailByThread(id) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentsRepository
