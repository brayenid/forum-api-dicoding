const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentThreadUseCase {
  constructor({ commentRepository, threadRepository, commentValidator }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._commentValidator = commentValidator
  }

  async execute(useCasePayload) {
    this._commentValidator.validate(useCasePayload)
    const addComment = new AddComment(useCasePayload)
    await this._threadRepository.checkThreadAvailability(addComment.thread)
    return this._commentRepository.addComment(addComment)
  }
}

module.exports = AddCommentThreadUseCase
