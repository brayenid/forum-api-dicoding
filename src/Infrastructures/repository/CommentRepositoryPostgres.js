const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
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

  async deleteComment(payload) {
    const { commentId, threadId } = payload

    const query = {
      text: 'UPDATE comments SET deleted = true WHERE id = $1 AND thread = $2',
      values: [commentId, threadId]
    }

    await this._pool.query(query)
  }

  async checkCommentInThreadAvailability(payload) {
    const { commentId, threadId } = payload

    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread = $2',
      values: [commentId, threadId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Data tidak valid')
    }
  }

  async checkCommentOwnership(payload) {
    const { commentId, owner } = payload

    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new AuthorizationError('Anda bukan pemilik komentar')
    }
  }

  async getDetailByThread(thread) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.deleted 
      FROM comments
      LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread = $1 
      ORDER BY comments.date ASC`,
      values: [thread]
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = CommentsRepositoryPostgres
