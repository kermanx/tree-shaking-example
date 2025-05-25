var react = { exports: {} }, react_production = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production) return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    return maybeIterable === null || typeof maybeIterable != "object" ? null : (maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"], typeof maybeIterable == "function" ? maybeIterable : null);
  }
  var ReactNoopUpdateQueue = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, assign = Object.assign, emptyObject = {};
  function Component(props, context, updater) {
    this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {}, Component.prototype.setState = function(partialState, callback) {
    if (typeof partialState != "object" && typeof partialState != "function" && partialState != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  }, Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent, assign(pureComponentPrototype, Component.prototype), pureComponentPrototype.isPureReactComponent = !0;
  var isArrayImpl = Array.isArray, ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, self, source, owner, props) {
    return self = props.ref, {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: self !== void 0 ? self : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(
      oldElement.type,
      newKey,
      void 0,
      void 0,
      void 0,
      oldElement.props
    );
  }
  function isValidElement(object) {
    return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return typeof element == "object" && element !== null && element.key != null ? escape("" + element.key) : index.toString(36);
  }
  function noop$1() {
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch (typeof thenable.status == "string" ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            thenable.status === "pending" && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            thenable.status === "pending" && (thenable.status = "rejected", thenable.reason = error);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    (type === "undefined" || type === "boolean") && (children = null);
    var invokeCallback = !1;
    if (children === null) invokeCallback = !0;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = !0;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = !0;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = nameSoFar === "" ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", invokeCallback != null && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : callback != null && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (callback.key == null || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = nameSoFar === "" ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), typeof i == "function")
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (type === "object") {
      if (typeof children.then == "function")
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      throw array = String(children), Error(
        "Objects are not valid as a React child (found: " + (array === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (children == null) return children;
    var result = [], count = 0;
    return mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    }), result;
  }
  function lazyInitializer(payload) {
    if (payload._status === -1) {
      var ctor = payload._result;
      ctor = ctor(), ctor.then(
        function(moduleObject) {
          (payload._status === 0 || payload._status === -1) && (payload._status = 1, payload._result = moduleObject);
        },
        function(error) {
          (payload._status === 0 || payload._status === -1) && (payload._status = 2, payload._result = error);
        }
      ), payload._status === -1 && (payload._status = 0, payload._result = ctor);
    }
    if (payload._status === 1) return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError = typeof reportError == "function" ? reportError : function(error) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var event = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof error == "object" && error !== null && typeof error.message == "string" ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  };
  function noop() {
  }
  return react_production.Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      return mapChildren(children, function() {
        n++;
      }), n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return children;
    }
  }, react_production.Component = Component, react_production.Fragment = REACT_FRAGMENT_TYPE, react_production.Profiler = REACT_PROFILER_TYPE, react_production.PureComponent = PureComponent, react_production.StrictMode = REACT_STRICT_MODE_TYPE, react_production.Suspense = REACT_SUSPENSE_TYPE, react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals, react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
      return ReactSharedInternals.H.useMemoCache(size);
    }
  }, react_production.cache = function(fn) {
    return function() {
      return fn.apply(null, arguments);
    };
  }, react_production.cloneElement = function(element, config, children) {
    if (element == null)
      throw Error(
        "The argument must be a React element, but you passed " + element + "."
      );
    var props = assign({}, element.props), key = element.key, owner = void 0;
    if (config != null)
      for (propName in config.ref !== void 0 && (owner = void 0), config.key !== void 0 && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || propName === "key" || propName === "__self" || propName === "__source" || propName === "ref" && config.ref === void 0 || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (propName === 1) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, void 0, void 0, owner, props);
  }, react_production.createContext = function(defaultValue) {
    return defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, defaultValue.Provider = defaultValue, defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue
    }, defaultValue;
  }, react_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (config != null)
      for (propName in config.key !== void 0 && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && propName !== "key" && propName !== "__self" && propName !== "__source" && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        props[propName] === void 0 && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, void 0, void 0, null, props);
  }, react_production.createRef = function() {
    return { current: null };
  }, react_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  }, react_production.isValidElement = isValidElement, react_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  }, react_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: compare === void 0 ? null : compare
    };
  }, react_production.startTransition = function(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
      onStartTransitionFinish !== null && onStartTransitionFinish(currentTransition, returnValue), typeof returnValue == "object" && returnValue !== null && typeof returnValue.then == "function" && returnValue.then(noop, reportGlobalError);
    } catch (error) {
      reportGlobalError(error);
    } finally {
      ReactSharedInternals.T = prevTransition;
    }
  }, react_production.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
  }, react_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  }, react_production.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  }, react_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  }, react_production.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
  }, react_production.useDebugValue = function() {
  }, react_production.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  }, react_production.useEffect = function(create, createDeps, update) {
    var dispatcher = ReactSharedInternals.H;
    if (typeof update == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return dispatcher.useEffect(create, createDeps);
  }, react_production.useId = function() {
    return ReactSharedInternals.H.useId();
  }, react_production.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  }, react_production.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  }, react_production.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  }, react_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  }, react_production.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  }, react_production.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  }, react_production.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  }, react_production.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
  }, react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
    );
  }, react_production.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
  }, react_production.version = "19.1.0", react_production;
}
var react_development = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
react_development.exports;
var hasRequiredReact_development;
function requireReact_development() {
  return hasRequiredReact_development || (hasRequiredReact_development = 1, function(module, exports) {
    use, process.env.NODE_ENV !== "production" && function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        return maybeIterable === null || typeof maybeIterable != "object" ? null : (maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"], typeof maybeIterable == "function" ? maybeIterable : null);
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = !0);
      }
      function Component(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props, this.context = context, this.refs = emptyObject, this.updater = updater || ReactNoopUpdateQueue;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = !1;
        } catch {
          JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error, JSCompiler_inline_result$jscomp$0 = typeof Symbol == "function" && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          ), testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (type == null) return null;
        if (typeof type == "function")
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if (typeof type == "string") return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if (typeof type == "object")
          switch (typeof type.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              return type = type.displayName, type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef"), type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload, type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if (typeof type == "object" && type !== null && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return dispatcher === null ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return !1;
        }
        return config.key !== void 0;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = !0, Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: !0
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        return didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), componentName = this.props.ref, componentName !== void 0 ? componentName : null;
      }
      function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        return self = props.ref, type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        }, (self !== void 0 ? self : null) !== null ? Object.defineProperty(type, "ref", {
          enumerable: !1,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: !1, value: null }), type._store = {}, Object.defineProperty(type._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(type, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.defineProperty(type, "_debugStack", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: debugStack
        }), Object.defineProperty(type, "_debugTask", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: debugTask
        }), Object.freeze && (Object.freeze(type.props), Object.freeze(type)), type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        return newKey = ReactElement(
          oldElement.type,
          newKey,
          void 0,
          void 0,
          oldElement._owner,
          oldElement.props,
          oldElement._debugStack,
          oldElement._debugTask
        ), oldElement._store && (newKey._store.validated = oldElement._store.validated), newKey;
      }
      function isValidElement(object) {
        return typeof object == "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return typeof element == "object" && element !== null && element.key != null ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function noop$1() {
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch (typeof thenable.status == "string" ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                thenable.status === "pending" && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                thenable.status === "pending" && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        (type === "undefined" || type === "boolean") && (children = null);
        var invokeCallback = !1;
        if (children === null) invokeCallback = !0;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = !0;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = !0;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children, callback = callback(invokeCallback);
          var childKey = nameSoFar === "" ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          return isArrayImpl(callback) ? (escapedPrefix = "", childKey != null && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : callback != null && (isValidElement(callback) && (callback.key != null && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (callback.key == null || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), nameSoFar !== "" && invokeCallback != null && isValidElement(invokeCallback) && invokeCallback.key == null && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback)), 1;
        }
        if (invokeCallback = 0, childKey = nameSoFar === "" ? "." : nameSoFar + ":", isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), typeof i == "function")
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = !0), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (type === "object") {
          if (typeof children.then == "function")
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          throw array = String(children), Error(
            "Objects are not valid as a React child (found: " + (array === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (children == null) return children;
        var result = [], count = 0;
        return mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        }), result;
      }
      function lazyInitializer(payload) {
        if (payload._status === -1) {
          var ctor = payload._result;
          ctor = ctor(), ctor.then(
            function(moduleObject) {
              (payload._status === 0 || payload._status === -1) && (payload._status = 1, payload._result = moduleObject);
            },
            function(error) {
              (payload._status === 0 || payload._status === -1) && (payload._status = 2, payload._result = error);
            }
          ), payload._status === -1 && (payload._status = 0, payload._result = ctor);
        }
        if (payload._status === 1)
          return ctor = payload._result, ctor === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            ctor
          ), "default" in ctor || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            ctor
          ), ctor.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        return dispatcher === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), dispatcher;
      }
      function noop() {
      }
      function enqueueTask(task) {
        if (enqueueTaskImpl === null)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch {
            enqueueTaskImpl = function(callback) {
              didWarnAboutMessageChannel === !1 && (didWarnAboutMessageChannel = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback, channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && typeof AggregateError == "function" ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (queue !== null)
          if (queue.length !== 0)
            try {
              flushActQueue(queue), enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = !0;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = !1;
                var continuation = callback(!1);
                if (continuation !== null) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback, queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (!0);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject), Component.prototype.isReactComponent = {}, Component.prototype.setState = function(partialState, callback) {
        if (typeof partialState != "object" && typeof partialState != "function" && partialState != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      }, Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, fnName;
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype, deprecatedAPIs = PureComponent.prototype = new ComponentDummy(), deprecatedAPIs.constructor = PureComponent, assign(deprecatedAPIs, Component.prototype), deprecatedAPIs.isPureReactComponent = !0;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null,
        actQueue: null,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        "react-stack-bottom-frame": function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime, didWarnAboutElementRef = {}, unknownOwnerDebugStack = deprecatedAPIs["react-stack-bottom-frame"].bind(deprecatedAPIs, UnknownOwner)(), unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner)), didWarnAboutMaps = !1, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = typeof reportError == "function" ? reportError : function(error) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var event = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof error == "object" && error !== null && typeof error.message == "string" ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = !1, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = !1, isFlushing = !1, queueSeveralMicrotasks = typeof queueMicrotask == "function" ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      }), exports.Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          return mapChildren(children, function() {
            n++;
          }), n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      }, exports.Component = Component, exports.Fragment = REACT_FRAGMENT_TYPE, exports.Profiler = REACT_PROFILER_TYPE, exports.PureComponent = PureComponent, exports.StrictMode = REACT_STRICT_MODE_TYPE, exports.Suspense = REACT_SUSPENSE_TYPE, exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals, exports.__COMPILER_RUNTIME = deprecatedAPIs, exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = prevActQueue !== null ? prevActQueue : [], didAwaitActCall = !1;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (result !== null && typeof result == "object" && typeof result.then == "function") {
          var thenable = result;
          return queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(resolve, reject) {
              didAwaitActCall = !0, thenable.then(
                function(returnValue) {
                  if (popActScope(prevActQueue, prevActScopeDepth), prevActScopeDepth === 0) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0, reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth), 0 < ReactSharedInternals.thrownErrors.length && (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0), reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        if (popActScope(prevActQueue, prevActScopeDepth), prevActScopeDepth === 0 && (flushActQueue(queue), queue.length !== 0 && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null), 0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = !0, prevActScopeDepth === 0 ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      }, exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      }, exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return getCurrentStack === null ? null : getCurrentStack();
      }, exports.cloneElement = function(element, config, children) {
        if (element == null)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (config != null) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = !1;
              break a;
            }
            JSCompiler_inline_result = config.ref !== void 0;
          }
          JSCompiler_inline_result && (owner = getOwner()), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || propName === "key" || propName === "__self" || propName === "__source" || propName === "ref" && config.ref === void 0 || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (propName === 1) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        for (props = ReactElement(
          element.type,
          key,
          void 0,
          void 0,
          owner,
          props,
          element._debugStack,
          element._debugTask
        ), key = 2; key < arguments.length; key++)
          owner = arguments[key], isValidElement(owner) && owner._store && (owner._store.validated = 1);
        return props;
      }, exports.createContext = function(defaultValue) {
        return defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, defaultValue.Provider = defaultValue, defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        }, defaultValue._currentRenderer = null, defaultValue._currentRenderer2 = null, defaultValue;
      }, exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++) {
          var node = arguments[i];
          isValidElement(node) && node._store && (node._store.validated = 1);
        }
        if (i = {}, node = null, config != null)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), node = "" + config.key), config)
            hasOwnProperty.call(config, propName) && propName !== "key" && propName !== "__self" && propName !== "__source" && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray), i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            i[propName] === void 0 && (i[propName] = childrenLength[propName]);
        node && defineKeyPropWarningGetter(
          i,
          typeof type == "function" ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          node,
          void 0,
          void 0,
          getOwner(),
          i,
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      }, exports.createRef = function() {
        var refObject = { current: null };
        return Object.seal(refObject), refObject;
      }, exports.forwardRef = function(render) {
        render != null && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof render != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          render === null ? "null" : typeof render
        ) : render.length !== 0 && render.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), render != null && render.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        return Object.defineProperty(elementType, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name, render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        }), elementType;
      }, exports.isValidElement = isValidElement, exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      }, exports.memo = function(type, compare) {
        type == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          type === null ? "null" : typeof type
        ), compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: compare === void 0 ? null : compare
        };
        var ownName;
        return Object.defineProperty(compare, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name, type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        }), compare;
      }, exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition, currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          onStartTransitionFinish !== null && onStartTransitionFinish(currentTransition, returnValue), typeof returnValue == "object" && returnValue !== null && typeof returnValue.then == "function" && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          prevTransition === null && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), ReactSharedInternals.T = prevTransition;
        }
      }, exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      }, exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      }, exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      }, exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      }, exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        return Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), dispatcher.useContext(Context);
      }, exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      }, exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      }, exports.useEffect = function(create, createDeps, update) {
        create == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        var dispatcher = resolveDispatcher();
        if (typeof update == "function")
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return dispatcher.useEffect(create, createDeps);
      }, exports.useId = function() {
        return resolveDispatcher().useId();
      }, exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      }, exports.useInsertionEffect = function(create, deps) {
        return create == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), resolveDispatcher().useInsertionEffect(create, deps);
      }, exports.useLayoutEffect = function(create, deps) {
        return create == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), resolveDispatcher().useLayoutEffect(create, deps);
      }, exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      }, exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      }, exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      }, exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      }, exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      }, exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      }, exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      }, exports.version = "19.1.0", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    }();
  }(react_development, react_development.exports)), react_development.exports;
}
var hasRequiredReact;
function requireReact() {
  return hasRequiredReact || (hasRequiredReact = 1, process.env.NODE_ENV === "production" ? react.exports = requireReact_production() : react.exports = requireReact_development()), react.exports;
}
var reactExports = requireReact(), DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
}, IconContext = reactExports.createContext && reactExports.createContext(DefaultContext), __assign = function() {
  return __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
    }
    return t;
  }, __assign.apply(this, arguments);
}, __rest = function(s, e) {
  var t = {};
  for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
  if (s != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && (t[p[i]] = s[p[i]]);
  return t;
};
function Tree2Element(tree) {
  return tree && tree.map(function(node, i) {
    return reactExports.createElement(node.tag, __assign({
      key: i
    }, node.attr), Tree2Element(node.child));
  });
}
function GenIcon(data) {
  return function(props) {
    return reactExports.createElement(IconBase, __assign({
      attr: __assign({}, data.attr)
    }, props), Tree2Element(data.child));
  };
}
function IconBase(props) {
  var elem = function(conf) {
    var computedSize = props.size || conf.size || "1em", className;
    conf.className && (className = conf.className), props.className && (className = (className ? className + " " : "") + props.className);
    var attr = props.attr, title = props.title, svgProps = __rest(props, ["attr", "title"]);
    return reactExports.createElement("svg", __assign({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: __assign({
        color: props.color || conf.color
      }, conf.style, props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && reactExports.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? reactExports.createElement(IconContext.Consumer, null, function(conf) {
    return elem(conf);
  }) : elem(DefaultContext);
}
var FaBeer = function(props) {
  return GenIcon({ attr: { viewBox: "0 0 448 512" }, child: [{ tag: "path", attr: { d: "M368 96h-48V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56v400c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24v-42.11l80.606-35.977C429.396 365.063 448 336.388 448 304.86V176c0-44.112-35.888-80-80-80zm16 208.86a16.018 16.018 0 0 1-9.479 14.611L320 343.805V160h48c8.822 0 16 7.178 16 16v128.86zM208 384c-8.836 0-16-7.164-16-16V144c0-8.836 7.164-16 16-16s16 7.164 16 16v224c0 8.836-7.164 16-16 16zm-96 0c-8.836 0-16-7.164-16-16V144c0-8.836 7.164-16 16-16s16 7.164 16 16v224c0 8.836-7.164 16-16 16z" } }] })(props);
};
FaBeer.displayName = "FaBeer";
const answer = FaBeer.displayName + FaBeer().props.children[0].props.d;
export {
  answer
};
