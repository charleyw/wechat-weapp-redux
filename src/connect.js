const shallowEqual = require('../utils/shallowEqual.js')
const warning = require('../utils/warning.js')
const wrapActionCreators = require('../utils/wrapActionCreators.js')

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

    function onLoad(options) {
      this.store = app.store;
      if (!this.store) {
        warning("Store对象不存在!")
      }
      if(shouldSubscribe){
        this.unsubscribe = this.store.subscribe(handleChange.bind(this, options))
        handleChange.apply(this)
      }
    }

    function onUnload() {
      typeof this.unsubscribe === 'function' && this.unsubscribe()
    }

    return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {onLoad, onUnload})
  }
}

module.exports = connect