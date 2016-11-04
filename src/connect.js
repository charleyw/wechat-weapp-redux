import shallowEqual from './shallowEqual.js'
import warning from './warning.js'
import wrapActionCreators from './wrapActionCreators.js'
import meld from 'meld';

const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({dispatch})

function connect(mapStateToProps, mapDispatchToProps) {
  const shouldSubscribe = Boolean(mapStateToProps)
  const mapState = mapStateToProps || defaultMapStateToProps
  const app = getApp();

  let mapDispatch
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps)
  }

  return function wrapWithConnect(pageConfig) {

    function handleChange(options) {
      if (!this.unsubscribe) {
        return
      }

      const state = this.store.getState()
      const mappedState = mapState(state, options);
      if (!this.data || shallowEqual(this.data, mappedState)) {
        return;
      }
      this.setData(mappedState)
    }

    const {
      onLoad: _onLoad,
      onUnload: _onUnload,
    } = pageConfig

    function onLoad(options) {
      this.store = app.store;
      if (!this.store) {
        warning("Store对象不存在!")
      }
      if(shouldSubscribe){
        this.unsubscribe = this.store.subscribe(handleChange.bind(this, options))
        handleChange.apply(this)
      }
      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options)
      }
    }

    function onUnload() {
      if (typeof _onUnload === 'function') {
        _onUnload.call(this)
      }
      typeof this.unsubscribe === 'function' && this.unsubscribe()
    }

    let props=mapDispatch(app.store.dispatch);
    for (let p in props) {
      if (pageConfig[p]) meld.before(pageConfig, p, props[p]);
      else pageConfig[p]=props[p];
    }
    if (pageConfig.onLoad) meld.before(pageConfig, 'onLoad', onLoad);
    else pageConfig.onLoad=onLoad;

    if (pageConfig.onUnload) meld.before(pageConfig, 'onUnload', onUnload);
    else pageConfig.onUnload=onUnload

    return pageConfig;
    //return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {onLoad, onUnload})
  }
}

module.exports = connect