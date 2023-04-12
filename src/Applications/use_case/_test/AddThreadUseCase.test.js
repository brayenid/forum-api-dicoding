const AddThreadUseCase = require('../AddThreadUseCase')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const PayloadValidator = require('../../security/PayloadValidator')

describe('Add Thread Use Case', () => {
  it('should orchestrating the add thread use case correctly', async () => {
    const useCasePayload = {
      title: 'this is title',
      body: 'this is thread body',
      owner: 'BrayenL'
    }

    const mockThreadRepository = new ThreadRepository()
    const mockPayloadValidator = new PayloadValidator()
    const mockAddedThread = new AddedThread({
      id: 'thread-2134',
      title: 'this is title',
      owner: 'BrayenL'
    })

    //mocking
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-2134',
          title: 'this is title',
          owner: 'BrayenL'
        })
      )
    )
    mockPayloadValidator.validate = jest.fn().mockReturnValue(true)

    //use case instance
    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository, threadValidator: mockPayloadValidator })

    //action
    const actualAddingThread = await addThreadUseCase.execute(useCasePayload)

    //assert
    expect(actualAddingThread).toStrictEqual(mockAddedThread)
    expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload)
    expect(mockPayloadValidator.validate).toBeCalled()
  })
})
