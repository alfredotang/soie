import snakeCase from '.'

const testCases1 = [
  'test-string',
  'testString',
  'TestString',
  'TEST_STRING',
  'test_string',
  'test@string',
  'test_string_',
  '-----test_string_',
]

const testCases2 = [
  'test-string-2',
  'testString2',
  'TestString2',
  'TEST_STRING_2',
  'test_string_2',
  'test@string@2',
]

const testCases3 = [
  '1-test-string-2',
  '1testString2',
  '1TestString2',
  '1_TEST_STRING_2',
  '1_test_string_2',
  '1@test@string@2',
]

describe('change case snakeCase', () => {
  testCases1.forEach(input => {
    it(`should snakeCase ${input} correctly`, () => {
      expect(snakeCase(input)).toBe('test_string')
    })
  })
  describe('edge cases', () => {
    describe('with number', () => {
      testCases2.forEach(input => {
        it(`should snakeCase ${input} correctly`, () => {
          expect(snakeCase(input)).toBe('test_string_2')
        })
      })
      testCases3.forEach(input => {
        it(`should snakeCase ${input} correctly`, () => {
          expect(snakeCase(input)).toBe('1_test_string_2')
        })
      })
    })
  })
})
