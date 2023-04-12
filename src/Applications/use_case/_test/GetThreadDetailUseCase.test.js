const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')

describe('GetThreadDetailUseCase test', () => {
  it('should throw 404 for not found thread', () => {
    const param = {
      id: 'thread-123'
    }

    const mockThreadRepository = new ThreadRepository()

    //mocking
    mockThreadRepository.checkThreadAvailability = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('NoData')))

    const getThreadDetailUseCase = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository })

    expect(async () => {
      await getThreadDetailUseCase.execute(param.id)
    }).rejects.toThrow(NotFoundError)
  })

  it('should show a valid response and show 200 status', async () => {
    const param = {
      id: 'thread-123'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentsRepository()

    //mocking
    mockThreadRepository.checkThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve())
    mockThreadRepository.getDetailById = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding'
      })
    })
    mockCommentRepository.getDetailByThread = jest.fn().mockImplementation(() => {
      return Promise.resolve([
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          deleted: false
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'sebuah koment kedua',
          deleted: false
        }
      ])
    })

    const getThreadDetailUseCase = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository })

    const { thread, comment } = await getThreadDetailUseCase.execute(param)

    expect(typeof thread).toBe('object')
    expect(thread).toEqual({
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding'
    })
    expect(comment).toHaveLength(2)
    expect(comment[0]).toEqual({
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment'
    })
    expect(comment[1]).toEqual({
      id: 'comment-yksuCoxM2s4MMrZJO-qVD',
      username: 'dicoding',
      date: '2021-08-08T07:26:21.338Z',
      content: 'sebuah koment kedua'
    })
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith({ id: 'thread-123' })
    expect(mockThreadRepository.getDetailById).toBeCalledWith({ id: 'thread-123' })
    expect(mockCommentRepository.getDetailByThread({ id: 'thread-123' }))
  })

  it('should show **komentar telah dihapus** content for deleted comment', async () => {
    const param = {
      id: 'thread-123'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentsRepository()

    //mocking
    mockThreadRepository.checkThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve())
    mockThreadRepository.getDetailById = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding'
      })
    })
    mockCommentRepository.getDetailByThread = jest.fn().mockImplementation(() => {
      return Promise.resolve([
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          deleted: false
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'sebuah koment kedua',
          deleted: true
        }
      ])
    })

    const getThreadDetailUseCase = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository })

    const response = await getThreadDetailUseCase.execute(param)
    expect(response.comment[1].content).toStrictEqual('**komentar telah dihapus**')
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith({ id: 'thread-123' })
    expect(mockThreadRepository.getDetailById).toBeCalledWith({ id: 'thread-123' })
    expect(mockCommentRepository.getDetailByThread).toBeCalledWith({ id: 'thread-123' })
  })
})
