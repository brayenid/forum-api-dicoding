const pool = require('../../database/postgres/pool')
const CommentsRepositoryPostgres = require('../CommentRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

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

  describe('deleteComment function', () => {
    it('should soft delete comment', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread() //create user-123
      await CommentsTableTestHelper.createComment() //create comment-123

      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      await commentRepositoryPostgres.deleteComment(payload)
      const response = await CommentsTableTestHelper.findComment('comment-123')
      expect(response).toHaveLength(1)
      expect(response[0].deleted).toStrictEqual(true)
    })

    it('should not delete and throw NotFoundError if the threadId and commentId were not valid', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread() //make thread-123
      await CommentsTableTestHelper.createComment() //make comment-123

      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-124'
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      await expect(async () => {
        await commentRepositoryPostgres.checkCommentInThreadAvailability(payload)
      }).rejects.toThrow(NotFoundError)
    })

    it('should not delete if ownership was invalid', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread() //make thread-123
      await CommentsTableTestHelper.createComment() //make comment-123

      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-124',
        owner: 'user-124'
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      await expect(async () => {
        await commentRepositoryPostgres.checkCommentOwnership(payload)
      }).rejects.toThrow(AuthorizationError)
    })
  })

  describe('getDetailByThread function', () => {
    it('should return valid response', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()
      await CommentsTableTestHelper.createComment()
      await CommentsTableTestHelper.createComment('thread-123', '124') //create comment-124

      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool)
      const response = await commentRepositoryPostgres.getDetailByThread('thread-123')
      const body = response.rows[0]

      expect(response.rows).toHaveLength(2)
      expect(body.id).toBeDefined()
      expect(body.owner).toBeDefined()
      expect(body.date).toBeDefined()
      expect(body.content).toBeDefined()
    })
  })
})
