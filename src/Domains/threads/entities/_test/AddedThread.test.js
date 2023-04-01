const AddedThread = require('../AddedThread')

describe('Added Thread', () => {
  it('should throw error if not included the needed property', () => {
    const payload = {
      id: 'thread-2134',
      title: 'this is title'
    }

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_INCLUDED_NEEDED_PROPERTY')
  })

  it('should throw error when the payload did not meet the spesification', () => {
    const payload = {
      id: true,
      title: 'this is title',
      owner: 142
    }

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.INVALID_DATA_TYPES')
  })

  it('should return valid value', () => {
    const payload = {
      id: 'thread-2134',
      title: 'this is title',
      owner: 'BrayenL'
    }

    const addedThread = new AddedThread(payload)

    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
