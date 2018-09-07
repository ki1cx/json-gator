import products from './data';

const jsonAggregate = require('../src/index');

describe('limit', () => {
  test('limit', () => {
    const collection = jsonAggregate.create(JSON.stringify(products));
    expect(
      collection.limit(2).exec(),
    ).toHaveLength(2);
  });
});
