import getTypeTag, { type TypeTag } from '.'

const testCase: Array<[unknown, TypeTag]> = [
  ['1', 'String'],
  [1, 'Number'],
  [[], 'Array'],
  [{}, 'Object'],
  [function () {}, 'Function'],
  [Number('a'), 'NaN'],
  [null, 'Null'],
  [undefined, 'Undefined'],
  [Symbol(), 'Symbol'],
  [Promise.resolve(), 'Promise'],
  [new RegExp('hello'), 'RegExp'],
  [new Date(), 'Date'],
  [new Error('hello'), 'Error'],
  [new Headers(), 'Headers'],
]

describe('getTypeTag', () => {
  testCase.forEach(([value, tag]) => {
    describe(tag, () => {
      it('is correct', () => {
        expect(getTypeTag(value)).toBe(tag)
      })
    })
  })
})
