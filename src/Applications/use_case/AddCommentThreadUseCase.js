const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentThreadUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload)
    return this._commentRepository.addComment(addComment)
  }
}

module.exports = AddCommentThreadUseCase
