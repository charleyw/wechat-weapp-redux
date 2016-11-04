'use strict';

var _shallowEqual = require('./shallowEqual.js');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _warning = require('./warning.js');

var _warning2 = _interopRequireDefault(_warning);

var _wrapActionCreators = require('./wrapActionCreators.js');

var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

var _meld = require('meld');

var _meld2 = _interopRequireDefault(_meld);

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

    var _onLoad = pageConfig.onLoad,
        _onUnload = pageConfig.onUnload;


    function onLoad(options) {
      this.store = app.store;
      if (!this.store) {
        (0, _warning2.default)("Store对象不存在!");
      }
      if (shouldSubscribe) {
        this.unsubscribe = this.store.subscribe(handleChange.bind(this, options));
        handleChange.apply(this);
      }
      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options);
      }
    }

    function onUnload() {
      if (typeof _onUnload === 'function') {
        _onUnload.call(this);
      }
      typeof this.unsubscribe === 'function' && this.unsubscribe();
    }

    var props = mapDispatch(app.store.dispatch);
    for (var p in props) {
      if (pageConfig[p]) _meld2.default.before(pageConfig, p, props[p]);else pageConfig[p] = props[p];
    }
    if (pageConfig.onLoad) _meld2.default.before(pageConfig, 'onLoad', onLoad);else pageConfig.onLoad = onLoad;

    if (pageConfig.onUnload) _meld2.default.before(pageConfig, 'onUnload', onUnload);else pageConfig.onUnload = onUnload;

    return pageConfig;
    //return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {onLoad, onUnload})
  };
}

module.exports = connect;