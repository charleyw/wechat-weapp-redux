function shallowEqualAndDiff(objA = {}, objB = {}) {
  const diffAByB = {};

  if (objA === objB) {
    return {
      equal: true,
      diff: diffAByB
    }
  }

  const keysA = Object.keys(objA)

  let equal = true;
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

module.exports = shallowEqualAndDiff