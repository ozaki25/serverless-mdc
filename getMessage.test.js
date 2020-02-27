const getMessage = require('./getMessage');

describe('#getMessage', () => {
  test('ozakiを渡すとHello ozaki!が返ること', () => {
    const expected = 'Hello ozaki!';
    const result = getMessage('ozaki');
    expect(result).toBe(expected);
  });
});
