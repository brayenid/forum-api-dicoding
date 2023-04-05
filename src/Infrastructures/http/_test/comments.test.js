const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should throw 401 status for unauthenticated user', async () => {
      const payload = {
        content: 'this is comment'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload
      })
      expect(response.statusCode).toEqual(401)
      expect(response.statusMessage).toEqual('Unauthorized')
    })

    it('should throw 400 status for bad payload', async () => {
      const payload = {
        content: '',
        owner: 'user-123',
        thread: 'thread-123'
      }

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      await ThreadsTableTestHelper.createThread()

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should throw 404 status if the thread was not available', async () => {
      const payload = {
        content: 'this is comment'
      }

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should throw 201 status for authenticated user and valid input', async () => {
      const payload = {
        content: 'this is comment'
      }

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      await ThreadsTableTestHelper.createThread()

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.content).toEqual(payload.content)
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should throw 401 status for unauthenticated user', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123'
      })
      expect(response.statusCode).toEqual(401)
      expect(response.statusMessage).toEqual('Unauthorized')
    })

    it('should throw 403 status for unauthorized user', async () => {
      const accessToken = await ServerTestHelper.getAccessTokenDifferentUser()
      const server = await createServer(container)

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'brayenid' })
      await ThreadsTableTestHelper.createThread() //make thread-123
      await CommentsTableTestHelper.createComment() //make comment-123

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
    })

    it('should delete the comment and giva 200 status', async () => {
      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      await ThreadsTableTestHelper.createThread() //make thread-123
      await CommentsTableTestHelper.createComment() //make comment-123

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseFindComment = await CommentsTableTestHelper.findComment('comment-123')
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseFindComment[0].deleted).toStrictEqual(true)
    })
  })
})
