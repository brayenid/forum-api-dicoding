const CommentsRepository = require('../../Domains/comments/CommentsRepository')

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(payload) {
    const id = `comment-${this._idGenerator()}`
    const nowDate = new Date()
    const { content, owner, thread } = payload

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, nowDate, content, thread]
    }

    const result = await this._pool.query(query)
    return { ...result.rows[0] }
  }
}

module.exports = CommentsRepositoryPostgres
