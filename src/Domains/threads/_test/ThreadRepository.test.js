const ThreadRepository = require('../ThreadRepository')

describe('Thread Repository', () => {
  it('should throw error when invoke unimplemented method', () => {
    const threadRepository = new ThreadRepository()

    expect(threadRepository.addThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(threadRepository.getDetailById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(threadRepository.checkThreadAvailability('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
