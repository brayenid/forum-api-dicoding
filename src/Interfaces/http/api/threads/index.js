const routes = require('./routes')
const AddThreadHandler = require('./handler')

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const addThreadHandler = new AddThreadHandler(container)
    server.route(routes(addThreadHandler))
  }
}
