/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async createComment(threadId = 'thread-123', id = 'comment-123') {
    const payload = {
      content: 'I like this thread',
      owner: 'user-123',
      thread: threadId
    }

    const nowDate = new Date()
    const { content, owner, thread } = payload

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, nowDate, content, thread]
    }

    const result = await pool.query(query)
    return { ...result.rows[0] }
  },
  async findComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
