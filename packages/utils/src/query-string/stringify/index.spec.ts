import { ArrayFormat, StringifyOptions } from '@soie/utils/query-string/types'

import stringify from '.'

const expectedResults: Record<
  ArrayFormat,
  Record<
    string,
    Array<{ options: StringifyOptions | undefined; expected: string }>
  >
> = {
  index: {
    default: [
      {
        options: { skipNull: true },
        expected: 'a[0]=b&a[1]=1&a[2]=&a[3]=true&a[4]=false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a[0]=b&a[1]=1&a[2]&a[3]=true&a[4]=false',
      },
      {
        options: undefined,
        expected: 'a[0]=b&a[1]=1&a[2]&a[3]=&a[4]=true&a[5]=false',
      },
    ],
  },
  bracket: {
    default: [
      {
        options: { skipNull: true },
        expected: 'a[]=b&a[]=1&a[]=&a[]=true&a[]=false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a[]=b&a[]=1&a[]&a[]=true&a[]=false',
      },
      {
        options: undefined,
        expected: 'a[]=b&a[]=1&a[]&a[]=&a[]=true&a[]=false',
      },
    ],
  },
  comma: {
    default: [
      {
        options: { skipNull: true },
        expected: 'a=b,1,,true,false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a=b,1,,true,false',
      },
      {
        options: undefined,
        expected: 'a=b,1,,,true,false',
      },
    ],
  },
  separator: {
    default: [
      {
        options: { skipNull: true },
        expected: 'a=b,1,,true,false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a=b,1,,true,false',
      },
      {
        options: undefined,
        expected: 'a=b,1,,,true,false',
      },
    ],
    '|': [
      {
        options: { skipNull: true },
        expected: 'a=b|1||true|false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a=b|1||true|false',
      },
      {
        options: undefined,
        expected: 'a=b|1|||true|false',
      },
    ],
  },
  'bracket-separator': {
    default: [
      {
        options: { skipNull: true },
        expected: 'a[]=b,1,,true,false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a[]=b,1,,true,false',
      },
      {
        options: undefined,
        expected: 'a[]=b,1,,,true,false',
      },
    ],
    '|': [
      {
        options: { skipNull: true },
        expected: 'a[]=b|1||true|false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a[]=b|1||true|false',
      },
      {
        options: undefined,
        expected: 'a[]=b|1|||true|false',
      },
    ],
  },
  'colon-list-separator': {
    default: [
      {
        options: { skipNull: true },
        expected: 'a:list=b&a:list=1&a:list=&a:list=true&a:list=false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a:list=b&a:list=1&a:list=&a:list=true&a:list=false',
      },
      {
        options: undefined,
        expected: 'a:list=b&a:list=1&a:list=&a:list=&a:list=true&a:list=false',
      },
    ],
  },
  none: {
    default: [
      {
        options: { skipNull: true },
        expected: 'a=b&a=1&a=&a=true&a=false',
      },
      {
        options: { skipEmptyString: true },
        expected: 'a=b&a=1&a&a=true&a=false',
      },
      {
        options: undefined,
        expected: 'a=b&a=1&a&a=&a=true&a=false',
      },
    ],
  },
}

describe('query-string stringify', () => {
  describe('isEmpty', () => {
    it('should return empty string when object is undefined', () => {
      expect(stringify(undefined, undefined)).toBe('')
    })
    it('should return empty string when object is empty', () => {
      expect(stringify({}, undefined)).toBe('')
    })
    it('should return empty string when array is empty', () => {
      expect(stringify({ a: [] }, undefined)).toBe('')
    })
  })

  describe('object', () => {
    const testCase = {
      a: 'b',
      b: null,
      c: undefined,
      d: '',
      e: 1,
      f: true,
      g: false,
    }
    describe('with options', () => {
      describe('skipNull', () => {
        it('should skip null value', () => {
          expect(stringify(testCase, { skipNull: true })).toBe(
            'a=b&d=&e=1&f=true&g=false'
          )
        })
      })

      describe('skipEmptyString', () => {
        it('should skip empty string value', () => {
          expect(stringify(testCase, { skipEmptyString: true })).toBe(
            'a=b&b&e=1&f=true&g=false'
          )
        })
      })
    })

    describe('without options', () => {
      it('should return stringified object', () => {
        expect(stringify(testCase)).toBe('a=b&b&d=&e=1&f=true&g=false')
      })
    })
  })
  describe('array', () => {
    const testCase = { a: ['b', 1, null, undefined, '', true, false] }
    Object.entries(expectedResults).forEach(([arrayFormat, results]) => {
      describe(arrayFormat, () => {
        Object.entries(results).forEach(([arrayFormatSeparator, params]) => {
          params.forEach(({ options, expected }) => {
            describe(options ? Object.keys(options)[0] : 'default', () => {
              it('is correct', () => {
                expect(
                  stringify(testCase, {
                    arrayFormat: arrayFormat as ArrayFormat,
                    arrayFormatSeparator:
                      arrayFormatSeparator === 'default'
                        ? undefined
                        : arrayFormatSeparator,
                    ...options,
                  })
                ).toBe(expected)
              })
            })
          })
        })
      })
    })
  })
})
