const pool = require('../../database/postgres/pool')
const CommentsRepositoryPostgres = require('../CommentRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('CommentRepository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    pool.end()
  })

  describe('addComment function', () => {
    it('should add comment to database', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()

      const payload = {
        content: 'I like this thread',
        owner: 'user-123',
        thread: 'thread-123'
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      await commentRepositoryPostgres.addComment(payload)

      const findComment = await CommentsTableTestHelper.findComment('comment-123')
      expect(findComment).toHaveLength(1)
    })
  })
})
