const Collection = require('./Collection');

const isDevelopmentEnv = process.env.NODE_ENV !== 'production';

function create(json) {
  let data;
  try {
    data = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (e) {
    if (isDevelopmentEnv) {
      throw TypeError('Could not parse JSON.');
    }
    return null;
  }
  if (!data.length) data = [data];

  return new Collection(data);
}

module.exports = { create };
