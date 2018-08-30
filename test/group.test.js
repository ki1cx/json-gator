const jsonAggregate = require('../src/index');
const { products } = require('./data');

describe('group', () => {
  const collection = jsonAggregate.create(JSON.stringify(products));
  test('simple group', () => {
    expect(
      collection
        .group('company')
        .exec(),
    ).toEqual(['a', 'b']);
  });

  test('group with id', () => {
    expect(
      collection
        .group({ id: 'company' })
        .exec(),
    ).toEqual(['a', 'b']);
  });

  test('group with $sum (number)', () => {
    expect(
      collection
        .group({
          id: 'company',
          count: { $sum: 1 },
        })
        .exec(),
    ).toEqual([
      { id: 'a', count: 4 },
      { id: 'b', count: 4 },
    ]);
  });

  test('group with $sum (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          count: { $sum: 'employeeCount' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', count: 180 },
      { id: 'b', count: 120 },
    ]);
  });

  test('group with $sum float(property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          count: { $sum: 'price' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', count: 400.5 },
      { id: 'b', count: 331.22 },
    ]);
  });

  test('group with $avg (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          employeeCount: { $avg: 'employeeCount' },
          price: { $avg: 'price' },
        })
        .exec(),
    ).toEqual([
      {
        employeeCount: 45,
        id: 'a',
        price: 100.125,
      },
      {
        employeeCount: 30,
        id: 'b',
        price: 82.805,
      },
    ]);
  });

  test('group with $first (property', () => {
    expect(
      collection
        .group({
          id: 'company',
          product: { $first: 'product' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', product: 'Product A' },
      { id: 'b', product: 'Product A' },
    ]);
  });

  test('group with $last (property', () => {
    expect(
      collection
        .group({
          id: 'company',
          product: { $last: 'product' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', product: 'Product D' },
      { id: 'b', product: 'Product D' },
    ]);
  });

  test('group with $max (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          highestPrice: { $max: 'price' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', highestPrice: 120 },
      { id: 'b', highestPrice: 130 },
    ]);
  });

  test('group with $min (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          lowestPrice: { $min: 'price' },
        })
        .exec(),
    ).toEqual([
      { id: 'a', lowestPrice: 80 },
      { id: 'b', lowestPrice: 40 },
    ]);
  });

  test('group with $push (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          products: { $push: ['product', 'price'] },
        })
        .exec(),
    ).toEqual([
      {
        id: 'a',
        products: [
          { product: 'Product A', price: 120 },
          { product: 'Product B', price: 80 },
          { product: 'Product C', price: 105.1 },
          { product: 'Product D', price: 95.4 },
        ],
      },
      {
        id: 'b',
        products: [
          { product: 'Product A', price: 40 },
          { product: 'Product B', price: 100.99 },
          { product: 'Product C', price: 60.23 },
          { product: 'Product D', price: 130 },
        ],
      },
    ]);
  });

  test('group with $push non-array', () => {
    function testPushFail() {
      return collection
        .group({
          id: 'company',
          products: { $push: { a: 1, b: 2 } },
        })
        .exec();
    }
    expect(testPushFail).toThrowError(TypeError);
  });

  test('group with $addToSet (property)', () => {
    expect(
      collection
        .group({
          id: 'company',
          categories: { $addToSet: 'category' },
        })
        .exec(),
    ).toEqual([
      {
        id: 'a',
        categories: [1, 2],
      },
      {
        id: 'b',
        categories: [1, 2],
      },
    ]);
  });

  test('group with multiple keys (array)', () => {
    expect(
      collection
        .group(['company', 'category'])
        .exec(),
    ).toEqual([{ id: { company: 'a', category: 1 } }, { id: { company: 'a', category: 2 } }, { id: { company: 'b', category: 1 } }, { id: { company: 'b', category: 2 } }]);
  });

  test('group with multiple keys (object)', () => {
    expect(
      collection
        .group({ id: ['company', 'category'] })
        .exec(),
    ).toEqual([{ id: { company: 'a', category: 1 } }, { id: { company: 'a', category: 2 } }, { id: { company: 'b', category: 1 } }, { id: { company: 'b', category: 2 } }]);
  });

  test('group with multiple keys ($avg)', () => {
    expect(
      collection
        .group({
          id: ['company', 'category'],
          avg: { $avg: 'price' },
        })
        .exec(),
    ).toEqual([
      {
        avg: 100,
        id: {
          category: 1,
          company: 'a',
        },
      },
      {
        avg: 100.125,
        id: {
          category: 2,
          company: 'a',
        },
      },
      {
        avg: 90.2483333333,
        id: {
          category: 1,
          company: 'b',
        },
      },
      {
        avg: 91.465,
        id: {
          category: 2,
          company: 'b',
        },
      },
    ]);
  });

  test('group with multiple keys ($max)', () => {
    expect(
      collection
        .group({
          id: ['company', 'category'],
          max: { $max: 'price' },
        })
        .exec(),
    ).toEqual([{
      id: { company: 'a', category: 1 },
      max: 120,
    }, {
      id: { company: 'a', category: 2 },
      max: 105.1,
    }, {
      id: { company: 'b', category: 1 },
      max: 100.99,
    }, {
      id: { company: 'b', category: 2 },
      max: 130,
    }]);
  });
});
