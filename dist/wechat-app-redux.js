(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WeAppRedux"] = factory();
	else
		root["WeAppRedux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Provider = __webpack_require__(3);

	var _Provider2 = _interopRequireDefault(_Provider);

	var _connect = __webpack_require__(4);

	var _connect2 = _interopRequireDefault(_connect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  Provider: _Provider2.default,
	  connect: _connect2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

	module.exports = warning;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @license MIT License (c) copyright 2011-2013 original author or authors */

	/**
	 * meld
	 * Aspect Oriented Programming for Javascript
	 *
	 * meld is part of the cujo.js family of libraries (http://cujojs.com/)
	 *
	 * Licensed under the MIT License at:
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * @author Brian Cavalier
	 * @author John Hann
	 * @version 1.3.1
	 */
	(function (define) {
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

		//
		// Public API
		//

		// Add a single, specific type of advice
		// returns a function that will remove the newly-added advice
		meld.before =         adviceApi('before');
		meld.around =         adviceApi('around');
		meld.on =             adviceApi('on');
		meld.afterReturning = adviceApi('afterReturning');
		meld.afterThrowing =  adviceApi('afterThrowing');
		meld.after =          adviceApi('after');

		// Access to the current joinpoint in advices
		meld.joinpoint =      joinpoint;

		// DEPRECATED: meld.add(). Use meld() instead
		// Returns a function that will remove the newly-added aspect
		meld.add =            function() { return meld.apply(null, arguments); };

		/**
		 * Add an aspect to all matching methods of target, or to target itself if
		 * target is a function and no pointcut is provided.
		 * @param {object|function} target
		 * @param {string|array|RegExp|function} [pointcut]
		 * @param {object} aspect
		 * @param {function?} aspect.before
		 * @param {function?} aspect.on
		 * @param {function?} aspect.around
		 * @param {function?} aspect.afterReturning
		 * @param {function?} aspect.afterThrowing
		 * @param {function?} aspect.after
		 * @returns {{ remove: function }|function} if target is an object, returns a
		 *  remover { remove: function } whose remove method will remove the added
		 *  aspect. If target is a function, returns the newly advised function.
		 */
		function meld(target, pointcut, aspect) {
			var pointcutType, remove;

			if(arguments.length < 3) {
				return addAspectToFunction(target, pointcut);
			} else {
				if (isArray(pointcut)) {
					remove = addAspectToAll(target, pointcut, aspect);
				} else {
					pointcutType = typeof pointcut;

					if (pointcutType === 'string') {
						if (typeof target[pointcut] === 'function') {
							remove = addAspectToMethod(target, pointcut, aspect);
						}

					} else if (pointcutType === 'function') {
						remove = addAspectToAll(target, pointcut(target), aspect);

					} else {
						remove = addAspectToMatches(target, pointcut, aspect);
					}
				}

				return remove;
			}

		}

		function Advisor(target, func) {

			var orig, advisor, advised;

			this.target = target;
			this.func = func;
			this.aspects = {};

			orig = this.orig = target[func];
			advisor = this;

			advised = this.advised = function() {
				var context, joinpoint, args, callOrig, afterType;

				// If called as a constructor (i.e. using "new"), create a context
				// of the correct type, so that all advice types (including before!)
				// are called with the correct context.
				if(this instanceof advised) {
					// shamelessly derived from https://github.com/cujojs/wire/blob/c7c55fe50238ecb4afbb35f902058ab6b32beb8f/lib/component.js#L25
					context = objectCreate(orig.prototype);
					callOrig = function (args) {
						return applyConstructor(orig, context, args);
					};

				} else {
					context = this;
					callOrig = function(args) {
						return orig.apply(context, args);
					};

				}

				args = slice.call(arguments);
				afterType = 'afterReturning';

				// Save the previous joinpoint and set the current joinpoint
				joinpoint = pushJoinpoint({
					target: context,
					method: func,
					args: args
				});

				try {
					advisor._callSimpleAdvice('before', context, args);

					try {
						joinpoint.result = advisor._callAroundAdvice(context, func, args, callOrigAndOn);
					} catch(e) {
						joinpoint.result = joinpoint.exception = e;
						// Switch to afterThrowing
						afterType = 'afterThrowing';
					}

					args = [joinpoint.result];

					callAfter(afterType, args);
					callAfter('after', args);

					if(joinpoint.exception) {
						throw joinpoint.exception;
					}

					return joinpoint.result;

				} finally {
					// Restore the previous joinpoint, if necessary.
					popJoinpoint();
				}

				function callOrigAndOn(args) {
					var result = callOrig(args);
					advisor._callSimpleAdvice('on', context, args);

					return result;
				}

				function callAfter(afterType, args) {
					advisor._callSimpleAdvice(afterType, context, args);
				}
			};

			defineProperty(advised, '_advisor', { value: advisor, configurable: true });
		}

		Advisor.prototype = {

			/**
			 * Invoke all advice functions in the supplied context, with the supplied args
			 *
			 * @param adviceType
			 * @param context
			 * @param args
			 */
			_callSimpleAdvice: function(adviceType, context, args) {

				// before advice runs LIFO, from most-recently added to least-recently added.
				// All other advice is FIFO
				var iterator, advices;

				advices = this.aspects[adviceType];
				if(!advices) {
					return;
				}

				iterator = iterators[adviceType];

				iterator(this.aspects[adviceType], function(aspect) {
					var advice = aspect.advice;
					advice && advice.apply(context, args);
				});
			},

			/**
			 * Invoke all around advice and then the original method
			 *
			 * @param context
			 * @param method
			 * @param args
			 * @param applyOriginal
			 */
			_callAroundAdvice: function (context, method, args, applyOriginal) {
				var len, aspects;

				aspects = this.aspects.around;
				len = aspects ? aspects.length : 0;

				/**
				 * Call the next function in the around chain, which will either be another around
				 * advice, or the orig method.
				 * @param i {Number} index of the around advice
				 * @param args {Array} arguments with with to call the next around advice
				 */
				function callNext(i, args) {
					// If we exhausted all aspects, finally call the original
					// Otherwise, if we found another around, call it
					return i < 0
						? applyOriginal(args)
						: callAround(aspects[i].advice, i, args);
				}

				function callAround(around, i, args) {
					var proceedCalled, joinpoint;

					proceedCalled = 0;

					// Joinpoint is immutable
					// TODO: Use Object.freeze once v8 perf problem is fixed
					joinpoint = pushJoinpoint({
						target: context,
						method: method,
						args: args,
						proceed: proceedCall,
						proceedApply: proceedApply,
						proceedCount: proceedCount
					});

					try {
						// Call supplied around advice function
						return around.call(context, joinpoint);
					} finally {
						popJoinpoint();
					}

					/**
					 * The number of times proceed() has been called
					 * @return {Number}
					 */
					function proceedCount() {
						return proceedCalled;
					}

					/**
					 * Proceed to the original method/function or the next around
					 * advice using original arguments or new argument list if
					 * arguments.length > 0
					 * @return {*} result of original method/function or next around advice
					 */
					function proceedCall(/* newArg1, newArg2... */) {
						return proceed(arguments.length > 0 ? slice.call(arguments) : args);
					}

					/**
					 * Proceed to the original method/function or the next around
					 * advice using original arguments or new argument list if
					 * newArgs is supplied
					 * @param [newArgs] {Array} new arguments with which to proceed
					 * @return {*} result of original method/function or next around advice
					 */
					function proceedApply(newArgs) {
						return proceed(newArgs || args);
					}

					/**
					 * Create proceed function that calls the next around advice, or
					 * the original.  May be called multiple times, for example, in retry
					 * scenarios
					 * @param [args] {Array} optional arguments to use instead of the
					 * original arguments
					 */
					function proceed(args) {
						proceedCalled++;
						return callNext(i - 1, args);
					}

				}

				return callNext(len - 1, args);
			},

			/**
			 * Adds the supplied aspect to the advised target method
			 *
			 * @param aspect
			 */
			add: function(aspect) {

				var advisor, aspects;

				advisor = this;
				aspects = advisor.aspects;

				insertAspect(aspects, aspect);

				return {
					remove: function () {
						var remaining = removeAspect(aspects, aspect);

						// If there are no aspects left, restore the original method
						if (!remaining) {
							advisor.remove();
						}
					}
				};
			},

			/**
			 * Removes the Advisor and thus, all aspects from the advised target method, and
			 * restores the original target method, copying back all properties that may have
			 * been added or updated on the advised function.
			 */
			remove: function () {
				delete this.advised._advisor;
				this.target[this.func] = this.orig;
			}
		};

		/**
		 * Returns the advisor for the target object-function pair.  A new advisor
		 * will be created if one does not already exist.
		 * @param target {*} target containing a method with the supplied methodName
		 * @param methodName {String} name of method on target for which to get an advisor
		 * @return {Object|undefined} existing or newly created advisor for the supplied method
		 */
		Advisor.get = function(target, methodName) {
			if(!(methodName in target)) {
				return;
			}

			var advisor, advised;

			advised = target[methodName];

			if(typeof advised !== 'function') {
				throw new Error('Advice can only be applied to functions: ' + methodName);
			}

			advisor = advised._advisor;
			if(!advisor) {
				advisor = new Advisor(target, methodName);
				target[methodName] = advisor.advised;
			}

			return advisor;
		};

		/**
		 * Add an aspect to a pure function, returning an advised version of it.
		 * NOTE: *only the returned function* is advised.  The original (input) function
		 * is not modified in any way.
		 * @param func {Function} function to advise
		 * @param aspect {Object} aspect to add
		 * @return {Function} advised function
		 */
		function addAspectToFunction(func, aspect) {
			var name, placeholderTarget;

			name = func.name || '_';

			placeholderTarget = {};
			placeholderTarget[name] = func;

			addAspectToMethod(placeholderTarget, name, aspect);

			return placeholderTarget[name];

		}

		function addAspectToMethod(target, method, aspect) {
			var advisor = Advisor.get(target, method);

			return advisor && advisor.add(aspect);
		}

		function addAspectToAll(target, methodArray, aspect) {
			var removers, added, f, i;

			removers = [];
			i = 0;

			while((f = methodArray[i++])) {
				added = addAspectToMethod(target, f, aspect);
				added && removers.push(added);
			}

			return createRemover(removers);
		}

		function addAspectToMatches(target, pointcut, aspect) {
			var removers = [];
			// Assume the pointcut is a an object with a .test() method
			for (var p in target) {
				// TODO: Decide whether hasOwnProperty is correct here
				// Only apply to own properties that are functions, and match the pointcut regexp
				if (typeof target[p] == 'function' && pointcut.test(p)) {
					// if(object.hasOwnProperty(p) && typeof object[p] === 'function' && pointcut.test(p)) {
					removers.push(addAspectToMethod(target, p, aspect));
				}
			}

			return createRemover(removers);
		}

		function createRemover(removers) {
			return {
				remove: function() {
					for (var i = removers.length - 1; i >= 0; --i) {
						removers[i].remove();
					}
				}
			};
		}

		// Create an API function for the specified advice type
		function adviceApi(type) {
			return function(target, method, adviceFunc) {
				var aspect = {};

				if(arguments.length === 2) {
					aspect[type] = method;
					return meld(target, aspect);
				} else {
					aspect[type] = adviceFunc;
					return meld(target, method, aspect);
				}
			};
		}

		/**
		 * Insert the supplied aspect into aspectList
		 * @param aspectList {Object} list of aspects, categorized by advice type
		 * @param aspect {Object} aspect containing one or more supported advice types
		 */
		function insertAspect(aspectList, aspect) {
			var adviceType, advice, advices;

			for(adviceType in iterators) {
				advice = aspect[adviceType];

				if(advice) {
					advices = aspectList[adviceType];
					if(!advices) {
						aspectList[adviceType] = advices = [];
					}

					advices.push({
						aspect: aspect,
						advice: advice
					});
				}
			}
		}

		/**
		 * Remove the supplied aspect from aspectList
		 * @param aspectList {Object} list of aspects, categorized by advice type
		 * @param aspect {Object} aspect containing one or more supported advice types
		 * @return {Number} Number of *advices* left on the advised function.  If
		 *  this returns zero, then it is safe to remove the advisor completely.
		 */
		function removeAspect(aspectList, aspect) {
			var adviceType, advices, remaining;

			remaining = 0;

			for(adviceType in iterators) {
				advices = aspectList[adviceType];
				if(advices) {
					remaining += advices.length;

					for (var i = advices.length - 1; i >= 0; --i) {
						if (advices[i].aspect === aspect) {
							advices.splice(i, 1);
							--remaining;
							break;
						}
					}
				}
			}

			return remaining;
		}

		function applyConstructor(C, instance, args) {
			try {
				// Try to define a constructor, but don't care if it fails
				defineProperty(instance, 'constructor', {
					value: C,
					enumerable: false
				});
			} catch(e) {
				// ignore
			}

			C.apply(instance, args);

			return instance;
		}

		var currentJoinpoint, joinpointStack,
			ap, prepend, append, iterators, slice, isArray, defineProperty, objectCreate;

		// TOOD: Freeze joinpoints when v8 perf problems are resolved
	//	freeze = Object.freeze || function (o) { return o; };

		joinpointStack = [];

		ap      = Array.prototype;
		prepend = ap.unshift;
		append  = ap.push;
		slice   = ap.slice;

		isArray = Array.isArray || function(it) {
			return Object.prototype.toString.call(it) == '[object Array]';
		};

		// Check for a *working* Object.defineProperty, fallback to
		// simple assignment.
		defineProperty = definePropertyWorks()
			? Object.defineProperty
			: function(obj, prop, descriptor) {
			obj[prop] = descriptor.value;
		};

		objectCreate = Object.create ||
			(function() {
				function F() {}
				return function(proto) {
					F.prototype = proto;
					var instance = new F();
					F.prototype = null;
					return instance;
				};
			}());

		iterators = {
			// Before uses reverse iteration
			before: forEachReverse,
			around: false
		};

		// All other advice types use forward iteration
		// Around is a special case that uses recursion rather than
		// iteration.  See Advisor._callAroundAdvice
		iterators.on
			= iterators.afterReturning
			= iterators.afterThrowing
			= iterators.after
			= forEach;

		function forEach(array, func) {
			for (var i = 0, len = array.length; i < len; i++) {
				func(array[i]);
			}
		}

		function forEachReverse(array, func) {
			for (var i = array.length - 1; i >= 0; --i) {
				func(array[i]);
			}
		}

		function joinpoint() {
			return currentJoinpoint;
		}

		function pushJoinpoint(newJoinpoint) {
			joinpointStack.push(currentJoinpoint);
			return currentJoinpoint = newJoinpoint;
		}

		function popJoinpoint() {
			return currentJoinpoint = joinpointStack.pop();
		}

		function definePropertyWorks() {
			try {
				return 'x' in Object.defineProperty({}, 'x', {});
			} catch (e) { /* return falsey */ }
		}

		return meld;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(__webpack_require__(7)
	);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _warning = __webpack_require__(1);

	var _warning2 = _interopRequireDefault(_warning);

	var _meld = __webpack_require__(2);

	var _meld2 = _interopRequireDefault(_meld);

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
	    appConfig.store = store;
	    return appConfig;
	    //return Object.assign({}, appConfig, {store})
	  };
	}

	module.exports = Provider;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _shallowEqual = __webpack_require__(5);

	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

	var _warning = __webpack_require__(1);

	var _warning2 = _interopRequireDefault(_warning);

	var _wrapActionCreators = __webpack_require__(6);

	var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

	var _meld = __webpack_require__(2);

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var hasOwn = Object.prototype.hasOwnProperty;
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if ((typeof actionCreators === 'undefined' ? 'undefined' : _typeof(actionCreators)) !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators === 'undefined' ? 'undefined' : _typeof(actionCreators)) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

	function wrapActionCreators(actionCreators) {
	  return function (dispatch) {
	    return bindActionCreators(actionCreators, dispatch);
	  };
	}

	module.exports = wrapActionCreators;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }
/******/ ])
});
;