const AddThread = require('../AddThread')

describe('Add Thread', () => {
  it('should throw error if the title is not included', () => {
    const payload = {
      body: 'this is thread body'
    }

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if the payload data type is not string', () => {
    const payload = {
      title: 123,
      body: true,
      owner: 'brayen'
    }

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.INVALID_DATA_TYPE')
  })

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'This is first thread',
      body: 'This is the body',
      owner: 'brayen'
    }

    const { title, body, owner } = new AddThread(payload)

    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
    expect(owner).toEqual(payload.owner)
  })
})
