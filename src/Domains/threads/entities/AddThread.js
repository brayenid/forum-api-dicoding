class AddThread {
  constructor(payload) {
    this._verifyPayload(payload)

    this.title = payload.title
    this.body = payload.body
    this.owner = payload.owner
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.body || !payload.owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof payload.title !== 'string' || typeof payload.body !== 'string' || typeof payload.owner !== 'string') {
      throw new Error('ADD_THREAD.INVALID_DATA_TYPE')
    }
  }
}

module.exports = AddThread
