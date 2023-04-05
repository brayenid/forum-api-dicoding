/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')
const ThreadRepositoryPostgres = require('../src/Infrastructures/repository/ThreadRepositoryPostgres')

const ThreadsTableTestHelper = {
  async findThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)

    return result.rows
  },
  async createThread(title = 'this is title') {
    const payload = {
      title,
      body: 'this is body',
      owner: 'user-123'
    }

    const fakeIdGenerator = () => '123'
    const threadReposity = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

    const result = await threadReposity.addThread(payload)
    return result
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
