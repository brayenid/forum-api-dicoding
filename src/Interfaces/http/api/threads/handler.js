const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container

    this.addThreadHandler = this.addThreadHandler.bind(this)
    this.addCommentHandler = this.addCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this)
  }

  async addThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)

    const payload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth.credentials.id
    }
    const addedThread = await addThreadUseCase.execute(payload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async addCommentHandler(request, h) {
    const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name)
    const payload = {
      content: request.payload.content,
      owner: request.auth.credentials.id,
      thread: request.params.threadId
    }

    const addedComment = await addCommentThreadUseCase.execute(payload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const payload = {
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      owner: request.auth.credentials.id
    }

    await deleteCommentUseCase.execute(payload)
    const response = h.response({
      status: 'success',
      message: 'Deleted'
    })
    response.code(200)
    return response
  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name)
    const result = await getThreadDetailUseCase.execute(threadId)

    const response = h.response({
      status: 'success',
      data: {
        thread: {
          ...result.thread.rows[0],
          comment: result.comment.rows
        }
      }
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
