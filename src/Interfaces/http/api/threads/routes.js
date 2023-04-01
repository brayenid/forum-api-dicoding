const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.addThreadHandler
  }
]

module.exports = routes
