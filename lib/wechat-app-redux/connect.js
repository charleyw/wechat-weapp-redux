'use strict';

var _shallowEqual = require('./shallowEqual.js');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _warning = require('./warning.js');

var _warning2 = _interopRequireDefault(_warning);

var _wrapActionCreators = require('./wrapActionCreators.js');

var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
  return {};
}; // eslint-disable-line no-unused-vars
var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
  return { dispatch: dispatch };
};

function connect(mapStateToProps, mapDispatchToProps) {
  var shouldSubscribe = Boolean(mapStateToProps);
  var mapState = mapStateToProps || defaultMapStateToProps;
  var app = getApp();

  var mapDispatch = void 0;
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = (0, _wrapActionCreators2.default)(mapDispatchToProps);
  }

  return function wrapWithConnect(pageConfig) {

    function handleChange(options) {
      if (!this.unsubscribe) {
        return;
      }

      var state = this.store.getState();
      var mappedState = mapState(state, options);
      if (!this.data || (0, _shallowEqual2.default)(this.data, mappedState)) {
        return;
      }
      this.setData(mappedState);
    }

    function onLoad(options) {
      this.store = app.store;
      if (!this.store) {
        (0, _warning2.default)("Store对象不存在!");
      }
      if (shouldSubscribe) {
        this.unsubscribe = this.store.subscribe(handleChange.bind(this, options));
        handleChange.apply(this);
      }
    }

    function onUnload() {
      typeof this.unsubscribe === 'function' && this.unsubscribe();
    }

    return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), { onLoad: onLoad, onUnload: onUnload });
  };
}

module.exports = connect;