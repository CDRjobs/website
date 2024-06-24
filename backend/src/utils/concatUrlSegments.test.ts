import concatUrl from './concatUrlSegments'

describe('concatUrlSegments', () => {
  test.each([
    [['a'], 'a'],
    [['/a'], 'a'],
    [['a/'], 'a'],
    [['/a/'], 'a'],
    [['/////a////////'], 'a'],
    [['a', 'b'], 'a/b'],
    [['/a', '/b'], 'a/b'],
    [['a/', 'b/'], 'a/b'],
    [['/a/', '/b/'], 'a/b'],
    [['/////a/////', '/////b/////'], 'a/b'],
    [['a', 'b', 'c'], 'a/b/c'],
    [['/a', '/b', '/c'], 'a/b/c'],
    [['a/', 'b/', 'c/'], 'a/b/c'],
    [['/a/', '/b/', '/c/'], 'a/b/c'],
    [['/////a/////', '/////b/////', '/////c/////'], 'a/b/c'],
    [['https://cdrjobs.earth/', '/a/', '/b/'], 'https://cdrjobs.earth/a/b'],
  ])('%p => %s', (segments, expectedResult) => {
    const result = concatUrl(...segments)
    expect(result).toBe(expectedResult)
  })
})