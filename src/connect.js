import stateDiff from './stateDiff.js'
import warning from './warning.js'
import wrapActionCreators from './wrapActionCreators.js'

const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({
  dispatch
})

function connect(mapStateToProps, mapDispatchToProps) {
  const shouldSubscribe = Boolean(mapStateToProps)
  const mapState = mapStateToProps || defaultMapStateToProps
  const app = getApp()

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
      const mappedState = mapState(state, options)
      const {
        __state
      } = this
      const patch = stateDiff(mappedState, __state)
      if (!patch) {
        return
      }
      this.__state = mappedState
      // only pass in updated data to .setData()
      this.setData(patch)
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
      if (shouldSubscribe) {
        this.__state = {}
        this.unsubscribe = this.store.subscribe(() => {
          handleChange.call(this, options)
        })
        handleChange.call(this)
      }
      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options)
      }
    }

    function onUnload() {
      typeof this.unsubscribe === 'function' && this.unsubscribe()
      // should no long receive state changes after .onUnload()
      this.unsubscribe = null
      if (typeof _onUnload === 'function') {
        _onUnload.call(this)
      }
    }

    return Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {
      onLoad,
      onUnload
    })
  }
}

module.exports = connect
