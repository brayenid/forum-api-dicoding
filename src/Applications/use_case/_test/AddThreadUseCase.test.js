const AddThreadUseCase = require('../AddThreadUseCase')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('Add Thread Use Case', () => {
  it('should orchestrating the add thread use case correctly', async () => {
    const useCasePayload = {
      title: 'this is title',
      body: 'this is thread body',
      owner: 'BrayenL'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockAddedThread = new AddedThread({
      id: 'thread-2134',
      title: 'this is title',
      owner: 'BrayenL'
    })

    //mocking
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread))

    //use case instance
    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository)

    //action
    const actualAddingThread = await addThreadUseCase.execute(useCasePayload)

    //assert
    expect(actualAddingThread).toStrictEqual(
      new AddedThread({
        id: 'thread-2134',
        title: useCasePayload.title,
        owner: 'BrayenL'
      })
    )
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload)
  })
})
