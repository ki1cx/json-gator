import products from './data';

const jsonAggregate = require('../src/index');

describe('match', () => {
  const collection = jsonAggregate.create(JSON.stringify(products));

  test('text value', () => {
    expect(
      collection
        .match({ product: 'Product A' })
        .exec(),
    ).toEqual([
      {
        company: 'a',
        employeeCount: 45,
        category: 1,
        product: 'Product A',
        price: 120,
      },
      {
        company: 'b',
        employeeCount: 30,
        category: 1,
        product: 'Product A',
        price: 40,
      },
    ]);
  });

  test('with condition', () => {
    expect(
      collection
        .match(doc => doc.price > 100)
        .exec(),
    ).toEqual([{
      company: 'a',
      employeeCount: 45,
      category: 1,
      product: 'Product A',
      price: 120,
    }, {
      company: 'a',
      employeeCount: 45,
      category: 2,
      product: 'Product C',
      price: 105.1,
    }, {
      company: 'b',
      employeeCount: 30,
      category: 1,
      product: 'Product B',
      price: 100.99,
    }, {
      company: 'b',
      employeeCount: 30,
      category: 2,
      product: 'Product D',
      price: 130,
    }]);
  });

  test('text value', () => {
    function wrongMatch() {
      collection
        .match(123)
        .exec();
    }
    expect(wrongMatch).toThrowError(TypeError);
  });
});
