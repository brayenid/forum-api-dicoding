const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const container = require('../../container')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/threads endpoint', () => {
  afterAll(async () => {
    pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should throw 401 when the client is unauthenticated', async () => {
      const payload = {
        title: 'this is title',
        body: 'this is body'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload
      })
      expect(response.statusCode).toEqual(401)
      expect(response.statusMessage).toEqual('Unauthorized')
    })

    it('should response 201 and added thread', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body'
      }
      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.title).toEqual(payload.title)
    })

    it('should response 400 for bad payload', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: ''
      }
      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should throw 404 if the thread not found', async () => {
      const server = await createServer(container)
      const response = await server.inject({
        url: '/threads/thread-123',
        method: 'GET'
      })

      expect(response.statusCode).toEqual(404)
      const payload = JSON.parse(response.payload)
      expect(payload.status).toEqual('fail')
    })

    it('should return valid response', async () => {
      await UsersTableTestHelper.addUser({ username: 'brayenid' })
      await ThreadsTableTestHelper.createThread()
      await CommentsTableTestHelper.createComment()
      await CommentsTableTestHelper.createComment('thread-123', '124') //create comment-124

      const server = await createServer(container)
      const response = await server.inject({
        url: '/threads/thread-123',
        method: 'GET'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.comment).toHaveLength(2)
    })
  })
})
