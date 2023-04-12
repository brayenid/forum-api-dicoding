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

      const response = await commentRepositoryPostgres.addComment(payload)
      const findComment = await CommentsTableTestHelper.findComment('comment-123')

      expect(response).toEqual({ id: 'comment-123', content: 'I like this thread', owner: 'user-123' })
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
  })

  describe('checkCommentInThreadAvailability function', () => {
    it('should throw NotFoundError if comment in thread was not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()
      await CommentsTableTestHelper.createComment() //create comment-123
      const payload = {
        commentId: 'comment-124',
        threadId: 'thread-123'
      }

      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool)

      await expect(async () => {
        await commentRepositoryPostgres.checkCommentInThreadAvailability(payload)
      }).rejects.toThrow(NotFoundError)
    })

    it('should not throw error and resolves if comment in thread was available', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()
      await CommentsTableTestHelper.createComment() //create comment-123
      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-123'
      }

      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool)

      await expect(commentRepositoryPostgres.checkCommentInThreadAvailability(payload)).resolves.not.toThrow()
    })
  })

  describe('checkCommentOwnership function', () => {
    it('should throw error for unauthorized user', async () => {
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

    it('should not throw error for authorized user and resolve', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread() //make thread-123
      await CommentsTableTestHelper.createComment() //make comment-123

      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      }

      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      await expect(commentRepositoryPostgres.checkCommentOwnership(payload)).resolves.not.toThrow()
    })
  })

  describe('getDetailByThread function', () => {
    it('should return valid response', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()
      await CommentsTableTestHelper.createComment()
      await CommentsTableTestHelper.createComment('thread-123', 'comment-124') //create comment-124

      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool)
      const response = await commentRepositoryPostgres.getDetailByThread('thread-123')

      expect(response).toHaveLength(2)
      expect(response[0].id).toEqual('comment-123')
      expect(response[0].username).toEqual('brayenid')
      expect(typeof response[0].date).toBe('string')
      expect(response[0].content).toEqual('I like this thread')
      expect(response[0].deleted).toStrictEqual(false)

      expect(response[1].id).toEqual('comment-124')
      expect(response[1].username).toEqual('brayenid')
      expect(typeof response[1].date).toBe('string')
      expect(response[1].content).toEqual('I like this thread')
      expect(response[1].deleted).toStrictEqual(false)
    })
  })
})
