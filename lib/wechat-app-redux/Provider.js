'use strict';

var _warning = require('./warning.js');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkStoreShape(store) {
  var missingMethods = ['subscribe', 'dispatch', 'getState'].filter(function (m) {
    return !store.hasOwnProperty(m);
  });

  if (missingMethods.length > 0) {
    (0, _warning2.default)('Store似乎不是一个合法的Redux Store对象: ' + '缺少这些方法: ' + missingMethods.join(', ') + '。');
  }
}

function Provider(store) {
  checkStoreShape(store);
  return function (appConfig) {
    return Object.assign({}, appConfig, { store: store });
  };
}

module.exports = Provider;