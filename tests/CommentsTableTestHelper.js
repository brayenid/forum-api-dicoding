/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')
const CommentsRepositoryPostgres = require('../src/Infrastructures/repository/CommentRepositoryPostgres')

const CommentsTableTestHelper = {
  async createComment(threadId = 'thread-123', id = '123') {
    const payload = {
      content: 'I like this thread',
      owner: 'user-123',
      thread: threadId
    }

    const fakeIdGenerator = () => id
    const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

    await commentRepositoryPostgres.addComment(payload)
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
