class AddThread {
  constructor(payload) {
    this._verifyPayload(payload)

    this.content = payload.content
    this.owner = payload.owner
    this.thread = payload.thread
  }

  _verifyPayload(payload) {
    const { content, owner, thread } = payload
    if (!content || !owner || !thread) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
      throw new Error('ADD_COMMENT.INVALID_DATA_TYPE')
    }
  }
}

module.exports = AddThread
