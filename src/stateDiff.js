const hasOwn = Object.prototype.hasOwnProperty

function stateDiff(nextState, state) {
  if (nextState === state) {
    return null
  }

  const patch = {}

  const keys = Object.keys(nextState)
  const length = keys.length
  let hasChanged = false
  for (let i = 0; i < length; ++i) {
    const key = keys[i]
    const val = nextState[key]
    if (!hasOwn.call(state, key) || val !== state[key]) {
      patch[key] = val
      hasChanged = true
    }
  }

  if (!hasChanged) {
    return null
  }

  return patch
}

module.exports = stateDiff
