const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(payload) {
    const { title, owner, body } = payload
    const id = `thread-${this._idGenerator()}`
    const nowDate = new Date()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, owner, body, nowDate]
    }

    const result = await this._pool.query(query)

    return new AddedThread({ ...result.rows[0] })
  }

  async checkThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak tersedia')
    }
  }

  async getDetailById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
      FROM threads
      LEFT JOIN users ON users.id = threads.owner 
      WHERE threads.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = ThreadRepositoryPostgres
