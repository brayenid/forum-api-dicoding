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
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadDetailHandler
  }
]

module.exports = routes
