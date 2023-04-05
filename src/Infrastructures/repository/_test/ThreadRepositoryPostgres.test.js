const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })
  describe('add thread function', () => {
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

      await threadReposity.addThread(addThread)

      const findThread = await ThreadsTableTestHelper.findThread('thread-123')
      expect(findThread).toHaveLength(1)
    })
  })

  describe('get detail by id function', () => {
    it('should return valid data', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayen' })
      await ThreadsTableTestHelper.createThread()

      const threadRepository = new ThreadRepositoryPostgres(pool)

      const result = await threadRepository.getDetailById('thread-123')
      const body = result.rows[0]

      expect(body.id).toBeDefined()
      expect(body.title).toBeDefined()
      expect(body.body).toBeDefined()
      expect(body.date).toBeDefined()
      expect(body.owner).toBeDefined()
    })
  })
})
