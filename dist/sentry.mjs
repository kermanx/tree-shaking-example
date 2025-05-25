const DEBUG_BUILD$3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, SDK_VERSION = "9.15.0", GLOBAL_OBJ = globalThis;
function getMainCarrier() {
  return getSentryCarrier(GLOBAL_OBJ), GLOBAL_OBJ;
}
function getSentryCarrier(carrier) {
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  return __SENTRY__.version = __SENTRY__.version || SDK_VERSION, __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
}
function getGlobalSingleton(name, creator, obj = GLOBAL_OBJ) {
  const __SENTRY__ = obj.__SENTRY__ = obj.__SENTRY__ || {}, carrier = __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
  return carrier[name] || (carrier[name] = creator());
}
const objectToString = Object.prototype.toString;
function isError(wat) {
  switch (objectToString.call(wat)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return !0;
    default:
      return isInstanceOf(wat, Error);
  }
}
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}
function isErrorEvent$1(wat) {
  return isBuiltin(wat, "ErrorEvent");
}
function isDOMError(wat) {
  return isBuiltin(wat, "DOMError");
}
function isDOMException(wat) {
  return isBuiltin(wat, "DOMException");
}
function isString(wat) {
  return isBuiltin(wat, "String");
}
function isParameterizedString(wat) {
  return typeof wat == "object" && wat !== null && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
}
function isPrimitive(wat) {
  return wat === null || isParameterizedString(wat) || typeof wat != "object" && typeof wat != "function";
}
function isPlainObject(wat) {
  return isBuiltin(wat, "Object");
}
function isEvent(wat) {
  return typeof Event < "u" && isInstanceOf(wat, Event);
}
function isElement(wat) {
  return typeof Element < "u" && isInstanceOf(wat, Element);
}
function isRegExp(wat) {
  return isBuiltin(wat, "RegExp");
}
function isThenable(wat) {
  return !!(wat != null && wat.then && typeof wat.then == "function");
}
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch {
    return !1;
  }
}
function isVueViewModel(wat) {
  return !!(typeof wat == "object" && wat !== null && (wat.__isVue || wat._isVue));
}
function isRequest(request) {
  return typeof Request < "u" && isInstanceOf(request, Request);
}
const WINDOW$3 = GLOBAL_OBJ, DEFAULT_MAX_STRING_LENGTH = 80;
function htmlTreeAsString(elem, options = {}) {
  if (!elem)
    return "<unknown>";
  try {
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5, out = [];
    let height = 0, len = 0;
    const separator = " > ", sepLength = separator.length;
    let nextStr;
    const keyAttrs = Array.isArray(options) ? options : options.keyAttrs, maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
    for (; currentElem && height++ < MAX_TRAVERSE_HEIGHT && (nextStr = _htmlElementAsString(currentElem, keyAttrs), !(nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength)); )
      out.push(nextStr), len += nextStr.length, currentElem = currentElem.parentNode;
    return out.reverse().join(separator);
  } catch {
    return "<unknown>";
  }
}
function _htmlElementAsString(el, keyAttrs) {
  const elem = el, out = [];
  if (!(elem != null && elem.tagName))
    return "";
  if (WINDOW$3.HTMLElement && elem instanceof HTMLElement && elem.dataset) {
    if (elem.dataset.sentryComponent)
      return elem.dataset.sentryComponent;
    if (elem.dataset.sentryElement)
      return elem.dataset.sentryElement;
  }
  out.push(elem.tagName.toLowerCase());
  const keyAttrPairs = keyAttrs != null && keyAttrs.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
  if (keyAttrPairs != null && keyAttrPairs.length)
    keyAttrPairs.forEach((keyAttrPair) => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  else {
    elem.id && out.push(`#${elem.id}`);
    const className = elem.className;
    if (className && isString(className)) {
      const classes = className.split(/\s+/);
      for (const c of classes)
        out.push(`.${c}`);
    }
  }
  const allowedAttrs = ["aria-label", "type", "name", "title", "alt"];
  for (const k of allowedAttrs) {
    const attr = elem.getAttribute(k);
    attr && out.push(`[${k}="${attr}"]`);
  }
  return out.join("");
}
function getLocationHref() {
  try {
    return WINDOW$3.document.location.href;
  } catch {
    return "";
  }
}
function getComponentName(elem) {
  if (!WINDOW$3.HTMLElement)
    return null;
  let currentElem = elem;
  const MAX_TRAVERSE_HEIGHT = 5;
  for (let i = 0; i < MAX_TRAVERSE_HEIGHT; i++) {
    if (!currentElem)
      return null;
    if (currentElem instanceof HTMLElement) {
      if (currentElem.dataset.sentryComponent)
        return currentElem.dataset.sentryComponent;
      if (currentElem.dataset.sentryElement)
        return currentElem.dataset.sentryElement;
    }
    currentElem = currentElem.parentNode;
  }
  return null;
}
const DEBUG_BUILD$2 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, PREFIX = "Sentry Logger ", CONSOLE_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
  "log",
  "assert",
  "trace"
], originalConsoleMethods = {};
function consoleSandbox(callback) {
  if (!("console" in GLOBAL_OBJ))
    return callback();
  const console2 = GLOBAL_OBJ.console, wrappedFuncs = {}, wrappedLevels = Object.keys(originalConsoleMethods);
  wrappedLevels.forEach((level) => {
    const originalConsoleMethod = originalConsoleMethods[level];
    wrappedFuncs[level] = console2[level], console2[level] = originalConsoleMethod;
  });
  try {
    return callback();
  } finally {
    wrappedLevels.forEach((level) => {
      console2[level] = wrappedFuncs[level];
    });
  }
}
function makeLogger() {
  let enabled = !1;
  const logger2 = {
    enable: () => {
      enabled = !0;
    },
    disable: () => {
      enabled = !1;
    },
    isEnabled: () => enabled
  };
  return DEBUG_BUILD$2 ? CONSOLE_LEVELS.forEach((name) => {
    logger2[name] = (...args) => {
      enabled && consoleSandbox(() => {
        GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
      });
    };
  }) : CONSOLE_LEVELS.forEach((name) => {
    logger2[name] = () => {
    };
  }), logger2;
}
const logger = getGlobalSingleton("logger", makeLogger);
function truncate(str, max = 0) {
  return typeof str != "string" || max === 0 || str.length <= max ? str : `${str.slice(0, max)}...`;
}
function safeJoin(input, delimiter) {
  if (!Array.isArray(input))
    return "";
  const output = [];
  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    try {
      isVueViewModel(value) ? output.push("[VueViewModel]") : output.push(String(value));
    } catch {
      output.push("[value cannot be serialized]");
    }
  }
  return output.join(delimiter);
}
function isMatchingPattern(value, pattern, requireExactStringMatch = !1) {
  return isString(value) ? isRegExp(pattern) ? pattern.test(value) : isString(pattern) ? requireExactStringMatch ? value === pattern : value.includes(pattern) : !1 : !1;
}
function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = !1) {
  return patterns.some((pattern) => isMatchingPattern(testString, pattern, requireExactStringMatch));
}
function fill(source, name, replacementFactory) {
  if (!(name in source))
    return;
  const original = source[name];
  if (typeof original != "function")
    return;
  const wrapped = replacementFactory(original);
  typeof wrapped == "function" && markFunctionWrapped(wrapped, original);
  try {
    source[name] = wrapped;
  } catch {
    DEBUG_BUILD$2 && logger.log(`Failed to replace method "${name}" in object`, source);
  }
}
function addNonEnumerableProperty(obj, name, value) {
  try {
    Object.defineProperty(obj, name, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value,
      writable: !0,
      configurable: !0
    });
  } catch {
    DEBUG_BUILD$2 && logger.log(`Failed to add non-enumerable property "${name}" to object`, obj);
  }
}
function markFunctionWrapped(wrapped, original) {
  try {
    const proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto, addNonEnumerableProperty(wrapped, "__sentry_original__", original);
  } catch {
  }
}
function getOriginalFunction(func) {
  return func.__sentry_original__;
}
function convertToPlainObject(value) {
  if (isError(value))
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value)
    };
  if (isEvent(value)) {
    const newObj = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value)
    };
    return typeof CustomEvent < "u" && isInstanceOf(value, CustomEvent) && (newObj.detail = value.detail), newObj;
  } else
    return value;
}
function serializeEventTarget(target) {
  try {
    return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
  } catch {
    return "<unknown>";
  }
}
function getOwnProperties(obj) {
  if (typeof obj == "object" && obj !== null) {
    const extractedProps = {};
    for (const property in obj)
      Object.prototype.hasOwnProperty.call(obj, property) && (extractedProps[property] = obj[property]);
    return extractedProps;
  } else
    return {};
}
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  const keys = Object.keys(convertToPlainObject(exception));
  keys.sort();
  const firstKey = keys[0];
  if (!firstKey)
    return "[object has no keys]";
  if (firstKey.length >= maxLength)
    return truncate(firstKey, maxLength);
  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    const serialized = keys.slice(0, includedKeys).join(", ");
    if (!(serialized.length > maxLength))
      return includedKeys === keys.length ? serialized : truncate(serialized, maxLength);
  }
  return "";
}
function getCrypto() {
  const gbl = GLOBAL_OBJ;
  return gbl.crypto || gbl.msCrypto;
}
function uuid4(crypto = getCrypto()) {
  let getRandomByte = () => Math.random() * 16;
  try {
    if (crypto != null && crypto.randomUUID)
      return crypto.randomUUID().replace(/-/g, "");
    crypto != null && crypto.getRandomValues && (getRandomByte = () => {
      const typedArray = new Uint8Array(1);
      return crypto.getRandomValues(typedArray), typedArray[0];
    });
  } catch {
  }
  return ("10000000100040008000" + 1e11).replace(
    /[018]/g,
    (c) => (
      // eslint-disable-next-line no-bitwise
      (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
    )
  );
}
function getFirstException(event) {
  var _a, _b;
  return (_b = (_a = event.exception) == null ? void 0 : _a.values) == null ? void 0 : _b[0];
}
function getEventDescription(event) {
  const { message, event_id: eventId } = event;
  if (message)
    return message;
  const firstException = getFirstException(event);
  return firstException ? firstException.type && firstException.value ? `${firstException.type}: ${firstException.value}` : firstException.type || firstException.value || eventId || "<unknown>" : eventId || "<unknown>";
}
function addExceptionTypeValue(event, value, type) {
  const exception = event.exception = event.exception || {}, values = exception.values = exception.values || [], firstException = values[0] = values[0] || {};
  firstException.value || (firstException.value = value || ""), firstException.type || (firstException.type = "Error");
}
function addExceptionMechanism(event, newMechanism) {
  const firstException = getFirstException(event);
  if (!firstException)
    return;
  const defaultMechanism = { type: "generic", handled: !0 }, currentMechanism = firstException.mechanism;
  if (firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism }, newMechanism && "data" in newMechanism) {
    const mergedData = { ...currentMechanism == null ? void 0 : currentMechanism.data, ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}
function checkOrSetAlreadyCaught(exception) {
  if (isAlreadyCaptured(exception))
    return !0;
  try {
    addNonEnumerableProperty(exception, "__sentry_captured__", !0);
  } catch {
  }
  return !1;
}
function isAlreadyCaptured(exception) {
  try {
    return exception.__sentry_captured__;
  } catch {
  }
}
const ONE_SECOND_IN_MS = 1e3;
function dateTimestampInSeconds() {
  return Date.now() / ONE_SECOND_IN_MS;
}
function createUnixTimestampInSecondsFunc() {
  const { performance } = GLOBAL_OBJ;
  if (!(performance != null && performance.now))
    return dateTimestampInSeconds;
  const approxStartingTimeOrigin = Date.now() - performance.now(), timeOrigin = performance.timeOrigin == null ? approxStartingTimeOrigin : performance.timeOrigin;
  return () => (timeOrigin + performance.now()) / ONE_SECOND_IN_MS;
}
const timestampInSeconds = createUnixTimestampInSecondsFunc();
function makeSession(context) {
  const startingTime = timestampInSeconds(), session = {
    sid: uuid4(),
    init: !0,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: !1,
    toJSON: () => sessionToJSON(session)
  };
  return context && updateSession(session, context), session;
}
function updateSession(session, context = {}) {
  if (context.user && (!session.ipAddress && context.user.ip_address && (session.ipAddress = context.user.ip_address), !session.did && !context.did && (session.did = context.user.id || context.user.email || context.user.username)), session.timestamp = context.timestamp || timestampInSeconds(), context.abnormal_mechanism && (session.abnormal_mechanism = context.abnormal_mechanism), context.ignoreDuration && (session.ignoreDuration = context.ignoreDuration), context.sid && (session.sid = context.sid.length === 32 ? context.sid : uuid4()), context.init !== void 0 && (session.init = context.init), !session.did && context.did && (session.did = `${context.did}`), typeof context.started == "number" && (session.started = context.started), session.ignoreDuration)
    session.duration = void 0;
  else if (typeof context.duration == "number")
    session.duration = context.duration;
  else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  context.release && (session.release = context.release), context.environment && (session.environment = context.environment), !session.ipAddress && context.ipAddress && (session.ipAddress = context.ipAddress), !session.userAgent && context.userAgent && (session.userAgent = context.userAgent), typeof context.errors == "number" && (session.errors = context.errors), context.status && (session.status = context.status);
}
function closeSession(session, status) {
  let context = {};
  session.status === "ok" && (context = { status: "exited" }), updateSession(session, context);
}
function sessionToJSON(session) {
  return {
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1e3).toISOString(),
    timestamp: new Date(session.timestamp * 1e3).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did == "number" || typeof session.did == "string" ? `${session.did}` : void 0,
    duration: session.duration,
    abnormal_mechanism: session.abnormal_mechanism,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent
    }
  };
}
function merge(initialObj, mergeObj, levels = 2) {
  if (!mergeObj || typeof mergeObj != "object" || levels <= 0)
    return mergeObj;
  if (initialObj && Object.keys(mergeObj).length === 0)
    return initialObj;
  const output = { ...initialObj };
  for (const key in mergeObj)
    Object.prototype.hasOwnProperty.call(mergeObj, key) && (output[key] = merge(output[key], mergeObj[key], levels - 1));
  return output;
}
const SCOPE_SPAN_FIELD = "_sentrySpan";
function _setSpanForScope(scope, span) {
  span ? addNonEnumerableProperty(scope, SCOPE_SPAN_FIELD, span) : delete scope[SCOPE_SPAN_FIELD];
}
function _getSpanForScope(scope) {
  return scope[SCOPE_SPAN_FIELD];
}
function generateTraceId() {
  return uuid4();
}
function generateSpanId() {
  return uuid4().substring(16);
}
const DEFAULT_MAX_BREADCRUMBS = 100;
class Scope {
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called during event processing. */
  /** Array of breadcrumbs. */
  /** User */
  /** Tags */
  /** Extra */
  /** Contexts */
  /** Attachments */
  /** Propagation Context for distributed tracing */
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  /** Fingerprint */
  /** Severity */
  /**
   * Transaction Name
   *
   * IMPORTANT: The transaction name on the scope has nothing to do with root spans/transaction objects.
   * It's purpose is to assign a transaction to the scope that's added to non-transaction events.
   */
  /** Session */
  /** The client on this scope */
  /** Contains the last event id of a captured event.  */
  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  constructor() {
    this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = {
      traceId: generateTraceId(),
      sampleRand: Math.random()
    };
  }
  /**
   * Clone all data from this scope into a new scope.
   */
  clone() {
    const newScope = new Scope();
    return newScope._breadcrumbs = [...this._breadcrumbs], newScope._tags = { ...this._tags }, newScope._extra = { ...this._extra }, newScope._contexts = { ...this._contexts }, this._contexts.flags && (newScope._contexts.flags = {
      values: [...this._contexts.flags.values]
    }), newScope._user = this._user, newScope._level = this._level, newScope._session = this._session, newScope._transactionName = this._transactionName, newScope._fingerprint = this._fingerprint, newScope._eventProcessors = [...this._eventProcessors], newScope._attachments = [...this._attachments], newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }, newScope._propagationContext = { ...this._propagationContext }, newScope._client = this._client, newScope._lastEventId = this._lastEventId, _setSpanForScope(newScope, _getSpanForScope(this)), newScope;
  }
  /**
   * Update the client assigned to this scope.
   * Note that not every scope will have a client assigned - isolation scopes & the global scope will generally not have a client,
   * as well as manually created scopes.
   */
  setClient(client) {
    this._client = client;
  }
  /**
   * Set the ID of the last captured error event.
   * This is generally only captured on the isolation scope.
   */
  setLastEventId(lastEventId) {
    this._lastEventId = lastEventId;
  }
  /**
   * Get the client assigned to this scope.
   */
  getClient() {
    return this._client;
  }
  /**
   * Get the ID of the last captured error event.
   * This is generally only available on the isolation scope.
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   */
  addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }
  /**
   * Add an event processor that will be called before an event is sent.
   */
  addEventProcessor(callback) {
    return this._eventProcessors.push(callback), this;
  }
  /**
   * Set the user for this scope.
   * Set to `null` to unset the user.
   */
  setUser(user) {
    return this._user = user || {
      email: void 0,
      id: void 0,
      ip_address: void 0,
      username: void 0
    }, this._session && updateSession(this._session, { user }), this._notifyScopeListeners(), this;
  }
  /**
   * Get the user from this scope.
   */
  getUser() {
    return this._user;
  }
  /**
   * Set an object that will be merged into existing tags on the scope,
   * and will be sent as tags data with the event.
   */
  setTags(tags) {
    return this._tags = {
      ...this._tags,
      ...tags
    }, this._notifyScopeListeners(), this;
  }
  /**
   * Set a single tag that will be sent as tags data with the event.
   */
  setTag(key, value) {
    return this._tags = { ...this._tags, [key]: value }, this._notifyScopeListeners(), this;
  }
  /**
   * Set an object that will be merged into existing extra on the scope,
   * and will be sent as extra data with the event.
   */
  setExtras(extras) {
    return this._extra = {
      ...this._extra,
      ...extras
    }, this._notifyScopeListeners(), this;
  }
  /**
   * Set a single key:value extra entry that will be sent as extra data with the event.
   */
  setExtra(key, extra) {
    return this._extra = { ...this._extra, [key]: extra }, this._notifyScopeListeners(), this;
  }
  /**
   * Sets the fingerprint on the scope to send with the events.
   * @param {string[]} fingerprint Fingerprint to group events in Sentry.
   */
  setFingerprint(fingerprint) {
    return this._fingerprint = fingerprint, this._notifyScopeListeners(), this;
  }
  /**
   * Sets the level on the scope for future events.
   */
  setLevel(level) {
    return this._level = level, this._notifyScopeListeners(), this;
  }
  /**
   * Sets the transaction name on the scope so that the name of e.g. taken server route or
   * the page location is attached to future events.
   *
   * IMPORTANT: Calling this function does NOT change the name of the currently active
   * root span. If you want to change the name of the active root span, use
   * `Sentry.updateSpanName(rootSpan, 'new name')` instead.
   *
   * By default, the SDK updates the scope's transaction name automatically on sensible
   * occasions, such as a page navigation or when handling a new request on the server.
   */
  setTransactionName(name) {
    return this._transactionName = name, this._notifyScopeListeners(), this;
  }
  /**
   * Sets context data with the given name.
   * Data passed as context will be normalized. You can also pass `null` to unset the context.
   * Note that context data will not be merged - calling `setContext` will overwrite an existing context with the same key.
   */
  setContext(key, context) {
    return context === null ? delete this._contexts[key] : this._contexts[key] = context, this._notifyScopeListeners(), this;
  }
  /**
   * Set the session for the scope.
   */
  setSession(session) {
    return session ? this._session = session : delete this._session, this._notifyScopeListeners(), this;
  }
  /**
   * Get the session from the scope.
   */
  getSession() {
    return this._session;
  }
  /**
   * Updates the scope with provided data. Can work in three variations:
   * - plain object containing updatable attributes
   * - Scope instance that'll extract the attributes from
   * - callback function that'll receive the current scope as an argument and allow for modifications
   */
  update(captureContext) {
    if (!captureContext)
      return this;
    const scopeToMerge = typeof captureContext == "function" ? captureContext(this) : captureContext, scopeInstance = scopeToMerge instanceof Scope ? scopeToMerge.getScopeData() : isPlainObject(scopeToMerge) ? captureContext : void 0, { tags, extra, user, contexts, level, fingerprint = [], propagationContext } = scopeInstance || {};
    return this._tags = { ...this._tags, ...tags }, this._extra = { ...this._extra, ...extra }, this._contexts = { ...this._contexts, ...contexts }, user && Object.keys(user).length && (this._user = user), level && (this._level = level), fingerprint.length && (this._fingerprint = fingerprint), propagationContext && (this._propagationContext = propagationContext), this;
  }
  /**
   * Clears the current scope and resets its properties.
   * Note: The client will not be cleared.
   */
  clear() {
    return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._session = void 0, _setSpanForScope(this, void 0), this._attachments = [], this.setPropagationContext({ traceId: generateTraceId(), sampleRand: Math.random() }), this._notifyScopeListeners(), this;
  }
  /**
   * Adds a breadcrumb to the scope.
   * By default, the last 100 breadcrumbs are kept.
   */
  addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    var _a;
    const maxCrumbs = typeof maxBreadcrumbs == "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
    if (maxCrumbs <= 0)
      return this;
    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb,
      // Breadcrumb messages can theoretically be infinitely large and they're held in memory so we truncate them not to leak (too much) memory
      message: breadcrumb.message ? truncate(breadcrumb.message, 2048) : breadcrumb.message
    };
    return this._breadcrumbs.push(mergedBreadcrumb), this._breadcrumbs.length > maxCrumbs && (this._breadcrumbs = this._breadcrumbs.slice(-maxCrumbs), (_a = this._client) == null || _a.recordDroppedEvent("buffer_overflow", "log_item")), this._notifyScopeListeners(), this;
  }
  /**
   * Get the last breadcrumb of the scope.
   */
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  /**
   * Clear all breadcrumbs from the scope.
   */
  clearBreadcrumbs() {
    return this._breadcrumbs = [], this._notifyScopeListeners(), this;
  }
  /**
   * Add an attachment to the scope.
   */
  addAttachment(attachment) {
    return this._attachments.push(attachment), this;
  }
  /**
   * Clear all attachments from the scope.
   */
  clearAttachments() {
    return this._attachments = [], this;
  }
  /**
   * Get the data of this scope, which should be applied to an event during processing.
   */
  getScopeData() {
    return {
      breadcrumbs: this._breadcrumbs,
      attachments: this._attachments,
      contexts: this._contexts,
      tags: this._tags,
      extra: this._extra,
      user: this._user,
      level: this._level,
      fingerprint: this._fingerprint || [],
      eventProcessors: this._eventProcessors,
      propagationContext: this._propagationContext,
      sdkProcessingMetadata: this._sdkProcessingMetadata,
      transactionName: this._transactionName,
      span: _getSpanForScope(this)
    };
  }
  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry.
   */
  setSDKProcessingMetadata(newData) {
    return this._sdkProcessingMetadata = merge(this._sdkProcessingMetadata, newData, 2), this;
  }
  /**
   * Add propagation context to the scope, used for distributed tracing
   */
  setPropagationContext(context) {
    return this._propagationContext = context, this;
  }
  /**
   * Get propagation context from the scope, used for distributed tracing
   */
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * Capture an exception for this scope.
   *
   * @returns {string} The id of the captured Sentry event.
   */
  captureException(exception, hint) {
    const eventId = (hint == null ? void 0 : hint.event_id) || uuid4();
    if (!this._client)
      return logger.warn("No client configured on scope - will not capture exception!"), eventId;
    const syntheticException = new Error("Sentry syntheticException");
    return this._client.captureException(
      exception,
      {
        originalException: exception,
        syntheticException,
        ...hint,
        event_id: eventId
      },
      this
    ), eventId;
  }
  /**
   * Capture a message for this scope.
   *
   * @returns {string} The id of the captured message.
   */
  captureMessage(message, level, hint) {
    const eventId = (hint == null ? void 0 : hint.event_id) || uuid4();
    if (!this._client)
      return logger.warn("No client configured on scope - will not capture message!"), eventId;
    const syntheticException = new Error(message);
    return this._client.captureMessage(
      message,
      level,
      {
        originalException: message,
        syntheticException,
        ...hint,
        event_id: eventId
      },
      this
    ), eventId;
  }
  /**
   * Capture a Sentry event for this scope.
   *
   * @returns {string} The id of the captured event.
   */
  captureEvent(event, hint) {
    const eventId = (hint == null ? void 0 : hint.event_id) || uuid4();
    return this._client ? (this._client.captureEvent(event, { ...hint, event_id: eventId }, this), eventId) : (logger.warn("No client configured on scope - will not capture event!"), eventId);
  }
  /**
   * This will be called on every set call.
   */
  _notifyScopeListeners() {
    this._notifyingListeners || (this._notifyingListeners = !0, this._scopeListeners.forEach((callback) => {
      callback(this);
    }), this._notifyingListeners = !1);
  }
}
function getDefaultCurrentScope() {
  return getGlobalSingleton("defaultCurrentScope", () => new Scope());
}
function getDefaultIsolationScope() {
  return getGlobalSingleton("defaultIsolationScope", () => new Scope());
}
class AsyncContextStack {
  constructor(scope, isolationScope) {
    let assignedScope;
    scope ? assignedScope = scope : assignedScope = new Scope();
    let assignedIsolationScope;
    isolationScope ? assignedIsolationScope = isolationScope : assignedIsolationScope = new Scope(), this._stack = [{ scope: assignedScope }], this._isolationScope = assignedIsolationScope;
  }
  /**
   * Fork a scope for the stack.
   */
  withScope(callback) {
    const scope = this._pushScope();
    let maybePromiseResult;
    try {
      maybePromiseResult = callback(scope);
    } catch (e) {
      throw this._popScope(), e;
    }
    return isThenable(maybePromiseResult) ? maybePromiseResult.then(
      (res) => (this._popScope(), res),
      (e) => {
        throw this._popScope(), e;
      }
    ) : (this._popScope(), maybePromiseResult);
  }
  /**
   * Get the client of the stack.
   */
  getClient() {
    return this.getStackTop().client;
  }
  /**
   * Returns the scope of the top stack.
   */
  getScope() {
    return this.getStackTop().scope;
  }
  /**
   * Get the isolation scope for the stack.
   */
  getIsolationScope() {
    return this._isolationScope;
  }
  /**
   * Returns the topmost scope layer in the order domain > local > process.
   */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * Push a scope to the stack.
   */
  _pushScope() {
    const scope = this.getScope().clone();
    return this._stack.push({
      client: this.getClient(),
      scope
    }), scope;
  }
  /**
   * Pop a scope from the stack.
   */
  _popScope() {
    return this._stack.length <= 1 ? !1 : !!this._stack.pop();
  }
}
function getAsyncContextStack() {
  const registry = getMainCarrier(), sentry = getSentryCarrier(registry);
  return sentry.stack = sentry.stack || new AsyncContextStack(getDefaultCurrentScope(), getDefaultIsolationScope());
}
function withScope$1(callback) {
  return getAsyncContextStack().withScope(callback);
}
function withSetScope(scope, callback) {
  const stack = getAsyncContextStack();
  return stack.withScope(() => (stack.getStackTop().scope = scope, callback(scope)));
}
function withIsolationScope(callback) {
  return getAsyncContextStack().withScope(() => callback(getAsyncContextStack().getIsolationScope()));
}
function getStackAsyncContextStrategy() {
  return {
    withIsolationScope,
    withScope: withScope$1,
    withSetScope,
    withSetIsolationScope: (_isolationScope, callback) => withIsolationScope(callback),
    getCurrentScope: () => getAsyncContextStack().getScope(),
    getIsolationScope: () => getAsyncContextStack().getIsolationScope()
  };
}
function getAsyncContextStrategy(carrier) {
  const sentry = getSentryCarrier(carrier);
  return sentry.acs ? sentry.acs : getStackAsyncContextStrategy();
}
function getCurrentScope() {
  const carrier = getMainCarrier();
  return getAsyncContextStrategy(carrier).getCurrentScope();
}
function getIsolationScope() {
  const carrier = getMainCarrier();
  return getAsyncContextStrategy(carrier).getIsolationScope();
}
function getGlobalScope() {
  return getGlobalSingleton("globalScope", () => new Scope());
}
function withScope(...rest) {
  const carrier = getMainCarrier(), acs = getAsyncContextStrategy(carrier);
  if (rest.length === 2) {
    const [scope, callback] = rest;
    return scope ? acs.withSetScope(scope, callback) : acs.withScope(callback);
  }
  return acs.withScope(rest[0]);
}
function getClient() {
  return getCurrentScope().getClient();
}
function getTraceContextFromScope(scope) {
  const propagationContext = scope.getPropagationContext(), { traceId, parentSpanId, propagationSpanId } = propagationContext, traceContext = {
    trace_id: traceId,
    span_id: propagationSpanId || generateSpanId()
  };
  return parentSpanId && (traceContext.parent_span_id = parentSpanId), traceContext;
}
const SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = "sentry.source", SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = "sentry.sample_rate", SEMANTIC_ATTRIBUTE_SENTRY_OP = "sentry.op", SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = "sentry.origin", SEMANTIC_ATTRIBUTE_PROFILE_ID = "sentry.profile_id", SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME = "sentry.exclusive_time", SPAN_STATUS_UNSET = 0, SPAN_STATUS_OK = 1, SCOPE_ON_START_SPAN_FIELD = "_sentryScope", ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
function getCapturedScopesOnSpan(span) {
  return {
    scope: span[SCOPE_ON_START_SPAN_FIELD],
    isolationScope: span[ISOLATION_SCOPE_ON_START_SPAN_FIELD]
  };
}
function parseSampleRate(sampleRate) {
  if (typeof sampleRate == "boolean")
    return Number(sampleRate);
  const rate = typeof sampleRate == "string" ? parseFloat(sampleRate) : sampleRate;
  if (!(typeof rate != "number" || isNaN(rate) || rate < 0 || rate > 1))
    return rate;
}
const SENTRY_BAGGAGE_KEY_PREFIX = "sentry-", SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
function baggageHeaderToDynamicSamplingContext(baggageHeader) {
  const baggageObject = parseBaggageHeader(baggageHeader);
  if (!baggageObject)
    return;
  const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
    if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
      const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
      acc[nonPrefixedKey] = value;
    }
    return acc;
  }, {});
  if (Object.keys(dynamicSamplingContext).length > 0)
    return dynamicSamplingContext;
}
function parseBaggageHeader(baggageHeader) {
  if (!(!baggageHeader || !isString(baggageHeader) && !Array.isArray(baggageHeader)))
    return Array.isArray(baggageHeader) ? baggageHeader.reduce((acc, curr) => {
      const currBaggageObject = baggageHeaderToObject(curr);
      return Object.entries(currBaggageObject).forEach(([key, value]) => {
        acc[key] = value;
      }), acc;
    }, {}) : baggageHeaderToObject(baggageHeader);
}
function baggageHeaderToObject(baggageHeader) {
  return baggageHeader.split(",").map((baggageEntry) => baggageEntry.split("=").map((keyOrValue) => decodeURIComponent(keyOrValue.trim()))).reduce((acc, [key, value]) => (key && value && (acc[key] = value), acc), {});
}
const TRACE_FLAG_SAMPLED = 1;
let hasShownSpanDropWarning = !1;
function spanToTraceContext(span) {
  const { spanId, traceId: trace_id, isRemote } = span.spanContext(), parent_span_id = isRemote ? spanId : spanToJSON(span).parent_span_id, scope = getCapturedScopesOnSpan(span).scope, span_id = isRemote ? (scope == null ? void 0 : scope.getPropagationContext().propagationSpanId) || generateSpanId() : spanId;
  return {
    parent_span_id,
    span_id,
    trace_id
  };
}
function convertSpanLinksForEnvelope(links) {
  if (links && links.length > 0)
    return links.map(({ context: { spanId, traceId, traceFlags, ...restContext }, attributes }) => ({
      span_id: spanId,
      trace_id: traceId,
      sampled: traceFlags === TRACE_FLAG_SAMPLED,
      attributes,
      ...restContext
    }));
}
function spanTimeInputToSeconds(input) {
  return typeof input == "number" ? ensureTimestampInSeconds(input) : Array.isArray(input) ? input[0] + input[1] / 1e9 : input instanceof Date ? ensureTimestampInSeconds(input.getTime()) : timestampInSeconds();
}
function ensureTimestampInSeconds(timestamp) {
  return timestamp > 9999999999 ? timestamp / 1e3 : timestamp;
}
function spanToJSON(span) {
  if (spanIsSentrySpan(span))
    return span.getSpanJSON();
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
    const { attributes, startTime, name, endTime, parentSpanId, status, links } = span;
    return {
      span_id,
      trace_id,
      data: attributes,
      description: name,
      parent_span_id: parentSpanId,
      start_timestamp: spanTimeInputToSeconds(startTime),
      // This is [0,0] by default in OTEL, in which case we want to interpret this as no end time
      timestamp: spanTimeInputToSeconds(endTime) || void 0,
      status: getStatusMessage(status),
      op: attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
      origin: attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
      links: convertSpanLinksForEnvelope(links)
    };
  }
  return {
    span_id,
    trace_id,
    start_timestamp: 0,
    data: {}
  };
}
function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
  const castSpan = span;
  return !!castSpan.attributes && !!castSpan.startTime && !!castSpan.name && !!castSpan.endTime && !!castSpan.status;
}
function spanIsSentrySpan(span) {
  return typeof span.getSpanJSON == "function";
}
function spanIsSampled(span) {
  const { traceFlags } = span.spanContext();
  return traceFlags === TRACE_FLAG_SAMPLED;
}
function getStatusMessage(status) {
  if (!(!status || status.code === SPAN_STATUS_UNSET))
    return status.code === SPAN_STATUS_OK ? "ok" : status.message || "unknown_error";
}
const ROOT_SPAN_FIELD = "_sentryRootSpan";
function getRootSpan(span) {
  return span[ROOT_SPAN_FIELD] || span;
}
function showSpanDropWarning() {
  hasShownSpanDropWarning || (consoleSandbox(() => {
    console.warn(
      "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly."
    );
  }), hasShownSpanDropWarning = !0);
}
const STACKTRACE_FRAME_LIMIT = 50, UNKNOWN_FUNCTION = "?", WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/, STRIP_FRAME_REGEXP = /captureMessage|captureException/;
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirstLines = 0, framesToPop = 0) => {
    const frames = [], lines = stack.split(`
`);
    for (let i = skipFirstLines; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 1024)
        continue;
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (!cleanedLine.match(/\S*Error: /)) {
        for (const parser of sortedParsers) {
          const frame = parser(cleanedLine);
          if (frame) {
            frames.push(frame);
            break;
          }
        }
        if (frames.length >= STACKTRACE_FRAME_LIMIT + framesToPop)
          break;
      }
    }
    return stripSentryFramesAndReverse(frames.slice(framesToPop));
  };
}
function stackParserFromStackParserOptions(stackParser) {
  return Array.isArray(stackParser) ? createStackParser(...stackParser) : stackParser;
}
function stripSentryFramesAndReverse(stack) {
  if (!stack.length)
    return [];
  const localStack = Array.from(stack);
  return /sentryWrapped/.test(getLastStackFrame(localStack).function || "") && localStack.pop(), localStack.reverse(), STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "") && (localStack.pop(), STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "") && localStack.pop()), localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || getLastStackFrame(localStack).filename,
    function: frame.function || UNKNOWN_FUNCTION
  }));
}
function getLastStackFrame(arr) {
  return arr[arr.length - 1] || {};
}
const defaultFunctionName = "<anonymous>";
function getFunctionName(fn) {
  try {
    return !fn || typeof fn != "function" ? defaultFunctionName : fn.name || defaultFunctionName;
  } catch {
    return defaultFunctionName;
  }
}
function getFramesFromEvent(event) {
  const exception = event.exception;
  if (exception) {
    const frames = [];
    try {
      return exception.values.forEach((value) => {
        value.stacktrace.frames && frames.push(...value.stacktrace.frames);
      }), frames;
    } catch {
      return;
    }
  }
}
const handlers = {}, instrumented = {};
function addHandler(type, handler) {
  handlers[type] = handlers[type] || [], handlers[type].push(handler);
}
function maybeInstrument(type, instrumentFn) {
  if (!instrumented[type]) {
    instrumented[type] = !0;
    try {
      instrumentFn();
    } catch (e) {
      DEBUG_BUILD$2 && logger.error(`Error while instrumenting ${type}`, e);
    }
  }
}
function triggerHandlers(type, data) {
  const typeHandlers = type && handlers[type];
  if (typeHandlers)
    for (const handler of typeHandlers)
      try {
        handler(data);
      } catch (e) {
        DEBUG_BUILD$2 && logger.error(
          `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`,
          e
        );
      }
}
let _oldOnErrorHandler = null;
function addGlobalErrorInstrumentationHandler(handler) {
  const type = "error";
  addHandler(type, handler), maybeInstrument(type, instrumentError);
}
function instrumentError() {
  _oldOnErrorHandler = GLOBAL_OBJ.onerror, GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
    return triggerHandlers("error", {
      column,
      error,
      line,
      msg,
      url
    }), _oldOnErrorHandler ? _oldOnErrorHandler.apply(this, arguments) : !1;
  }, GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = !0;
}
let _oldOnUnhandledRejectionHandler = null;
function addGlobalUnhandledRejectionInstrumentationHandler(handler) {
  const type = "unhandledrejection";
  addHandler(type, handler), maybeInstrument(type, instrumentUnhandledRejection);
}
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = GLOBAL_OBJ.onunhandledrejection, GLOBAL_OBJ.onunhandledrejection = function(e) {
    return triggerHandlers("unhandledrejection", e), _oldOnUnhandledRejectionHandler ? _oldOnUnhandledRejectionHandler.apply(this, arguments) : !0;
  }, GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0;
}
function hasSpansEnabled(maybeOptions) {
  var _a;
  if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__)
    return !1;
  const options = maybeOptions || ((_a = getClient()) == null ? void 0 : _a.getOptions());
  return !!options && // Note: This check is `!= null`, meaning "nullish". `0` is not "nullish", `undefined` and `null` are. (This comment was brought to you by 15 minutes of questioning life)
  (options.tracesSampleRate != null || !!options.tracesSampler);
}
const DEFAULT_ENVIRONMENT = "production", FROZEN_DSC_FIELD = "_frozenDsc";
function getDynamicSamplingContextFromClient(trace_id, client) {
  const options = client.getOptions(), { publicKey: public_key } = client.getDsn() || {}, dsc = {
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    public_key,
    trace_id
  };
  return client.emit("createDsc", dsc), dsc;
}
function getDynamicSamplingContextFromScope(client, scope) {
  const propagationContext = scope.getPropagationContext();
  return propagationContext.dsc || getDynamicSamplingContextFromClient(propagationContext.traceId, client);
}
function getDynamicSamplingContextFromSpan(span) {
  var _a;
  const client = getClient();
  if (!client)
    return {};
  const rootSpan = getRootSpan(span), rootSpanJson = spanToJSON(rootSpan), rootSpanAttributes = rootSpanJson.data, traceState = rootSpan.spanContext().traceState, rootSpanSampleRate = (traceState == null ? void 0 : traceState.get("sentry.sample_rate")) ?? rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE];
  function applyLocalSampleRateToDsc(dsc2) {
    return (typeof rootSpanSampleRate == "number" || typeof rootSpanSampleRate == "string") && (dsc2.sample_rate = `${rootSpanSampleRate}`), dsc2;
  }
  const frozenDsc = rootSpan[FROZEN_DSC_FIELD];
  if (frozenDsc)
    return applyLocalSampleRateToDsc(frozenDsc);
  const traceStateDsc = traceState == null ? void 0 : traceState.get("sentry.dsc"), dscOnTraceState = traceStateDsc && baggageHeaderToDynamicSamplingContext(traceStateDsc);
  if (dscOnTraceState)
    return applyLocalSampleRateToDsc(dscOnTraceState);
  const dsc = getDynamicSamplingContextFromClient(span.spanContext().traceId, client), source = rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE], name = rootSpanJson.description;
  return source !== "url" && name && (dsc.transaction = name), hasSpansEnabled() && (dsc.sampled = String(spanIsSampled(rootSpan)), dsc.sample_rand = // In OTEL we store the sample rand on the trace state because we cannot access scopes for NonRecordingSpans
  // The Sentry OTEL SpanSampler takes care of writing the sample rand on the root span
  (traceState == null ? void 0 : traceState.get("sentry.sample_rand")) ?? // On all other platforms we can actually get the scopes from a root span (we use this as a fallback)
  ((_a = getCapturedScopesOnSpan(rootSpan).scope) == null ? void 0 : _a.getPropagationContext().sampleRand.toString())), applyLocalSampleRateToDsc(dsc), client.emit("createDsc", dsc, rootSpan), dsc;
}
const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
  return protocol === "http" || protocol === "https";
}
function dsnToString(dsn, withPassword = !1) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path && `${path}/`}${projectId}`;
}
function dsnFromString(str) {
  const match = DSN_REGEX.exec(str);
  if (!match) {
    consoleSandbox(() => {
      console.error(`Invalid Sentry Dsn: ${str}`);
    });
    return;
  }
  const [protocol, publicKey, pass = "", host = "", port = "", lastPath = ""] = match.slice(1);
  let path = "", projectId = lastPath;
  const split = projectId.split("/");
  if (split.length > 1 && (path = split.slice(0, -1).join("/"), projectId = split.pop()), projectId) {
    const projectMatch = projectId.match(/^\d+/);
    projectMatch && (projectId = projectMatch[0]);
  }
  return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
}
function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || "",
    pass: components.pass || "",
    host: components.host,
    port: components.port || "",
    path: components.path || "",
    projectId: components.projectId
  };
}
function validateDsn(dsn) {
  if (!DEBUG_BUILD$2)
    return !0;
  const { port, projectId, protocol } = dsn;
  return ["protocol", "publicKey", "host", "projectId"].find((component) => dsn[component] ? !1 : (logger.error(`Invalid Sentry Dsn: ${component} missing`), !0)) ? !1 : projectId.match(/^\d+$/) ? isValidProtocol(protocol) ? port && isNaN(parseInt(port, 10)) ? (logger.error(`Invalid Sentry Dsn: Invalid port ${port}`), !1) : !0 : (logger.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`), !1) : (logger.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`), !1);
}
function makeDsn(from) {
  const components = typeof from == "string" ? dsnFromString(from) : dsnFromComponents(from);
  if (!(!components || !validateDsn(components)))
    return components;
}
function normalize(input, depth = 100, maxProperties = 1 / 0) {
  try {
    return visit("", input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}
function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
  const normalized = normalize(object, depth);
  return jsonSize(normalized) > maxSize ? normalizeToSize(object, depth - 1, maxSize) : normalized;
}
function visit(key, value, depth = 1 / 0, maxProperties = 1 / 0, memo = memoBuilder()) {
  const [memoize, unmemoize] = memo;
  if (value == null || // this matches null and undefined -> eqeq not eqeqeq
  ["boolean", "string"].includes(typeof value) || typeof value == "number" && Number.isFinite(value))
    return value;
  const stringified = stringifyValue(key, value);
  if (!stringified.startsWith("[object "))
    return stringified;
  if (value.__sentry_skip_normalization__)
    return value;
  const remainingDepth = typeof value.__sentry_override_normalization_depth__ == "number" ? value.__sentry_override_normalization_depth__ : depth;
  if (remainingDepth === 0)
    return stringified.replace("object ", "");
  if (memoize(value))
    return "[Circular ~]";
  const valueWithToJSON = value;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON == "function")
    try {
      const jsonValue = valueWithToJSON.toJSON();
      return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
    } catch {
    }
  const normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0;
  const visitable = convertToPlainObject(value);
  for (const visitKey in visitable) {
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey))
      continue;
    if (numAdded >= maxProperties) {
      normalized[visitKey] = "[MaxProperties ~]";
      break;
    }
    const visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo), numAdded++;
  }
  return unmemoize(value), normalized;
}
function stringifyValue(key, value) {
  try {
    if (key === "domain" && value && typeof value == "object" && value._events)
      return "[Domain]";
    if (key === "domainEmitter")
      return "[DomainEmitter]";
    if (typeof global < "u" && value === global)
      return "[Global]";
    if (typeof window < "u" && value === window)
      return "[Window]";
    if (typeof document < "u" && value === document)
      return "[Document]";
    if (isVueViewModel(value))
      return "[VueViewModel]";
    if (isSyntheticEvent(value))
      return "[SyntheticEvent]";
    if (typeof value == "number" && !Number.isFinite(value))
      return `[${value}]`;
    if (typeof value == "function")
      return `[Function: ${getFunctionName(value)}]`;
    if (typeof value == "symbol")
      return `[${String(value)}]`;
    if (typeof value == "bigint")
      return `[BigInt: ${String(value)}]`;
    const objName = getConstructorName(value);
    return /^HTML(\w*)Element$/.test(objName) ? `[HTMLElement: ${objName}]` : `[object ${objName}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}
function getConstructorName(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype != null && prototype.constructor ? prototype.constructor.name : "null prototype";
}
function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}
function memoBuilder() {
  const inner = /* @__PURE__ */ new WeakSet();
  function memoize(obj) {
    return inner.has(obj) ? !0 : (inner.add(obj), !1);
  }
  function unmemoize(obj) {
    inner.delete(obj);
  }
  return [memoize, unmemoize];
}
function createEnvelope(headers, items = []) {
  return [headers, items];
}
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
function forEachEnvelopeItem(envelope, callback) {
  const envelopeItems = envelope[1];
  for (const envelopeItem of envelopeItems) {
    const envelopeItemType = envelopeItem[0].type;
    if (callback(envelopeItem, envelopeItemType))
      return !0;
  }
  return !1;
}
function encodeUTF8(input) {
  const carrier = getSentryCarrier(GLOBAL_OBJ);
  return carrier.encodePolyfill ? carrier.encodePolyfill(input) : new TextEncoder().encode(input);
}
function serializeEnvelope(envelope) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    typeof parts == "string" ? parts = typeof next == "string" ? parts + next : [encodeUTF8(parts), next] : parts.push(typeof next == "string" ? encodeUTF8(next) : next);
  }
  for (const item of items) {
    const [itemHeaders, payload] = item;
    if (append(`
${JSON.stringify(itemHeaders)}
`), typeof payload == "string" || payload instanceof Uint8Array)
      append(payload);
    else {
      let stringifiedPayload;
      try {
        stringifiedPayload = JSON.stringify(payload);
      } catch {
        stringifiedPayload = JSON.stringify(normalize(payload));
      }
      append(stringifiedPayload);
    }
  }
  return typeof parts == "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0), merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers)
    merged.set(buffer, offset), offset += buffer.length;
  return merged;
}
function createAttachmentEnvelopeItem(attachment) {
  const buffer = typeof attachment.data == "string" ? encodeUTF8(attachment.data) : attachment.data;
  return [
    {
      type: "attachment",
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType
    },
    buffer
  ];
}
const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  profile_chunk: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  span: "span",
  raw_security: "security",
  otel_log: "log_item"
};
function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
  if (!(metadataOrEvent != null && metadataOrEvent.sdk))
    return;
  const { name, version } = metadataOrEvent.sdk;
  return { name, version };
}
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  var _a;
  const dynamicSamplingContext = (_a = event.sdkProcessingMetadata) == null ? void 0 : _a.dynamicSamplingContext;
  return {
    event_id: event.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) },
    ...dynamicSamplingContext && {
      trace: dynamicSamplingContext
    }
  };
}
function enhanceEventWithSdkInfo(event, sdkInfo) {
  return sdkInfo && (event.sdk = event.sdk || {}, event.sdk.name = event.sdk.name || sdkInfo.name, event.sdk.version = event.sdk.version || sdkInfo.version, event.sdk.integrations = [...event.sdk.integrations || [], ...sdkInfo.integrations || []], event.sdk.packages = [...event.sdk.packages || [], ...sdkInfo.packages || []]), event;
}
function createSessionEnvelope(session, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata), envelopeHeaders = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  }, envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
  return createEnvelope(envelopeHeaders, [envelopeItem]);
}
function createEventEnvelope(event, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata), eventType = event.type && event.type !== "replay_event" ? event.type : "event";
  enhanceEventWithSdkInfo(event, metadata == null ? void 0 : metadata.sdk);
  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  return delete event.sdkProcessingMetadata, createEnvelope(envelopeHeaders, [[{ type: eventType }, event]]);
}
var States;
(function(States2) {
  States2[States2.PENDING = 0] = "PENDING";
  const RESOLVED = 1;
  States2[States2.RESOLVED = RESOLVED] = "RESOLVED";
  const REJECTED = 2;
  States2[States2.REJECTED = REJECTED] = "REJECTED";
})(States || (States = {}));
function resolvedSyncPromise(value) {
  return new SyncPromise((resolve) => {
    resolve(value);
  });
}
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
class SyncPromise {
  constructor(executor) {
    this._state = States.PENDING, this._handlers = [], this._runExecutor(executor);
  }
  /** @inheritdoc */
  then(onfulfilled, onrejected) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([
        !1,
        (result) => {
          if (!onfulfilled)
            resolve(result);
          else
            try {
              resolve(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
        },
        (reason) => {
          if (!onrejected)
            reject(reason);
          else
            try {
              resolve(onrejected(reason));
            } catch (e) {
              reject(e);
            }
        }
      ]), this._executeHandlers();
    });
  }
  /** @inheritdoc */
  catch(onrejected) {
    return this.then((val) => val, onrejected);
  }
  /** @inheritdoc */
  finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val, isRejected;
      return this.then(
        (value) => {
          isRejected = !1, val = value, onfinally && onfinally();
        },
        (reason) => {
          isRejected = !0, val = reason, onfinally && onfinally();
        }
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }
        resolve(val);
      });
    });
  }
  /** Excute the resolve/reject handlers. */
  _executeHandlers() {
    if (this._state === States.PENDING)
      return;
    const cachedHandlers = this._handlers.slice();
    this._handlers = [], cachedHandlers.forEach((handler) => {
      handler[0] || (this._state === States.RESOLVED && handler[1](this._value), this._state === States.REJECTED && handler[2](this._value), handler[0] = !0);
    });
  }
  /** Run the executor for the SyncPromise. */
  _runExecutor(executor) {
    const setResult = (state, value) => {
      if (this._state === States.PENDING) {
        if (isThenable(value)) {
          value.then(resolve, reject);
          return;
        }
        this._state = state, this._value = value, this._executeHandlers();
      }
    }, resolve = (value) => {
      setResult(States.RESOLVED, value);
    }, reject = (reason) => {
      setResult(States.REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}
function notifyEventProcessors(processors, event, hint, index = 0) {
  return new SyncPromise((resolve, reject) => {
    const processor = processors[index];
    if (event === null || typeof processor != "function")
      resolve(event);
    else {
      const result = processor({ ...event }, hint);
      DEBUG_BUILD$3 && processor.id && result === null && logger.log(`Event processor "${processor.id}" dropped event`), isThenable(result) ? result.then((final) => notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject) : notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
    }
  });
}
let parsedStackResults, lastKeysCount, cachedFilenameDebugIds;
function getFilenameToDebugIdMap(stackParser) {
  const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  if (!debugIdMap)
    return {};
  const debugIdKeys = Object.keys(debugIdMap);
  return cachedFilenameDebugIds && debugIdKeys.length === lastKeysCount || (lastKeysCount = debugIdKeys.length, cachedFilenameDebugIds = debugIdKeys.reduce((acc, stackKey) => {
    parsedStackResults || (parsedStackResults = {});
    const result = parsedStackResults[stackKey];
    if (result)
      acc[result[0]] = result[1];
    else {
      const parsedStack = stackParser(stackKey);
      for (let i = parsedStack.length - 1; i >= 0; i--) {
        const stackFrame = parsedStack[i], filename = stackFrame == null ? void 0 : stackFrame.filename, debugId = debugIdMap[stackKey];
        if (filename && debugId) {
          acc[filename] = debugId, parsedStackResults[stackKey] = [filename, debugId];
          break;
        }
      }
    }
    return acc;
  }, {})), cachedFilenameDebugIds;
}
function applyScopeDataToEvent(event, data) {
  const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
  applyDataToEvent(event, data), span && applySpanToEvent(event, span), applyFingerprintToEvent(event, fingerprint), applyBreadcrumbsToEvent(event, breadcrumbs), applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
function mergeScopeData(data, mergeData) {
  const {
    extra,
    tags,
    user,
    contexts,
    level,
    sdkProcessingMetadata,
    breadcrumbs,
    fingerprint,
    eventProcessors,
    attachments,
    propagationContext,
    transactionName,
    span
  } = mergeData;
  mergeAndOverwriteScopeData(data, "extra", extra), mergeAndOverwriteScopeData(data, "tags", tags), mergeAndOverwriteScopeData(data, "user", user), mergeAndOverwriteScopeData(data, "contexts", contexts), data.sdkProcessingMetadata = merge(data.sdkProcessingMetadata, sdkProcessingMetadata, 2), level && (data.level = level), transactionName && (data.transactionName = transactionName), span && (data.span = span), breadcrumbs.length && (data.breadcrumbs = [...data.breadcrumbs, ...breadcrumbs]), fingerprint.length && (data.fingerprint = [...data.fingerprint, ...fingerprint]), eventProcessors.length && (data.eventProcessors = [...data.eventProcessors, ...eventProcessors]), attachments.length && (data.attachments = [...data.attachments, ...attachments]), data.propagationContext = { ...data.propagationContext, ...propagationContext };
}
function mergeAndOverwriteScopeData(data, prop, mergeVal) {
  data[prop] = merge(data[prop], mergeVal, 1);
}
function applyDataToEvent(event, data) {
  const { extra, tags, user, contexts, level, transactionName } = data;
  Object.keys(extra).length && (event.extra = { ...extra, ...event.extra }), Object.keys(tags).length && (event.tags = { ...tags, ...event.tags }), Object.keys(user).length && (event.user = { ...user, ...event.user }), Object.keys(contexts).length && (event.contexts = { ...contexts, ...event.contexts }), level && (event.level = level), transactionName && event.type !== "transaction" && (event.transaction = transactionName);
}
function applyBreadcrumbsToEvent(event, breadcrumbs) {
  const mergedBreadcrumbs = [...event.breadcrumbs || [], ...breadcrumbs];
  event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : void 0;
}
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
  event.sdkProcessingMetadata = {
    ...event.sdkProcessingMetadata,
    ...sdkProcessingMetadata
  };
}
function applySpanToEvent(event, span) {
  event.contexts = {
    trace: spanToTraceContext(span),
    ...event.contexts
  }, event.sdkProcessingMetadata = {
    dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
    ...event.sdkProcessingMetadata
  };
  const rootSpan = getRootSpan(span), transactionName = spanToJSON(rootSpan).description;
  transactionName && !event.transaction && event.type === "transaction" && (event.transaction = transactionName);
}
function applyFingerprintToEvent(event, fingerprint) {
  event.fingerprint = event.fingerprint ? Array.isArray(event.fingerprint) ? event.fingerprint : [event.fingerprint] : [], fingerprint && (event.fingerprint = event.fingerprint.concat(fingerprint)), event.fingerprint.length || delete event.fingerprint;
}
function prepareEvent(options, event, hint, scope, client, isolationScope) {
  const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options, prepared = {
    ...event,
    event_id: event.event_id || hint.event_id || uuid4(),
    timestamp: event.timestamp || dateTimestampInSeconds()
  }, integrations = hint.integrations || options.integrations.map((i) => i.name);
  applyClientOptions(prepared, options), applyIntegrationsMetadata(prepared, integrations), client && client.emit("applyFrameMetadata", event), event.type === void 0 && applyDebugIds(prepared, options.stackParser);
  const finalScope = getFinalScope(scope, hint.captureContext);
  hint.mechanism && addExceptionMechanism(prepared, hint.mechanism);
  const clientEventProcessors = client ? client.getEventProcessors() : [], data = getGlobalScope().getScopeData();
  if (isolationScope) {
    const isolationData = isolationScope.getScopeData();
    mergeScopeData(data, isolationData);
  }
  if (finalScope) {
    const finalScopeData = finalScope.getScopeData();
    mergeScopeData(data, finalScopeData);
  }
  const attachments = [...hint.attachments || [], ...data.attachments];
  attachments.length && (hint.attachments = attachments), applyScopeDataToEvent(prepared, data);
  const eventProcessors = [
    ...clientEventProcessors,
    // Run scope event processors _after_ all other processors
    ...data.eventProcessors
  ];
  return notifyEventProcessors(eventProcessors, prepared, hint).then((evt) => (evt && applyDebugMeta(evt), typeof normalizeDepth == "number" && normalizeDepth > 0 ? normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth) : evt));
}
function applyClientOptions(event, options) {
  const { environment, release, dist, maxValueLength = 250 } = options;
  event.environment = event.environment || environment || DEFAULT_ENVIRONMENT, !event.release && release && (event.release = release), !event.dist && dist && (event.dist = dist);
  const request = event.request;
  request != null && request.url && (request.url = truncate(request.url, maxValueLength));
}
function applyDebugIds(event, stackParser) {
  var _a, _b;
  const filenameDebugIdMap = getFilenameToDebugIdMap(stackParser);
  (_b = (_a = event.exception) == null ? void 0 : _a.values) == null || _b.forEach((exception) => {
    var _a2, _b2;
    (_b2 = (_a2 = exception.stacktrace) == null ? void 0 : _a2.frames) == null || _b2.forEach((frame) => {
      frame.filename && (frame.debug_id = filenameDebugIdMap[frame.filename]);
    });
  });
}
function applyDebugMeta(event) {
  var _a, _b;
  const filenameDebugIdMap = {};
  if ((_b = (_a = event.exception) == null ? void 0 : _a.values) == null || _b.forEach((exception) => {
    var _a2, _b2;
    (_b2 = (_a2 = exception.stacktrace) == null ? void 0 : _a2.frames) == null || _b2.forEach((frame) => {
      frame.debug_id && (frame.abs_path ? filenameDebugIdMap[frame.abs_path] = frame.debug_id : frame.filename && (filenameDebugIdMap[frame.filename] = frame.debug_id), delete frame.debug_id);
    });
  }), Object.keys(filenameDebugIdMap).length === 0)
    return;
  event.debug_meta = event.debug_meta || {}, event.debug_meta.images = event.debug_meta.images || [];
  const images = event.debug_meta.images;
  Object.entries(filenameDebugIdMap).forEach(([filename, debug_id]) => {
    images.push({
      type: "sourcemap",
      code_file: filename,
      debug_id
    });
  });
}
function applyIntegrationsMetadata(event, integrationNames) {
  integrationNames.length > 0 && (event.sdk = event.sdk || {}, event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames]);
}
function normalizeEvent(event, depth, maxBreadth) {
  var _a, _b;
  if (!event)
    return null;
  const normalized = {
    ...event,
    ...event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        ...b.data && {
          data: normalize(b.data, depth, maxBreadth)
        }
      }))
    },
    ...event.user && {
      user: normalize(event.user, depth, maxBreadth)
    },
    ...event.contexts && {
      contexts: normalize(event.contexts, depth, maxBreadth)
    },
    ...event.extra && {
      extra: normalize(event.extra, depth, maxBreadth)
    }
  };
  return (_a = event.contexts) != null && _a.trace && normalized.contexts && (normalized.contexts.trace = event.contexts.trace, event.contexts.trace.data && (normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth))), event.spans && (normalized.spans = event.spans.map((span) => ({
    ...span,
    ...span.data && {
      data: normalize(span.data, depth, maxBreadth)
    }
  }))), (_b = event.contexts) != null && _b.flags && normalized.contexts && (normalized.contexts.flags = normalize(event.contexts.flags, 3, maxBreadth)), normalized;
}
function getFinalScope(scope, captureContext) {
  if (!captureContext)
    return scope;
  const finalScope = scope ? scope.clone() : new Scope();
  return finalScope.update(captureContext), finalScope;
}
function captureException(exception, hint) {
  return getCurrentScope().captureException(exception, void 0);
}
function captureEvent(event, hint) {
  return getCurrentScope().captureEvent(event, hint);
}
function startSession(context) {
  const isolationScope = getIsolationScope(), currentScope = getCurrentScope(), { userAgent } = GLOBAL_OBJ.navigator || {}, session = makeSession({
    user: currentScope.getUser() || isolationScope.getUser(),
    ...userAgent && { userAgent },
    ...context
  }), currentSession = isolationScope.getSession();
  return (currentSession == null ? void 0 : currentSession.status) === "ok" && updateSession(currentSession, { status: "exited" }), endSession(), isolationScope.setSession(session), session;
}
function endSession() {
  const isolationScope = getIsolationScope(), session = getCurrentScope().getSession() || isolationScope.getSession();
  session && closeSession(session), _sendSessionUpdate(), isolationScope.setSession();
}
function _sendSessionUpdate() {
  const isolationScope = getIsolationScope(), client = getClient(), session = isolationScope.getSession();
  session && client && client.captureSession(session);
}
function captureSession(end = !1) {
  if (end) {
    endSession();
    return;
  }
  _sendSessionUpdate();
}
const SENTRY_API_VERSION = "7";
function getBaseApiEndpoint(dsn) {
  const protocol = dsn.protocol ? `${dsn.protocol}:` : "", port = dsn.port ? `:${dsn.port}` : "";
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
function _encodedAuth(dsn, sdkInfo) {
  const params = {
    sentry_version: SENTRY_API_VERSION
  };
  return dsn.publicKey && (params.sentry_key = dsn.publicKey), sdkInfo && (params.sentry_client = `${sdkInfo.name}/${sdkInfo.version}`), new URLSearchParams(params).toString();
}
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel, sdkInfo) {
  return tunnel || `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
const installedIntegrations = [];
function filterDuplicates(integrations) {
  const integrationsByName = {};
  return integrations.forEach((currentInstance) => {
    const { name } = currentInstance, existingInstance = integrationsByName[name];
    existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance || (integrationsByName[name] = currentInstance);
  }), Object.values(integrationsByName);
}
function getIntegrationsToSetup(options) {
  const defaultIntegrations = options.defaultIntegrations || [], userIntegrations = options.integrations;
  defaultIntegrations.forEach((integration) => {
    integration.isDefaultInstance = !0;
  });
  let integrations;
  if (Array.isArray(userIntegrations))
    integrations = [...defaultIntegrations, ...userIntegrations];
  else if (typeof userIntegrations == "function") {
    const resolvedUserIntegrations = userIntegrations(defaultIntegrations);
    integrations = Array.isArray(resolvedUserIntegrations) ? resolvedUserIntegrations : [resolvedUserIntegrations];
  } else
    integrations = defaultIntegrations;
  return filterDuplicates(integrations);
}
function setupIntegrations(client, integrations) {
  const integrationIndex = {};
  return integrations.forEach((integration) => {
    integration && setupIntegration(client, integration, integrationIndex);
  }), integrationIndex;
}
function afterSetupIntegrations(client, integrations) {
  for (const integration of integrations)
    integration != null && integration.afterAllSetup && integration.afterAllSetup(client);
}
function setupIntegration(client, integration, integrationIndex) {
  if (integrationIndex[integration.name]) {
    DEBUG_BUILD$3 && logger.log(`Integration skipped because it was already installed: ${integration.name}`);
    return;
  }
  if (integrationIndex[integration.name] = integration, installedIntegrations.indexOf(integration.name) === -1 && typeof integration.setupOnce == "function" && (integration.setupOnce(), installedIntegrations.push(integration.name)), integration.setup && typeof integration.setup == "function" && integration.setup(client), typeof integration.preprocessEvent == "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (typeof integration.processEvent == "function") {
    const callback = integration.processEvent.bind(integration), processor = Object.assign((event, hint) => callback(event, hint, client), {
      id: integration.name
    });
    client.addEventProcessor(processor);
  }
  DEBUG_BUILD$3 && logger.log(`Integration installed: ${integration.name}`);
}
function getPossibleEventMessages(event) {
  const possibleMessages = [];
  event.message && possibleMessages.push(event.message);
  try {
    const lastException = event.exception.values[event.exception.values.length - 1];
    lastException != null && lastException.value && (possibleMessages.push(lastException.value), lastException.type && possibleMessages.push(`${lastException.type}: ${lastException.value}`));
  } catch {
  }
  return possibleMessages;
}
function convertTransactionEventToSpanJson(event) {
  var _a;
  const { trace_id, parent_span_id, span_id, status, origin, data, op } = ((_a = event.contexts) == null ? void 0 : _a.trace) ?? {};
  return {
    data: data ?? {},
    description: event.transaction,
    op,
    parent_span_id,
    span_id: span_id ?? "",
    start_timestamp: event.start_timestamp ?? 0,
    status,
    timestamp: event.timestamp,
    trace_id: trace_id ?? "",
    origin,
    profile_id: data == null ? void 0 : data[SEMANTIC_ATTRIBUTE_PROFILE_ID],
    exclusive_time: data == null ? void 0 : data[SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
    measurements: event.measurements,
    is_segment: !0
  };
}
function convertSpanJsonToTransactionEvent(span) {
  return {
    type: "transaction",
    timestamp: span.timestamp,
    start_timestamp: span.start_timestamp,
    transaction: span.description,
    contexts: {
      trace: {
        trace_id: span.trace_id,
        span_id: span.span_id,
        parent_span_id: span.parent_span_id,
        op: span.op,
        status: span.status,
        origin: span.origin,
        data: {
          ...span.data,
          ...span.profile_id && { [SEMANTIC_ATTRIBUTE_PROFILE_ID]: span.profile_id },
          ...span.exclusive_time && { [SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: span.exclusive_time }
        }
      }
    },
    measurements: span.measurements
  };
}
function createClientReportEnvelope(discarded_events, dsn, timestamp) {
  const clientReportItem = [
    { type: "client_report" },
    {
      timestamp: dateTimestampInSeconds(),
      discarded_events
    }
  ];
  return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
}
const ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.", MISSING_RELEASE_FOR_SESSION_ERROR = "Discarded session because of missing or non-string release", INTERNAL_ERROR_SYMBOL = Symbol.for("SentryInternalError"), DO_NOT_SEND_EVENT_SYMBOL = Symbol.for("SentryDoNotSendEventError");
function _makeInternalError(message) {
  return {
    message,
    [INTERNAL_ERROR_SYMBOL]: !0
  };
}
function _makeDoNotSendEventError(message) {
  return {
    message,
    [DO_NOT_SEND_EVENT_SYMBOL]: !0
  };
}
function _isInternalError(error) {
  return !!error && typeof error == "object" && INTERNAL_ERROR_SYMBOL in error;
}
function _isDoNotSendEventError(error) {
  return !!error && typeof error == "object" && DO_NOT_SEND_EVENT_SYMBOL in error;
}
class Client {
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
  /** Number of calls being processed */
  /** Holds flushable  */
  // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(options) {
    if (this._options = options, this._integrations = {}, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], options.dsn ? this._dsn = makeDsn(options.dsn) : DEBUG_BUILD$3 && logger.warn("No DSN provided, client will not send events."), this._dsn) {
      const url = getEnvelopeEndpointWithUrlEncodedAuth(
        this._dsn,
        options.tunnel,
        options._metadata ? options._metadata.sdk : void 0
      );
      this._transport = options.transport({
        tunnel: this._options.tunnel,
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url
      });
    }
  }
  /**
   * Captures an exception event and sends it to Sentry.
   *
   * Unlike `captureException` exported from every SDK, this method requires that you pass it the current scope.
   */
  captureException(exception, hint, scope) {
    const eventId = uuid4();
    if (checkOrSetAlreadyCaught(exception))
      return DEBUG_BUILD$3 && logger.log(ALREADY_SEEN_ERROR), eventId;
    const hintWithEventId = {
      event_id: eventId,
      ...hint
    };
    return this._process(
      this.eventFromException(exception, hintWithEventId).then(
        (event) => this._captureEvent(event, hintWithEventId, scope)
      )
    ), hintWithEventId.event_id;
  }
  /**
   * Captures a message event and sends it to Sentry.
   *
   * Unlike `captureMessage` exported from every SDK, this method requires that you pass it the current scope.
   */
  captureMessage(message, level, hint, currentScope) {
    const hintWithEventId = {
      event_id: uuid4(),
      ...hint
    }, eventMessage = isParameterizedString(message) ? message : String(message), promisedEvent = isPrimitive(message) ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
    return this._process(promisedEvent.then((event) => this._captureEvent(event, hintWithEventId, currentScope))), hintWithEventId.event_id;
  }
  /**
   * Captures a manually created event and sends it to Sentry.
   *
   * Unlike `captureEvent` exported from every SDK, this method requires that you pass it the current scope.
   */
  captureEvent(event, hint, currentScope) {
    const eventId = uuid4();
    if (hint != null && hint.originalException && checkOrSetAlreadyCaught(hint.originalException))
      return DEBUG_BUILD$3 && logger.log(ALREADY_SEEN_ERROR), eventId;
    const hintWithEventId = {
      event_id: eventId,
      ...hint
    }, sdkProcessingMetadata = event.sdkProcessingMetadata || {}, capturedSpanScope = sdkProcessingMetadata.capturedSpanScope, capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
    return this._process(
      this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope, capturedSpanIsolationScope)
    ), hintWithEventId.event_id;
  }
  /**
   * Captures a session.
   */
  captureSession(session) {
    this.sendSession(session), updateSession(session, { init: !1 });
  }
  /**
   * Create a cron monitor check in and send it to Sentry. This method is not available on all clients.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   * @param scope An optional scope containing event metadata.
   * @returns A string representing the id of the check in.
   */
  /**
   * Get the current Dsn.
   */
  getDsn() {
    return this._dsn;
  }
  /**
   * Get the current options.
   */
  getOptions() {
    return this._options;
  }
  /**
   * Get the SDK metadata.
   * @see SdkMetadata
   */
  getSdkMetadata() {
    return this._options._metadata;
  }
  /**
   * Returns the transport that is used by the client.
   * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
   */
  getTransport() {
    return this._transport;
  }
  /**
   * Wait for all events to be sent or the timeout to expire, whichever comes first.
   *
   * @param timeout Maximum time in ms the client should wait for events to be flushed. Omitting this parameter will
   *   cause the client to wait until all events are sent before resolving the promise.
   * @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
   * still events in the queue when the timeout is reached.
   */
  flush(timeout) {
    const transport = this._transport;
    return transport ? (this.emit("flush"), this._isClientDoneProcessing(timeout).then((clientFinished) => transport.flush(timeout).then((transportFlushed) => clientFinished && transportFlushed))) : resolvedSyncPromise(!0);
  }
  /**
   * Flush the event queue and set the client to `enabled = false`. See {@link Client.flush}.
   *
   * @param {number} timeout Maximum time in ms the client should wait before shutting down. Omitting this parameter will cause
   *   the client to wait until all events are sent before disabling itself.
   * @returns {Promise<boolean>} A promise which resolves to `true` if the flush completes successfully before the timeout, or `false` if
   * it doesn't.
   */
  close(timeout) {
    return this.flush(timeout).then((result) => (this.getOptions().enabled = !1, this.emit("close"), result));
  }
  /**
   * Get all installed event processors.
   */
  getEventProcessors() {
    return this._eventProcessors;
  }
  /**
   * Adds an event processor that applies to any event processed by this client.
   */
  addEventProcessor(eventProcessor) {
    this._eventProcessors.push(eventProcessor);
  }
  /**
   * Initialize this client.
   * Call this after the client was set on a scope.
   */
  init() {
    (this._isEnabled() || // Force integrations to be setup even if no DSN was set when we have
    // Spotlight enabled. This is particularly important for browser as we
    // don't support the `spotlight` option there and rely on the users
    // adding the `spotlightBrowserIntegration()` to their integrations which
    // wouldn't get initialized with the check below when there's no DSN set.
    this._options.integrations.some(({ name }) => name.startsWith("Spotlight"))) && this._setupIntegrations();
  }
  /**
   * Gets an installed integration by its name.
   *
   * @returns {Integration|undefined} The installed integration or `undefined` if no integration with that `name` was installed.
   */
  getIntegrationByName(integrationName) {
    return this._integrations[integrationName];
  }
  /**
   * Add an integration to the client.
   * This can be used to e.g. lazy load integrations.
   * In most cases, this should not be necessary,
   * and you're better off just passing the integrations via `integrations: []` at initialization time.
   * However, if you find the need to conditionally load & add an integration, you can use `addIntegration` to do so.
   */
  addIntegration(integration) {
    const isAlreadyInstalled = this._integrations[integration.name];
    setupIntegration(this, integration, this._integrations), isAlreadyInstalled || afterSetupIntegrations(this, [integration]);
  }
  /**
   * Send a fully prepared event to Sentry.
   */
  sendEvent(event, hint = {}) {
    this.emit("beforeSendEvent", event, hint);
    let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
    for (const attachment of hint.attachments || [])
      env = addItemToEnvelope(env, createAttachmentEnvelopeItem(attachment));
    const promise = this.sendEnvelope(env);
    promise && promise.then((sendResponse) => this.emit("afterSendEvent", event, sendResponse), null);
  }
  /**
   * Send a session or session aggregrates to Sentry.
   */
  sendSession(session) {
    const { release: clientReleaseOption, environment: clientEnvironmentOption = DEFAULT_ENVIRONMENT } = this._options;
    if ("aggregates" in session) {
      const sessionAttrs = session.attrs || {};
      if (!sessionAttrs.release && !clientReleaseOption) {
        DEBUG_BUILD$3 && logger.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
        return;
      }
      sessionAttrs.release = sessionAttrs.release || clientReleaseOption, sessionAttrs.environment = sessionAttrs.environment || clientEnvironmentOption, session.attrs = sessionAttrs;
    } else {
      if (!session.release && !clientReleaseOption) {
        DEBUG_BUILD$3 && logger.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
        return;
      }
      session.release = session.release || clientReleaseOption, session.environment = session.environment || clientEnvironmentOption;
    }
    this.emit("beforeSendSession", session);
    const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
    this.sendEnvelope(env);
  }
  /**
   * Record on the client that an event got dropped (ie, an event that will not be sent to Sentry).
   */
  recordDroppedEvent(reason, category, count = 1) {
    if (this._options.sendClientReports) {
      const key = `${reason}:${category}`;
      DEBUG_BUILD$3 && logger.log(`Recording outcome: "${key}"${count > 1 ? ` (${count} times)` : ""}`), this._outcomes[key] = (this._outcomes[key] || 0) + count;
    }
  }
  /* eslint-disable @typescript-eslint/unified-signatures */
  /**
   * Register a callback for whenever a span is started.
   * Receives the span as argument.
   * @returns {() => void} A function that, when executed, removes the registered callback.
   */
  /**
   * Register a hook on this client.
   */
  on(hook, callback) {
    const hooks = this._hooks[hook] = this._hooks[hook] || [];
    return hooks.push(callback), () => {
      const cbIndex = hooks.indexOf(callback);
      cbIndex > -1 && hooks.splice(cbIndex, 1);
    };
  }
  /** Fire a hook whenever a span starts. */
  /**
   * Emit a hook that was previously registered via `on()`.
   */
  emit(hook, ...rest) {
    const callbacks = this._hooks[hook];
    callbacks && callbacks.forEach((callback) => callback(...rest));
  }
  /**
   * Send an envelope to Sentry.
   */
  sendEnvelope(envelope) {
    return this.emit("beforeEnvelope", envelope), this._isEnabled() && this._transport ? this._transport.send(envelope).then(null, (reason) => (DEBUG_BUILD$3 && logger.error("Error while sending envelope:", reason), reason)) : (DEBUG_BUILD$3 && logger.error("Transport disabled"), resolvedSyncPromise({}));
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Setup integrations for this client. */
  _setupIntegrations() {
    const { integrations } = this._options;
    this._integrations = setupIntegrations(this, integrations), afterSetupIntegrations(this, integrations);
  }
  /** Updates existing session based on the provided event */
  _updateSessionFromEvent(session, event) {
    var _a;
    let crashed = event.level === "fatal", errored = !1;
    const exceptions = (_a = event.exception) == null ? void 0 : _a.values;
    if (exceptions) {
      errored = !0;
      for (const ex of exceptions) {
        const mechanism = ex.mechanism;
        if ((mechanism == null ? void 0 : mechanism.handled) === !1) {
          crashed = !0;
          break;
        }
      }
    }
    const sessionNonTerminal = session.status === "ok";
    (sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed) && (updateSession(session, {
      ...crashed && { status: "crashed" },
      errors: session.errors || Number(errored || crashed)
    }), this.captureSession(session));
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
  _isClientDoneProcessing(timeout) {
    return new SyncPromise((resolve) => {
      let ticked = 0;
      const tick = 1, interval = setInterval(() => {
        this._numProcessing == 0 ? (clearInterval(interval), resolve(!0)) : (ticked += tick, timeout && ticked >= timeout && (clearInterval(interval), resolve(!1)));
      }, tick);
    });
  }
  /** Determines whether this SDK is enabled and a transport is present. */
  _isEnabled() {
    return this.getOptions().enabled !== !1 && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(event, hint, currentScope, isolationScope) {
    const options = this.getOptions(), integrations = Object.keys(this._integrations);
    return !hint.integrations && (integrations != null && integrations.length) && (hint.integrations = integrations), this.emit("preprocessEvent", event, hint), event.type || isolationScope.setLastEventId(event.event_id || hint.event_id), prepareEvent(options, event, hint, currentScope, this, isolationScope).then((evt) => {
      if (evt === null)
        return evt;
      this.emit("postprocessEvent", evt, hint), evt.contexts = {
        trace: getTraceContextFromScope(currentScope),
        ...evt.contexts
      };
      const dynamicSamplingContext = getDynamicSamplingContextFromScope(this, currentScope);
      return evt.sdkProcessingMetadata = {
        dynamicSamplingContext,
        ...evt.sdkProcessingMetadata
      }, evt;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
  _captureEvent(event, hint = {}, currentScope = getCurrentScope(), isolationScope = getIsolationScope()) {
    return DEBUG_BUILD$3 && isErrorEvent(event) && logger.log(`Captured error event \`${getPossibleEventMessages(event)[0] || "<unknown>"}\``), this._processEvent(event, hint, currentScope, isolationScope).then(
      (finalEvent) => finalEvent.event_id,
      (reason) => {
        DEBUG_BUILD$3 && (_isDoNotSendEventError(reason) ? logger.log(reason.message) : _isInternalError(reason) ? logger.warn(reason.message) : logger.warn(reason));
      }
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(event, hint, currentScope, isolationScope) {
    const options = this.getOptions(), { sampleRate } = options, isTransaction = isTransactionEvent(event), isError2 = isErrorEvent(event), eventType = event.type || "error", beforeSendLabel = `before send for type \`${eventType}\``, parsedSampleRate = typeof sampleRate > "u" ? void 0 : parseSampleRate(sampleRate);
    if (isError2 && typeof parsedSampleRate == "number" && Math.random() > parsedSampleRate)
      return this.recordDroppedEvent("sample_rate", "error"), rejectedSyncPromise(
        _makeDoNotSendEventError(
          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`
        )
      );
    const dataCategory = eventType === "replay_event" ? "replay" : eventType;
    return this._prepareEvent(event, hint, currentScope, isolationScope).then((prepared) => {
      if (prepared === null)
        throw this.recordDroppedEvent("event_processor", dataCategory), _makeDoNotSendEventError("An event processor returned `null`, will not send event.");
      if (hint.data && hint.data.__sentry__ === !0)
        return prepared;
      const result = processBeforeSend(this, options, prepared, hint);
      return _validateBeforeSendResult(result, beforeSendLabel);
    }).then((processedEvent) => {
      var _a;
      if (processedEvent === null) {
        if (this.recordDroppedEvent("before_send", dataCategory), isTransaction) {
          const spanCount = 1 + (event.spans || []).length;
          this.recordDroppedEvent("before_send", "span", spanCount);
        }
        throw _makeDoNotSendEventError(`${beforeSendLabel} returned \`null\`, will not send event.`);
      }
      const session = currentScope.getSession() || isolationScope.getSession();
      if (isError2 && session && this._updateSessionFromEvent(session, processedEvent), isTransaction) {
        const spanCountBefore = ((_a = processedEvent.sdkProcessingMetadata) == null ? void 0 : _a.spanCountBeforeProcessing) || 0, spanCountAfter = processedEvent.spans ? processedEvent.spans.length : 0, droppedSpanCount = spanCountBefore - spanCountAfter;
        droppedSpanCount > 0 && this.recordDroppedEvent("before_send", "span", droppedSpanCount);
      }
      const transactionInfo = processedEvent.transaction_info;
      if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
        const source = "custom";
        processedEvent.transaction_info = {
          ...transactionInfo,
          source
        };
      }
      return this.sendEvent(processedEvent, hint), processedEvent;
    }).then(null, (reason) => {
      throw _isDoNotSendEventError(reason) || _isInternalError(reason) ? reason : (this.captureException(reason, {
        data: {
          __sentry__: !0
        },
        originalException: reason
      }), _makeInternalError(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
      ));
    });
  }
  /**
   * Occupies the client with processing and event
   */
  _process(promise) {
    this._numProcessing++, promise.then(
      (value) => (this._numProcessing--, value),
      (reason) => (this._numProcessing--, reason)
    );
  }
  /**
   * Clears outcomes on this client and returns them.
   */
  _clearOutcomes() {
    const outcomes = this._outcomes;
    return this._outcomes = {}, Object.entries(outcomes).map(([key, quantity]) => {
      const [reason, category] = key.split(":");
      return {
        reason,
        category,
        quantity
      };
    });
  }
  /**
   * Sends client reports as an envelope.
   */
  _flushOutcomes() {
    DEBUG_BUILD$3 && logger.log("Flushing outcomes...");
    const outcomes = this._clearOutcomes();
    if (outcomes.length === 0) {
      DEBUG_BUILD$3 && logger.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      DEBUG_BUILD$3 && logger.log("No dsn provided, will not send outcomes");
      return;
    }
    DEBUG_BUILD$3 && logger.log("Sending outcomes:", outcomes);
    const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
    this.sendEnvelope(envelope);
  }
  /**
   * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
   */
}
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
  const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
  if (isThenable(beforeSendResult))
    return beforeSendResult.then(
      (event) => {
        if (!isPlainObject(event) && event !== null)
          throw _makeInternalError(invalidValueError);
        return event;
      },
      (e) => {
        throw _makeInternalError(`${beforeSendLabel} rejected with ${e}`);
      }
    );
  if (!isPlainObject(beforeSendResult) && beforeSendResult !== null)
    throw _makeInternalError(invalidValueError);
  return beforeSendResult;
}
function processBeforeSend(client, options, event, hint) {
  const { beforeSend, beforeSendTransaction, beforeSendSpan } = options;
  let processedEvent = event;
  if (isErrorEvent(processedEvent) && beforeSend)
    return beforeSend(processedEvent, hint);
  if (isTransactionEvent(processedEvent)) {
    if (beforeSendSpan) {
      const processedRootSpanJson = beforeSendSpan(convertTransactionEventToSpanJson(processedEvent));
      if (processedRootSpanJson ? processedEvent = merge(event, convertSpanJsonToTransactionEvent(processedRootSpanJson)) : showSpanDropWarning(), processedEvent.spans) {
        const processedSpans = [];
        for (const span of processedEvent.spans) {
          const processedSpan = beforeSendSpan(span);
          processedSpan ? processedSpans.push(processedSpan) : (showSpanDropWarning(), processedSpans.push(span));
        }
        processedEvent.spans = processedSpans;
      }
    }
    if (beforeSendTransaction) {
      if (processedEvent.spans) {
        const spanCountBefore = processedEvent.spans.length;
        processedEvent.sdkProcessingMetadata = {
          ...event.sdkProcessingMetadata,
          spanCountBeforeProcessing: spanCountBefore
        };
      }
      return beforeSendTransaction(processedEvent, hint);
    }
  }
  return processedEvent;
}
function isErrorEvent(event) {
  return event.type === void 0;
}
function isTransactionEvent(event) {
  return event.type === "transaction";
}
function createOtelLogEnvelopeItem(log) {
  return [
    {
      type: "otel_log"
    },
    log
  ];
}
function createOtelLogEnvelope(logs, metadata, tunnel, dsn) {
  const headers = {};
  return metadata != null && metadata.sdk && (headers.sdk = {
    name: metadata.sdk.name,
    version: metadata.sdk.version
  }), tunnel && dsn && (headers.dsn = dsnToString(dsn)), createEnvelope(headers, logs.map(createOtelLogEnvelopeItem));
}
const CLIENT_TO_LOG_BUFFER_MAP = /* @__PURE__ */ new WeakMap();
function _INTERNAL_flushLogsBuffer(client, maybeLogBuffer) {
  const logBuffer = CLIENT_TO_LOG_BUFFER_MAP.get(client) ?? [];
  if (logBuffer.length === 0)
    return;
  const clientOptions = client.getOptions(), envelope = createOtelLogEnvelope(logBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
  logBuffer.length = 0, client.emit("flushLogs"), client.sendEnvelope(envelope);
}
function initAndBind(clientClass, options) {
  options.debug === !0 && (DEBUG_BUILD$3 ? logger.enable() : consoleSandbox(() => {
    console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
  })), getCurrentScope().update(options.initialScope);
  const client = new clientClass(options);
  return setCurrentClient(client), client.init(), client;
}
function setCurrentClient(client) {
  getCurrentScope().setClient(client);
}
const SENTRY_BUFFER_FULL_ERROR = Symbol.for("SentryBufferFullError");
function makePromiseBuffer(limit) {
  const buffer = [];
  function isReady() {
    return limit === void 0 || buffer.length < limit;
  }
  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0] || Promise.resolve(void 0);
  }
  function add(taskProducer) {
    if (!isReady())
      return rejectedSyncPromise(SENTRY_BUFFER_FULL_ERROR);
    const task = taskProducer();
    return buffer.indexOf(task) === -1 && buffer.push(task), task.then(() => remove(task)).then(
      null,
      () => remove(task).then(null, () => {
      })
    ), task;
  }
  function drain(timeout) {
    return new SyncPromise((resolve, reject) => {
      let counter = buffer.length;
      if (!counter)
        return resolve(!0);
      const capturedSetTimeout = setTimeout(() => {
        timeout && timeout > 0 && resolve(!1);
      }, timeout);
      buffer.forEach((item) => {
        resolvedSyncPromise(item).then(() => {
          --counter || (clearTimeout(capturedSetTimeout), resolve(!0));
        }, reject);
      });
    });
  }
  return {
    $: buffer,
    add,
    drain
  };
}
const DEFAULT_RETRY_AFTER = 60 * 1e3;
function parseRetryAfterHeader(header, now = Date.now()) {
  const headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay))
    return headerDelay * 1e3;
  const headerDate = Date.parse(`${header}`);
  return isNaN(headerDate) ? DEFAULT_RETRY_AFTER : headerDate - now;
}
function disabledUntil(limits, dataCategory) {
  return limits[dataCategory] || limits.all || 0;
}
function isRateLimited(limits, dataCategory, now = Date.now()) {
  return disabledUntil(limits, dataCategory) > now;
}
function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
  const updatedRateLimits = {
    ...limits
  }, rateLimitHeader = headers == null ? void 0 : headers["x-sentry-rate-limits"], retryAfterHeader = headers == null ? void 0 : headers["retry-after"];
  if (rateLimitHeader)
    for (const limit of rateLimitHeader.trim().split(",")) {
      const [retryAfter, categories, , , namespaces] = limit.split(":", 5), headerDelay = parseInt(retryAfter, 10), delay = (isNaN(headerDelay) ? 60 : headerDelay) * 1e3;
      if (!categories)
        updatedRateLimits.all = now + delay;
      else
        for (const category of categories.split(";"))
          category === "metric_bucket" ? (!namespaces || namespaces.split(";").includes("custom")) && (updatedRateLimits[category] = now + delay) : updatedRateLimits[category] = now + delay;
    }
  else retryAfterHeader ? updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now) : statusCode === 429 && (updatedRateLimits.all = now + 60 * 1e3);
  return updatedRateLimits;
}
const DEFAULT_TRANSPORT_BUFFER_SIZE = 64;
function createTransport(options, makeRequest, buffer = makePromiseBuffer(
  options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
)) {
  let rateLimits = {};
  const flush = (timeout) => buffer.drain(timeout);
  function send(envelope) {
    const filteredEnvelopeItems = [];
    if (forEachEnvelopeItem(envelope, (item, type) => {
      const dataCategory = envelopeItemTypeToDataCategory(type);
      isRateLimited(rateLimits, dataCategory) ? options.recordDroppedEvent("ratelimit_backoff", dataCategory) : filteredEnvelopeItems.push(item);
    }), filteredEnvelopeItems.length === 0)
      return resolvedSyncPromise({});
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems), recordEnvelopeLoss = (reason) => {
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type));
      });
    }, requestTask = () => makeRequest({ body: serializeEnvelope(filteredEnvelope) }).then(
      (response) => (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300) && DEBUG_BUILD$3 && logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`), rateLimits = updateRateLimits(rateLimits, response), response),
      (error) => {
        throw recordEnvelopeLoss("network_error"), DEBUG_BUILD$3 && logger.error("Encountered error running transport request:", error), error;
      }
    );
    return buffer.add(requestTask).then(
      (result) => result,
      (error) => {
        if (error === SENTRY_BUFFER_FULL_ERROR)
          return DEBUG_BUILD$3 && logger.error("Skipped sending event because buffer is full."), recordEnvelopeLoss("queue_overflow"), resolvedSyncPromise({});
        throw error;
      }
    );
  }
  return {
    send,
    flush
  };
}
function addAutoIpAddressToUser(objWithMaybeUser) {
  var _a;
  ((_a = objWithMaybeUser.user) == null ? void 0 : _a.ip_address) === void 0 && (objWithMaybeUser.user = {
    ...objWithMaybeUser.user,
    ip_address: "{{auto}}"
  });
}
function addAutoIpAddressToSession(session) {
  var _a;
  "aggregates" in session ? ((_a = session.attrs) == null ? void 0 : _a.ip_address) === void 0 && (session.attrs = {
    ...session.attrs,
    ip_address: "{{auto}}"
  }) : session.ipAddress === void 0 && (session.ipAddress = "{{auto}}");
}
function applySdkMetadata(options, name, names = [name], source = "npm") {
  const metadata = options._metadata || {};
  metadata.sdk || (metadata.sdk = {
    name: `sentry.javascript.${name}`,
    packages: names.map((name2) => ({
      name: `${source}:@sentry/${name2}`,
      version: SDK_VERSION
    })),
    version: SDK_VERSION
  }), options._metadata = metadata;
}
const DEFAULT_BREADCRUMBS = 100;
function addBreadcrumb(breadcrumb, hint) {
  const client = getClient(), isolationScope = getIsolationScope();
  if (!client) return;
  const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions();
  if (maxBreadcrumbs <= 0) return;
  const mergedBreadcrumb = { timestamp: dateTimestampInSeconds(), ...breadcrumb }, finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
  finalBreadcrumb !== null && (client.emit && client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint), isolationScope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs));
}
let originalFunctionToString;
const INTEGRATION_NAME$6 = "FunctionToString", SETUP_CLIENTS = /* @__PURE__ */ new WeakMap(), _functionToStringIntegration = () => ({
  name: INTEGRATION_NAME$6,
  setupOnce() {
    originalFunctionToString = Function.prototype.toString;
    try {
      Function.prototype.toString = function(...args) {
        const originalFunction = getOriginalFunction(this), context = SETUP_CLIENTS.has(getClient()) && originalFunction !== void 0 ? originalFunction : this;
        return originalFunctionToString.apply(context, args);
      };
    } catch {
    }
  },
  setup(client) {
    SETUP_CLIENTS.set(client, !0);
  }
}), functionToStringIntegration = _functionToStringIntegration, DEFAULT_IGNORE_ERRORS = [
  /^Script error\.?$/,
  /^Javascript error: Script error\.? on line 0$/,
  /^ResizeObserver loop completed with undelivered notifications.$/,
  // The browser logs this when a ResizeObserver handler takes a bit longer. Usually this is not an actual issue though. It indicates slowness.
  /^Cannot redefine property: googletag$/,
  // This is thrown when google tag manager is used in combination with an ad blocker
  /^Can't find variable: gmo$/,
  // Error from Google Search App https://issuetracker.google.com/issues/396043331
  /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
  // Random error that happens but not actionable or noticeable to end-users.
  `can't redefine non-configurable property "solana"`,
  // Probably a browser extension or custom browser (Brave) throwing this error
  "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
  // Error thrown by GTM, seemingly not affecting end-users
  "Can't find variable: _AutofillCallbackHandler",
  // Unactionable error in instagram webview https://developers.facebook.com/community/threads/320013549791141/
  /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
  // unactionable error from CEFSharp, a .NET library that embeds chromium in .NET apps
  /^Java exception was raised during method invocation$/
  // error from Facebook Mobile browser (https://github.com/getsentry/sentry-javascript/issues/15065)
], INTEGRATION_NAME$5 = "EventFilters", eventFiltersIntegration = (options = {}) => {
  let mergedOptions;
  return {
    name: INTEGRATION_NAME$5,
    setup(client) {
      const clientOptions = client.getOptions();
      mergedOptions = _mergeOptions(options, clientOptions);
    },
    processEvent(event, _hint, client) {
      if (!mergedOptions) {
        const clientOptions = client.getOptions();
        mergedOptions = _mergeOptions(options, clientOptions);
      }
      return _shouldDropEvent$1(event, mergedOptions) ? null : event;
    }
  };
}, inboundFiltersIntegration = (options = {}) => ({
  ...eventFiltersIntegration(options),
  name: "InboundFilters"
});
function _mergeOptions(internalOptions = {}, clientOptions = {}) {
  return {
    allowUrls: [...internalOptions.allowUrls || [], ...clientOptions.allowUrls || []],
    denyUrls: [...internalOptions.denyUrls || [], ...clientOptions.denyUrls || []],
    ignoreErrors: [
      ...internalOptions.ignoreErrors || [],
      ...clientOptions.ignoreErrors || [],
      ...internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS
    ],
    ignoreTransactions: [...internalOptions.ignoreTransactions || [], ...clientOptions.ignoreTransactions || []]
  };
}
function _shouldDropEvent$1(event, options) {
  if (event.type) {
    if (event.type === "transaction" && _isIgnoredTransaction(event, options.ignoreTransactions))
      return DEBUG_BUILD$3 && logger.warn(
        `Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${getEventDescription(event)}`
      ), !0;
  } else {
    if (_isIgnoredError(event, options.ignoreErrors))
      return DEBUG_BUILD$3 && logger.warn(
        `Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${getEventDescription(event)}`
      ), !0;
    if (_isUselessError(event))
      return DEBUG_BUILD$3 && logger.warn(
        `Event dropped due to not having an error message, error type or stacktrace.
Event: ${getEventDescription(
          event
        )}`
      ), !0;
    if (_isDeniedUrl(event, options.denyUrls))
      return DEBUG_BUILD$3 && logger.warn(
        `Event dropped due to being matched by \`denyUrls\` option.
Event: ${getEventDescription(
          event
        )}.
Url: ${_getEventFilterUrl(event)}`
      ), !0;
    if (!_isAllowedUrl(event, options.allowUrls))
      return DEBUG_BUILD$3 && logger.warn(
        `Event dropped due to not being matched by \`allowUrls\` option.
Event: ${getEventDescription(
          event
        )}.
Url: ${_getEventFilterUrl(event)}`
      ), !0;
  }
  return !1;
}
function _isIgnoredError(event, ignoreErrors) {
  return ignoreErrors != null && ignoreErrors.length ? getPossibleEventMessages(event).some((message) => stringMatchesSomePattern(message, ignoreErrors)) : !1;
}
function _isIgnoredTransaction(event, ignoreTransactions) {
  if (!(ignoreTransactions != null && ignoreTransactions.length))
    return !1;
  const name = event.transaction;
  return name ? stringMatchesSomePattern(name, ignoreTransactions) : !1;
}
function _isDeniedUrl(event, denyUrls) {
  if (!(denyUrls != null && denyUrls.length))
    return !1;
  const url = _getEventFilterUrl(event);
  return url ? stringMatchesSomePattern(url, denyUrls) : !1;
}
function _isAllowedUrl(event, allowUrls) {
  if (!(allowUrls != null && allowUrls.length))
    return !0;
  const url = _getEventFilterUrl(event);
  return url ? stringMatchesSomePattern(url, allowUrls) : !0;
}
function _getLastValidUrl(frames = []) {
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i];
    if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]")
      return frame.filename || null;
  }
  return null;
}
function _getEventFilterUrl(event) {
  var _a, _b;
  try {
    const rootException = [...((_a = event.exception) == null ? void 0 : _a.values) ?? []].reverse().find((value) => {
      var _a2, _b2, _c;
      return ((_a2 = value.mechanism) == null ? void 0 : _a2.parent_id) === void 0 && ((_c = (_b2 = value.stacktrace) == null ? void 0 : _b2.frames) == null ? void 0 : _c.length);
    }), frames = (_b = rootException == null ? void 0 : rootException.stacktrace) == null ? void 0 : _b.frames;
    return frames ? _getLastValidUrl(frames) : null;
  } catch {
    return DEBUG_BUILD$3 && logger.error(`Cannot extract url for event ${getEventDescription(event)}`), null;
  }
}
function _isUselessError(event) {
  var _a, _b;
  return (_b = (_a = event.exception) == null ? void 0 : _a.values) != null && _b.length ? (
    // No top-level message
    !event.message && // There are no exception values that have a stacktrace, a non-generic-Error type or value
    !event.exception.values.some((value) => value.stacktrace || value.type && value.type !== "Error" || value.value)
  ) : !1;
}
function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, key, limit, event, hint) {
  var _a;
  if (!((_a = event.exception) != null && _a.values) || !hint || !isInstanceOf(hint.originalException, Error))
    return;
  const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : void 0;
  originalException && (event.exception.values = aggregateExceptionsFromError(
    exceptionFromErrorImplementation,
    parser,
    limit,
    hint.originalException,
    key,
    event.exception.values,
    originalException,
    0
  ));
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error, key, prevExceptions, exception, exceptionId) {
  if (prevExceptions.length >= limit + 1)
    return prevExceptions;
  let newExceptions = [...prevExceptions];
  if (isInstanceOf(error[key], Error)) {
    applyExceptionGroupFieldsForParentException(exception, exceptionId);
    const newException = exceptionFromErrorImplementation(parser, error[key]), newExceptionId = newExceptions.length;
    applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId), newExceptions = aggregateExceptionsFromError(
      exceptionFromErrorImplementation,
      parser,
      limit,
      error[key],
      key,
      [newException, ...newExceptions],
      newException,
      newExceptionId
    );
  }
  return Array.isArray(error.errors) && error.errors.forEach((childError, i) => {
    if (isInstanceOf(childError, Error)) {
      applyExceptionGroupFieldsForParentException(exception, exceptionId);
      const newException = exceptionFromErrorImplementation(parser, childError), newExceptionId = newExceptions.length;
      applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId), newExceptions = aggregateExceptionsFromError(
        exceptionFromErrorImplementation,
        parser,
        limit,
        childError,
        key,
        [newException, ...newExceptions],
        newException,
        newExceptionId
      );
    }
  }), newExceptions;
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId) {
  exception.mechanism = exception.mechanism || { type: "generic", handled: !0 }, exception.mechanism = {
    ...exception.mechanism,
    ...exception.type === "AggregateError" && { is_exception_group: !0 },
    exception_id: exceptionId
  };
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
  exception.mechanism = exception.mechanism || { type: "generic", handled: !0 }, exception.mechanism = {
    ...exception.mechanism,
    type: "chained",
    source,
    exception_id: exceptionId,
    parent_id: parentId
  };
}
function addConsoleInstrumentationHandler(handler) {
  const type = "console";
  addHandler(type, handler), maybeInstrument(type, instrumentConsole);
}
function instrumentConsole() {
  "console" in GLOBAL_OBJ && CONSOLE_LEVELS.forEach(function(level) {
    level in GLOBAL_OBJ.console && fill(GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
      return originalConsoleMethods[level] = originalConsoleMethod, function(...args) {
        triggerHandlers("console", { args, level });
        const log = originalConsoleMethods[level];
        log == null || log.apply(GLOBAL_OBJ.console, args);
      };
    });
  });
}
function severityLevelFromString(level) {
  return level === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(level) ? level : "log";
}
const INTEGRATION_NAME$4 = "Dedupe", _dedupeIntegration = () => {
  let previousEvent;
  return {
    name: INTEGRATION_NAME$4,
    processEvent(currentEvent) {
      if (currentEvent.type)
        return currentEvent;
      try {
        if (_shouldDropEvent(currentEvent, previousEvent))
          return DEBUG_BUILD$3 && logger.warn("Event dropped due to being a duplicate of previously captured event."), null;
      } catch {
      }
      return previousEvent = currentEvent;
    }
  };
}, dedupeIntegration = _dedupeIntegration;
function _shouldDropEvent(currentEvent, previousEvent) {
  return previousEvent ? !!(_isSameMessageEvent(currentEvent, previousEvent) || _isSameExceptionEvent(currentEvent, previousEvent)) : !1;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
  const currentMessage = currentEvent.message, previousMessage = previousEvent.message;
  return !(!currentMessage && !previousMessage || currentMessage && !previousMessage || !currentMessage && previousMessage || currentMessage !== previousMessage || !_isSameFingerprint(currentEvent, previousEvent) || !_isSameStacktrace(currentEvent, previousEvent));
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
  const previousException = _getExceptionFromEvent(previousEvent), currentException = _getExceptionFromEvent(currentEvent);
  return !(!previousException || !currentException || previousException.type !== currentException.type || previousException.value !== currentException.value || !_isSameFingerprint(currentEvent, previousEvent) || !_isSameStacktrace(currentEvent, previousEvent));
}
function _isSameStacktrace(currentEvent, previousEvent) {
  let currentFrames = getFramesFromEvent(currentEvent), previousFrames = getFramesFromEvent(previousEvent);
  if (!currentFrames && !previousFrames)
    return !0;
  if (currentFrames && !previousFrames || !currentFrames && previousFrames || (currentFrames = currentFrames, previousFrames = previousFrames, previousFrames.length !== currentFrames.length))
    return !1;
  for (let i = 0; i < previousFrames.length; i++) {
    const frameA = previousFrames[i], frameB = currentFrames[i];
    if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function)
      return !1;
  }
  return !0;
}
function _isSameFingerprint(currentEvent, previousEvent) {
  let currentFingerprint = currentEvent.fingerprint, previousFingerprint = previousEvent.fingerprint;
  if (!currentFingerprint && !previousFingerprint)
    return !0;
  if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint)
    return !1;
  currentFingerprint = currentFingerprint, previousFingerprint = previousFingerprint;
  try {
    return currentFingerprint.join("") === previousFingerprint.join("");
  } catch {
    return !1;
  }
}
function _getExceptionFromEvent(event) {
  var _a;
  return ((_a = event.exception) == null ? void 0 : _a.values) && event.exception.values[0];
}
function parseUrl(url) {
  if (!url)
    return {};
  const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match)
    return {};
  const query = match[6] || "", fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    search: query,
    hash: fragment,
    relative: match[5] + query + fragment
    // everything minus origin
  };
}
function getBreadcrumbLogLevelFromHttpStatusCode(statusCode) {
  if (statusCode !== void 0)
    return statusCode >= 400 && statusCode < 500 ? "warning" : statusCode >= 500 ? "error" : void 0;
}
const WINDOW$2 = GLOBAL_OBJ;
function supportsHistory() {
  return "history" in WINDOW$2 && !!WINDOW$2.history;
}
function supportsFetch() {
  if (!("fetch" in WINDOW$2))
    return !1;
  try {
    return new Headers(), new Request("http://www.example.com"), new Response(), !0;
  } catch {
    return !1;
  }
}
function isNativeFunction(func) {
  return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
function supportsNativeFetch() {
  var _a;
  if (typeof EdgeRuntime == "string")
    return !0;
  if (!supportsFetch())
    return !1;
  if (isNativeFunction(WINDOW$2.fetch))
    return !0;
  let result = !1;
  const doc = WINDOW$2.document;
  if (doc && typeof doc.createElement == "function")
    try {
      const sandbox = doc.createElement("iframe");
      sandbox.hidden = !0, doc.head.appendChild(sandbox), (_a = sandbox.contentWindow) != null && _a.fetch && (result = isNativeFunction(sandbox.contentWindow.fetch)), doc.head.removeChild(sandbox);
    } catch (err) {
      DEBUG_BUILD$2 && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
    }
  return result;
}
function addFetchInstrumentationHandler(handler, skipNativeFetchCheck) {
  const type = "fetch";
  addHandler(type, handler), maybeInstrument(type, () => instrumentFetch(void 0, skipNativeFetchCheck));
}
function instrumentFetch(onFetchResolved, skipNativeFetchCheck = !1) {
  skipNativeFetchCheck && !supportsNativeFetch() || fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
    return function(...args) {
      const virtualError = new Error(), { method, url } = parseFetchArgs(args), handlerData = {
        args,
        fetchData: {
          method,
          url
        },
        startTimestamp: timestampInSeconds() * 1e3,
        // // Adding the error to be able to fingerprint the failed fetch event in HttpClient instrumentation
        virtualError,
        headers: getHeadersFromFetchArgs(args)
      };
      return triggerHandlers("fetch", {
        ...handlerData
      }), originalFetch.apply(GLOBAL_OBJ, args).then(
        async (response) => (triggerHandlers("fetch", {
          ...handlerData,
          endTimestamp: timestampInSeconds() * 1e3,
          response
        }), response),
        (error) => {
          if (triggerHandlers("fetch", {
            ...handlerData,
            endTimestamp: timestampInSeconds() * 1e3,
            error
          }), isError(error) && error.stack === void 0 && (error.stack = virtualError.stack, addNonEnumerableProperty(error, "framesToPop", 1)), error instanceof TypeError && (error.message === "Failed to fetch" || error.message === "Load failed" || error.message === "NetworkError when attempting to fetch resource."))
            try {
              const url2 = new URL(handlerData.fetchData.url);
              error.message = `${error.message} (${url2.host})`;
            } catch {
            }
          throw error;
        }
      );
    };
  });
}
function hasProp(obj, prop) {
  return !!obj && typeof obj == "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
  return typeof resource == "string" ? resource : resource ? hasProp(resource, "url") ? resource.url : resource.toString ? resource.toString() : "" : "";
}
function parseFetchArgs(fetchArgs) {
  if (fetchArgs.length === 0)
    return { method: "GET", url: "" };
  if (fetchArgs.length === 2) {
    const [url, options] = fetchArgs;
    return {
      url: getUrlFromResource(url),
      method: hasProp(options, "method") ? String(options.method).toUpperCase() : "GET"
    };
  }
  const arg = fetchArgs[0];
  return {
    url: getUrlFromResource(arg),
    method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
  };
}
function getHeadersFromFetchArgs(fetchArgs) {
  const [requestArgument, optionsArgument] = fetchArgs;
  try {
    if (typeof optionsArgument == "object" && optionsArgument !== null && "headers" in optionsArgument && optionsArgument.headers)
      return new Headers(optionsArgument.headers);
    if (isRequest(requestArgument))
      return new Headers(requestArgument.headers);
  } catch {
  }
}
function getSDKSource() {
  return "npm";
}
const WINDOW$1 = GLOBAL_OBJ;
let ignoreOnError = 0;
function shouldIgnoreOnError() {
  return ignoreOnError > 0;
}
function ignoreNextOnError() {
  ignoreOnError++, setTimeout(() => {
    ignoreOnError--;
  });
}
function wrap(fn, options = {}) {
  function isFunction(fn2) {
    return typeof fn2 == "function";
  }
  if (!isFunction(fn))
    return fn;
  try {
    const wrapper = fn.__sentry_wrapped__;
    if (wrapper)
      return typeof wrapper == "function" ? wrapper : fn;
    if (getOriginalFunction(fn))
      return fn;
  } catch {
    return fn;
  }
  const sentryWrapped = function(...args) {
    try {
      const wrappedArguments = args.map((arg) => wrap(arg, options));
      return fn.apply(this, wrappedArguments);
    } catch (ex) {
      throw ignoreNextOnError(), withScope((scope) => {
        scope.addEventProcessor((event) => (options.mechanism && (addExceptionTypeValue(event, void 0), addExceptionMechanism(event, options.mechanism)), event.extra = {
          ...event.extra,
          arguments: args
        }, event)), captureException(ex);
      }), ex;
    }
  };
  try {
    for (const property in fn)
      Object.prototype.hasOwnProperty.call(fn, property) && (sentryWrapped[property] = fn[property]);
  } catch {
  }
  markFunctionWrapped(sentryWrapped, fn), addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped);
  try {
    Object.getOwnPropertyDescriptor(sentryWrapped, "name").configurable && Object.defineProperty(sentryWrapped, "name", {
      get() {
        return fn.name;
      }
    });
  } catch {
  }
  return sentryWrapped;
}
function exceptionFromError(stackParser, ex) {
  const frames = parseStackFrames(stackParser, ex), exception = {
    type: extractType(ex),
    value: extractMessage(ex)
  };
  return frames.length && (exception.stacktrace = { frames }), exception.type === void 0 && exception.value === "" && (exception.value = "Unrecoverable error caught"), exception;
}
function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
  const client = getClient(), normalizeDepth = client == null ? void 0 : client.getOptions().normalizeDepth, errorFromProp = getErrorPropertyFromObject(exception), extra = {
    __serialized__: normalizeToSize(exception, normalizeDepth)
  };
  if (errorFromProp)
    return {
      exception: {
        values: [exceptionFromError(stackParser, errorFromProp)]
      },
      extra
    };
  const event = {
    exception: {
      values: [
        {
          type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
          value: getNonErrorObjectExceptionValue(exception, { isUnhandledRejection })
        }
      ]
    },
    extra
  };
  if (syntheticException) {
    const frames = parseStackFrames(stackParser, syntheticException);
    frames.length && (event.exception.values[0].stacktrace = { frames });
  }
  return event;
}
function eventFromError(stackParser, ex) {
  return {
    exception: {
      values: [exceptionFromError(stackParser, ex)]
    }
  };
}
function parseStackFrames(stackParser, ex) {
  const stacktrace = ex.stacktrace || ex.stack || "", skipLines = getSkipFirstStackStringLines(ex), framesToPop = getPopFirstTopFrames(ex);
  try {
    return stackParser(stacktrace, skipLines, framesToPop);
  } catch {
  }
  return [];
}
const reactMinifiedRegexp = /Minified React error #\d+;/i;
function getSkipFirstStackStringLines(ex) {
  return ex && reactMinifiedRegexp.test(ex.message) ? 1 : 0;
}
function getPopFirstTopFrames(ex) {
  return typeof ex.framesToPop == "number" ? ex.framesToPop : 0;
}
function isWebAssemblyException(exception) {
  return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u" ? exception instanceof WebAssembly.Exception : !1;
}
function extractType(ex) {
  const name = ex == null ? void 0 : ex.name;
  return !name && isWebAssemblyException(ex) ? ex.message && Array.isArray(ex.message) && ex.message.length == 2 ? ex.message[0] : "WebAssembly.Exception" : name;
}
function extractMessage(ex) {
  const message = ex == null ? void 0 : ex.message;
  return isWebAssemblyException(ex) ? Array.isArray(ex.message) && ex.message.length == 2 ? ex.message[1] : "wasm exception" : message ? message.error && typeof message.error.message == "string" ? message.error.message : message : "No error message";
}
function eventFromException(stackParser, exception, hint, attachStacktrace) {
  const syntheticException = (hint == null ? void 0 : hint.syntheticException) || void 0, event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
  return addExceptionMechanism(event), event.level = "error", hint != null && hint.event_id && (event.event_id = hint.event_id), resolvedSyncPromise(event);
}
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
  const syntheticException = (hint == null ? void 0 : hint.syntheticException) || void 0, event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
  return event.level = level, hint != null && hint.event_id && (event.event_id = hint.event_id), resolvedSyncPromise(event);
}
function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
  let event;
  if (isErrorEvent$1(exception) && exception.error)
    return eventFromError(stackParser, exception.error);
  if (isDOMError(exception) || isDOMException(exception)) {
    const domException = exception;
    if ("stack" in exception)
      event = eventFromError(stackParser, exception);
    else {
      const name = domException.name || (isDOMError(domException) ? "DOMError" : "DOMException"), message = domException.message ? `${name}: ${domException.message}` : name;
      event = eventFromString(stackParser, message, syntheticException, attachStacktrace), addExceptionTypeValue(event, message);
    }
    return "code" in domException && (event.tags = { ...event.tags, "DOMException.code": `${domException.code}` }), event;
  }
  return isError(exception) ? eventFromError(stackParser, exception) : isPlainObject(exception) || isEvent(exception) ? (event = eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection), addExceptionMechanism(event, {
    synthetic: !0
  }), event) : (event = eventFromString(stackParser, exception, syntheticException, attachStacktrace), addExceptionTypeValue(event, `${exception}`), addExceptionMechanism(event, {
    synthetic: !0
  }), event);
}
function eventFromString(stackParser, message, syntheticException, attachStacktrace) {
  const event = {};
  if (attachStacktrace && syntheticException) {
    const frames = parseStackFrames(stackParser, syntheticException);
    frames.length && (event.exception = {
      values: [{ value: message, stacktrace: { frames } }]
    }), addExceptionMechanism(event, { synthetic: !0 });
  }
  if (isParameterizedString(message)) {
    const { __sentry_template_string__, __sentry_template_values__ } = message;
    return event.logentry = {
      message: __sentry_template_string__,
      params: __sentry_template_values__
    }, event;
  }
  return event.message = message, event;
}
function getNonErrorObjectExceptionValue(exception, { isUnhandledRejection }) {
  const keys = extractExceptionKeysForMessage(exception), captureType = isUnhandledRejection ? "promise rejection" : "exception";
  return isErrorEvent$1(exception) ? `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\`` : isEvent(exception) ? `Event \`${getObjectClassName(exception)}\` (type=${exception.type}) captured as ${captureType}` : `Object captured as ${captureType} with keys: ${keys}`;
}
function getObjectClassName(obj) {
  try {
    const prototype = Object.getPrototypeOf(obj);
    return prototype ? prototype.constructor.name : void 0;
  } catch {
  }
}
function getErrorPropertyFromObject(obj) {
  for (const prop in obj)
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop];
      if (value instanceof Error)
        return value;
    }
}
const DEFAULT_FLUSH_INTERVAL = 5e3;
class BrowserClient extends Client {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    const opts = {
      // We default this to true, as it is the safer scenario
      parentSpanIsAlwaysRootSpan: !0,
      ...options
    }, sdkSource = WINDOW$1.SENTRY_SDK_SOURCE || getSDKSource();
    applySdkMetadata(opts, "browser", ["browser"], sdkSource), super(opts);
    const client = this, { sendDefaultPii, _experiments } = client._options, enableLogs = _experiments == null ? void 0 : _experiments.enableLogs;
    opts.sendClientReports && WINDOW$1.document && WINDOW$1.document.addEventListener("visibilitychange", () => {
      WINDOW$1.document.visibilityState === "hidden" && (this._flushOutcomes(), enableLogs && _INTERNAL_flushLogsBuffer(client));
    }), enableLogs && (client.on("flush", () => {
      _INTERNAL_flushLogsBuffer(client);
    }), client.on("afterCaptureLog", () => {
      client._logFlushIdleTimeout && clearTimeout(client._logFlushIdleTimeout), client._logFlushIdleTimeout = setTimeout(() => {
        _INTERNAL_flushLogsBuffer(client);
      }, DEFAULT_FLUSH_INTERVAL);
    })), sendDefaultPii && (client.on("postprocessEvent", addAutoIpAddressToUser), client.on("beforeSendSession", addAutoIpAddressToSession));
  }
  /**
   * @inheritDoc
   */
  eventFromException(exception, hint) {
    return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */
  eventFromMessage(message, level = "info", hint) {
    return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */
  _prepareEvent(event, hint, currentScope, isolationScope) {
    return event.platform = event.platform || "javascript", super._prepareEvent(event, hint, currentScope, isolationScope);
  }
}
const DEBUG_BUILD$1 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, WINDOW = GLOBAL_OBJ, DEBOUNCE_DURATION = 1e3;
let debounceTimerID, lastCapturedEventType, lastCapturedEventTargetId;
function addClickKeypressInstrumentationHandler(handler) {
  const type = "dom";
  addHandler(type, handler), maybeInstrument(type, instrumentDOM);
}
function instrumentDOM() {
  if (!WINDOW.document)
    return;
  const triggerDOMHandler = triggerHandlers.bind(null, "dom"), globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, !0);
  WINDOW.document.addEventListener("click", globalDOMEventHandler, !1), WINDOW.document.addEventListener("keypress", globalDOMEventHandler, !1), ["EventTarget", "Node"].forEach((target) => {
    var _a, _b;
    const proto = (_a = WINDOW[target]) == null ? void 0 : _a.prototype;
    (_b = proto == null ? void 0 : proto.hasOwnProperty) != null && _b.call(proto, "addEventListener") && (fill(proto, "addEventListener", function(originalAddEventListener) {
      return function(type, listener, options) {
        if (type === "click" || type == "keypress")
          try {
            const handlers2 = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {}, handlerForType = handlers2[type] = handlers2[type] || { refCount: 0 };
            if (!handlerForType.handler) {
              const handler = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler, originalAddEventListener.call(this, type, handler, options);
            }
            handlerForType.refCount++;
          } catch {
          }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }), fill(
      proto,
      "removeEventListener",
      function(originalRemoveEventListener) {
        return function(type, listener, options) {
          if (type === "click" || type == "keypress")
            try {
              const handlers2 = this.__sentry_instrumentation_handlers__ || {}, handlerForType = handlers2[type];
              handlerForType && (handlerForType.refCount--, handlerForType.refCount <= 0 && (originalRemoveEventListener.call(this, type, handlerForType.handler, options), handlerForType.handler = void 0, delete handlers2[type]), Object.keys(handlers2).length === 0 && delete this.__sentry_instrumentation_handlers__);
            } catch {
            }
          return originalRemoveEventListener.call(this, type, listener, options);
        };
      }
    ));
  });
}
function isSimilarToLastCapturedEvent(event) {
  if (event.type !== lastCapturedEventType)
    return !1;
  try {
    if (!event.target || event.target._sentryId !== lastCapturedEventTargetId)
      return !1;
  } catch {
  }
  return !0;
}
function shouldSkipDOMEvent(eventType, target) {
  return eventType !== "keypress" ? !1 : target != null && target.tagName ? !(target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) : !0;
}
function makeDOMEventHandler(handler, globalListener = !1) {
  return (event) => {
    if (!event || event._sentryCaptured)
      return;
    const target = getEventTarget(event);
    if (shouldSkipDOMEvent(event.type, target))
      return;
    addNonEnumerableProperty(event, "_sentryCaptured", !0), target && !target._sentryId && addNonEnumerableProperty(target, "_sentryId", uuid4());
    const name = event.type === "keypress" ? "input" : event.type;
    isSimilarToLastCapturedEvent(event) || (handler({ event, name, global: globalListener }), lastCapturedEventType = event.type, lastCapturedEventTargetId = target ? target._sentryId : void 0), clearTimeout(debounceTimerID), debounceTimerID = WINDOW.setTimeout(() => {
      lastCapturedEventTargetId = void 0, lastCapturedEventType = void 0;
    }, DEBOUNCE_DURATION);
  };
}
function getEventTarget(event) {
  try {
    return event.target;
  } catch {
    return null;
  }
}
let lastHref;
function addHistoryInstrumentationHandler(handler) {
  const type = "history";
  addHandler(type, handler), maybeInstrument(type, instrumentHistory);
}
function instrumentHistory() {
  if (WINDOW.addEventListener("popstate", () => {
    const to = WINDOW.location.href, from = lastHref;
    if (lastHref = to, from === to)
      return;
    triggerHandlers("history", { from, to });
  }), !supportsHistory())
    return;
  function historyReplacementFunction(originalHistoryFunction) {
    return function(...args) {
      const url = args.length > 2 ? args[2] : void 0;
      if (url) {
        const from = lastHref, to = String(url);
        if (lastHref = to, from === to)
          return originalHistoryFunction.apply(this, args);
        triggerHandlers("history", { from, to });
      }
      return originalHistoryFunction.apply(this, args);
    };
  }
  fill(WINDOW.history, "pushState", historyReplacementFunction), fill(WINDOW.history, "replaceState", historyReplacementFunction);
}
const cachedImplementations = {};
function getNativeImplementation(name) {
  const cached = cachedImplementations[name];
  if (cached)
    return cached;
  let impl = WINDOW[name];
  if (isNativeFunction(impl))
    return cachedImplementations[name] = impl.bind(WINDOW);
  const document2 = WINDOW.document;
  if (document2 && typeof document2.createElement == "function")
    try {
      const sandbox = document2.createElement("iframe");
      sandbox.hidden = !0, document2.head.appendChild(sandbox);
      const contentWindow = sandbox.contentWindow;
      contentWindow != null && contentWindow[name] && (impl = contentWindow[name]), document2.head.removeChild(sandbox);
    } catch (e) {
      DEBUG_BUILD$1 && logger.warn(`Could not create sandbox iframe for ${name} check, bailing to window.${name}: `, e);
    }
  return impl && (cachedImplementations[name] = impl.bind(WINDOW));
}
function clearCachedImplementation(name) {
  cachedImplementations[name] = void 0;
}
const SENTRY_XHR_DATA_KEY = "__sentry_xhr_v3__";
function addXhrInstrumentationHandler(handler) {
  const type = "xhr";
  addHandler(type, handler), maybeInstrument(type, instrumentXHR);
}
function instrumentXHR() {
  if (!WINDOW.XMLHttpRequest)
    return;
  const xhrproto = XMLHttpRequest.prototype;
  xhrproto.open = new Proxy(xhrproto.open, {
    apply(originalOpen, xhrOpenThisArg, xhrOpenArgArray) {
      const virtualError = new Error(), startTimestamp = timestampInSeconds() * 1e3, method = isString(xhrOpenArgArray[0]) ? xhrOpenArgArray[0].toUpperCase() : void 0, url = parseXhrUrlArg(xhrOpenArgArray[1]);
      if (!method || !url)
        return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
      xhrOpenThisArg[SENTRY_XHR_DATA_KEY] = {
        method,
        url,
        request_headers: {}
      }, method === "POST" && url.match(/sentry_key/) && (xhrOpenThisArg.__sentry_own_request__ = !0);
      const onreadystatechangeHandler = () => {
        const xhrInfo = xhrOpenThisArg[SENTRY_XHR_DATA_KEY];
        if (xhrInfo && xhrOpenThisArg.readyState === 4) {
          try {
            xhrInfo.status_code = xhrOpenThisArg.status;
          } catch {
          }
          const handlerData = {
            endTimestamp: timestampInSeconds() * 1e3,
            startTimestamp,
            xhr: xhrOpenThisArg,
            virtualError
          };
          triggerHandlers("xhr", handlerData);
        }
      };
      return "onreadystatechange" in xhrOpenThisArg && typeof xhrOpenThisArg.onreadystatechange == "function" ? xhrOpenThisArg.onreadystatechange = new Proxy(xhrOpenThisArg.onreadystatechange, {
        apply(originalOnreadystatechange, onreadystatechangeThisArg, onreadystatechangeArgArray) {
          return onreadystatechangeHandler(), originalOnreadystatechange.apply(onreadystatechangeThisArg, onreadystatechangeArgArray);
        }
      }) : xhrOpenThisArg.addEventListener("readystatechange", onreadystatechangeHandler), xhrOpenThisArg.setRequestHeader = new Proxy(xhrOpenThisArg.setRequestHeader, {
        apply(originalSetRequestHeader, setRequestHeaderThisArg, setRequestHeaderArgArray) {
          const [header, value] = setRequestHeaderArgArray, xhrInfo = setRequestHeaderThisArg[SENTRY_XHR_DATA_KEY];
          return xhrInfo && isString(header) && isString(value) && (xhrInfo.request_headers[header.toLowerCase()] = value), originalSetRequestHeader.apply(setRequestHeaderThisArg, setRequestHeaderArgArray);
        }
      }), originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
    }
  }), xhrproto.send = new Proxy(xhrproto.send, {
    apply(originalSend, sendThisArg, sendArgArray) {
      const sentryXhrData = sendThisArg[SENTRY_XHR_DATA_KEY];
      if (!sentryXhrData)
        return originalSend.apply(sendThisArg, sendArgArray);
      sendArgArray[0] !== void 0 && (sentryXhrData.body = sendArgArray[0]);
      const handlerData = {
        startTimestamp: timestampInSeconds() * 1e3,
        xhr: sendThisArg
      };
      return triggerHandlers("xhr", handlerData), originalSend.apply(sendThisArg, sendArgArray);
    }
  });
}
function parseXhrUrlArg(url) {
  if (isString(url))
    return url;
  try {
    return url.toString();
  } catch {
  }
}
function makeFetchTransport(options, nativeFetch = getNativeImplementation("fetch")) {
  let pendingBodySize = 0, pendingCount = 0;
  function makeRequest(request) {
    const requestSize = request.body.length;
    pendingBodySize += requestSize, pendingCount++;
    const requestOptions = {
      body: request.body,
      method: "POST",
      referrerPolicy: "strict-origin",
      headers: options.headers,
      // Outgoing requests are usually cancelled when navigating to a different page, causing a "TypeError: Failed to
      // fetch" error and sending a "network_error" client-outcome - in Chrome, the request status shows "(cancelled)".
      // The `keepalive` flag keeps outgoing requests alive, even when switching pages. We want this since we're
      // frequently sending events right before the user is switching pages (eg. when finishing navigation transactions).
      // Gotchas:
      // - `keepalive` isn't supported by Firefox
      // - As per spec (https://fetch.spec.whatwg.org/#http-network-or-cache-fetch):
      //   If the sum of contentLength and inflightKeepaliveBytes is greater than 64 kibibytes, then return a network error.
      //   We will therefore only activate the flag when we're below that limit.
      // There is also a limit of requests that can be open at the same time, so we also limit this to 15
      // See https://github.com/getsentry/sentry-javascript/pull/7553 for details
      keepalive: pendingBodySize <= 6e4 && pendingCount < 15,
      ...options.fetchOptions
    };
    if (!nativeFetch)
      return clearCachedImplementation("fetch"), rejectedSyncPromise("No fetch implementation available");
    try {
      return nativeFetch(options.url, requestOptions).then((response) => (pendingBodySize -= requestSize, pendingCount--, {
        statusCode: response.status,
        headers: {
          "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
          "retry-after": response.headers.get("Retry-After")
        }
      }));
    } catch (e) {
      return clearCachedImplementation("fetch"), pendingBodySize -= requestSize, pendingCount--, rejectedSyncPromise(e);
    }
  }
  return createTransport(options, makeRequest);
}
const CHROME_PRIORITY = 30, GECKO_PRIORITY = 50;
function createFrame(filename, func, lineno, colno) {
  const frame = {
    filename,
    function: func === "<anonymous>" ? UNKNOWN_FUNCTION : func,
    in_app: !0
    // All browser frames are considered in_app
  };
  return lineno !== void 0 && (frame.lineno = lineno), colno !== void 0 && (frame.colno = colno), frame;
}
const chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i, chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/, chromeStackParserFn = (line) => {
  const noFnParts = chromeRegexNoFnName.exec(line);
  if (noFnParts) {
    const [, filename, line2, col] = noFnParts;
    return createFrame(filename, UNKNOWN_FUNCTION, +line2, +col);
  }
  const parts = chromeRegex.exec(line);
  if (parts) {
    if (parts[2] && parts[2].indexOf("eval") === 0) {
      const subMatch = chromeEvalRegex.exec(parts[2]);
      subMatch && (parts[2] = subMatch[1], parts[3] = subMatch[2], parts[4] = subMatch[3]);
    }
    const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
    return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
  }
}, chromeStackLineParser = [CHROME_PRIORITY, chromeStackParserFn], geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i, geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, gecko = (line) => {
  const parts = geckoREgex.exec(line);
  if (parts) {
    if (parts[3] && parts[3].indexOf(" > eval") > -1) {
      const subMatch = geckoEvalRegex.exec(parts[3]);
      subMatch && (parts[1] = parts[1] || "eval", parts[3] = subMatch[1], parts[4] = subMatch[2], parts[5] = "");
    }
    let filename = parts[3], func = parts[1] || UNKNOWN_FUNCTION;
    return [func, filename] = extractSafariExtensionDetails(func, filename), createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
  }
}, geckoStackLineParser = [GECKO_PRIORITY, gecko], defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser], defaultStackParser = createStackParser(...defaultStackLineParsers), extractSafariExtensionDetails = (func, filename) => {
  const isSafariExtension = func.indexOf("safari-extension") !== -1, isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
  return isSafariExtension || isSafariWebExtension ? [
    func.indexOf("@") !== -1 ? func.split("@")[0] : UNKNOWN_FUNCTION,
    isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
  ] : [func, filename];
}, DEBUG_BUILD = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__, MAX_ALLOWED_STRING_LENGTH = 1024, INTEGRATION_NAME$3 = "Breadcrumbs", _breadcrumbsIntegration = (options = {}) => {
  const _options = {
    console: !0,
    dom: !0,
    fetch: !0,
    history: !0,
    sentry: !0,
    xhr: !0,
    ...options
  };
  return {
    name: INTEGRATION_NAME$3,
    setup(client) {
      _options.console && addConsoleInstrumentationHandler(_getConsoleBreadcrumbHandler(client)), _options.dom && addClickKeypressInstrumentationHandler(_getDomBreadcrumbHandler(client, _options.dom)), _options.xhr && addXhrInstrumentationHandler(_getXhrBreadcrumbHandler(client)), _options.fetch && addFetchInstrumentationHandler(_getFetchBreadcrumbHandler(client)), _options.history && addHistoryInstrumentationHandler(_getHistoryBreadcrumbHandler(client)), _options.sentry && client.on("beforeSendEvent", _getSentryBreadcrumbHandler(client));
    }
  };
}, breadcrumbsIntegration = _breadcrumbsIntegration;
function _getSentryBreadcrumbHandler(client) {
  return function(event) {
    getClient() === client && addBreadcrumb(
      {
        category: `sentry.${event.type === "transaction" ? "transaction" : "event"}`,
        event_id: event.event_id,
        level: event.level,
        message: getEventDescription(event)
      },
      {
        event
      }
    );
  };
}
function _getDomBreadcrumbHandler(client, dom) {
  return function(handlerData) {
    if (getClient() !== client)
      return;
    let target, componentName, keyAttrs = typeof dom == "object" ? dom.serializeAttribute : void 0, maxStringLength = typeof dom == "object" && typeof dom.maxStringLength == "number" ? dom.maxStringLength : void 0;
    maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH && (DEBUG_BUILD && logger.warn(
      `\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`
    ), maxStringLength = MAX_ALLOWED_STRING_LENGTH), typeof keyAttrs == "string" && (keyAttrs = [keyAttrs]);
    try {
      const event = handlerData.event, element = _isEvent(event) ? event.target : event;
      target = htmlTreeAsString(element, { keyAttrs, maxStringLength }), componentName = getComponentName(element);
    } catch {
      target = "<unknown>";
    }
    if (target.length === 0)
      return;
    const breadcrumb = {
      category: `ui.${handlerData.name}`,
      message: target
    };
    componentName && (breadcrumb.data = { "ui.component_name": componentName }), addBreadcrumb(breadcrumb, {
      event: handlerData.event,
      name: handlerData.name,
      global: handlerData.global
    });
  };
}
function _getConsoleBreadcrumbHandler(client) {
  return function(handlerData) {
    if (getClient() !== client)
      return;
    const breadcrumb = {
      category: "console",
      data: {
        arguments: handlerData.args,
        logger: "console"
      },
      level: severityLevelFromString(handlerData.level),
      message: safeJoin(handlerData.args, " ")
    };
    if (handlerData.level === "assert")
      if (handlerData.args[0] === !1)
        breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1), " ") || "console.assert"}`, breadcrumb.data.arguments = handlerData.args.slice(1);
      else
        return;
    addBreadcrumb(breadcrumb, {
      input: handlerData.args,
      level: handlerData.level
    });
  };
}
function _getXhrBreadcrumbHandler(client) {
  return function(handlerData) {
    if (getClient() !== client)
      return;
    const { startTimestamp, endTimestamp } = handlerData, sentryXhrData = handlerData.xhr[SENTRY_XHR_DATA_KEY];
    if (!startTimestamp || !endTimestamp || !sentryXhrData)
      return;
    const { method, url, status_code, body } = sentryXhrData, data = {
      method,
      url,
      status_code
    }, hint = {
      xhr: handlerData.xhr,
      input: body,
      startTimestamp,
      endTimestamp
    }, breadcrumb = {
      category: "xhr",
      data,
      type: "http",
      level: getBreadcrumbLogLevelFromHttpStatusCode(status_code)
    };
    client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), addBreadcrumb(breadcrumb, hint);
  };
}
function _getFetchBreadcrumbHandler(client) {
  return function(handlerData) {
    if (getClient() !== client)
      return;
    const { startTimestamp, endTimestamp } = handlerData;
    if (endTimestamp && !(handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === "POST"))
      if (handlerData.fetchData.method, handlerData.fetchData.url, handlerData.error) {
        const data = handlerData.fetchData, hint = {
          data: handlerData.error,
          input: handlerData.args,
          startTimestamp,
          endTimestamp
        }, breadcrumb = {
          category: "fetch",
          data,
          level: "error",
          type: "http"
        };
        client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), addBreadcrumb(breadcrumb, hint);
      } else {
        const response = handlerData.response, data = {
          ...handlerData.fetchData,
          status_code: response == null ? void 0 : response.status
        };
        handlerData.fetchData.request_body_size, handlerData.fetchData.response_body_size, response == null || response.status;
        const hint = {
          input: handlerData.args,
          response,
          startTimestamp,
          endTimestamp
        }, breadcrumb = {
          category: "fetch",
          data,
          type: "http",
          level: getBreadcrumbLogLevelFromHttpStatusCode(data.status_code)
        };
        client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint), addBreadcrumb(breadcrumb, hint);
      }
  };
}
function _getHistoryBreadcrumbHandler(client) {
  return function(handlerData) {
    if (getClient() !== client)
      return;
    let from = handlerData.from, to = handlerData.to;
    const parsedLoc = parseUrl(WINDOW$1.location.href);
    let parsedFrom = from ? parseUrl(from) : void 0;
    const parsedTo = parseUrl(to);
    parsedFrom != null && parsedFrom.path || (parsedFrom = parsedLoc), parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host && (to = parsedTo.relative), parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host && (from = parsedFrom.relative), addBreadcrumb({
      category: "navigation",
      data: {
        from,
        to
      }
    });
  };
}
function _isEvent(event) {
  return !!event && !!event.target;
}
const DEFAULT_EVENT_TARGET = [
  "EventTarget",
  "Window",
  "Node",
  "ApplicationCache",
  "AudioTrackList",
  "BroadcastChannel",
  "ChannelMergerNode",
  "CryptoOperation",
  "EventSource",
  "FileReader",
  "HTMLUnknownElement",
  "IDBDatabase",
  "IDBRequest",
  "IDBTransaction",
  "KeyOperation",
  "MediaController",
  "MessagePort",
  "ModalWindow",
  "Notification",
  "SVGElementInstance",
  "Screen",
  "SharedWorker",
  "TextTrack",
  "TextTrackCue",
  "TextTrackList",
  "WebSocket",
  "WebSocketWorker",
  "Worker",
  "XMLHttpRequest",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload"
], INTEGRATION_NAME$2 = "BrowserApiErrors", _browserApiErrorsIntegration = (options = {}) => {
  const _options = {
    XMLHttpRequest: !0,
    eventTarget: !0,
    requestAnimationFrame: !0,
    setInterval: !0,
    setTimeout: !0,
    ...options
  };
  return {
    name: INTEGRATION_NAME$2,
    // TODO: This currently only works for the first client this is setup
    // We may want to adjust this to check for client etc.
    setupOnce() {
      _options.setTimeout && fill(WINDOW$1, "setTimeout", _wrapTimeFunction), _options.setInterval && fill(WINDOW$1, "setInterval", _wrapTimeFunction), _options.requestAnimationFrame && fill(WINDOW$1, "requestAnimationFrame", _wrapRAF), _options.XMLHttpRequest && "XMLHttpRequest" in WINDOW$1 && fill(XMLHttpRequest.prototype, "send", _wrapXHR);
      const eventTargetOption = _options.eventTarget;
      eventTargetOption && (Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET).forEach(_wrapEventTarget);
    }
  };
}, browserApiErrorsIntegration = _browserApiErrorsIntegration;
function _wrapTimeFunction(original) {
  return function(...args) {
    const originalCallback = args[0];
    return args[0] = wrap(originalCallback, {
      mechanism: {
        data: { function: getFunctionName(original) },
        handled: !1,
        type: "instrument"
      }
    }), original.apply(this, args);
  };
}
function _wrapRAF(original) {
  return function(callback) {
    return original.apply(this, [
      wrap(callback, {
        mechanism: {
          data: {
            function: "requestAnimationFrame",
            handler: getFunctionName(original)
          },
          handled: !1,
          type: "instrument"
        }
      })
    ]);
  };
}
function _wrapXHR(originalSend) {
  return function(...args) {
    const xhr = this;
    return ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((prop) => {
      prop in xhr && typeof xhr[prop] == "function" && fill(xhr, prop, function(original) {
        const wrapOptions = {
          mechanism: {
            data: {
              function: prop,
              handler: getFunctionName(original)
            },
            handled: !1,
            type: "instrument"
          }
        }, originalFunction = getOriginalFunction(original);
        return originalFunction && (wrapOptions.mechanism.data.handler = getFunctionName(originalFunction)), wrap(original, wrapOptions);
      });
    }), originalSend.apply(this, args);
  };
}
function _wrapEventTarget(target) {
  var _a, _b;
  const proto = (_a = WINDOW$1[target]) == null ? void 0 : _a.prototype;
  (_b = proto == null ? void 0 : proto.hasOwnProperty) != null && _b.call(proto, "addEventListener") && (fill(proto, "addEventListener", function(original) {
    return function(eventName, fn, options) {
      try {
        isEventListenerObject(fn) && (fn.handleEvent = wrap(fn.handleEvent, {
          mechanism: {
            data: {
              function: "handleEvent",
              handler: getFunctionName(fn),
              target
            },
            handled: !1,
            type: "instrument"
          }
        }));
      } catch {
      }
      return original.apply(this, [
        eventName,
        wrap(fn, {
          mechanism: {
            data: {
              function: "addEventListener",
              handler: getFunctionName(fn),
              target
            },
            handled: !1,
            type: "instrument"
          }
        }),
        options
      ]);
    };
  }), fill(proto, "removeEventListener", function(originalRemoveEventListener) {
    return function(eventName, fn, options) {
      try {
        const originalEventHandler = fn.__sentry_wrapped__;
        originalEventHandler && originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
      } catch {
      }
      return originalRemoveEventListener.call(this, eventName, fn, options);
    };
  }));
}
function isEventListenerObject(obj) {
  return typeof obj.handleEvent == "function";
}
const browserSessionIntegration = () => ({
  name: "BrowserSession",
  setupOnce() {
    if (typeof WINDOW$1.document > "u") {
      DEBUG_BUILD && logger.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
      return;
    }
    startSession({ ignoreDuration: !0 }), captureSession(), addHistoryInstrumentationHandler(({ from, to }) => {
      from !== void 0 && from !== to && (startSession({ ignoreDuration: !0 }), captureSession());
    });
  }
}), INTEGRATION_NAME$1 = "GlobalHandlers", _globalHandlersIntegration = (options = {}) => {
  const _options = {
    onerror: !0,
    onunhandledrejection: !0,
    ...options
  };
  return {
    name: INTEGRATION_NAME$1,
    setupOnce() {
      Error.stackTraceLimit = 50;
    },
    setup(client) {
      _options.onerror && (_installGlobalOnErrorHandler(client), globalHandlerLog("onerror")), _options.onunhandledrejection && (_installGlobalOnUnhandledRejectionHandler(client), globalHandlerLog("onunhandledrejection"));
    }
  };
}, globalHandlersIntegration = _globalHandlersIntegration;
function _installGlobalOnErrorHandler(client) {
  addGlobalErrorInstrumentationHandler((data) => {
    const { stackParser, attachStacktrace } = getOptions();
    if (getClient() !== client || shouldIgnoreOnError())
      return;
    const { msg, url, line, column, error } = data, event = _enhanceEventWithInitialFrame(
      eventFromUnknownInput(stackParser, error || msg, void 0, attachStacktrace, !1),
      url,
      line,
      column
    );
    event.level = "error", captureEvent(event, {
      originalException: error,
      mechanism: {
        handled: !1,
        type: "onerror"
      }
    });
  });
}
function _installGlobalOnUnhandledRejectionHandler(client) {
  addGlobalUnhandledRejectionInstrumentationHandler((e) => {
    const { stackParser, attachStacktrace } = getOptions();
    if (getClient() !== client || shouldIgnoreOnError())
      return;
    const error = _getUnhandledRejectionError(e), event = isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, !0);
    event.level = "error", captureEvent(event, {
      originalException: error,
      mechanism: {
        handled: !1,
        type: "onunhandledrejection"
      }
    });
  });
}
function _getUnhandledRejectionError(error) {
  if (isPrimitive(error))
    return error;
  try {
    if ("reason" in error)
      return error.reason;
    if ("detail" in error && "reason" in error.detail)
      return error.detail.reason;
  } catch {
  }
  return error;
}
function _eventFromRejectionWithPrimitive(reason) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
          value: `Non-Error promise rejection captured with value: ${String(reason)}`
        }
      ]
    }
  };
}
function _enhanceEventWithInitialFrame(event, url, line, column) {
  const e = event.exception = event.exception || {}, ev = e.values = e.values || [], ev0 = ev[0] = ev[0] || {}, ev0s = ev0.stacktrace = ev0.stacktrace || {}, ev0sf = ev0s.frames = ev0s.frames || [], colno = column, lineno = line, filename = isString(url) && url.length > 0 ? url : getLocationHref();
  return ev0sf.length === 0 && ev0sf.push({
    colno,
    filename,
    function: UNKNOWN_FUNCTION,
    in_app: !0,
    lineno
  }), event;
}
function globalHandlerLog(type) {
  DEBUG_BUILD && logger.log(`Global Handler attached: ${type}`);
}
function getOptions() {
  const client = getClient();
  return (client == null ? void 0 : client.getOptions()) || {
    stackParser: () => [],
    attachStacktrace: !1
  };
}
const httpContextIntegration = () => ({
  name: "HttpContext",
  preprocessEvent(event) {
    var _a, _b;
    if (!WINDOW$1.navigator && !WINDOW$1.location && !WINDOW$1.document)
      return;
    const url = ((_a = event.request) == null ? void 0 : _a.url) || getLocationHref(), { referrer } = WINDOW$1.document || {}, { userAgent } = WINDOW$1.navigator || {}, headers = {
      ...(_b = event.request) == null ? void 0 : _b.headers,
      ...referrer && { Referer: referrer },
      ...userAgent && { "User-Agent": userAgent }
    }, request = {
      ...event.request,
      ...url && { url },
      headers
    };
    event.request = request;
  }
}), DEFAULT_KEY = "cause", DEFAULT_LIMIT = 5, INTEGRATION_NAME = "LinkedErrors", _linkedErrorsIntegration = (options = {}) => {
  const limit = options.limit || DEFAULT_LIMIT, key = options.key || DEFAULT_KEY;
  return {
    name: INTEGRATION_NAME,
    preprocessEvent(event, hint, client) {
      const options2 = client.getOptions();
      applyAggregateErrorsToEvent(
        // This differs from the LinkedErrors integration in core by using a different exceptionFromError function
        exceptionFromError,
        options2.stackParser,
        key,
        limit,
        event,
        hint
      );
    }
  };
}, linkedErrorsIntegration = _linkedErrorsIntegration;
function getDefaultIntegrations(_options) {
  return [
    // TODO(v10): Replace with `eventFiltersIntegration` once we remove the deprecated `inboundFiltersIntegration`
    // eslint-disable-next-line deprecation/deprecation
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    browserApiErrorsIntegration(),
    breadcrumbsIntegration(),
    globalHandlersIntegration(),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    httpContextIntegration(),
    browserSessionIntegration()
  ];
}
function applyDefaultOptions(optionsArg = {}) {
  var _a;
  return {
    ...{
      defaultIntegrations: getDefaultIntegrations(),
      release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : (_a = WINDOW$1.SENTRY_RELEASE) == null ? void 0 : _a.id,
      // This supports the variable that sentry-webpack-plugin injects
      sendClientReports: !0
    },
    ...dropTopLevelUndefinedKeys(optionsArg)
  };
}
function dropTopLevelUndefinedKeys(obj) {
  const mutatetedObj = {};
  for (const k of Object.getOwnPropertyNames(obj)) {
    const key = k;
    obj[key] !== void 0 && (mutatetedObj[key] = obj[key]);
  }
  return mutatetedObj;
}
function shouldShowBrowserExtensionError() {
  var _a;
  const windowWithMaybeExtension = typeof WINDOW$1.window < "u" && WINDOW$1;
  if (!windowWithMaybeExtension)
    return !1;
  const extensionKey = windowWithMaybeExtension.chrome ? "chrome" : "browser", extensionObject = windowWithMaybeExtension[extensionKey], runtimeId = (_a = extensionObject == null ? void 0 : extensionObject.runtime) == null ? void 0 : _a.id, href = getLocationHref() || "", extensionProtocols = ["chrome-extension:", "moz-extension:", "ms-browser-extension:", "safari-web-extension:"], isDedicatedExtensionPage = !!runtimeId && WINDOW$1 === WINDOW$1.top && extensionProtocols.some((protocol) => href.startsWith(`${protocol}//`)), isNWjs = typeof windowWithMaybeExtension.nw < "u";
  return !!runtimeId && !isDedicatedExtensionPage && !isNWjs;
}
function init(browserOptions = {}) {
  const options = applyDefaultOptions(browserOptions);
  if (!options.skipBrowserExtensionCheck && shouldShowBrowserExtensionError()) {
    DEBUG_BUILD && consoleSandbox(() => {
      console.error(
        "[Sentry] You cannot run Sentry this way in a browser extension, check: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/"
      );
    });
    return;
  }
  DEBUG_BUILD && !supportsFetch() && logger.warn(
    "No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill."
  );
  const clientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || makeFetchTransport
  };
  return initAndBind(BrowserClient, clientOptions);
}
init({
  dsn: "https://9523a043c1a34ad1b261c558b4d6a352@o383174.ingest.sentry.io/5273572"
});
const answer = !0;
export {
  answer
};
