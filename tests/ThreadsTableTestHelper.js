/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

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
      id: 'thread-123',
      title,
      body: 'this is body',
      owner: 'user-123'
    }
    const nowDate = new Date()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [payload.id, payload.title, payload.owner, payload.body, nowDate]
    }

    const result = await pool.query(query)

    return { ...result.rows[0] }
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
