

const _typeof2 = require('babel-runtime/helpers/typeof');

const _typeof3 = _interopRequireDefault(_typeof2);

const _getIterator2 = require('babel-runtime/core-js/get-iterator');

const _getIterator3 = _interopRequireDefault(_getIterator2);

const _keys = require('babel-runtime/core-js/object/keys');

const _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deepEqual = require('deep-equal');

function getGroupId(id, obj) {
  if (typeof id === 'string') {
    const candidateId = obj[id];
    if (!(typeof candidateId === 'string' || typeof candidateId === 'number')) {
      throw TypeError('Only types "string" and "number" are supported for group ids.');
    }
    return candidateId;
  } if (Array.isArray(id)) {
    return id.reduce((aggregated, key) => {
      aggregated[key] = obj[key];
      return aggregated;
    }, {});
  }
}

function getGroup(groupId, aggregated) {
  let idx = void 0;
  if ((0, _keys2.default)(groupId).length) {
    idx = aggregated.findIndex((item) => {
      let _iteratorNormalCompletion = true;
      let _didIteratorError = false;
      let _iteratorError;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(item.id)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const field = _step.value;

          if (groupId[field] !== item.id[field]) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    });
  } else if (typeof groupId === 'string') {
    idx = aggregated.findIndex(item => item.id === groupId);
  }
  const groupObj = idx === -1 ? { id: groupId } : aggregated.splice(idx, 1)[0];
  return groupObj;
}

function getGroupKeys(groupId, aggregated) {
  if (typeof groupId === 'string') {
    if (aggregated.indexOf(groupId) === -1) {
      aggregated.push(groupId);
    }
  } else if ((typeof groupId === 'undefined' ? 'undefined' : (0, _typeof3.default)(groupId)) === 'object') {
    let exists = false;
    let _iteratorNormalCompletion2 = true;
    let _didIteratorError2 = false;
    let _iteratorError2;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(aggregated), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const record = _step2.value;

        if (deepEqual(groupId, record.id)) {
          exists = true;
          break;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (!aggregated.length || !exists) {
      aggregated.push({ id: groupId });
    }
  }
  return aggregated;
}

module.exports = {
  getGroupId,
  getGroup,
  getGroupKeys,
};
