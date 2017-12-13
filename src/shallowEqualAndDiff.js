function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  let equal = true;
  const diffAByB = {};
  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i];
    if (!hasOwn.call(objB, keyA) ||
      objA[keyA] !== objB[keyA]) {
      diffAByB[keyA] = objA[keyA]
      equal = false;
    }
  }

  return {
    equal,
    diff: diffAByB
  }
}

module.exports = shallowEqual