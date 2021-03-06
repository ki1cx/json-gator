const isDevelopmentEnv = process.env.NODE_ENV !== 'production';

const round = (number, places) => +(`${Math.round(`${number}e+${places}`)}e-${places}`);

const $avg = (function () {
  return function (target, record, currentValue, groupId, cache) {
    const cacheId = JSON.stringify(`${groupId}-${target}`);
    if (typeof target !== 'string') {
      return currentValue;
    }
    const value = record[target];
    if (typeof value !== 'number') {
      return currentValue;
    }
    if (!cache[cacheId]) {
      cache[cacheId] = [1, value];
      return value;
    }
    const [n, avg] = cache[cacheId];
    const newValue = round(((n * avg) + value) / (n + 1), 10);
    cache[cacheId] = [n + 1, newValue];
    return newValue;
  };
}());

function $first(target, record, currentValue) {
  if (currentValue) return currentValue;
  const value = record[target];
  if (typeof value === 'undefined') {
    return currentValue;
  }
  return value;
}

const $last = (target, record) => record[target];

const $max = generateMinMax('max');

const $min = generateMinMax('min');

function $sum(target, record, currentValue) {
  currentValue = typeof currentValue === 'number' ? currentValue : 0;
  if (target === 1) {
    return currentValue + 1;
  } if (typeof target === 'string') {
    const value = record[target];
    if (typeof value !== 'number') {
      return currentValue;
    }
    return currentValue + value;
  }
  if (isDevelopmentEnv) throw new SyntaxError('Invalid target.');
  return null;
}

function $push(arr, record, currentValue) {
  if (!arr.length) {
    if (isDevelopmentEnv) {
      throw new TypeError('$push expects an array of fields (string).');
    }
    return null;
  }
  const value = arr.reduce((newRecord, field) => {
    newRecord[field] = record[field];
    return newRecord;
  }, {});
  if (currentValue) {
    currentValue.push(value);
    return currentValue;
  }
  return [value];
}

function $addToSet(target, record, currentValue) {
  if (typeof target !== 'string') {
    if (isDevelopmentEnv) throw TypeError('$addToSet expects a field (string).');
    return null;
  }
  const value = record[target];
  if (currentValue) {
    if (currentValue.indexOf(value) === -1) {
      currentValue.push(value);
    }
    return currentValue;
  }
  return [value];
}

/*
 * TODO
 * function $ranges () {} // $bucket
*/

// min-max helper
function generateMinMax(op) {
  return function (target, record, currentValue) {
    if (typeof target !== 'string') {
      return currentValue;
    }
    const value = record[target];
    if (typeof value !== 'number') {
      return currentValue;
    }
    const condition = op === 'min' ? currentValue < value : currentValue > value;
    return condition ? currentValue : value;
  };
}

const operators = {
  $avg,
  $first,
  $last,
  $max,
  $min,
  $sum,
  $push,
  $addToSet,
};

function resolveOperator(options) {
  const { operatorObj, record, currentValue, groupId, cache } = options;
  if (typeof operatorObj !== 'object') {
    if (isDevelopmentEnv) throw TypeError('Expected a value/key pair.');
    return null;
  }
  const operatorObjKeys = Object.keys(operatorObj);
  if (operatorObjKeys.length > 1) {
    if (isDevelopmentEnv) throw SyntaxError('Only 1 operator per field is supported.');
    return null;
  }
  const operator = operatorObjKeys[0];
  const target = operatorObj[operator];
  if (Object.keys(operators).indexOf(operator) === -1) {
    if (isDevelopmentEnv) throw SyntaxError('Invalid operator.');
    return null;
  }

  return operators[operator](target, record, currentValue, groupId, cache);
}

module.exports = resolveOperator;
