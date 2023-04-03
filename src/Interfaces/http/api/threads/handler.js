const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container

    this.addThreadHandler = this.addThreadHandler.bind(this)
    this.addCommentHandler = this.addCommentHandler.bind(this)
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
}

module.exports = ThreadsHandler
