import getPropertySafe from '.'

const obj = {
  name: 'John',
  age: 30,
}

describe('getPropertySafe', () => {
  it('returns the value of the property if it exists and has the correct type', () => {
    expect(
      getPropertySafe({
        target: obj,
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('John')
  })

  it('returns the default value if the property does not exist', () => {
    expect(
      getPropertySafe({
        target: obj,
        propertyName: 'address',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the property has the wrong type', () => {
    expect(
      getPropertySafe({
        target: obj,
        propertyName: 'age',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the target is not an object', () => {
    expect(
      getPropertySafe({
        target: 'string',
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the target is null', () => {
    expect(
      getPropertySafe({
        target: null,
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the target is undefined', () => {
    expect(
      getPropertySafe({
        target: undefined,
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the target is null and the property does not exist', () => {
    expect(
      getPropertySafe({
        target: null,
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })

  it('returns the default value if the target is undefined and the property does not exist', () => {
    expect(
      getPropertySafe({
        target: undefined,
        propertyName: 'name',
        type: 'String',
        defaultValue: 'default',
      })
    ).toBe('default')
  })
})
