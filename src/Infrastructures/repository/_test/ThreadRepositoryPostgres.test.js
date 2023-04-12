const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })
  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      //add user
      await UsersTableTestHelper.addUser({ username: 'brayen' })

      const addThread = new AddThread({
        title: 'this is title',
        body: 'this is body',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123'
      const threadReposity = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      const response = await threadReposity.addThread(addThread)
      const findThread = await ThreadsTableTestHelper.findThread('thread-123')

      expect(response).toEqual({ id: 'thread-123', title: 'this is title', owner: 'user-123' })
      expect(findThread).toHaveLength(1)
    })
  })

  describe('checkThreadAvailability function', () => {
    it('should throw NotFoundError if thread was not available', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool)

      expect(async () => {
        await threadRepository.checkThreadAvailability('thread-123')
      }).rejects.toThrow(NotFoundError)
    })

    it('should not throw error and resolves if thread was available', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayen' })
      await ThreadsTableTestHelper.createThread() //make thread-123

      const threadRepository = new ThreadRepositoryPostgres(pool)
      await expect(threadRepository.checkThreadAvailability('thread-123')).resolves.not.toThrow()
    })
  })

  describe('getDetailById function', () => {
    it('should return valid data', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayen' })
      await ThreadsTableTestHelper.createThread()

      const threadRepository = new ThreadRepositoryPostgres(pool)

      const result = await threadRepository.getDetailById('thread-123')

      const body = result[0]

      expect(body.id).toEqual('thread-123')
      expect(body.title).toEqual('this is title')
      expect(body.body).toEqual('this is body')
      expect(typeof body.date).toBe('string')
      expect(body.username).toEqual('brayen')
    })
  })
})
