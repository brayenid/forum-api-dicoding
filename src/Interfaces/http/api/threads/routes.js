const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.addThreadHandler,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.addCommentHandler,
    options: {
      auth: 'forum_jwt'
    }
  }
]

module.exports = routes
