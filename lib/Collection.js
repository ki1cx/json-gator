

const _isInteger = require('babel-runtime/core-js/number/is-integer');

const _isInteger2 = _interopRequireDefault(_isInteger);

const _defineProperty2 = require('babel-runtime/helpers/defineProperty');

const _defineProperty3 = _interopRequireDefault(_defineProperty2);

const _assign = require('babel-runtime/core-js/object/assign');

const _assign2 = _interopRequireDefault(_assign);

const _getIterator2 = require('babel-runtime/core-js/get-iterator');

const _getIterator3 = _interopRequireDefault(_getIterator2);

const _keys = require('babel-runtime/core-js/object/keys');

const _keys2 = _interopRequireDefault(_keys);

const _typeof2 = require('babel-runtime/helpers/typeof');

const _typeof3 = _interopRequireDefault(_typeof2);

const _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

const _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

const _createClass2 = require('babel-runtime/helpers/createClass');

const _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const resolveOperator = require('./operators');

let _require = require('./helpers'),
  getGroupId = _require.getGroupId,
  getGroup = _require.getGroup,
  getGroupKeys = _require.getGroupKeys;

const isDevelopmentEnv = process.env.NODE_ENV !== 'production';

const Collection = (function () {
  function Collection(data) {
    (0, _classCallCheck3.default)(this, Collection);

    this.data = this.cache = data;
  }

  (0, _createClass3.default)(Collection, [{
    key: 'match',
    value: function match(options) {
      if (typeof options === 'function') {
        this.data = this.data.filter(options);
      } else if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object') {
        const fields = (0, _keys2.default)(options);
        this.data = this.data.reduce((matches, doc) => {
          let _iteratorNormalCompletion = true;
          let _didIteratorError = false;
          let _iteratorError;

          try {
            for (var _iterator = (0, _getIterator3.default)(fields), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const field = _step.value;

              if (doc[field] !== options[field]) return matches;
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

          matches.push(doc);
          return matches;
        }, []);
      } else if (isDevelopmentEnv) {
        throw TypeError('match :: expects an object or a condition function.');
      }
      return this;
    },
  }, {
    key: 'unwind',
    value: function unwind(field) {
      const unwinded = [];
      this.data.forEach((record) => {
        const arrField = record[field];
        if (!arrField || !arrField.length) {
          unwinded.push(record);
          return;
        }
        arrField.forEach((value) => {
          const obj = (0, _assign2.default)({}, record, (0, _defineProperty3.default)({}, field, value));
          unwinded.push(obj);
        });
      });
      this.data = unwinded;
      return this;
    },
  }, {
    key: 'group',
    value: function group(options) {
      // check and extract group id
      let id = void 0;
      if (typeof options === 'string' || Array.isArray(options)) {
        id = options;
      } else if ((0, _keys2.default)(options).indexOf('id') !== -1) {
        id = options.id;
        delete options.id;
      } else {
        if (isDevelopmentEnv) {
          throw Error('group :: an id field is required.');
        }
        return this;
      }

      // there are no group operators defined
      // simply return group ids
      if (typeof options === 'string' || Array.isArray(options) || (0, _keys2.default)(options).length === 0) {
        this.data = this.data.reduce((aggregated, record) => {
          const groupId = getGroupId(id, record);
          return getGroupKeys(groupId, aggregated);
        }, []);
        return this;
      }

      if (typeof id === 'string' || Array.isArray(id)) {
        this.data = this.data.reduce((aggregated, record) => {
          const fields = (0, _keys2.default)(options);
          const groupId = getGroupId(id, record);

          // the record does not belong to a group
          if (typeof groupId === 'undefined') {
            return aggregated;
          }

          const groupObj = getGroup(groupId, aggregated);
          let _iteratorNormalCompletion2 = true;
          let _didIteratorError2 = false;
          let _iteratorError2;

          try {
            for (var _iterator2 = (0, _getIterator3.default)(fields), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              const field = _step2.value;

              groupObj[field] = resolveOperator({
                operatorObj: options[field],
                currentValue: groupObj[field],
                groupId,
                record,
              });
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

          aggregated.push(groupObj);
          return aggregated;
        }, []);

        return this;
      }
    },
  }, {
    key: 'sort',
    value: function sort(criteria) {
      if ((typeof criteria === 'undefined' ? 'undefined' : (0, _typeof3.default)(criteria)) !== 'object' || criteria === null) {
        if (isDevelopmentEnv) throw TypeError('sort :: criteria must be an object.');
        return this;
      }
      let _iteratorNormalCompletion3 = true;
      let _didIteratorError3 = false;
      let _iteratorError3;

      try {
        for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(criteria)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          const field = _step3.value;

          const sortValue = criteria[field];
          if (!(0, _isInteger2.default)(sortValue) || Math.abs(sortValue) !== 1) {
            throw SyntaxError('sort :: criteria need to use either 1 or -1.');
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      const fields = (0, _keys2.default)(criteria);
      function compare(a, b) {
        const i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        const field = fields[i];
        const order = criteria[field];
        if (a[field] < b[field]) {
          return order * -1;
        } if (a[field] > b[field]) {
          return order * 1;
        }
        return compare(a, b, i + 1);
      }
      this.data = this.data.sort(compare);
      return this;
    },
  }, {
    key: 'limit',
    value: function limit(n) {
      this.data = this.data.slice(0, n);
      return this;
    },
  }, {
    key: 'exec',
    value: function exec() {
      const data = this.data;

      this.data = this.cache;
      return data;
    },
  }]);
  return Collection;
}());

module.exports = Collection;
