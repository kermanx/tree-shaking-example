/**
* @vue/shared v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str) {
	const map = Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) {
		arr.splice(i, 1);
	}
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
	return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = makeMap(
	// the leading comma is intentional so empty string "" is also included
	",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
	const cache = Object.create(null);
	return (str) => {
		const hit = cache[str];
		return hit || (cache[str] = fn(str));
	};
};
const camelizeRE = /-\w/g;
const camelize = cacheStringFunction((str) => {
	return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
	const s = str ? `on${capitalize(str)}` : "";
	return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns) => {
	for (let i = 0; i < fns.length; i++) {
		fns[i]();
	}
};
const def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
const looseToNumber = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) {
				for (const key in normalized) {
					res[key] = normalized[key];
				}
			}
		}
		return res;
	} else if (isString(value) || isObject$1(value)) {
		return value;
	}
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) {
		res = value;
	} else if (isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			const normalized = normalizeClass(value[i]);
			if (normalized) {
				res += normalized + " ";
			}
		}
	} else if (isObject$1(value)) {
		for (const name in value) {
			if (value[name]) {
				res += name + " ";
			}
		}
	}
	return res.trim();
}
const specialBooleanAttrs = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly";
const isSpecialBooleanAttr = makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
	return !!value || value === "";
}
const isRef$1 = (val) => {
	return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
	return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
	if (isRef$1(val)) {
		return replacer(_key, val.value);
	} else if (isMap(val)) {
		return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
			entries[stringifySymbol(key, i) + " =>"] = val2;
			return entries;
		}, {}) };
	} else if (isSet(val)) {
		return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
	} else if (isSymbol(val)) {
		return stringifySymbol(val);
	} else if (isObject$1(val) && !isArray(val) && !isPlainObject$1(val)) {
		return String(val);
	}
	return val;
};
const stringifySymbol = (v, i = "") => {
	var _a;
	return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
/**
* @vue/reactivity v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this.parent = activeEffectScope;
		if (!detached && activeEffectScope) {
			this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) {
				for (i = 0, l = this.scopes.length; i < l; i++) {
					this.scopes[i].pause();
				}
			}
			for (i = 0, l = this.effects.length; i < l; i++) {
				this.effects[i].pause();
			}
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) {
					for (i = 0, l = this.scopes.length; i < l; i++) {
						this.scopes[i].resume();
					}
				}
				for (i = 0, l = this.effects.length; i < l; i++) {
					this.effects[i].resume();
				}
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			activeEffectScope = this.prevScope;
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) {
				this.effects[i].stop();
			}
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) {
				this.cleanups[i]();
			}
			this.cleanups.length = 0;
			if (this.scopes) {
				for (i = 0, l = this.scopes.length; i < l; i++) {
					this.scopes[i].stop(true);
				}
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
}
function effectScope() {
	return new EffectScope(void 0);
}
function getCurrentScope() {
	return activeEffectScope;
}
function onScopeDispose(fn) {
	if (activeEffectScope) {
		activeEffectScope.cleanups.push(fn);
	}
}
let activeSub;
const pausedQueueEffects = new WeakSet();
class ReactiveEffect {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope && activeEffectScope.active) {
			activeEffectScope.effects.push(this);
		}
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) {
			return;
		}
		if (!(this.flags & 8)) {
			batch(this);
		}
	}
	run() {
		if (!(this.flags & 1)) {
			return this.fn();
		}
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) {
				removeSub(link);
			}
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) {
			pausedQueueEffects.add(this);
		} else if (this.scheduler) {
			this.scheduler();
		} else {
			this.runIfDirty();
		}
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) {
			this.run();
		}
	}
	get dirty() {
		return isDirty(this);
	}
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) {
		return;
	}
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) {
				try {
					e.trigger();
				} catch (err) {
					if (!error) error = err;
				}
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else {
			head = link;
		}
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
			return true;
		}
	}
	if (sub._dirty) {
		return true;
	}
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) {
		return;
	}
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) {
		return;
	}
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) {
		return;
	}
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) {
				removeSub(l, true);
			}
		}
	}
	if (!soft && !--dep.sc && dep.map) {
		dep.map.delete(dep.key);
	}
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
let globalVersion = 0;
class Link {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}
class Dep {
	// TODO isolatedDeclarations "__v_skip"
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
	}
	track() {
		if (!activeSub || !shouldTrack || activeSub === this.computed) {
			return;
		}
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) {
				activeSub.deps = activeSub.depsTail = link;
			} else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) {
					link.prevDep.nextDep = next;
				}
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) {
					activeSub.deps = next;
				}
			}
		}
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify() {
		startBatch();
		try {
			for (let link = this.subs; link; link = link.prevSub) {
				if (link.sub.notify()) {
					link.sub.dep.notify();
				}
			}
		} finally {
			endBatch();
		}
	}
}
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) {
				addSub(l);
			}
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		link.dep.subs = link;
	}
}
const targetMap = new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
const ARRAY_ITERATE_KEY = Symbol("");
function track(target, __unused_EF71, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) {
			targetMap.set(target, depsMap = new Map());
		}
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		{
			dep.track();
		}
	}
}
function trigger(target, type, key, newValue) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) {
			{
				dep.trigger();
			}
		}
	};
	startBatch();
	if (type === "clear") {
		depsMap.forEach(run);
	} else {
		const targetIsArray = isArray(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
					run(dep);
				}
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) {
				run(depsMap.get(key));
			}
			if (isArrayIndex) {
				run(depsMap.get(ARRAY_ITERATE_KEY));
			}
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) {
							run(depsMap.get(MAP_KEY_ITERATE_KEY));
						}
					} else if (isArrayIndex) {
						run(depsMap.get("length"));
					}
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) {
							run(depsMap.get(MAP_KEY_ITERATE_KEY));
						}
					}
					break;
				case "set":
					if (isMap(target)) {
						run(depsMap.get(ITERATE_KEY));
					}
					break;
			}
		}
	}
	endBatch();
}
function getDepFromReactive(object, key) {
	const depMap = targetMap.get(object);
	return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
	const raw = toRaw(array);
	if (raw === array) return raw;
	track(raw, 0, ARRAY_ITERATE_KEY);
	return isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
	arr = toRaw(arr);
	return arr;
}
function toWrapped(target, item) {
	if (isReadonly(target)) {
		return isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
	}
	return toReactive(item);
}
const arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const iter = arr[method]();
	if (arr !== self && !isShallow(self)) {
		iter._next = iter.next;
		iter.next = () => {
			const result = iter._next();
			if (!result.done) {
				result.value = wrapValue(result.value);
			}
			return result;
		};
	}
	return iter;
}
const arrayProto = Array.prototype;
function apply(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) {
			wrappedFn = function(item, index) {
				return fn.call(this, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 2) {
			wrappedFn = function(item, index) {
				return fn.call(this, item, index, self);
			};
		}
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	let wrappedFn = fn;
	if (arr !== self) {
		if (!isShallow(self)) {
			wrappedFn = function(acc, item, index) {
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) {
			wrappedFn = function(acc, item, index) {
				return fn.call(this, acc, item, index, self);
			};
		}
	}
	return arr[method](wrappedFn, ...args);
}
function searchProxy(self, method, args) {
	const arr = toRaw(self);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && isProxy(args[0])) {
		args[0] = toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = toRaw(self)[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
const isNonTrackableKeys = makeMap("__proto__,__v_isRef,__isVue");
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
function hasOwnProperty(key) {
	if (!isSymbol(key)) key = String(key);
	const obj = toRaw(this);
	return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
	constructor(_isReadonly, _isShallow) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") {
			return !isReadonly2;
		} else if (key === "__v_isReadonly") {
			return isReadonly2;
		} else if (key === "__v_isShallow") {
			return isShallow2;
		} else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
				return target;
			}
			return;
		}
		const targetIsArray = isArray(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) {
				return fn;
			}
			if (key === "hasOwnProperty") {
				return hasOwnProperty;
			}
		}
		const res = Reflect.get(
			target,
			key,
			// if this is a proxy wrapping a ref, return methods using the raw ref
			// as receiver so that we don't have to call `toRaw` on the ref in all
			// its class methods
			isRef(target) ? target : receiver
		);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
			return res;
		}
		if (isShallow2) {
			return res;
		}
		if (isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject$1(value) ? readonly(value) : value;
		}
		if (isObject$1(res)) {
			return isReadonly2 ? readonly(res) : reactive(res);
		}
		return res;
	}
}
class MutableReactiveHandler extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = isReadonly(oldValue);
			if (!isShallow(value) && !isReadonly(value)) {
				oldValue = toRaw(oldValue);
				value = toRaw(value);
			}
			if (!isArrayWithIntegerKey && isRef(oldValue) && !isRef(value)) {
				if (isOldValueReadonly) {
					return true;
				} else {
					oldValue.value = value;
					return true;
				}
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, isRef(target) ? target : receiver);
		if (target === toRaw(receiver)) {
			if (!hadKey) {
				trigger(target, "add", key, value);
			} else if (hasChanged(value, oldValue)) {
				trigger(target, "set", key, value);
			}
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) {
			trigger(target, "delete", key, void 0);
		}
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		{
			!isSymbol(key) || builtInSymbols.has(key);
		}
		return result;
	}
	ownKeys(target) {
		track(target, 0, isArray(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
	constructor() {
		super(true, false);
	}
	set() {
		return true;
	}
	deleteProperty() {
		return true;
	}
}
const mutableHandlers = new MutableReactiveHandler();
const readonlyHandlers = new ReadonlyReactiveHandler();
const shallowReactiveHandlers = new MutableReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
		!isReadonly2 && track(rawTarget, 0, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend(
			// inheriting all iterator properties
			Object.create(innerIterator),
			{ next() {
				const { value, done } = innerIterator.next();
				return done ? {
					value,
					done
				} : {
					value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
					done
				};
			} }
		);
	};
}
function createReadonlyMethod(type) {
	return function() {
		return type === "a" ? false : type === "b" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = toRaw(target);
			const rawKey = toRaw(key);
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			if (has.call(rawTarget, key)) {
				return wrap(target.get(key));
			} else if (has.call(rawTarget, rawKey)) {
				return wrap(target.get(rawKey));
			} else if (target !== rawTarget) {
				target.get(key);
			}
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(toRaw(target), 0, ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = toRaw(target);
			const rawKey = toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) {
					track(rawTarget, 0, key);
				}
				track(rawTarget, 0, rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend(instrumentations, readonly ? {
		add: createReadonlyMethod("c"),
		set: createReadonlyMethod("c"),
		delete: createReadonlyMethod("a"),
		clear: createReadonlyMethod("b")
	} : {
		add(value) {
			if (!shallow && !isShallow(value) && !isReadonly(value)) {
				value = toRaw(value);
			}
			const target = toRaw(this);
			const proto = getProto(target);
			const hadKey = proto.has.call(target, value);
			if (!hadKey) {
				target.add(value);
				trigger(target, "add", value, value);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !isShallow(value) && !isReadonly(value)) {
				value = toRaw(value);
			}
			const target = toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) {
				trigger(target, "add", key, value);
			} else if (hasChanged(value, oldValue)) {
				trigger(target, "set", key, value);
			}
			return this;
		},
		delete(key) {
			const target = toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = toRaw(key);
				hadKey = has.call(target, key);
			}
			get && get.call(target, key);
			const result = target.delete(key);
			if (hadKey) {
				trigger(target, "delete", key, void 0);
			}
			return result;
		},
		clear() {
			const target = toRaw(this);
			const hadItems = target.size !== 0;
			const result = target.clear();
			if (hadItems) {
				trigger(target, "clear");
			}
			return result;
		}
	});
	const iteratorMethods = [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	];
	iteratorMethods.forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") {
			return !isReadonly2;
		} else if (key === "__v_isReadonly") {
			return isReadonly2;
		} else if (key === "__v_raw") {
			return target;
		}
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
const mutableCollectionHandlers = { get: createInstrumentationGetter(false, false) };
const shallowCollectionHandlers = { get: createInstrumentationGetter(false, true) };
const readonlyCollectionHandlers = { get: createInstrumentationGetter(true, false) };
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
function getTargetType(value) {
	return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
	if (isReadonly(target)) {
		return target;
	}
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject$1(target)) {
		return target;
	}
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
		return target;
	}
	const targetType = getTargetType(target);
	if (targetType === 0) {
		return target;
	}
	const existingProxy = proxyMap.get(target);
	if (existingProxy) {
		return existingProxy;
	}
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
function isReactive(value) {
	if (isReadonly(value)) {
		return isReactive(value["__v_raw"]);
	}
	return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
		def(value, "__v_skip", true);
	}
	return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
function ref(value) {
	return createRef(value, false);
}
function shallowRef(value) {
	return createRef(value, true);
}
function createRef(rawValue, shallow) {
	if (isRef(rawValue)) {
		return rawValue;
	}
	return new RefImpl(rawValue, shallow);
}
class RefImpl {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this._rawValue = isShallow2 ? value : toRaw(value);
		this._value = isShallow2 ? value : toReactive(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		{
			this.dep.track();
		}
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
		newValue = useDirectValue ? newValue : toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive(newValue);
			{
				this.dep.trigger();
			}
		}
	}
}
function unref(ref2) {
	return isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
	return isFunction(source) ? source() : unref(source);
}
const shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (isRef(oldValue) && !isRef(value)) {
			oldValue.value = value;
			return true;
		} else {
			return Reflect.set(target, key, value, receiver);
		}
	}
};
function proxyRefs(objectWithRefs) {
	return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
	const ret = isArray(object) ? new Array(object.length) : {};
	for (const key in object) {
		ret[key] = propertyToRef(object, key);
	}
	return ret;
}
class ObjectRefImpl {
	constructor(_object, _key) {
		this._object = _object;
		this._key = _key;
		this._defaultValue = void 0;
		this["__v_isRef"] = true;
		this._value = void 0;
		this._raw = toRaw(_object);
		let shallow = true;
		let obj = _object;
		if (!isArray(_object) || !isIntegerKey(String(_key))) {
			do {
				shallow = !isProxy(obj) || isShallow(obj);
			} while (shallow && (obj = obj["__v_raw"]));
		}
		this._shallow = shallow;
	}
	get value() {
		let val = this._object[this._key];
		if (this._shallow) {
			val = unref(val);
		}
		return this._value = val === void 0 ? this._defaultValue : val;
	}
	set value(newVal) {
		if (this._shallow && isRef(this._raw[this._key])) {
			const nestedRef = this._object[this._key];
			if (isRef(nestedRef)) {
				nestedRef.value = newVal;
				return;
			}
		}
		this._object[this._key] = newVal;
	}
	get dep() {
		return getDepFromReactive(this._raw, this._key);
	}
}
class GetterRefImpl {
	constructor(_getter) {
		this._getter = _getter;
		this["__v_isRef"] = true;
		this["__v_isReadonly"] = true;
		this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
}
function toRef(source) {
	if (isRef(source)) {
		return source;
	} else {
		{
			return new GetterRefImpl(source);
		}
	}
}
function propertyToRef(source, key) {
	return new ObjectRefImpl(source, key);
}
class ComputedRefImpl {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		// TODO isolatedDeclarations "__v_isReadonly"
		// A computed is also a subscriber that tracks other deps
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		// for backwards compat
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track();
		refreshComputed(this);
		if (link) {
			link.version = this.dep.version;
		}
		return this._value;
	}
	set value(newValue) {
		if (this.setter) {
			this.setter(newValue);
		}
	}
}
function computed$1(getterOrOptions, __unused_E86B, isSSR = false) {
	let getter;
	let setter;
	if (isFunction(getterOrOptions)) {
		getter = getterOrOptions;
	} else {
		getter = getterOrOptions.a;
		setter = getterOrOptions.b;
	}
	const cRef = new ComputedRefImpl(getter, setter, isSSR);
	return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = new WeakMap();
function onWatcherCleanup(cleanupFn, __unused_DBF3, owner) {
	{
		{
			let cleanups = cleanupMap.get(owner);
			if (!cleanups) cleanupMap.set(owner, cleanups = []);
			cleanups.push(cleanupFn);
		}
	}
}
function watch$1(source, cb, options) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (isRef(source)) {
		getter = () => source.value;
		forceTrigger = isShallow(source);
	} else if (isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
		getter = () => source.map((s) => {
			if (isRef(s)) {
				return s.value;
			} else if (isReactive(s)) {
				return reactiveGetter(s);
			} else if (isFunction(s)) {
				return call ? call(s, 2) : s();
			}
		});
	} else if (isFunction(source)) {
		if (cb) {
			getter = call ? () => call(source, 2) : source;
		} else {
			getter = () => {
				if (cleanup) {
					pauseTracking();
					try {
						cleanup();
					} finally {
						resetTracking();
					}
				}
				try {
					return call ? call(source, 3, [boundCleanup]) : source();
				} catch {}
			};
		}
	} else {
		getter = NOOP;
	}
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) {
			remove(scope.effects, effect);
		}
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			_cb(...args);
			watchHandle();
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) {
			return;
		}
		if (cb) {
			const newValue = effect.run();
			if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				if (cleanup) {
					cleanup();
				}
				try {
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} catch {}
			}
		} else {
			effect.run();
		}
	};
	if (augmentJob) {
		augmentJob(job);
	}
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => (onWatcherCleanup(fn, 0, effect), void 0);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) {
				call(cleanups, 4);
			} else {
				for (const cleanup2 of cleanups) cleanup2();
			}
			cleanupMap.delete(effect);
		}
	};
	if (cb) {
		if (immediate) {
			job(true);
		} else {
			oldValue = effect.run();
		}
	} else if (scheduler) {
		scheduler(job.bind(null, true), true);
	} else {
		effect.run();
	}
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) {
		return value;
	}
	seen = seen || new Map();
	if ((seen.get(value) || 0) >= depth) {
		return value;
	}
	seen.set(value, depth);
	depth--;
	if (isRef(value)) {
		traverse(value.value, depth, seen);
	} else if (isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			traverse(value[i], depth, seen);
		}
	} else if (isSet(value) || isMap(value)) {
		value.forEach((v) => {
			traverse(v, depth, seen);
		});
	} else if (isPlainObject$1(value)) {
		for (const key in value) {
			traverse(value[key], depth, seen);
		}
		for (const key of Object.getOwnPropertySymbols(value)) {
			if (Object.prototype.propertyIsEnumerable.call(value, key)) {
				traverse(value[key], depth, seen);
			}
		}
	}
	return value;
}
/**
* @vue/runtime-core v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) {
			res.catch((err) => {
				handleError(err, instance, type);
			});
		}
		return res;
	}
	if (isArray(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) {
			values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		}
		return values;
	}
}
function handleError(err, instance, type) {
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks) {
				for (let i = 0; i < errorCapturedHooks.length; i++) {
					if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
						return;
					}
				}
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 0, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, 0, 0, 0, throwUnhandledErrorInProduction);
}
function logError(err, __unused_9ABC, __unused_0E4F, __unused_B710, throwInProd = false) {
	if (throwInProd) {
		throw err;
	} else {
		console.error(err);
	}
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
			start = middle + 1;
		} else {
			end = middle;
		}
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) {
			queue.push(job);
		} else {
			queue.splice(findInsertionIndex(jobId), 0, job);
		}
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) {
		currentFlushPromise = resolvedPromise.then(flushJobs);
	}
}
function queuePostFlushCb(cb) {
	if (!isArray(cb)) {
		if (activePostFlushCbs && cb.id === -1) {
			activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		} else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else {
		pendingPostFlushCbs.push(...cb);
	}
	queueFlush();
}
function flushPreFlushCbs(instance, __unused_9C68, i = flushIndex + 1) {
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid) {
				continue;
			}
			queue.splice(i, 1);
			i--;
			if (cb.flags & 4) {
				cb.flags &= -2;
			}
			cb();
			if (!(cb.flags & 4)) {
				cb.flags &= -2;
			}
		}
	}
}
function flushPostFlushCbs() {
	if (pendingPostFlushCbs.length) {
		const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = 0;
		if (activePostFlushCbs) {
			activePostFlushCbs.push(...deduped);
			return;
		}
		activePostFlushCbs = deduped;
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (cb.flags & 4) {
				cb.flags &= -2;
			}
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs() {
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (job.flags & 4) {
					job.flags &= -2;
				}
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) {
					job.flags &= -2;
				}
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) {
				job.flags &= -2;
			}
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs();
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) {
			flushJobs();
		}
	}
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance) {
	if (!ctx) return fn;
	const renderFnWithContext = (...args) => {
		const prevInstance = setCurrentRenderingInstance(ctx);
		let res;
		try {
			res = fn(...args);
		} finally {
			setCurrentRenderingInstance(prevInstance);
		}
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function withDirectives(vnode, directives) {
	if (currentRenderingInstance === null) {
		return vnode;
	}
	const instance = getComponentPublicInstance(currentRenderingInstance);
	const bindings = vnode.dirs || (vnode.dirs = []);
	for (let i = 0; i < 1; i++) {
		let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
		if (dir) {
			if (isFunction(dir)) {
				dir = {
					mounted: dir,
					updated: dir
				};
			}
			if (dir.deep) {
				traverse(value);
			}
			bindings.push({
				dir,
				instance,
				value,
				oldValue: void 0,
				arg,
				modifiers
			});
		}
	}
	return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	const bindings = vnode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		const binding = bindings[i];
		if (oldBindings) {
			binding.oldValue = oldBindings[i].value;
		}
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				vnode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) {
			provides = currentInstance.provides = Object.create(parentProvides);
		}
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance$1();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) {
			return provides[key];
		} else if (arguments.length > 1) {
			return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
		}
	}
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		return ctx;
	}
};
function watchEffect(effect, options) {
	return doWatch(effect, null, options);
}
function watch(source, cb, options) {
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, flush } = options;
	const baseWatchOptions = extend({}, options);
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			return;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") {
		baseWatchOptions.scheduler = (job) => {
			queuePostRenderEffect(job, instance && instance.suspense);
		};
	} else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) {
				job();
			} else {
				queueJob(job);
			}
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) {
			job.flags |= 4;
		}
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) {
			ssrCleanup.push(watchHandle);
		} else if (runsImmediately) {
			watchHandle();
		}
	}
	return;
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		setTransitionHooks(vnode.component.subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		vnode.ssContent.transition = hooks.clone(vnode.ssContent);
		vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
	} else {
		vnode.transition = hooks;
	}
}
function defineComponent$1(options) {
	return options;
}
function useId() {
	const i = getCurrentInstance$1();
	if (i) {
		return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
	}
	return "";
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
const pendingSetRefMap = new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
			setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		}
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		return hasOwn(rawSetupState, key);
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) {
				setupState[oldRef] = null;
			}
		} else if (isRef(oldRef)) {
			{
				oldRef.value = null;
			}
			const oldRawRefAtom = oldRawRef;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction(ref)) {
		callWithErrorHandling(ref, owner, 12, [value, refs]);
	} else {
		const _isString = isString(ref);
		const _isRef = isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : ref.value;
					if (isUnmount) {
						isArray(existing) && remove(existing, refValue);
					} else {
						if (!isArray(existing)) {
							if (_isString) {
								refs[ref] = [refValue];
								if (canSetSetupRef(ref)) {
									setupState[ref] = refs[ref];
								}
							} else {
								const newVal = [refValue];
								{
									ref.value = newVal;
								}
								if (rawRef.k) refs[rawRef.k] = newVal;
							}
						} else if (!existing.includes(refValue)) {
							existing.push(refValue);
						}
					}
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) {
						setupState[ref] = value;
					}
				} else if (_isRef) {
					{
						ref.value = value;
					}
					if (rawRef.k) refs[rawRef.k] = value;
				}
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		}
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
getGlobalThis();
getGlobalThis();
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function injectHook(type, hook, target = currentInstance) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		};
		{
			{
				hooks.push(wrappedHook);
			}
		}
		return;
	}
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || false) {
		injectHook(lifecycle, () => (hook(), void 0), target);
	}
};
const onMounted = createHook("m");
const onBeforeUnmount = createHook("bum");
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent() {
	{
		{
			return resolveAsset() || "RouterLink";
		}
	}
}
function resolveAsset() {
	const instance = currentRenderingInstance || currentInstance;
	if (instance) {
		const Component = instance.type;
		{
			const selfName = getComponentName(Component);
			if (selfName && (selfName === "RouterLink" || selfName === camelize("RouterLink") || selfName === capitalize(camelize("RouterLink")))) {
				return Component;
			}
		}
		const res = resolve(instance["components"] || Component["components"]) || resolve(instance.appContext["components"]);
		return res;
	}
}
function resolve(registry) {
	return registry && (registry["RouterLink"] || registry[camelize("RouterLink")] || registry[capitalize(camelize("RouterLink"))]);
}
const getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => i.props,
	$attrs: (i) => i.attrs,
	$slots: (i) => i.slots,
	$refs: (i) => i.refs,
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => i.type,
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
	$watch: () => NOOP
});
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") {
			return true;
		}
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) {
				switch (n) {
					case 1: return setupState[key];
					case 2: return data[key];
					case 4: return ctx[key];
					case 3: return props[key];
				}
			} else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else {
				accessCache[key] = 0;
			}
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") {
				track(instance.attrs, 0, "");
			}
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
			return cssModule;
		} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
			{
				return globalProperties[key];
			}
		}
	},
	set({ _: instance }, key, value) {
		const { setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) {
			return false;
		}
		if (key[0] === "$" && key.slice(1) in instance) {
			return false;
		} else {
			{
				ctx[key] = value;
			}
		}
		return true;
	},
	has({ _: { setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || false || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) {
			target._.accessCache[key] = 0;
		} else if (hasOwn(descriptor, "value")) {
			this.set(target, key, descriptor.value, null);
		}
		return Reflect.defineProperty(target, key, descriptor);
	}
};
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: Object.create(null),
		optionsCache: new WeakMap(),
		propsCache: new WeakMap(),
		emitsCache: new WeakMap()
	};
}
function createAppAPI(render) {
	return function(rootComponent) {
		{
			{
				rootComponent = extend({}, rootComponent);
			}
		}
		const context = createAppContext();
		const installedPlugins = new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: 0,
			_component: rootComponent,
			_props: null,
			_container: null,
			_context: context,
			_instance: null,
			version: "3.5.27",
			get config() {
				return context.config;
			},
			set config(__unused_273E) {},
			use(plugin, ...options) {
				if (!installedPlugins.has(plugin)) {
					if (plugin && isFunction(plugin.install)) {
						installedPlugins.add(plugin);
						plugin.install(app, ...options);
					} else if (isFunction(plugin)) {
						installedPlugins.add(plugin);
						plugin(app, ...options);
					}
				}
				return app;
			},
			mixin() {
				return app;
			},
			component(name, component) {
				if (!component) {
					return context.components[name];
				}
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				if (!directive) {
					return context.directives[name];
				}
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, __unused_614D, namespace) {
				if (!isMounted) {
					const vnode = app._ceVNode || createVNode(rootComponent, null);
					vnode.appContext = context;
					{
						render(vnode, rootContainer, namespace);
					}
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					return getComponentPublicInstance(vnode.component);
				}
			},
			onUnmount(cleanupFn) {
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					delete app._container.__vue_app__;
				}
			},
			provide(key, value) {
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
let currentApp = null;
const getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) {
			args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		}
		if (modifiers.number) {
			args = rawArgs.map(looseToNumber);
		}
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
	if (!handler && isModelListener) {
		handler = props[handlerName = toHandlerKey(hyphenate(event))];
	}
	if (handler) {
		callWithAsyncErrorHandling(handler, instance, 6, args);
	}
	const onceHandler = props[handlerName + "Once"];
	if (onceHandler) {
		if (!instance.emitted) {
			instance.emitted = {};
		} else if (instance.emitted[handlerName]) {
			return;
		}
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
function normalizeEmitsOptions(comp, appContext) {
	const cache = appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) {
		return cached;
	}
	const raw = comp.emits;
	let normalized = {};
	if (!raw && true) {
		if (isObject$1(comp)) {
			cache.set(comp, null);
		}
		return null;
	}
	if (isArray(raw)) {
		raw.forEach((key) => normalized[key] = null);
	} else {
		extend(normalized, raw);
	}
	if (isObject$1(comp)) {
		cache.set(comp, normalized);
	}
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) {
		return false;
	}
	key = key.slice(2).replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			result = normalizeVNode(render2.length > 1 ? render2(props, {
				attrs,
				slots,
				emit
			}) : render2(props, null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) {
					fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				}
				root = cloneVNode(root, fallthroughAttrs, false, true);
			}
		}
	}
	if (vnode.dirs) {
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) {
		setTransitionHooks(root, vnode.transition);
	}
	{
		result = root;
	}
	setCurrentRenderingInstance(prev);
	return result;
}
const getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) {
		if (key === "class" || key === "style" || isOn(key)) {
			(res || (res = {}))[key] = attrs[key];
		}
	}
	return res;
};
const filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) {
		if (!isModelListener(key) || !(key.slice(9) in props)) {
			res[key] = attrs[key];
		}
	}
	return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if (nextVNode.dirs || nextVNode.transition) {
		return true;
	}
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) {
			return true;
		}
		if (patchFlag & 16) {
			if (!prevProps) {
				return !!nextProps;
			}
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
					return true;
				}
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) {
				return true;
			}
		}
		if (prevProps === nextProps) {
			return false;
		}
		if (!prevProps) {
			return !!nextProps;
		}
		if (!nextProps) {
			return true;
		}
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) {
		return true;
	}
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
			return true;
		}
	}
	return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.el = vnode.el;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else {
			break;
		}
	}
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) {
		if (!(key in props)) {
			props[key] = void 0;
		}
	}
	if (isStateful) {
		instance.props = shallowReactive(props);
	} else {
		if (!instance.type.props) {
			instance.props = attrs;
		} else {
			instance.props = props;
		}
	}
	instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) {
					continue;
				}
				const value = rawProps[key];
				if (options) {
					if (hasOwn(attrs, key)) {
						if (value !== attrs[key]) {
							attrs[key] = value;
							hasAttrsChanged = true;
						}
					} else {
						const camelizedKey = camelize(key);
						props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
					}
				} else {
					if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) {
			hasAttrsChanged = true;
		}
		let kebabKey;
		for (const key in rawCurrentProps) {
			if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
				if (options) {
					if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
						props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
					}
				} else {
					delete props[key];
				}
			}
		}
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) {
				if (!rawProps || !hasOwn(rawProps, key) && true) {
					delete attrs[key];
					hasAttrsChanged = true;
				}
			}
		}
	}
	if (hasAttrsChanged) {
		trigger(instance.attrs, "set", "");
	}
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) {
		for (let key in rawProps) {
			if (isReservedProp(key)) {
				continue;
			}
			const value = rawProps[key];
			let camelKey;
			if (options && hasOwn(options, camelKey = camelize(key))) {
				if (!needCastKeys || !needCastKeys.includes(camelKey)) {
					props[camelKey] = value;
				} else {
					(rawCastValues || (rawCastValues = {}))[camelKey] = value;
				}
			} else if (!isEmitListener(instance.emitsOptions, key)) {
				if (!(key in attrs) || value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) {
					value = propsDefaults[key];
				} else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else {
				value = defaultValue;
			}
			if (instance.ce) {
				instance.ce._setProp(key, value);
			}
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) {
				value = false;
			} else if (opt[1] && (value === "" || value === hyphenate(key))) {
				value = true;
			}
		}
	}
	return value;
}
function normalizePropsOptions(comp, appContext) {
	const cache = appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) {
		return cached;
	}
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	if (!raw && true) {
		if (isObject$1(comp)) {
			cache.set(comp, EMPTY_ARR);
		}
		return EMPTY_ARR;
	}
	if (isArray(raw)) {
		for (let i = 0; i < raw.length; i++) {
			const normalizedKey = camelize(raw[i]);
			if (validatePropName(normalizedKey)) {
				normalized[normalizedKey] = EMPTY_OBJ;
			}
		}
	} else if (raw) {
		for (const key in raw) {
			const normalizedKey = camelize(key);
			if (validatePropName(normalizedKey)) {
				const opt = raw[key];
				const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
				const propType = prop.type;
				let shouldCast = false;
				let shouldCastTrue = true;
				if (isArray(propType)) {
					for (let index = 0; index < propType.length; ++index) {
						const type = propType[index];
						const typeName = isFunction(type) && type.name;
						if (typeName === "Boolean") {
							shouldCast = true;
							break;
						} else if (typeName === "String") {
							shouldCastTrue = false;
						}
					}
				} else {
					shouldCast = isFunction(propType) && propType.name === "Boolean";
				}
				prop[0] = shouldCast;
				prop[1] = shouldCastTrue;
				if (shouldCast || hasOwn(prop, "default")) {
					needCastKeys.push(normalizedKey);
				}
			}
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject$1(comp)) {
		cache.set(comp, res);
	}
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) {
		return true;
	}
	return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (__unused_E9EB, rawSlot, ctx) => {
	if (rawSlot._n) {
		return rawSlot;
	}
	const normalized = withCtx((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
const normalizeObjectSlots = (rawSlots, slots) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction(value)) {
			slots[key] = normalizeSlot(0, value, ctx);
		} else if (value != null) {
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
const normalizeVNodeSlots = (instance, children) => {
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
	for (const key in children) {
		if (optimized || !isInternalKey(key)) {
			slots[key] = children[key];
		}
	}
};
const initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) {
				def(slots, "_", type, true);
			}
		} else {
			normalizeObjectSlots(children, slots);
		}
	} else if (children) {
		normalizeVNodeSlots(instance, children);
	}
};
const updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			if (optimized && type === 1) {
				needDeletionCheck = false;
			} else {
				assignSlots(slots, children, optimized);
			}
		} else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) {
			if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
				delete slots[key];
			}
		}
	}
};
function initFeatureFlags() {
	if (typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ !== "boolean") {
		getGlobalThis().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
	}
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function baseCreateRenderer(options) {
	{
		initFeatureFlags();
	}
	const target = getGlobalThis();
	target.__VUE__ = true;
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
		if (n1 === n2) {
			return;
		}
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) {
					mountStaticNode(n2, container, anchor, namespace);
				}
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) {
				processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else if (shapeFlag & 6) {
				processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else if (shapeFlag & 64) {
				type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			} else if (shapeFlag & 128) {
				type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			}
		}
		if (ref != null && parentComponent) {
			setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		} else if (ref == null && n1 && n1.ref != null) {
			setRef(n1.ref, null, parentSuspense, n1, true);
		}
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) {
			hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		} else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) {
				{
					hostSetText(el, n2.children);
				}
			}
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) {
			hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		} else {
			n2.el = n1.el;
		}
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") {
			namespace = "svg";
		} else if (n2.type === "math") {
			namespace = "mathml";
		}
		if (n1 == null) {
			mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else {
			const customElement = !!(n1.el && n1.el._isVueCE) ? n1.el : null;
			try {
				if (customElement) {
					customElement._beginPatch();
				}
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) {
					customElement._endPatch();
				}
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) {
			hostSetElementText(el, vnode.children);
		} else if (shapeFlag & 16) {
			mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		}
		if (dirs) {
			invokeDirectiveHook(vnode, null, parentComponent, "created");
		}
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) {
				if (key !== "value" && !isReservedProp(key)) {
					hostPatchProp(el, key, null, props[key], namespace, parentComponent);
				}
			}
			if ("value" in props) {
				hostPatchProp(el, "value", 0, props.value, namespace);
			}
			if (vnodeHook = props.onVnodeBeforeMount) {
				invokeVNodeHook(vnodeHook, parentComponent, vnode);
			}
		}
		if (dirs) {
			invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		}
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) {
			transition.beforeEnter(el);
		}
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
			queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			}, parentSuspense);
		}
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) {
			hostSetScopeId(el, scopeId);
		}
		if (slotScopeIds) {
			for (let i = 0; i < slotScopeIds.length; i++) {
				hostSetScopeId(el, slotScopeIds[i]);
			}
		}
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) {
			const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
			patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) {
			invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		}
		if (dirs) {
			invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		}
		parentComponent && toggleRecurse(parentComponent, true);
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
			hostSetElementText(el, "");
		}
		if (dynamicChildren) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
		} else if (!optimized) {
			patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		}
		if (patchFlag > 0) {
			if (patchFlag & 16) {
				patchProps(el, oldProps, newProps, parentComponent, namespace);
			} else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) {
						hostPatchProp(el, "class", 0, newProps.class, namespace);
					}
				}
				if (patchFlag & 4) {
					hostPatchProp(el, "style", oldProps.style, newProps.style);
				}
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") {
							hostPatchProp(el, key, prev, next, namespace, parentComponent);
						}
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) {
					hostSetElementText(el, n2.children);
				}
			}
		} else if (!optimized && dynamicChildren == null) {
			patchProps(el, oldProps, newProps, parentComponent, namespace);
		}
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
			queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
				dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
			}, parentSuspense);
		}
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer;
			patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) {
					if (!isReservedProp(key) && !(key in newProps)) {
						hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
					}
				}
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") {
					hostPatchProp(el, key, prev, next, namespace, parentComponent);
				}
			}
			if ("value" in newProps) {
				hostPatchProp(el, "value", 0, newProps.value, namespace);
			}
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (fragmentSlotScopeIds) {
			slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		}
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(
				// #10007
				// such fragment like `<></>` will be compiled into
				// a fragment which doesn't have a children.
				// In this case fallback to an empty array
				n2.children || [],
				container,
				fragmentEndAnchor,
				parentComponent,
				parentSuspense,
				namespace,
				slotScopeIds,
				optimized
			);
		} else {
			if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
				patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
				if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
					traverseStaticChildren(
						n1,
						n2
						/* shallow */
					);
				}
			} else {
				patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
		}
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) {
			if (n2.shapeFlag & 512) {
				parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
			} else {
				mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
			}
		} else {
			updateComponent(n1, n2, optimized);
		}
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (isKeepAlive(initialVNode)) {
			instance.ctx.renderer = internals;
		}
		{
			setupComponent(instance, 0, optimized);
		}
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else {
			setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
		}
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) {
			if (instance.asyncDep && !instance.asyncResolved) {
				updateComponentPreRender(instance, n2, optimized);
				return;
			} else {
				instance.next = n2;
				instance.update();
			}
		} else {
			n2.el = n1.el;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) {
					invokeArrayFns(bm);
				}
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
					invokeVNodeHook(vnodeHook, parent, initialVNode);
				}
				toggleRecurse(instance, true);
				{
					if (root.ce && root.ce._def.shadowRoot !== false) {
						root.ce._injectChildStyle(type);
					}
					const subTree = instance.subTree = renderComponentRoot(instance);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					initialVNode.el = subTree.el;
				}
				if (m) {
					queuePostRenderEffect(m, parentSuspense);
				}
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => (invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), void 0), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
					instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				}
				instance.isMounted = true;
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
					if (nonHydratedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						nonHydratedAsyncRoot.asyncDep.then(() => {
							if (!instance.isUnmounted) {
								componentUpdateFn();
							}
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else {
					next = vnode;
				}
				if (bu) {
					invokeArrayFns(bu);
				}
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
					invokeVNodeHook(vnodeHook, parent, next, vnode);
				}
				toggleRecurse(instance, true);
				const nextTree = renderComponentRoot(instance);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				patch(
					prevTree,
					nextTree,
					// parent may have changed if it's in a teleport
					hostParentNode(prevTree.el),
					// anchor may have changed if it's in a fragment
					getNextHostNode(prevTree),
					instance,
					parentSuspense,
					namespace
				);
				next.el = nextTree.el;
				if (originNext === null) {
					updateHOCHostEl(instance, nextTree.el);
				}
				if (u) {
					queuePostRenderEffect(u, parentSuspense);
				}
				if (vnodeHook = next.props && next.props.onVnodeUpdated) {
					queuePostRenderEffect(() => (invokeVNodeHook(vnodeHook, parent, next, vnode), void 0), parentSuspense);
				}
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => (queueJob(job), void 0);
		toggleRecurse(instance, true);
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) {
				unmountChildren(c1, parentComponent, parentSuspense);
			}
			if (c2 !== c1) {
				hostSetElementText(container, c2);
			}
		} else {
			if (prevShapeFlag & 16) {
				if (shapeFlag & 16) {
					patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				} else {
					unmountChildren(c1, parentComponent, parentSuspense, true);
				}
			} else {
				if (prevShapeFlag & 8) {
					hostSetElementText(container, "");
				}
				if (shapeFlag & 16) {
					mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				}
			}
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i;
		for (i = 0; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) {
			unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		} else {
			mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
		}
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) {
				patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else {
				break;
			}
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) {
				patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else {
				break;
			}
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) {
			while (i <= e1) {
				unmount(c1[i], parentComponent, parentSuspense, true);
				i++;
			}
		} else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) {
					keyToNewIndexMap.set(nextChild.key, i);
				}
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) {
					newIndex = keyToNewIndexMap.get(prevChild.key);
				} else {
					for (j = s2; j <= e2; j++) {
						if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
							newIndex = j;
							break;
						}
					}
				}
				if (newIndex === void 0) {
					unmount(prevChild, parentComponent, parentSuspense, true);
				} else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) {
						maxNewIndexSoFar = newIndex;
					} else {
						moved = true;
					}
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) {
					patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				} else if (moved) {
					if (j < 0 || i !== increasingNewIndexSequence[j]) {
						move(nextChild, container, anchor, 2);
					} else {
						j--;
					}
				}
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) {
				move(children[i], container, anchor, moveType);
			}
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
		if (needTransition2) {
			if (moveType === 0) {
				transition.beforeEnter(el);
				hostInsert(el, container, anchor);
				queuePostRenderEffect(() => transition.enter(el), parentSuspense);
			} else {
				const { leave, delayLeave, afterLeave } = transition;
				const remove2 = () => {
					if (vnode.ctx.isUnmounted) {
						hostRemove(el);
					} else {
						hostInsert(el, container, anchor);
					}
				};
				const performLeave = () => {
					if (el._isLeaving) {
						el[leaveCbKey](
							true
							/* cancelled */
						);
					}
					leave(el, () => {
						remove2();
						afterLeave && afterLeave();
					});
				};
				if (delayLeave) {
					delayLeave(el, remove2, performLeave);
				} else {
					performLeave();
				}
			}
		} else {
			hostInsert(el, container, anchor);
		}
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex } = vnode;
		if (patchFlag === -2) {
			optimized = false;
		}
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null) {
			parentComponent.renderCache[cacheIndex] = void 0;
		}
		if (shapeFlag & 256) {
			parentComponent.ctx.deactivate(vnode);
			return;
		}
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
			invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		if (shapeFlag & 6) {
			unmountComponent(vnode.component, parentSuspense, doRemove);
		} else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) {
				invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			}
			if (shapeFlag & 64) {
				vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			} else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
				unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			} else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) {
				unmountChildren(children, parentComponent, parentSuspense);
			}
			if (doRemove) {
				remove(vnode);
			}
		}
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
			queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			}, parentSuspense);
		}
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		if (type === Fragment) {
			{
				removeFragment(el, anchor);
			}
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			return;
		}
		const performRemove = () => {
			hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) {
				transition.afterLeave();
			}
		};
		if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const performLeave = () => leave(el, performRemove);
			if (delayLeave) {
				delayLeave(vnode.el, performRemove, performLeave);
			} else {
				performLeave();
			}
		} else {
			performRemove();
		}
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) {
			invokeArrayFns(bum);
		}
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) {
			queuePostRenderEffect(um, parentSuspense);
		}
		queuePostRenderEffect(() => {
			instance.isUnmounted = true;
		}, parentSuspense);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) {
			unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
		}
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) {
			return getNextHostNode(vnode.component.subTree);
		}
		if (vnode.shapeFlag & 128) {
			return vnode.suspense.next();
		}
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	let isFlushing = false;
	const render = (vnode, container, namespace) => {
		let instance;
		if (vnode == null) {
			if (container._vnode) {
				unmount(container._vnode, null, null, true);
				instance = container._vnode.component;
			}
		} else {
			patch(container._vnode || null, vnode, container, null, null, null, namespace);
		}
		container._vnode = vnode;
		if (!isFlushing) {
			isFlushing = true;
			flushPreFlushCbs(instance);
			flushPostFlushCbs();
			isFlushing = false;
		}
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	return { a: createAppAPI(render) };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray(ch1) && isArray(ch2)) {
		for (let i = 0; i < ch1.length; i++) {
			const c1 = ch1[i];
			let c2 = ch2[i];
			if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
				if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
					c2 = ch2[i] = cloneIfMounted(ch2[i]);
					c2.el = c1.el;
				}
			}
			if (c2.type === Text) {
				if (c2.patchFlag !== -1) {
					c2.el = c1.el;
				} else {
					c2.__elIndex = i + (n1.type === Fragment ? 1 : 0);
				}
			}
			if (c2.type === Comment && !c2.el) {
				c2.el = c1.el;
			}
		}
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) {
					u = c + 1;
				} else {
					v = c;
				}
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) {
					p[i] = result[u - 1];
				}
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateNonHydratedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) {
		if (subComponent.asyncDep && !subComponent.asyncResolved) {
			return subComponent;
		} else {
			return locateNonHydratedAsyncRoot(subComponent);
		}
	}
}
function invalidateMount(hooks) {
	if (hooks) {
		for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
	}
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) {
		return anchorVnode.placeholder;
	}
	const instance = anchorVnode.component;
	if (instance) {
		return resolveAsyncComponentPlaceholder(instance.subTree);
	}
	return null;
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) {
		if (isArray(fn)) {
			suspense.effects.push(...fn);
		} else {
			suspense.effects.push(fn);
		}
	} else {
		queuePostFlushCb(fn);
	}
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") {
		ref = "" + ref;
	}
	return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, __unused_6930, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) {
			type.normalize(vnode);
		}
	} else if (children) {
		vnode.shapeFlag |= 16;
	}
	return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) {
		type = Comment;
	}
	if (isVNode(type)) {
		const cloned = cloneVNode(
			type,
			props,
			true
			/* mergeRef: true */
		);
		if (children) {
			normalizeChildren(cloned, children);
		}
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) {
		type = type.__vccOpts;
	}
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) {
			props.class = normalizeClass(klass);
		}
		if (isObject$1(style)) {
			if (isProxy(style) && !isArray(style)) {
				style = extend({}, style);
			}
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, 0, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce
	};
	if (transition && cloneTransition) {
		setTransitionHooks(cloned, transition.clone(cloned));
	}
	return cloned;
}
function createTextVNode(text = " ") {
	return createVNode(Text, null, text, 0);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") {
		return createVNode(Comment);
	} else if (isArray(child)) {
		return createVNode(
			Fragment,
			null,
			// #3666, avoid reference pollution when reusing vnode
			child.slice()
		);
	} else if (isVNode(child)) {
		return cloneIfMounted(child);
	} else {
		return createVNode(Text, null, String(child));
	}
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) {
		children = null;
	} else if (isArray(children)) {
		type = 16;
	} else if (typeof children === "object") {
		if (shapeFlag & 65) {
			const slot = children.default;
			if (slot) {
				slot._c && (slot._d = false);
				normalizeChildren(vnode, slot());
				slot._c && (slot._d = true);
			}
			return;
		} else {
			type = 32;
			const slotFlag = children._;
			if (!slotFlag && !isInternalObject(children)) {
				children._ctx = currentRenderingInstance;
			} else if (slotFlag === 3 && currentRenderingInstance) {
				if (currentRenderingInstance.slots._ === 1) {
					children._ = 1;
				} else {
					children._ = 2;
					vnode.patchFlag |= 1024;
				}
			}
		}
	} else if (isFunction(children)) {
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else {
			type = 8;
		}
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < 2; i++) {
		const toMerge = args[i];
		for (const key in toMerge) {
			if (key === "class") {
				if (ret.class !== toMerge.class) {
					ret.class = normalizeClass([ret.class, toMerge.class]);
				}
			} else if (key === "style") {
				ret.style = normalizeStyle([ret.style, toMerge.style]);
			} else if (isOn(key)) {
				const existing = ret[key];
				const incoming = toMerge[key];
				if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
					ret[key] = existing ? [].concat(existing, incoming) : incoming;
				}
			} else if (key !== "") {
				ret[key] = toMerge[key];
			}
		}
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(
			true
			/* detached */
		),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	{
		instance.ctx = { _: instance };
	}
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(0, instance);
	if (vnode.ce) {
		vnode.ce(instance);
	}
	return instance;
}
let currentInstance = null;
const getCurrentInstance$1 = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter("__VUE_INSTANCE_SETTERS__", (v) => currentInstance = v);
	registerGlobalSetter("__VUE_SSR_SETTERS__", (v) => isInSSRComponentSetup = v);
}
const setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
const unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, __unused_ECDD, optimized = false) {
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful);
	initSlots(instance, children, optimized || false);
	isStateful && setupStatefulComponent(instance);
	return;
}
function setupStatefulComponent(instance) {
	const Component = instance.type;
	instance.accessCache = Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
			markAsyncBoundary(instance);
		}
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			{
				{
					instance.asyncDep = setupResult;
				}
			}
		} else {
			handleSetupResult(instance, setupResult);
		}
	} else {
		finishComponentSetup(instance);
	}
}
function handleSetupResult(instance, setupResult) {
	if (isFunction(setupResult)) {
		if (instance.type.__ssrInlineRender) {
			instance.ssrRender = setupResult;
		} else {
			instance.render = setupResult;
		}
	} else if (isObject$1(setupResult)) {
		instance.setupState = proxyRefs(setupResult);
	}
	finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
	const Component = instance.type;
	if (!instance.render) {
		instance.render = Component.render || NOOP;
	}
}
const attrsProxyHandlers = { get(target, key) {
	track(target, 0, "");
	return target[key];
} };
function createSetupContext(instance) {
	const expose = (exposed) => {
		instance.exposed = exposed || {};
	};
	{
		return {
			attrs: new Proxy(instance.attrs, attrsProxyHandlers),
			slots: instance.slots,
			emit: instance.emit,
			expose
		};
	}
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) {
		return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
			get(target, key) {
				if (key in target) {
					return target[key];
				} else if (key in publicPropertiesMap) {
					return publicPropertiesMap[key](instance);
				}
			},
			has(target, key) {
				return key in target || key in publicPropertiesMap;
			}
		}));
	} else {
		return instance.proxy;
	}
}
function getComponentName(Component) {
	return isFunction(Component) ? Component.displayName || Component.name : Component.name || false;
}
function isClassComponent(value) {
	return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions) => {
	const c = computed$1(getterOrOptions, 0, isInSSRComponentSetup);
	return c;
};
function h(type, propsOrChildren, children) {
	try {
		const l = arguments.length;
		if (l === 2) {
			if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
				if (isVNode(propsOrChildren)) {
					return createVNode(type, null, [propsOrChildren]);
				}
				return createVNode(type, propsOrChildren);
			} else {
				return createVNode(type, null, propsOrChildren);
			}
		} else {
			if (l > 3) {
				children = Array.prototype.slice.call(arguments, 2);
			} else if (l === 3 && isVNode(children)) {
				children = [children];
			}
			return createVNode(type, propsOrChildren, children);
		}
	} catch {}
}
/**
* @vue/runtime-dom v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
	try {
		policy = tt.createPolicy("vue", { createHTML: (val) => val });
	} catch {}
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && doc.createElement("template");
const nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) {
			parent.removeChild(child);
		}
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) {
			el.setAttribute("multiple", props.multiple);
		}
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) {
			while (true) {
				parent.insertBefore(start.cloneNode(true), anchor);
				if (start === end || !(start = start.nextSibling)) break;
			}
		} else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) {
					template.appendChild(wrapper.firstChild);
				}
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) {
		value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	}
	if (value == null) {
		el.removeAttribute("class");
	} else if (isSVG) {
		el.setAttribute("class", value);
	} else {
		el.className = value;
	}
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) {
			if (!isString(prev)) {
				for (const key in prev) {
					if (next[key] == null) {
						setStyle(style, key, "");
					}
				}
			} else {
				for (const prevStyle of prev.split(";")) {
					const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
					if (next[key] == null) {
						setStyle(style, key, "");
					}
				}
			}
		}
		for (const key in next) {
			if (key === "display") {
				hasControlledDisplay = true;
			}
			setStyle(style, key, next[key]);
		}
	} else {
		if (isCssString) {
			if (prev !== next) {
				const cssVarText = style[CSS_VAR_TEXT];
				if (cssVarText) {
					next += ";" + cssVarText;
				}
				style.cssText = next;
				hasControlledDisplay = displayRE.test(next);
			}
		} else if (prev) {
			el.removeAttribute("style");
		}
	}
	if (vShowOriginalDisplay in el) {
		el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) {
			style.display = "none";
		}
	}
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
	if (isArray(val)) {
		val.forEach((v) => setStyle(style, name, v));
	} else {
		if (val == null) val = "";
		if (name.startsWith("--")) {
			style.setProperty(name, val);
		} else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) {
				style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
			} else {
				style[prefixed] = val;
			}
		}
	}
}
const prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
const prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) {
		return cached;
	}
	let name = camelize(rawName);
	if (name !== "filter" && name in style) {
		return prefixCache[rawName] = name;
	}
	name = capitalize(name);
	for (let i = 0; i < 3; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) {
			return prefixCache[rawName] = prefixed;
		}
	}
	return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, __unused_0579, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) {
		if (value == null) {
			el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
		} else {
			el.setAttributeNS(xlinkNS, key, value);
		}
	} else {
		if (value == null || isBoolean && !includeBooleanAttr(value)) {
			el.removeAttribute(key);
		} else {
			el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
		}
	}
}
function patchDOMProp(el, key, value, __unused_AE09, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) {
			el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		}
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) {
			el.value = newValue;
		}
		if (value == null) {
			el.removeAttribute(key);
		}
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") {
			value = includeBooleanAttr(value);
		} else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch {}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, __unused_7A4B, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) {
		existingInvoker.value = nextValue;
	} else {
		const [name, options] = parseName(rawName);
		if (nextValue) {
			const invoker = invokers[rawName] = createInvoker(nextValue, instance);
			addEventListener(el, name, invoker, options);
		} else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	if (optionsModifierRE.test(name)) {
		options = {};
		let m;
		while (m = name.match(optionsModifierRE)) {
			name = name.slice(0, name.length - m[0].length);
			options[m[0].toLowerCase()] = true;
		}
	}
	const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
	return [event, options];
}
let cachedNow = 0;
const p = Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) {
			e._vts = Date.now();
		} else if (e._vts <= invoker.attached) {
			return;
		}
		callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
function patchStopImmediatePropagation(e, value) {
	if (isArray(value)) {
		const originalStop = e.stopImmediatePropagation;
		e.stopImmediatePropagation = () => {
			originalStop.call(e);
			e._stopped = true;
		};
		return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
	} else {
		return value;
	}
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") {
		patchClass(el, nextValue, isSVG);
	} else if (key === "style") {
		patchStyle(el, prevValue, nextValue);
	} else if (isOn(key)) {
		if (!isModelListener(key)) {
			patchEvent(el, key, 0, nextValue, parentComponent);
		}
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
			patchAttr(el, key, nextValue, isSVG, 0, key !== "value");
		}
	} else if (el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))) {
		patchDOMProp(el, camelize(key), nextValue, 0, key);
	} else {
		if (key === "true-value") {
			el._trueValue = nextValue;
		} else if (key === "false-value") {
			el._falseValue = nextValue;
		}
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") {
			return true;
		}
		if (key in el && isNativeOn(key) && isFunction(value)) {
			return true;
		}
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
		return false;
	}
	if (key === "sandbox" && el.tagName === "IFRAME") {
		return false;
	}
	if (key === "form") {
		return false;
	}
	if (key === "list" && el.tagName === "INPUT") {
		return false;
	}
	if (key === "type" && el.tagName === "TEXTAREA") {
		return false;
	}
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
			return false;
		}
	}
	if (isNativeOn(key) && isString(value)) {
		return false;
	}
	return key in el;
}
const rendererOptions = extend({ patchProp }, nodeOps);
function ensureRenderer() {
	return createRenderer(rendererOptions);
}
const createApp = (...args) => {
	const app = ensureRenderer().a(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction(component) && !component.render && !component.template) {
			component.template = container.innerHTML;
		}
		if (container.nodeType === 1) {
			container.textContent = "";
		}
		const proxy = mount(container, 0, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
};
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) {
		return "svg";
	}
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
		return "mathml";
	}
}
function normalizeContainer(container) {
	if (isString(container)) {
		const res = document.querySelector(container);
		return res;
	}
	return container;
}
// Types
// eslint-disable-line vue/prefer-import-from-vue
/**
* Creates a factory function for props definitions.
* This is used to define props in a composable then override
* default values in an implementing component.
*
* @example Simplified signature
* (props: Props) => (defaults?: Record<keyof props, any>) => Props
*
* @example Usage
* const makeProps = propsFactory({
*   foo: String,
* })
*
* defineComponent({
*   props: {
*     ...makeProps({
*       foo: 'a',
*     }),
*   },
*   setup (props) {
*     // would be "string | undefined", now "string" because a default has been provided
*     props.foo
*   },
* }
*/
function propsFactory(props, source) {
	return (defaults) => {
		return Object.keys(props).reduce((obj, prop) => {
			const isObjectDefinition = typeof props[prop] === "object" && props[prop] != null && !Array.isArray(props[prop]);
			const definition = isObjectDefinition ? props[prop] : { type: props[prop] };
			if (defaults && prop in defaults) {
				obj[prop] = {
					...definition,
					default: defaults[prop]
				};
			} else {
				obj[prop] = definition;
			}
			if (source && !obj[prop].source) {
				obj[prop].source = source;
			}
			return obj;
		}, {});
	};
}
/**
* Like `Partial<T>` but doesn't care what the value is
*/
// Copied from Vue
// Utilities
// Composables
const makeComponentProps = propsFactory({
	class: [
		String,
		Array,
		Object
	],
	style: {
		type: [
			String,
			Array,
			Object
		],
		default: null
	}
}, "component");
function deprecate(__unused_9C1B, replacement) {
	Array.isArray(replacement) && (replacement.slice(0, -1).map((s) => `'${s}'`).join(", "), replacement.at(-1));
}
const IN_BROWSER = typeof window !== "undefined";
const SUPPORTS_INTERSECTION = IN_BROWSER && "IntersectionObserver" in window;
const SUPPORTS_TOUCH = IN_BROWSER && ("ontouchstart" in window || window.navigator.maxTouchPoints > 0);
const SUPPORTS_MATCH_MEDIA = IN_BROWSER && "matchMedia" in window && typeof window.matchMedia === "function";
const PREFERS_REDUCED_MOTION = () => SUPPORTS_MATCH_MEDIA && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function getNestedValue(obj, path) {
	const last = path.length - 1;
	if (last < 0) return obj === void 0 ? null : obj;
	for (let i = 0; i < last; i++) {
		if (obj == null) {
			return null;
		}
		obj = obj[path[i]];
	}
	if (obj == null) return null;
	return obj[path[last]] === void 0 ? null : obj[path[last]];
}
function getObjectValueByPath(obj, path) {
	// credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
	if (obj == null || !path || typeof path !== "string") return null;
	if (obj[path] !== void 0) return obj[path];
	path = path.replace(/\[(\w+)\]/g, ".$1");
	path = path.replace(/^\./, "");
	return getNestedValue(obj, path.split("."));
}
function createRange(length) {
	let start = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	return Array.from({ length }, (__unused_6F3F, k) => start + k);
}
function convertToUnit(str) {
	let unit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
	if (str == null || str === "") {
		return void 0;
	}
	const num = Number(str);
	if (isNaN(num)) {
		return String(str);
	} else if (!isFinite(num)) {
		return void 0;
	} else {
		return `${num}${unit}`;
	}
}
function isObject(obj) {
	return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
function isPlainObject(obj) {
	let proto;
	return obj !== null && typeof obj === "object" && ((proto = Object.getPrototypeOf(obj)) === Object.prototype || proto === null);
}
function refElement(obj) {
	if (obj && "$el" in obj) {
		const el = obj.$el;
		if (el?.nodeType === Node.TEXT_NODE) {
			// Multi-root component, use the first element
			return el.nextElementSibling;
		}
		return el;
	}
	return obj;
}
function has(obj, key) {
	return key.every((k) => obj.hasOwnProperty(k));
}
// Array of keys
function pick(obj, paths) {
	const found = {};
	for (const key of paths) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			found[key] = obj[key];
		}
	}
	return found;
}
function omit(obj, exclude) {
	const clone = { ...obj };
	exclude.forEach((prop) => (delete clone[prop], true));
	return clone;
}
function clamp(value) {
	let min = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	let max = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
	return Math.max(min, Math.min(max, value));
}
function padEnd(str, length) {
	let char = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
	return str + char.repeat(Math.max(0, length - str.length));
}
function padStart(str, length) {
	let char = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
	return char.repeat(Math.max(0, length - str.length)) + str;
}
function chunk(str) {
	let size = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
	const chunked = [];
	let index = 0;
	while (index < str.length) {
		chunked.push(str.substr(index, size));
		index += size;
	}
	return chunked;
}
function mergeDeep() {
	let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	let target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	let arrayFn = arguments.length > 2 ? arguments[2] : void 0;
	const out = {};
	for (const key in source) {
		out[key] = source[key];
	}
	for (const key in target) {
		const sourceProperty = source[key];
		const targetProperty = target[key];
		// Only continue deep merging if
		// both properties are plain objects
		if (isPlainObject(sourceProperty) && isPlainObject(targetProperty)) {
			out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn);
			continue;
		}
		if (arrayFn && Array.isArray(sourceProperty) && Array.isArray(targetProperty)) {
			out[key] = arrayFn(sourceProperty, targetProperty);
			continue;
		}
		out[key] = targetProperty;
	}
	return out;
}
function flattenFragments(nodes) {
	return nodes.map((node) => {
		if (node.type === Fragment) {
			return flattenFragments(node.children);
		} else {
			return node;
		}
	}).flat();
}
function toKebabCase() {
	let str = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
	if (toKebabCase.a.has(str)) return toKebabCase.a.get(str);
	const kebab = str.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
	toKebabCase.a.set(str, kebab);
	return kebab;
}
toKebabCase.a = new Map();
function findChildrenWithProvide(key, vnode) {
	if (!vnode || typeof vnode !== "object") return [];
	if (Array.isArray(vnode)) {
		return vnode.map((child) => findChildrenWithProvide(key, child)).flat(1);
	} else if (vnode.suspense) {
		return findChildrenWithProvide(key, vnode.ssContent);
	} else if (Array.isArray(vnode.children)) {
		return vnode.children.map((child) => findChildrenWithProvide(key, child)).flat(1);
	} else if (vnode.component) {
		if (Object.getOwnPropertyDescriptor(vnode.component.provides, key)) {
			return [vnode.component];
		} else if (vnode.component.subTree) {
			return findChildrenWithProvide(key, vnode.component.subTree).flat(1);
		}
	}
	return [];
}
// Only allow a single return type
/**
* Convert a computed ref to a record of refs.
* The getter function must always return an object with the same keys.
*/
function destructComputed(getter) {
	const refs = reactive({});
	watchEffect(() => {
		const base = getter();
		for (const key in base) {
			refs[key] = base[key];
		}
	}, { flush: "sync" });
	const obj = {};
	for (const key in refs) {
		obj[key] = toRef(() => refs[key]);
	}
	return obj;
}
/** Array.includes but value can be any type */
function includes(arr, val) {
	return arr.includes(val);
}
function hasEvent(props, name) {
	name = "on" + capitalize("click");
	return !!(props[name] || props[`${name}Once`] || props[`${name}Capture`] || props[`${name}OnceCapture`] || props[`${name}CaptureOnce`]);
}
function templateRef() {
	const el = shallowRef();
	const fn = (target) => {
		el.value = target;
	};
	Object.defineProperty(fn, "value", {
		enumerable: true,
		get: () => el.value,
		set: (val) => el.value = val
	});
	Object.defineProperty(fn, "el", {
		enumerable: true,
		get: () => refElement(el.value)
	});
	return fn;
}
function isPrimitive(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
}
// Utilities
const block = ["top", "bottom"];
const inline = [
	"start",
	"end",
	"left",
	"right"
];
/** Parse a raw anchor string into an object */
function parseAnchor(anchor, isRtl) {
	let [side, align] = anchor.split(" ");
	if (!align) {
		align = includes(block, side) ? "start" : includes(inline, side) ? "top" : "center";
	}
	return {
		a: toPhysical(side, isRtl),
		b: toPhysical(align, isRtl)
	};
}
function toPhysical(str, isRtl) {
	if (str === "start") return isRtl ? "right" : "left";
	if (str === "end") return isRtl ? "left" : "right";
	return str;
}
/**
* WCAG 3.0 APCA perceptual contrast algorithm from https://github.com/Myndex/SAPC-APCA
* @licence https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
* @see https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup
*/
// Types
// MAGICAL NUMBERS
// sRGB Conversion to Relative Luminance (Y)
// Transfer Curve (aka "Gamma") for sRGB linearization
// Simple power curve vs piecewise described in docs
// Essentially, 2.4 best models actual display
// characteristics in combination with the total method
const mainTRC = 2.4;
const Rco = .2126729;
const Gco = .7151522;
const Bco = .072175;
// For Finding Raw SAPC Contrast from Relative Luminance (Y)
// Constants for SAPC Power Curve Exponents
// One pair for normal text, and one for reverse
// These are the "beating heart" of SAPC
const normBG = .55;
const normTXT = .58;
const revTXT = .57;
const revBG = .62;
// For Clamping and Scaling Values
const blkThrs = .03;
const blkClmp = 1.45;
const deltaYmin = 5e-4;
const scaleBoW = 1.25;
const scaleWoB = 1.25;
const loConThresh = .078;
const loConFactor = 12.82051282051282;
const loConOffset = .06;
const loClip = .001;
function APCAcontrast(text, background) {
	// Linearize sRGB
	const Rtxt = (text.r / 255) ** mainTRC;
	const Gtxt = (text.g / 255) ** mainTRC;
	const Btxt = (text.b / 255) ** mainTRC;
	const Rbg = (background.r / 255) ** mainTRC;
	const Gbg = (background.g / 255) ** mainTRC;
	const Bbg = (background.b / 255) ** mainTRC;
	// Apply the standard coefficients and sum to Y
	let Ytxt = Rtxt * Rco + Gtxt * Gco + Btxt * Bco;
	let Ybg = Rbg * Rco + Gbg * Gco + Bbg * Bco;
	// Soft clamp Y when near black.
	// Now clamping all colors to prevent crossover errors
	if (Ytxt <= blkThrs) Ytxt += (blkThrs - Ytxt) ** blkClmp;
	if (Ybg <= blkThrs) Ybg += (blkThrs - Ybg) ** blkClmp;
	// Return 0 Early for extremely low ∆Y (lint trap #1)
	if (Math.abs(Ybg - Ytxt) < deltaYmin) return 0;
	// SAPC CONTRAST
	let outputContrast;
	if (Ybg > Ytxt) {
		// For normal polarity, black text on white
		// Calculate the SAPC contrast value and scale
		const SAPC = (Ybg ** normBG - Ytxt ** normTXT) * scaleBoW;
		// NEW! SAPC SmoothScale™
		// Low Contrast Smooth Scale Rollout to prevent polarity reversal
		// and also a low clip for very low contrasts (lint trap #2)
		// much of this is for very low contrasts, less than 10
		// therefore for most reversing needs, only loConOffset is important
		outputContrast = SAPC < loClip ? 0 : SAPC < loConThresh ? SAPC - SAPC * loConFactor * loConOffset : SAPC - loConOffset;
	} else {
		// For reverse polarity, light text on dark
		// WoB should always return negative value.
		const SAPC = (Ybg ** revBG - Ytxt ** revTXT) * scaleWoB;
		outputContrast = SAPC > -loClip ? 0 : SAPC > -loConThresh ? SAPC - SAPC * loConFactor * loConOffset : SAPC + loConOffset;
	}
	return outputContrast * 100;
}
// Types
const delta = .20689655172413793;
const cielabForwardTransform = (t) => t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta ** 2) + 4 / 29;
const cielabReverseTransform = (t) => t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4 / 29);
function fromXYZ$1(xyz) {
	const transform = cielabForwardTransform;
	const transformedY = transform(xyz[1]);
	return [
		116 * transformedY - 16,
		500 * (transform(xyz[0] / .95047) - transformedY),
		200 * (transformedY - transform(xyz[2] / 1.08883))
	];
}
function toXYZ$1(lab) {
	const transform = cielabReverseTransform;
	const Ln = (lab[0] + 16) / 116;
	return [
		transform(Ln + lab[1] / 500) * .95047,
		transform(Ln),
		transform(Ln - lab[2] / 200) * 1.08883
	];
}
// Utilities
// For converting XYZ to sRGB
const srgbForwardMatrix = [
	[
		3.2406,
		-1.5372,
		-.4986
	],
	[
		-.9689,
		1.8758,
		.0415
	],
	[
		.0557,
		-.204,
		1.057
	]
];
// Forward gamma adjust
const srgbForwardTransform = (C) => C <= .0031308 ? C * 12.92 : 1.055 * C ** (1 / 2.4) - .055;
// For converting sRGB to XYZ
const srgbReverseMatrix = [
	[
		.4124,
		.3576,
		.1805
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.0193,
		.1192,
		.9505
	]
];
// Reverse gamma adjust
const srgbReverseTransform = (C) => C <= .04045 ? C / 12.92 : ((C + .055) / 1.055) ** 2.4;
function fromXYZ(xyz) {
	const rgb = Array(3);
	const transform = srgbForwardTransform;
	const matrix = srgbForwardMatrix;
	// Matrix transform, then gamma adjustment
	for (let i = 0; i < 3; ++i) {
		// Rescale back to [0, 255]
		rgb[i] = Math.round(clamp(transform(matrix[i][0] * xyz[0] + matrix[i][1] * xyz[1] + matrix[i][2] * xyz[2])) * 255);
	}
	return {
		a: rgb[0],
		b: rgb[1],
		c: rgb[2]
	};
}
function toXYZ(_ref) {
	let { r, g, b } = _ref;
	const xyz = [
		0,
		0,
		0
	];
	const transform = srgbReverseTransform;
	const matrix = srgbReverseMatrix;
	// Rescale from [0, 255] to [0, 1] then adjust sRGB gamma to linear RGB
	r = transform(r / 255);
	g = transform(g / 255);
	b = transform(b / 255);
	// Matrix color space transform
	for (let i = 0; i < 3; ++i) {
		xyz[i] = matrix[i][0] * r + matrix[i][1] * g + matrix[i][2] * b;
	}
	return xyz;
}
// Utilities
function isCssColor(color) {
	return !!color && /^(#|var\(--|(rgb|hsl)a?\()/.test(color);
}
function isParsableColor(color) {
	return isCssColor(color) && !/^((rgb|hsl)a?\()?var\(--/.test(color);
}
const cssColorRe = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/;
const mappers = {
	rgb: (r, g, b, a) => ({
		r,
		g,
		b,
		a
	}),
	rgba: (r, g, b, a) => ({
		r,
		g,
		b,
		a
	}),
	hsl: (h, s, l, a) => HSLtoRGB({
		h,
		s,
		l,
		a
	}),
	hsla: (h, s, l, a) => HSLtoRGB({
		h,
		s,
		l,
		a
	}),
	hsv: (h, s, v, a) => HSVtoRGB({
		h,
		s,
		v,
		a
	}),
	hsva: (h, s, v, a) => HSVtoRGB({
		h,
		s,
		v,
		a
	})
};
function parseColor(color) {
	if (typeof color === "number") {
		return {
			r: (color & 16711680) >> 16,
			g: (color & 65280) >> 8,
			b: color & 255
		};
	} else if (typeof color === "string" && cssColorRe.test(color)) {
		const { groups } = color.match(cssColorRe);
		const { fn, values } = groups;
		const realValues = values.split(/,\s*|\s*\/\s*|\s+/).map((v, i) => {
			if (v.endsWith("%") || i > 0 && i < 3 && [
				"hsl",
				"hsla",
				"hsv",
				"hsva"
			].includes(fn)) {
				return parseFloat(v) / 100;
			} else {
				return parseFloat(v);
			}
		});
		return mappers[fn](...realValues);
	} else if (typeof color === "string") {
		let hex = color.startsWith("#") ? color.slice(1) : color;
		if ([3, 4].includes(hex.length)) {
			hex = hex.split("").map((char) => char + char).join("");
		} else {
			[6, 8].includes(hex.length);
		}
		return HexToRGB(hex);
	} else if (typeof color === "object") {
		if (has(color, [
			"r",
			"g",
			"b"
		])) {
			return color;
		} else if (has(color, [
			"h",
			"s",
			"l"
		])) {
			return HSVtoRGB(HSLtoHSV(color));
		} else if (has(color, [
			"h",
			"s",
			"v"
		])) {
			return HSVtoRGB(color);
		}
	}
	throw new TypeError(`Invalid color: ${color == null ? color : String(color) || color.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
/** Converts HSVA to RGBA. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV */
function HSVtoRGB(hsva) {
	const { h, s, v, a } = hsva;
	const f = (n) => {
		const k = (n + h / 60) % 6;
		return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	};
	const rgb = [
		f(5),
		f(3),
		f(1)
	].map((v) => Math.round(v * 255));
	return {
		r: rgb[0],
		g: rgb[1],
		b: rgb[2],
		a
	};
}
function HSLtoRGB(hsla) {
	return HSVtoRGB(HSLtoHSV(hsla));
}
function HSLtoHSV(hsl) {
	const { h, s, l, a } = hsl;
	const v = l + s * Math.min(l, 1 - l);
	const sprime = v === 0 ? 0 : 2 - 2 * l / v;
	return {
		h,
		s: sprime,
		v,
		a
	};
}
function toHex(v) {
	const h = Math.round(v).toString(16);
	return ("00".substr(0, 2 - h.length) + h).toUpperCase();
}
function RGBtoHex(_ref2) {
	let { a: r, b: g, c: b } = _ref2;
	return `#${[
		toHex(r),
		toHex(g),
		toHex(b),
		""
	].join("")}`;
}
function HexToRGB(hex) {
	hex = parseHex(hex);
	let [r, g, b, a] = chunk(hex, 2).map((c) => parseInt(c, 16));
	a = a === void 0 ? a : a / 255;
	return {
		r,
		g,
		b,
		a
	};
}
function parseHex(hex) {
	if (hex.startsWith("#")) {
		hex = hex.slice(1);
	}
	hex = hex.replace(/([^0-9a-f])/gi, "F");
	if (hex.length === 3 || hex.length === 4) {
		hex = hex.split("").map((x) => x + x).join("");
	}
	if (hex.length !== 6) {
		hex = padEnd(padEnd(hex, 6), 8, "F");
	}
	return hex;
}
function lighten(value, amount) {
	const lab = fromXYZ$1(toXYZ(value));
	lab[0] = lab[0] + amount * 10;
	return fromXYZ(toXYZ$1(lab));
}
function darken(value, amount) {
	const lab = fromXYZ$1(toXYZ(value));
	lab[0] = lab[0] - amount * 10;
	return fromXYZ(toXYZ$1(lab));
}
/**
* Calculate the relative luminance of a given color
* @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
*/
function getLuma(color) {
	const rgb = parseColor(color);
	return toXYZ(rgb)[1];
}
function getForeground(color) {
	const blackContrast = Math.abs(APCAcontrast(parseColor(0), parseColor(color)));
	const whiteContrast = Math.abs(APCAcontrast(parseColor(16777215), parseColor(color)));
	// TODO: warn about poor color selections
	// const contrastAsText = Math.abs(APCAcontrast(colorVal, colorToInt(theme.colors.background)))
	// const minContrast = Math.max(blackContrast, whiteContrast)
	// if (minContrast < 60) {
	//   consoleInfo(`${key} theme color ${color} has poor contrast (${minContrast.toFixed()}%)`)
	// } else if (contrastAsText < 60 && !['background', 'surface'].includes(color)) {
	//   consoleInfo(`${key} theme color ${color} has poor contrast as text (${contrastAsText.toFixed()}%)`)
	// }
	// Prefer white text if both have an acceptable contrast ratio
	return whiteContrast > Math.min(blackContrast, 50) ? "#fff" : "#000";
}
// Utilities
function getCurrentInstance(name) {
	const vm = getCurrentInstance$1();
	if (!vm) {
		throw new Error(`[Vuetify] ${name} ${"must be called from inside a setup function"}`);
	}
	return vm;
}
function getCurrentInstanceName() {
	let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
	const vm = getCurrentInstance(name).type;
	return toKebabCase(vm?.aliasName || vm?.name);
}
// Utilities
function injectSelf(key) {
	let vm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstance("injectSelf");
	const { provides } = vm;
	if (provides && key in provides) {
		// TS doesn't allow symbol as index type
		return provides[key];
	}
	return void 0;
}
// Utilities
const DefaultsSymbol = Symbol.for("vuetify:defaults");
function createDefaults(options) {
	return ref(options);
}
function injectDefaults() {
	const defaults = inject(DefaultsSymbol);
	if (!defaults) throw new Error("[Vuetify] Could not find defaults instance");
	return defaults;
}
function provideDefaults(defaults, options) {
	const injectedDefaults = injectDefaults();
	const providedDefaults = ref(defaults);
	const newDefaults = computed(() => {
		const disabled = unref(options.a);
		if (disabled) return injectedDefaults.value;
		const scoped = unref(options.b);
		const reset = unref(options.c);
		const root = unref(options.d);
		if (providedDefaults.value == null && !(scoped || reset || root)) return injectedDefaults.value;
		let properties = mergeDeep(providedDefaults.value, { prev: injectedDefaults.value });
		if (scoped) return properties;
		if (reset || root) {
			const len = Number(reset || Infinity);
			for (let i = 0; i <= len; i++) {
				if (!properties || !("prev" in properties)) {
					break;
				}
				properties = properties.prev;
			}
			if (properties && typeof root === "string" && root in properties) {
				properties = mergeDeep(mergeDeep(properties, { prev: properties }), properties[root]);
			}
			return properties;
		}
		return properties.prev ? mergeDeep(properties.prev, properties) : properties;
	});
	provide(DefaultsSymbol, newDefaults);
	return;
}
function propIsDefined(vnode, prop) {
	return vnode.props && (typeof vnode.props[prop] !== "undefined" || typeof vnode.props[toKebabCase(prop)] !== "undefined");
}
function internalUseDefaults() {
	let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	let name = arguments.length > 1 ? arguments[1] : void 0;
	let defaults = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : injectDefaults();
	const vm = getCurrentInstance("useDefaults");
	name = name ?? vm.type.name ?? vm.type.__name;
	if (!name) {
		throw new Error("[Vuetify] Could not determine component name");
	}
	const componentDefaults = computed(() => defaults.value?.[props._as ?? name]);
	const _props = new Proxy(props, { get(target, prop) {
		const propValue = Reflect.get(target, prop);
		if (prop === "class" || prop === "style") {
			return [componentDefaults.value?.[prop], propValue].filter((v) => v != null);
		}
		if (propIsDefined(vm.vnode, prop)) return propValue;
		const _componentDefault = componentDefaults.value?.[prop];
		if (_componentDefault !== void 0) return _componentDefault;
		const _globalDefault = defaults.value?.global?.[prop];
		if (_globalDefault !== void 0) return _globalDefault;
		return propValue;
	} });
	const _subcomponentDefaults = shallowRef();
	watchEffect(() => {
		if (componentDefaults.value) {
			const subComponents = Object.entries(componentDefaults.value).filter((_ref) => {
				let [key] = _ref;
				return key.startsWith(key[0].toUpperCase());
			});
			_subcomponentDefaults.value = subComponents.length ? Object.fromEntries(subComponents) : void 0;
		} else {
			_subcomponentDefaults.value = void 0;
		}
	});
	function provideSubDefaults() {
		const injected = injectSelf(DefaultsSymbol, vm);
		provide(DefaultsSymbol, computed(() => {
			return _subcomponentDefaults.value ? mergeDeep(injected?.value ?? {}, _subcomponentDefaults.value) : injected?.value;
		}));
	}
	return {
		a: _props,
		b: provideSubDefaults
	};
}
// Composables
// No props
// Object Props
// Implementation
function defineComponent(options) {
	options._setup = options._setup ?? options.setup;
	if (!options.name) {
		return options;
	}
	if (options._setup) {
		options.props = propsFactory(options.props ?? {}, options.name)();
		const propKeys = Object.keys(options.props).filter((key) => key !== "class" && key !== "style");
		options.filterProps = function(props) {
			return pick(props, propKeys);
		};
		options.props._as = String;
		options.setup = function(props, ctx) {
			const defaults = injectDefaults();
			// Skip props proxy if defaults are not provided
			if (!defaults.value) return options._setup(props, ctx);
			const { a: _props, b: provideSubDefaults } = internalUseDefaults(props, props._as ?? options.name, defaults);
			const setupBindings = options._setup(_props, ctx);
			provideSubDefaults();
			return setupBindings;
		};
	}
	return options;
}
// No argument - simple default slot
// Generic constructor argument - generic props and slots
// Slots argument - simple slots
// Implementation
function genericComponent() {
	let exposeDefaults = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
	return (options) => (exposeDefaults ? defineComponent : defineComponent$1)(options);
}
// Adds a filterProps method to the component options
// https://github.com/vuejs/core/pull/10557
// not a vue Component
function updateRecursionCache(a, b, cache) {
	if (!cache || isPrimitive(a) || isPrimitive(b)) return;
	const visitedObject = cache.get(a);
	if (visitedObject) {
		visitedObject.set(b, true);
	} else {
		const newCacheItem = new WeakMap();
		newCacheItem.set(b, true);
		cache.set(a, newCacheItem);
	}
}
function findCachedComparison(a, b, cache) {
	if (!cache || isPrimitive(a) || isPrimitive(b)) return null;
	const r1 = cache.get(a)?.get(b);
	if (typeof r1 === "boolean") return r1;
	const r2 = cache.get(b)?.get(a);
	if (typeof r2 === "boolean") return r2;
	return null;
}
function deepEqual(a, b) {
	let recursionCache = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : new WeakMap();
	if (a === b) return true;
	if (a instanceof Date && b instanceof Date && a.getTime() !== b.getTime()) {
		// If the values are Date, compare them as timestamps
		return false;
	}
	if (a !== Object(a) || b !== Object(b)) {
		// If the values aren't objects, they were already checked for equality
		return false;
	}
	const props = Object.keys(a);
	if (props.length !== Object.keys(b).length) {
		// Different number of props, don't bother to check
		return false;
	}
	const cachedComparisonResult = findCachedComparison(a, b, recursionCache);
	if (cachedComparisonResult) {
		return cachedComparisonResult;
	}
	updateRecursionCache(a, b, recursionCache);
	return props.every((p) => deepEqual(a[p], b[p], recursionCache));
}
// Utilities
const easingPatterns = {
	linear: (t) => t,
	easeInQuad: (t) => t ** 2,
	easeOutQuad: (t) => t * (2 - t),
	easeInOutQuad: (t) => t < .5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t,
	easeInCubic: (t) => t ** 3,
	easeOutCubic: (t) => (t - 1) ** 3 + 1,
	easeInOutCubic: (t) => t < .5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
	easeInQuart: (t) => t ** 4,
	easeOutQuart: (t) => 1 - (t - 1) ** 4,
	easeInOutQuart: (t) => t < .5 ? 8 * t ** 4 : 1 - 8 * (t - 1) ** 4,
	easeInQuint: (t) => t ** 5,
	easeOutQuint: (t) => 1 + (t - 1) ** 5,
	easeInOutQuint: (t) => t < .5 ? 16 * t ** 5 : 1 + 16 * (t - 1) ** 5,
	instant: () => 1
};
// Utilities
function useRender(render) {
	const vm = getCurrentInstance("useRender");
	vm.render = render;
}
// Utilities
function useResizeObserver(callback) {
	let box = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
	const resizeRef = templateRef();
	const contentRect = ref();
	if (IN_BROWSER) {
		const observer = new ResizeObserver((entries) => {
			if (!entries.length) return;
			if (box === "content") {
				contentRect.value = entries[0].contentRect;
			} else {
				contentRect.value = entries[0].target.getBoundingClientRect();
			}
		});
		onBeforeUnmount(() => {
			observer.disconnect();
		});
		watch(() => resizeRef.el, (newValue, oldValue) => {
			if (oldValue) {
				observer.unobserve(oldValue);
				contentRect.value = void 0;
			}
			if (newValue) observer.observe(newValue);
		}, { flush: "post" });
	}
	return {
		a: resizeRef,
		b: readonly(contentRect)
	};
}
// Composables
const VuetifyLayoutKey = Symbol.for("vuetify:layout");
const VuetifyLayoutItemKey = Symbol.for("vuetify:layout-item");
const makeLayoutProps = propsFactory({
	overlaps: {
		type: Array,
		default: () => []
	},
	fullHeight: Boolean
}, "layout");
const generateLayers = (layout, positions, layoutSizes, activeItems) => {
	let previousLayer = {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	};
	const layers = [{
		id: "",
		layer: { ...previousLayer }
	}];
	for (const id of layout) {
		const position = positions.get(id);
		const amount = layoutSizes.get(id);
		const active = activeItems.get(id);
		if (!position || !amount || !active) continue;
		const layer = {
			...previousLayer,
			[position.value]: parseInt(previousLayer[position.value], 10) + (active.value ? parseInt(amount.value, 10) : 0)
		};
		layers.push({
			id,
			layer
		});
		previousLayer = layer;
	}
	return layers;
};
function createLayout(props) {
	const parentLayout = inject(VuetifyLayoutKey, null);
	const rootZIndex = computed(() => parentLayout ? parentLayout.rootZIndex.value - 100 : 1e3);
	const registered = ref([]);
	const positions = reactive(new Map());
	const layoutSizes = reactive(new Map());
	const priorities = reactive(new Map());
	const activeItems = reactive(new Map());
	const disabledTransitions = reactive(new Map());
	const { a: resizeRef, b: layoutRect } = useResizeObserver();
	const computedOverlaps = computed(() => {
		const map = new Map();
		const overlaps = props.overlaps ?? [];
		for (const overlap of overlaps.filter((item) => item.includes(":"))) {
			const [top, bottom] = overlap.split(":");
			if (!registered.value.includes(top) || !registered.value.includes(bottom)) continue;
			const topPosition = positions.get(top);
			const bottomPosition = positions.get(bottom);
			const topAmount = layoutSizes.get(top);
			const bottomAmount = layoutSizes.get(bottom);
			if (!topPosition || !bottomPosition || !topAmount || !bottomAmount) continue;
			map.set(bottom, {
				position: topPosition.value,
				amount: parseInt(topAmount.value, 10)
			});
			map.set(top, {
				position: bottomPosition.value,
				amount: -parseInt(bottomAmount.value, 10)
			});
		}
		return map;
	});
	const layers = computed(() => {
		const uniquePriorities = [...new Set([...priorities.values()].map((p) => p.value))].sort((a, b) => a - b);
		const layout = [];
		for (const p of uniquePriorities) {
			const items = registered.value.filter((id) => priorities.get(id)?.value === p);
			layout.push(...items);
		}
		return generateLayers(layout, positions, layoutSizes, activeItems);
	});
	const transitionsEnabled = computed(() => {
		return !Array.from(disabledTransitions.values()).some((ref) => ref.value);
	});
	const mainRect = computed(() => {
		return layers.value[layers.value.length - 1].layer;
	});
	const mainStyles = toRef(() => {
		return {
			"--v-layout-left": convertToUnit(mainRect.value.left),
			"--v-layout-right": convertToUnit(mainRect.value.right),
			"--v-layout-top": convertToUnit(mainRect.value.top),
			"--v-layout-bottom": convertToUnit(mainRect.value.bottom),
			...transitionsEnabled.value ? void 0 : { transition: "none" }
		};
	});
	const items = computed(() => {
		return layers.value.slice(1).map((_ref, index) => {
			let { id } = _ref;
			const { layer } = layers.value[index];
			const size = layoutSizes.get(id);
			const position = positions.get(id);
			return {
				id,
				...layer,
				size: Number(size.value),
				position: position.value
			};
		});
	});
	const getLayoutItem = (id) => {
		return items.value.find((item) => item.id === id);
	};
	const rootVm = getCurrentInstance("createLayout");
	const isMounted = shallowRef(false);
	onMounted(() => {
		isMounted.value = true;
	});
	provide(VuetifyLayoutKey, {
		register: (vm, _ref2) => {
			let { id, order, position, layoutSize, elementSize, active, disableTransitions, absolute } = _ref2;
			priorities.set(id, order);
			positions.set(id, position);
			layoutSizes.set(id, layoutSize);
			activeItems.set(id, active);
			disableTransitions && disabledTransitions.set(id, disableTransitions);
			const instances = findChildrenWithProvide(VuetifyLayoutItemKey, rootVm?.vnode);
			const instanceIndex = instances.indexOf(vm);
			if (instanceIndex > -1) registered.value.splice(instanceIndex, 0, id);
			else registered.value.push(id);
			const index = computed(() => items.value.findIndex((i) => i.id === id));
			const zIndex = computed(() => rootZIndex.value + layers.value.length * 2 - index.value * 2);
			const layoutItemStyles = computed(() => {
				const isHorizontal = position.value === "left" || position.value === "right";
				const isOppositeHorizontal = position.value === "right";
				const isOppositeVertical = position.value === "bottom";
				const size = elementSize.value ?? layoutSize.value;
				const unit = size === 0 ? "%" : "px";
				const styles = {
					[position.value]: 0,
					zIndex: zIndex.value,
					transform: `translate${isHorizontal ? "X" : "Y"}(${(active.value ? 0 : -(size === 0 ? 100 : size)) * (isOppositeHorizontal || isOppositeVertical ? -1 : 1)}${unit})`,
					position: absolute.value || rootZIndex.value !== 1e3 ? "absolute" : "fixed",
					...transitionsEnabled.value ? void 0 : { transition: "none" }
				};
				if (!isMounted.value) return styles;
				const item = items.value[index.value];
				const overlap = computedOverlaps.value.get(id);
				if (overlap) {
					item[overlap.position] += overlap.amount;
				}
				return {
					...styles,
					height: isHorizontal ? `calc(100% - ${item.top}px - ${item.bottom}px)` : elementSize.value ? `${elementSize.value}px` : void 0,
					left: isOppositeHorizontal ? void 0 : `${item.left}px`,
					right: isOppositeHorizontal ? `${item.right}px` : void 0,
					top: position.value !== "bottom" ? `${item.top}px` : void 0,
					bottom: position.value !== "top" ? `${item.bottom}px` : void 0,
					width: !isHorizontal ? `calc(100% - ${item.left}px - ${item.right}px)` : elementSize.value ? `${elementSize.value}px` : void 0
				};
			});
			const layoutItemScrimStyles = computed(() => ({ zIndex: zIndex.value - 1 }));
			return {
				layoutItemStyles,
				layoutItemScrimStyles,
				zIndex
			};
		},
		unregister: (id) => {
			priorities.delete(id);
			positions.delete(id);
			layoutSizes.delete(id);
			activeItems.delete(id);
			disabledTransitions.delete(id);
			registered.value = registered.value.filter((v) => v !== id);
		},
		mainRect,
		mainStyles,
		getLayoutItem,
		items,
		layoutRect,
		rootZIndex
	});
	const layoutClasses = toRef(() => ["v-layout", { "v-layout--full-height": props.fullHeight }]);
	return {
		a: layoutClasses,
		b: getLayoutItem,
		c: items,
		d: resizeRef
	};
}
// Utilities
// Types
function useToggleScope(source, fn) {
	let scope;
	function start() {
		scope = effectScope();
		scope.run(() => fn.length ? fn() : fn());
	}
	watch(source, (active) => {
		if (active && !scope) {
			start();
		} else if (!active) {
			scope?.stop();
			scope = void 0;
		}
	}, { immediate: true });
	onScopeDispose(() => {
		scope?.stop();
	});
}
// Composables
// Composables
function useProxiedModel(props, prop, defaultValue) {
	let transformIn = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (v) => v;
	let transformOut = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (v) => v;
	const vm = getCurrentInstance("useProxiedModel");
	const internal = ref(props[prop] !== void 0 ? props[prop] : defaultValue);
	const kebabProp = toKebabCase(prop);
	const checkKebab = kebabProp !== prop;
	const isControlled = checkKebab ? computed(() => {
		return !!((vm.vnode.props?.hasOwnProperty(prop) || vm.vnode.props?.hasOwnProperty(kebabProp)) && (vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`) || vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabProp}`)));
	}) : computed(() => {
		return !!(vm.vnode.props?.hasOwnProperty(prop) && vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`));
	});
	useToggleScope(() => !isControlled.value, () => {
		watch(() => props[prop], (val) => {
			internal.value = val;
		});
	});
	const model = computed({
		a() {
			const externalValue = props[prop];
			return transformIn(isControlled.value ? externalValue : internal.value);
		},
		b(internalValue) {
			const newValue = transformOut(internalValue);
			const value = toRaw(isControlled.value ? props[prop] : internal.value);
			if (value === newValue || transformIn(value) === internalValue) {
				return;
			}
			internal.value = newValue;
			vm?.emit(`update:${prop}`, newValue);
		}
	});
	Object.defineProperty(model, "externalValue", { get: () => isControlled.value ? props[prop] : internal.value });
	return model;
}
var en = {
	badge: "Badge",
	open: "Open",
	close: "Close",
	dismiss: "Dismiss",
	confirmEdit: {
		ok: "OK",
		cancel: "Cancel"
	},
	dataIterator: {
		noResultsText: "No matching records found",
		loadingText: "Loading items..."
	},
	dataTable: {
		itemsPerPageText: "Rows per page:",
		ariaLabel: {
			sortDescending: "Sorted descending.",
			sortAscending: "Sorted ascending.",
			sortNone: "Not sorted.",
			activateNone: "Activate to remove sorting.",
			activateDescending: "Activate to sort descending.",
			activateAscending: "Activate to sort ascending."
		},
		sortBy: "Sort by"
	},
	dataFooter: {
		itemsPerPageText: "Items per page:",
		itemsPerPageAll: "All",
		nextPage: "Next page",
		prevPage: "Previous page",
		firstPage: "First page",
		lastPage: "Last page",
		pageText: "{0}-{1} of {2}"
	},
	dateRangeInput: { divider: "to" },
	datePicker: {
		itemsSelected: "{0} selected",
		range: {
			title: "Select dates",
			header: "Enter dates"
		},
		title: "Select date",
		header: "Enter date",
		input: { placeholder: "Enter date" },
		ariaLabel: {
			previousMonth: "Previous month",
			nextMonth: "Next month",
			selectYear: "Select year",
			previousYear: "Previous year",
			nextYear: "Next year",
			selectMonth: "Select month",
			selectDate: "{0}",
			currentDate: "Today, {0}"
		}
	},
	noDataText: "No data available",
	carousel: {
		prev: "Previous visual",
		next: "Next visual",
		ariaLabel: { delimiter: "Carousel slide {0} of {1}" }
	},
	calendar: {
		moreEvents: "{0} more",
		today: "Today"
	},
	input: {
		clear: "Clear {0}",
		prependAction: "{0} prepended action",
		appendAction: "{0} appended action",
		otp: "Please enter OTP character {0}"
	},
	fileInput: {
		counter: "{0} files",
		counterSize: "{0} files ({1} in total)"
	},
	fileUpload: {
		title: "Drag and drop files here",
		divider: "or",
		browse: "Browse Files"
	},
	timePicker: {
		am: "AM",
		pm: "PM",
		title: "Select Time",
		hour: "Hour",
		minute: "Minute",
		second: "Second"
	},
	pagination: { ariaLabel: {
		root: "Pagination Navigation",
		next: "Next page",
		previous: "Previous page",
		page: "Go to page {0}",
		currentPage: "Page {0}, Current page",
		first: "First page",
		last: "Last page"
	} },
	stepper: {
		next: "Next",
		prev: "Previous"
	},
	rating: { ariaLabel: { item: "Rating {0} of {1}" } },
	loading: "Loading...",
	infiniteScroll: {
		loadMore: "Load more",
		empty: "No more"
	},
	rules: {
		required: "This field is required",
		email: "Please enter a valid email",
		number: "This field can only contain numbers",
		integer: "This field can only contain integer values",
		capital: "This field can only contain uppercase letters",
		maxLength: "You must enter a maximum of {0} characters",
		minLength: "You must enter a minimum of {0} characters",
		strictLength: "The length of the entered field is invalid",
		exclude: "The {0} character is not allowed",
		notEmpty: "Please choose at least one value",
		pattern: "Invalid format"
	},
	hotkey: {
		then: "then",
		ctrl: "Ctrl",
		command: "Command",
		space: "Space",
		shift: "Shift",
		alt: "Alt",
		enter: "Enter",
		escape: "Escape",
		upArrow: "Up Arrow",
		downArrow: "Down Arrow",
		leftArrow: "Left Arrow",
		rightArrow: "Right Arrow",
		backspace: "Backspace",
		option: "Option",
		plus: "plus",
		shortcut: "Keyboard shortcut: {0}",
		or: "or"
	},
	video: {
		play: "Play",
		pause: "Pause",
		seek: "Seek",
		volume: "Volume",
		showVolume: "Show volume control",
		mute: "Mute",
		unmute: "Unmute",
		enterFullscreen: "Full screen",
		exitFullscreen: "Exit full screen"
	},
	colorPicker: { ariaLabel: {
		eyedropper: "Select color with eyedropper",
		hueSlider: "Hue",
		alphaSlider: "Alpha",
		redInput: "Red value",
		greenInput: "Green value",
		blueInput: "Blue value",
		alphaInput: "Alpha value",
		hueInput: "Hue value",
		saturationInput: "Saturation value",
		lightnessInput: "Lightness value",
		hexInput: "HEX value",
		hexaInput: "HEX with alpha value",
		changeFormat: "Change color format"
	} }
};
const replace = (str, params) => {
	return str.replace(/\{(\d+)\}/g, (__unused_160A, index) => {
		return String(params[Number(index)]);
	});
};
const createTranslateFunction = (current, fallback, messages) => {
	return function(key) {
		for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			params[_key - 1] = arguments[_key];
		}
		if (!key.startsWith("$vuetify.")) {
			return replace(key, params);
		}
		const shortKey = key.replace("$vuetify.", "");
		const currentLocale = current.value && messages.value[current.value];
		const fallbackLocale = fallback.value && messages.value[fallback.value];
		let str = getObjectValueByPath(currentLocale, shortKey);
		if (!str) {
			str = getObjectValueByPath(fallbackLocale, shortKey);
		}
		if (!str) {
			str = key;
		}
		if (typeof str !== "string") {
			str = key;
		}
		return replace(str, params);
	};
};
function createNumberFunction(current, fallback) {
	return (value, options) => {
		const numberFormat = new Intl.NumberFormat([current.value, fallback.value], options);
		return numberFormat.format(value);
	};
}
function inferDecimalSeparator(current, fallback) {
	const format = createNumberFunction(current, fallback);
	return format(.1).includes(",") ? "," : ".";
}
function useProvided(props, prop, provided) {
	const internal = useProxiedModel(props, prop, props[prop] ?? provided.value);
	// TODO: Remove when defaultValue works
	internal.value = props[prop] ?? provided.value;
	watch(provided, () => {
		if (props[prop] == null) {
			internal.value = provided.value;
		}
	});
	return internal;
}
function createProvideFunction(state) {
	return (props) => {
		const current = useProvided(props, "locale", state.current);
		const fallback = useProvided(props, "fallback", state.fallback);
		const messages = useProvided(props, "messages", state.messages);
		return {
			name: "vuetify",
			current,
			fallback,
			messages,
			decimalSeparator: toRef(() => inferDecimalSeparator(current, fallback)),
			t: createTranslateFunction(current, fallback, messages),
			n: createNumberFunction(current, fallback),
			provide: createProvideFunction({
				current,
				fallback,
				messages
			})
		};
	};
}
function createVuetifyAdapter(options) {
	const current = shallowRef(options?.locale ?? "en");
	const fallback = shallowRef(options?.fallback ?? "en");
	const messages = ref({
		en,
		...options?.messages
	});
	return {
		name: "vuetify",
		current,
		fallback,
		messages,
		decimalSeparator: toRef(() => options?.decimalSeparator ?? inferDecimalSeparator(current, fallback)),
		t: createTranslateFunction(current, fallback, messages),
		n: createNumberFunction(current, fallback),
		provide: createProvideFunction({
			current,
			fallback,
			messages
		})
	};
}
// Utilities
const LocaleSymbol = Symbol.for("vuetify:locale");
function isLocaleInstance(obj) {
	return obj.name != null;
}
function createLocale(options) {
	const i18n = options?.adapter && isLocaleInstance(options?.adapter) ? options?.adapter : createVuetifyAdapter(options);
	const rtl = createRtl(i18n, options);
	return {
		...i18n,
		...rtl
	};
}
function genDefaults$3() {
	return {
		af: false,
		ar: true,
		bg: false,
		ca: false,
		ckb: false,
		cs: false,
		de: false,
		el: false,
		en: false,
		es: false,
		et: false,
		fa: true,
		fi: false,
		fr: false,
		hr: false,
		hu: false,
		he: true,
		id: false,
		it: false,
		ja: false,
		km: false,
		ko: false,
		lv: false,
		lt: false,
		nl: false,
		no: false,
		pl: false,
		pt: false,
		ro: false,
		ru: false,
		sk: false,
		sl: false,
		srCyrl: false,
		srLatn: false,
		sv: false,
		th: false,
		tr: false,
		az: false,
		uk: false,
		vi: false,
		zhHans: false,
		zhHant: false
	};
}
function createRtl(i18n, options) {
	const rtl = ref(options?.rtl ?? genDefaults$3());
	const isRtl = computed(() => rtl.value[i18n.current.value] ?? false);
	return {
		isRtl,
		rtl,
		rtlClasses: toRef(() => `v-locale--is-${isRtl.value ? "rtl" : "ltr"}`)
	};
}
function useRtl() {
	const locale = inject(LocaleSymbol);
	if (!locale) throw new Error("[Vuetify] Could not find injected rtl instance");
	return {
		a: locale.isRtl,
		b: locale.rtlClasses
	};
}
// Utilities
const ThemeSymbol = Symbol.for("vuetify:theme");
const makeThemeProps = propsFactory({ theme: String }, "theme");
function genDefaults$2() {
	return {
		defaultTheme: "light",
		prefix: "v-",
		variations: {
			colors: [],
			lighten: 0,
			darken: 0
		},
		themes: {
			light: {
				dark: false,
				colors: {
					background: "#FFFFFF",
					surface: "#FFFFFF",
					"surface-bright": "#FFFFFF",
					"surface-light": "#EEEEEE",
					"surface-variant": "#424242",
					"on-surface-variant": "#EEEEEE",
					primary: "#1867C0",
					"primary-darken-1": "#1F5592",
					secondary: "#48A9A6",
					"secondary-darken-1": "#018786",
					error: "#B00020",
					info: "#2196F3",
					success: "#4CAF50",
					warning: "#FB8C00"
				},
				variables: {
					"border-color": "#000000",
					"border-opacity": .12,
					"high-emphasis-opacity": .87,
					"medium-emphasis-opacity": .6,
					"disabled-opacity": .38,
					"idle-opacity": .04,
					"hover-opacity": .04,
					"focus-opacity": .12,
					"selected-opacity": .08,
					"activated-opacity": .12,
					"pressed-opacity": .12,
					"dragged-opacity": .08,
					"theme-kbd": "#EEEEEE",
					"theme-on-kbd": "#000000",
					"theme-code": "#F5F5F5",
					"theme-on-code": "#000000"
				}
			},
			dark: {
				dark: true,
				colors: {
					background: "#121212",
					surface: "#212121",
					"surface-bright": "#ccbfd6",
					"surface-light": "#424242",
					"surface-variant": "#c8c8c8",
					"on-surface-variant": "#000000",
					primary: "#2196F3",
					"primary-darken-1": "#277CC1",
					secondary: "#54B6B2",
					"secondary-darken-1": "#48A9A6",
					error: "#CF6679",
					info: "#2196F3",
					success: "#4CAF50",
					warning: "#FB8C00"
				},
				variables: {
					"border-color": "#FFFFFF",
					"border-opacity": .12,
					"high-emphasis-opacity": 1,
					"medium-emphasis-opacity": .7,
					"disabled-opacity": .5,
					"idle-opacity": .1,
					"hover-opacity": .04,
					"focus-opacity": .12,
					"selected-opacity": .08,
					"activated-opacity": .12,
					"pressed-opacity": .16,
					"dragged-opacity": .08,
					"theme-kbd": "#424242",
					"theme-on-kbd": "#FFFFFF",
					"theme-code": "#343434",
					"theme-on-code": "#CCCCCC"
				}
			}
		},
		stylesheetId: "vuetify-theme-stylesheet",
		scoped: false,
		unimportant: false,
		utilities: true
	};
}
function parseThemeOptions() {
	let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : genDefaults$2();
	const defaults = genDefaults$2();
	if (!options) return {
		...defaults,
		isDisabled: true
	};
	const themes = {};
	for (const [key, theme] of Object.entries(options.themes ?? {})) {
		const defaultTheme = theme.dark || key === "dark" ? defaults.themes.dark : defaults.themes.light;
		themes[key] = mergeDeep(defaultTheme, theme);
	}
	return mergeDeep(defaults, {
		...options,
		themes
	});
}
function createCssClass(lines, selector, content, scope) {
	lines.push(`${getScopedSelector(selector, scope)} {
`, ...content.map((line) => `  ${line};
`), "}\n");
}
function genCssVariables(theme, prefix) {
	const lightOverlay = theme.dark ? 2 : 1;
	const darkOverlay = theme.dark ? 1 : 2;
	const variables = [];
	for (const [key, value] of Object.entries(theme.colors)) {
		const rgb = parseColor(value);
		variables.push(`--${prefix}theme-${key}: ${rgb.r},${rgb.g},${rgb.b}`);
		if (!key.startsWith("on-")) {
			variables.push(`--${prefix}theme-${key}-overlay-multiplier: ${getLuma(value) > .18 ? lightOverlay : darkOverlay}`);
		}
	}
	for (const [key, value] of Object.entries(theme.variables)) {
		const color = typeof value === "string" && value.startsWith("#") ? parseColor(value) : void 0;
		const rgb = color ? `${color.r}, ${color.g}, ${color.b}` : void 0;
		variables.push(`--${prefix}${key}: ${rgb ?? value}`);
	}
	return variables;
}
function genVariation(name, color, variations) {
	const object = {};
	if (variations) {
		for (const variation of ["lighten", "darken"]) {
			const fn = variation === "lighten" ? lighten : darken;
			for (const amount of createRange(variations[variation], 1)) {
				object[`${name}-${variation}-${amount}`] = RGBtoHex(fn(parseColor(color), amount));
			}
		}
	}
	return object;
}
function genVariations(colors, variations) {
	if (!variations) return {};
	let variationColors = {};
	for (const name of variations.colors) {
		const color = colors[name];
		if (!color) continue;
		variationColors = {
			...variationColors,
			...genVariation(name, color, variations)
		};
	}
	return variationColors;
}
function genOnColors(colors) {
	const onColors = {};
	for (const color of Object.keys(colors)) {
		if (color.startsWith("on-") || colors[`on-${color}`]) continue;
		const onColor = `on-${color}`;
		const colorVal = parseColor(colors[color]);
		onColors[onColor] = getForeground(colorVal);
	}
	return onColors;
}
function getScopedSelector(selector, scope) {
	if (!scope) return selector;
	const scopeSelector = `:where(${scope})`;
	return selector === ":root" ? scopeSelector : `${scopeSelector} ${selector}`;
}
function upsertStyles(id, cspNonce, styles) {
	const styleEl = getOrCreateStyleElement(id, cspNonce);
	if (!styleEl) return;
	styleEl.innerHTML = styles;
}
function getOrCreateStyleElement(id, cspNonce) {
	if (!IN_BROWSER) return null;
	let style = document.getElementById(id);
	if (!style) {
		style = document.createElement("style");
		style.id = id;
		style.type = "text/css";
		if (cspNonce) style.setAttribute("nonce", cspNonce);
		document.head.appendChild(style);
	}
	return style;
}
// Composables
function createTheme(options) {
	const parsedOptions = parseThemeOptions(options);
	const _name = shallowRef(parsedOptions.defaultTheme);
	const themes = ref(parsedOptions.themes);
	const systemName = shallowRef("light");
	const name = computed({
		a() {
			return _name.value === "system" ? systemName.value : _name.value;
		},
		b(val) {
			_name.value = val;
		}
	});
	const computedThemes = computed(() => {
		const acc = {};
		for (const [name, original] of Object.entries(themes.value)) {
			const colors = {
				...original.colors,
				...genVariations(original.colors, parsedOptions.variations)
			};
			acc[name] = {
				...original,
				colors: {
					...colors,
					...genOnColors(colors)
				}
			};
		}
		return acc;
	});
	const current = toRef(() => computedThemes.value[name.value]);
	const isSystem = toRef(() => _name.value === "system");
	const styles = computed(() => {
		const lines = [];
		const important = parsedOptions.unimportant ? "" : " !important";
		const scoped = parsedOptions.scoped ? parsedOptions.prefix : "";
		if (current.value?.dark) {
			createCssClass(lines, ":root", ["color-scheme: dark"], parsedOptions.scope);
		}
		createCssClass(lines, ":root", genCssVariables(current.value, parsedOptions.prefix), parsedOptions.scope);
		for (const [themeName, theme] of Object.entries(computedThemes.value)) {
			createCssClass(lines, `.${parsedOptions.prefix}theme--${themeName}`, [`color-scheme: ${theme.dark ? "dark" : "normal"}`, ...genCssVariables(theme, parsedOptions.prefix)], parsedOptions.scope);
		}
		if (parsedOptions.utilities) {
			const bgLines = [];
			const fgLines = [];
			const colors = new Set(Object.values(computedThemes.value).flatMap((theme) => Object.keys(theme.colors)));
			for (const key of colors) {
				if (key.startsWith("on-")) {
					createCssClass(fgLines, `.${key}`, [`color: rgb(var(--${parsedOptions.prefix}theme-${key}))${important}`], parsedOptions.scope);
				} else {
					createCssClass(bgLines, `.${scoped}bg-${key}`, [
						`--${parsedOptions.prefix}theme-overlay-multiplier: var(--${parsedOptions.prefix}theme-${key}-overlay-multiplier)`,
						`background-color: rgb(var(--${parsedOptions.prefix}theme-${key}))${important}`,
						`color: rgb(var(--${parsedOptions.prefix}theme-on-${key}))${important}`
					], parsedOptions.scope);
					createCssClass(fgLines, `.${scoped}text-${key}`, [`color: rgb(var(--${parsedOptions.prefix}theme-${key}))${important}`], parsedOptions.scope);
					createCssClass(fgLines, `.${scoped}border-${key}`, [`--${parsedOptions.prefix}border-color: var(--${parsedOptions.prefix}theme-${key})`], parsedOptions.scope);
				}
			}
			if (parsedOptions.layers) {
				lines.push("@layer background {\n", ...bgLines.map((v) => `  ${v}`), "}\n", "@layer foreground {\n", ...fgLines.map((v) => `  ${v}`), "}\n");
			} else {
				lines.push(...bgLines, ...fgLines);
			}
		}
		let final = lines.map((str, i) => i === 0 ? str : `    ${str}`).join("");
		if (parsedOptions.layers) {
			final = "@layer vuetify.theme {\n" + lines.map((v) => `  ${v}`).join("") + "\n}";
		}
		return final;
	});
	const themeClasses = toRef(() => parsedOptions.isDisabled ? void 0 : `${parsedOptions.prefix}theme--${name.value}`);
	const themeNames = toRef(() => Object.keys(computedThemes.value));
	if (SUPPORTS_MATCH_MEDIA) {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		function updateSystemName() {
			systemName.value = media.matches ? "dark" : "light";
		}
		updateSystemName();
		media.addEventListener("change", updateSystemName, { passive: true });
		if (getCurrentScope()) {
			onScopeDispose(() => {
				media.removeEventListener("change", updateSystemName);
			});
		}
	}
	function install(app) {
		if (parsedOptions.isDisabled) return;
		const head = app._context.provides.usehead;
		if (head) {
			function getHead() {
				return { style: [{
					textContent: styles.value,
					id: parsedOptions.stylesheetId,
					nonce: parsedOptions.cspNonce || false
				}] };
			}
			if (head.push) {
				const entry = head.push(getHead);
				if (IN_BROWSER) {
					watch(styles, () => {
						entry.patch(getHead);
					});
				}
			} else {
				if (IN_BROWSER) {
					head.addHeadObjs(toRef(getHead));
					watchEffect(() => head.updateDOM());
				} else {
					head.addHeadObjs(getHead());
				}
			}
		} else {
			if (IN_BROWSER) {
				watch(styles, updateStyles, { immediate: true });
			} else {
				updateStyles();
			}
			function updateStyles() {
				upsertStyles(parsedOptions.stylesheetId, parsedOptions.cspNonce, styles.value);
			}
		}
	}
	function change(themeName) {
		if (themeName !== "system" && !themeNames.value.includes(themeName)) {
			return;
		}
		name.value = themeName;
	}
	function cycle() {
		let themeArray = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : themeNames.value;
		const currentIndex = themeArray.indexOf(name.value);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length;
		change(themeArray[nextIndex]);
	}
	function toggle() {
		let themeArray = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["light", "dark"];
		cycle(themeArray);
	}
	const globalName = new Proxy(name, {
		get(target, prop) {
			return Reflect.get(target, prop);
		},
		set(target, prop, val) {
			if (prop === "value") {
				deprecate(0, `theme.change('${val}')`);
			}
			return Reflect.set(target, prop, val);
		}
	});
	return {
		install,
		change,
		cycle,
		toggle,
		isDisabled: parsedOptions.isDisabled,
		isSystem,
		name,
		themes,
		current,
		computedThemes,
		prefix: parsedOptions.prefix,
		themeClasses,
		styles,
		global: {
			name: globalName,
			current
		}
	};
}
function provideTheme(props) {
	getCurrentInstance("provideTheme");
	const theme = inject(ThemeSymbol, null);
	if (!theme) throw new Error("Could not find Vuetify theme injection");
	const name = toRef(() => props.theme ?? theme.name.value);
	const current = toRef(() => theme.themes.value[name.value]);
	const themeClasses = toRef(() => theme.isDisabled ? void 0 : `${theme.prefix}theme--${name.value}`);
	const newTheme = {
		...theme,
		name,
		current,
		themeClasses
	};
	provide(ThemeSymbol, newTheme);
	return newTheme;
}
function useTheme() {
	getCurrentInstance("useTheme");
	const theme = inject(ThemeSymbol, null);
	if (!theme) throw new Error("Could not find Vuetify theme injection");
	return theme;
}
const makeVAppProps = propsFactory({
	...makeComponentProps(),
	...omit(makeLayoutProps(), ["fullHeight"]),
	...makeThemeProps()
}, "VApp");
const VApp = genericComponent()({
	name: "VApp",
	props: makeVAppProps(),
	setup(props, _ref) {
		let { slots } = _ref;
		const theme = provideTheme(props);
		const { a: layoutClasses, b: getLayoutItem, c: items, d: layoutRef } = createLayout({
			...props,
			fullHeight: true
		});
		const { b: rtlClasses } = useRtl();
		useRender(() => createBaseVNode("div", {
			"ref": layoutRef,
			"class": normalizeClass([
				"v-application",
				theme.themeClasses.value,
				layoutClasses.value,
				rtlClasses.value,
				props.class
			]),
			"style": normalizeStyle([props.style])
		}, [createBaseVNode("div", { "class": "v-application__wrap" }, [slots.default?.()])]));
		return {
			getLayoutItem,
			items,
			theme
		};
	}
});
// Utilities
// Types
// Composables
const makeTagProps = propsFactory({ tag: {
	type: [
		String,
		Object,
		Function
	],
	default: "div"
} }, "tag");
// Composables
const makeVDefaultsProviderProps = propsFactory({
	defaults: Object,
	disabled: Boolean,
	reset: [Number, String],
	root: [Boolean, String],
	scoped: Boolean
}, "VDefaultsProvider");
const VDefaultsProvider = genericComponent(false)({
	name: "VDefaultsProvider",
	props: makeVDefaultsProviderProps(),
	setup(props, _ref) {
		let { slots } = _ref;
		const { defaults, disabled, reset, root, scoped } = toRefs(props);
		provideDefaults(defaults, {
			c: reset,
			d: root,
			b: scoped,
			a: disabled
		});
		return () => slots.default?.();
	}
});
// Utilities
// Composables
const makeDimensionProps = propsFactory({
	height: [Number, String],
	maxHeight: [Number, String],
	maxWidth: [Number, String],
	minHeight: [Number, String],
	minWidth: [Number, String],
	width: [Number, String]
}, "dimension");
function useDimension(props) {
	const dimensionStyles = computed(() => {
		const styles = {};
		const height = convertToUnit(props.height);
		const maxHeight = convertToUnit(props.maxHeight);
		const maxWidth = convertToUnit(props.maxWidth);
		const minHeight = convertToUnit(props.minHeight);
		const minWidth = convertToUnit(props.minWidth);
		const width = convertToUnit(props.width);
		if (height != null) styles.height = height;
		if (maxHeight != null) styles.maxHeight = maxHeight;
		if (maxWidth != null) styles.maxWidth = maxWidth;
		if (minHeight != null) styles.minHeight = minHeight;
		if (minWidth != null) styles.minWidth = minWidth;
		if (width != null) styles.width = width;
		return styles;
	});
	return { a: dimensionStyles };
}
// Utilities
// Composables
function useColor(colors) {
	return destructComputed(() => {
		const { a: colorClasses, b: colorStyles } = computeColor(colors);
		return {
			colorClasses,
			colorStyles
		};
	});
}
function useTextColor(color) {
	const { colorClasses: textColorClasses, colorStyles: textColorStyles } = useColor(() => ({ a: toValue(color) }));
	return {
		a: textColorClasses,
		b: textColorStyles
	};
}
function computeColor(colors) {
	const _colors = toValue(colors);
	const classes = [];
	const styles = {};
	if (_colors.b) {
		if (isCssColor(_colors.b)) {
			styles.backgroundColor = _colors.b;
			if (!_colors.a && isParsableColor(_colors.b)) {
				const backgroundColor = parseColor(_colors.b);
				if (backgroundColor.a == null || backgroundColor.a === 1) {
					const textColor = getForeground(backgroundColor);
					styles.color = textColor;
					styles.caretColor = textColor;
				}
			}
		} else {
			classes.push(`bg-${_colors.b}`);
		}
	}
	if (_colors.a) {
		if (isCssColor(_colors.a)) {
			styles.color = _colors.a;
			styles.caretColor = _colors.a;
		} else {
			classes.push(`text-${_colors.a}`);
		}
	}
	return {
		a: classes,
		b: styles
	};
}
// Utilities
// Composables
const makeRoundedProps = propsFactory({
	rounded: {
		type: [
			Boolean,
			Number,
			String
		],
		default: void 0
	},
	tile: Boolean
}, "rounded");
function useRounded(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const roundedClasses = computed(() => {
		const rounded = isRef(props) ? props.value : props.rounded;
		const tile = isRef(props) ? false : props.tile;
		const classes = [];
		if (tile || rounded === false) {
			classes.push("rounded-0");
		} else if (rounded === true || rounded === "") {
			classes.push(`${name}--rounded`);
		} else if (typeof rounded === "string" || rounded === 0) {
			for (const value of String(rounded).split(" ")) {
				classes.push(`rounded-${value}`);
			}
		}
		return classes;
	});
	return { a: roundedClasses };
}
// Utilities
// Composables
const makeBorderProps = propsFactory({ border: [
	Boolean,
	Number,
	String
] }, "border");
function useBorder(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const borderClasses = computed(() => {
		const border = props.border;
		if (border === true || border === "") {
			return `${name}--border`;
		} else if (typeof border === "string" || border === 0) {
			return String(border).split(" ").map((v) => `border-${v}`);
		}
		return [];
	});
	return { a: borderClasses };
}
// Utilities
// Composables
const makeElevationProps = propsFactory({ elevation: {
	type: [Number, String],
	validator(v) {
		const value = parseInt(v);
		return !isNaN(value) && value >= 0 && value <= 24;
	}
} }, "elevation");
function useElevation(props) {
	const elevationClasses = toRef(() => {
		const elevation = isRef(props) ? props.value : props.elevation;
		if (elevation == null) return [];
		return [`elevation-${elevation}`];
	});
	return { a: elevationClasses };
}
// Utilities
const allowedDensities = [
	null,
	"default",
	"comfortable",
	"compact"
];
// typeof allowedDensities[number] evaluates to any
// when generating api types for whatever reason.
// Composables
const makeDensityProps = propsFactory({ density: {
	type: String,
	default: "default",
	validator: (v) => allowedDensities.includes(v)
} }, "density");
function useDensity(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const densityClasses = toRef(() => {
		return `${name}--density-${props.density}`;
	});
	return { a: densityClasses };
}
const allowedVariants = [
	"elevated",
	"flat",
	"tonal",
	"outlined",
	"text",
	"plain"
];
function genOverlays() {
	return createBaseVNode(Fragment, null, [createBaseVNode("span", {
		"key": "overlay",
		"class": normalizeClass(`${"v-btn"}__overlay`)
	}, null), createBaseVNode("span", {
		"key": "underlay",
		"class": normalizeClass(`${"v-btn"}__underlay`)
	}, null)]);
}
const makeVariantProps = propsFactory({
	color: String,
	variant: {
		type: String,
		default: "elevated",
		validator: (v) => allowedVariants.includes(v)
	}
}, "variant");
function useVariant(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const variantClasses = toRef(() => {
		const { variant } = toValue(props);
		return `${name}--variant-${variant}`;
	});
	const { colorClasses, colorStyles } = useColor(() => {
		const { variant, color } = toValue(props);
		return { [["elevated", "flat"].includes(variant) ? "b" : "a"]: color };
	});
	return {
		a: colorClasses,
		b: colorStyles,
		c: variantClasses
	};
}
const makeVBtnGroupProps = propsFactory({
	baseColor: String,
	divided: Boolean,
	direction: {
		type: String,
		default: "horizontal"
	},
	...makeBorderProps(),
	...makeComponentProps(),
	...makeDensityProps(),
	...makeElevationProps(),
	...makeRoundedProps(),
	...makeTagProps(),
	...makeThemeProps(),
	...makeVariantProps()
}, "VBtnGroup");
genericComponent()({
	name: "VBtnGroup",
	props: makeVBtnGroupProps(),
	setup() {}
});
// Composables
const makeGroupProps = propsFactory({
	modelValue: {
		type: null,
		default: void 0
	},
	multiple: Boolean,
	mandatory: [Boolean, String],
	max: Number,
	selectedClass: String,
	disabled: Boolean
}, "group");
const makeGroupItemProps = propsFactory({
	value: null,
	disabled: Boolean,
	selectedClass: String
}, "group-item");
// Composables
function useGroupItem(props, injectKey) {
	let required = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	const vm = getCurrentInstance("useGroupItem");
	if (!vm) {
		throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
	}
	const id = useId();
	provide(Symbol.for(`${injectKey.description}:id`), id);
	const group = inject(injectKey, null);
	if (!group) {
		if (!required) return group;
		throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${injectKey.description}`);
	}
	const value = toRef(() => props.value);
	const disabled = computed(() => !!(group.disabled.value || props.disabled));
	function register() {
		group?.register({
			id,
			value,
			disabled
		}, vm);
	}
	function unregister() {
		group?.unregister(id);
	}
	register();
	onBeforeUnmount(() => unregister());
	const isSelected = computed(() => {
		return group.isSelected(id);
	});
	const isFirst = computed(() => {
		return group.items.value[0].id === id;
	});
	const isLast = computed(() => {
		return group.items.value[group.items.value.length - 1].id === id;
	});
	const selectedClass = computed(() => isSelected.value && [group.selectedClass.value, props.selectedClass]);
	watch(isSelected, (value) => {
		vm.emit("group:selected", { value });
	}, { flush: "sync" });
	return {
		id,
		isSelected,
		isFirst,
		isLast,
		toggle: () => group.select(id, !isSelected.value),
		select: (value) => group.select(id, value),
		selectedClass,
		value,
		disabled,
		group,
		register,
		unregister
	};
}
const VBtnToggleSymbol = Symbol.for("vuetify:v-btn-toggle");
const makeVBtnToggleProps = propsFactory({
	...makeVBtnGroupProps(),
	...makeGroupProps()
}, "VBtnToggle");
genericComponent()({
	name: "VBtnToggle",
	props: makeVBtnToggleProps(),
	setup() {}
});
// Utilities
const IconValue = [
	String,
	Function,
	Object,
	Array
];
const IconSymbol = Symbol.for("vuetify:icons");
const makeIconProps = propsFactory({
	icon: { type: IconValue },
	tag: {
		type: [
			String,
			Object,
			Function
		],
		required: true
	}
}, "icon");
const VComponentIcon = genericComponent()({
	name: "VComponentIcon",
	props: makeIconProps(),
	setup(props, _ref) {
		let { slots } = _ref;
		return () => {
			const Icon = props.icon;
			return createVNode(props.tag, null, { default: () => [props.icon ? createVNode(Icon, null, null) : slots.default?.()] });
		};
	}
});
const VSvgIcon = defineComponent({
	name: "VSvgIcon",
	inheritAttrs: false,
	props: makeIconProps(),
	setup(props, _ref2) {
		let { attrs } = _ref2;
		return () => {
			return createVNode(props.tag, mergeProps(attrs, { "style": null }), { default: () => [createBaseVNode("svg", {
				"class": "v-icon__svg",
				"xmlns": "http://www.w3.org/2000/svg",
				"viewBox": "0 0 24 24",
				"role": "img",
				"aria-hidden": "true"
			}, [Array.isArray(props.icon) ? props.icon.map((path) => Array.isArray(path) ? createBaseVNode("path", {
				"d": path[0],
				"fill-opacity": path[1]
			}, null) : createBaseVNode("path", { "d": path }, null)) : createBaseVNode("path", { "d": props.icon }, null)])] });
		};
	}
});
defineComponent({
	name: "VLigatureIcon",
	props: makeIconProps(),
	setup() {}
});
const VClassIcon = defineComponent({
	name: "VClassIcon",
	props: makeIconProps(),
	setup(props) {
		return () => {
			return createVNode(props.tag, { "class": normalizeClass(props.icon) }, null);
		};
	}
});
const useIcon = (props) => {
	const icons = inject(IconSymbol);
	if (!icons) throw new Error("Missing Vuetify Icons provide!");
	const iconData = computed(() => {
		const iconAlias = toValue(props);
		if (!iconAlias) return { component: VComponentIcon };
		let icon = iconAlias;
		if (typeof icon === "string") {
			icon = icon.trim();
			if (icon.startsWith("$")) {
				icon = icons.aliases?.[icon.slice(1)];
			}
		}
		if (Array.isArray(icon)) {
			return {
				component: VSvgIcon,
				icon
			};
		} else if (typeof icon !== "string") {
			return {
				component: VComponentIcon,
				icon
			};
		}
		const iconSetName = Object.keys(icons.sets).find((setName) => typeof icon === "string" && icon.startsWith(`${setName}:`));
		const iconName = iconSetName ? icon.slice(iconSetName.length + 1) : icon;
		const iconSet = icons.sets[iconSetName ?? icons.defaultSet];
		return {
			component: iconSet.component,
			icon: iconName
		};
	});
	return { a: iconData };
};
// Utilities
const predefinedSizes = [
	"x-small",
	"small",
	"default",
	"large",
	"x-large"
];
// Composables
const makeSizeProps = propsFactory({ size: {
	type: [String, Number],
	default: "default"
} }, "size");
function useSize(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	return destructComputed(() => {
		const size = props.size;
		let sizeClasses;
		let sizeStyles;
		if (includes(predefinedSizes, size)) {
			sizeClasses = `${name}--size-${size}`;
		} else if (size) {
			sizeStyles = {
				width: convertToUnit(size),
				height: convertToUnit(size)
			};
		}
		return {
			sizeClasses,
			sizeStyles
		};
	});
}
const makeVIconProps = propsFactory({
	color: String,
	disabled: Boolean,
	start: Boolean,
	end: Boolean,
	icon: IconValue,
	opacity: [String, Number],
	...makeComponentProps(),
	...makeSizeProps(),
	...makeTagProps({ tag: "i" }),
	...makeThemeProps()
}, "VIcon");
const VIcon = genericComponent()({
	name: "VIcon",
	props: makeVIconProps(),
	setup(props, _ref) {
		let { attrs, slots } = _ref;
		const slotIcon = shallowRef();
		const { themeClasses } = useTheme();
		const { a: iconData } = useIcon(() => slotIcon.value || props.icon);
		const { sizeClasses } = useSize(props);
		const { a: textColorClasses, b: textColorStyles } = useTextColor(() => props.color);
		useRender(() => {
			const slotValue = slots.default?.();
			if (slotValue) {
				slotIcon.value = flattenFragments(slotValue).filter((node) => node.type === Text && node.children && typeof node.children === "string")[0]?.children;
			}
			const hasClick = !!(attrs.onClick || attrs.onClickOnce);
			return createVNode(iconData.value.component, {
				"tag": props.tag,
				"icon": iconData.value.icon,
				"class": normalizeClass([
					"v-icon",
					"notranslate",
					themeClasses.value,
					sizeClasses.value,
					textColorClasses.value,
					{
						"v-icon--clickable": hasClick,
						"v-icon--disabled": props.disabled,
						"v-icon--start": props.start,
						"v-icon--end": props.end
					},
					props.class
				]),
				"style": normalizeStyle([
					{ "--v-icon-opacity": props.opacity },
					!sizeClasses.value ? {
						fontSize: convertToUnit(props.size),
						height: convertToUnit(props.size),
						width: convertToUnit(props.size)
					} : void 0,
					textColorStyles.value,
					props.style
				]),
				"role": hasClick ? "button" : void 0,
				"aria-hidden": !hasClick,
				"tabindex": hasClick ? props.disabled ? -1 : 0 : void 0
			}, { default: () => [slotValue] });
		});
		return {};
	}
});
// Utilities
function useIntersectionObserver() {
	const intersectionRef = ref();
	const isIntersecting = shallowRef(false);
	if (SUPPORTS_INTERSECTION) {
		const observer = new IntersectionObserver((entries) => {
			isIntersecting.value = !!entries.find((entry) => entry.isIntersecting);
		}, void 0);
		onScopeDispose(() => {
			observer.disconnect();
		});
		watch(intersectionRef, (newValue, oldValue) => {
			if (oldValue) {
				observer.unobserve(oldValue);
				isIntersecting.value = false;
			}
			if (newValue) observer.observe(newValue);
		}, { flush: "post" });
	}
	return {
		a: intersectionRef,
		b: isIntersecting
	};
}
const makeVProgressCircularProps = propsFactory({
	bgColor: String,
	color: String,
	indeterminate: [Boolean, String],
	rounded: Boolean,
	modelValue: {
		type: [Number, String],
		default: 0
	},
	rotate: {
		type: [Number, String],
		default: 0
	},
	width: {
		type: [Number, String],
		default: 4
	},
	...makeComponentProps(),
	...makeSizeProps(),
	...makeTagProps({ tag: "div" }),
	...makeThemeProps()
}, "VProgressCircular");
const VProgressCircular = genericComponent()({
	name: "VProgressCircular",
	props: makeVProgressCircularProps(),
	setup(props, _ref) {
		let { slots } = _ref;
		const CIRCUMFERENCE = 2 * Math.PI * 20;
		const root = ref();
		const { themeClasses } = provideTheme(props);
		const { sizeClasses, sizeStyles } = useSize(props);
		const { a: textColorClasses, b: textColorStyles } = useTextColor(() => props.color);
		const { a: underlayColorClasses, b: underlayColorStyles } = useTextColor(() => props.bgColor);
		const { a: intersectionRef, b: isIntersecting } = useIntersectionObserver();
		const { b: contentRect } = useResizeObserver();
		const normalizedValue = toRef(() => clamp(parseFloat(props.modelValue), 0, 100));
		const width = toRef(() => Number(props.width));
		const size = toRef(() => {
			// Get size from element if size prop value is small, large etc
			return sizeStyles.value ? Number(props.size) : contentRect.value ? contentRect.value.width : Math.max(width.value, 32);
		});
		const diameter = toRef(() => 20 / (1 - width.value / size.value) * 2);
		const strokeWidth = toRef(() => width.value / size.value * diameter.value);
		const strokeDashOffset = toRef(() => {
			const baseLength = (100 - normalizedValue.value) / 100 * CIRCUMFERENCE;
			return props.rounded && normalizedValue.value > 0 && normalizedValue.value < 100 ? convertToUnit(Math.min(CIRCUMFERENCE - .01, baseLength + strokeWidth.value)) : convertToUnit(baseLength);
		});
		const startAngle = computed(() => {
			const baseAngle = Number(props.rotate);
			return props.rounded ? baseAngle + strokeWidth.value / 2 / CIRCUMFERENCE * 360 : baseAngle;
		});
		watchEffect(() => {
			intersectionRef.value = root.value;
		});
		useRender(() => createVNode(props.tag, {
			"ref": root,
			"class": normalizeClass([
				"v-progress-circular",
				{
					"v-progress-circular--indeterminate": !!props.indeterminate,
					"v-progress-circular--visible": isIntersecting.value,
					"v-progress-circular--disable-shrink": props.indeterminate && (props.indeterminate === "disable-shrink" || PREFERS_REDUCED_MOTION())
				},
				themeClasses.value,
				sizeClasses.value,
				textColorClasses.value,
				props.class
			]),
			"style": normalizeStyle([
				sizeStyles.value,
				textColorStyles.value,
				props.style
			]),
			"role": "progressbar",
			"aria-valuemin": "0",
			"aria-valuemax": "100",
			"aria-valuenow": props.indeterminate ? void 0 : normalizedValue.value
		}, { default: () => [createBaseVNode("svg", {
			"style": { transform: `rotate(calc(-90deg + ${startAngle.value}deg))` },
			"xmlns": "http://www.w3.org/2000/svg",
			"viewBox": `0 0 ${diameter.value} ${diameter.value}`
		}, [createBaseVNode("circle", {
			"class": normalizeClass(["v-progress-circular__underlay", underlayColorClasses.value]),
			"style": normalizeStyle(underlayColorStyles.value),
			"fill": "transparent",
			"cx": "50%",
			"cy": "50%",
			"r": 20,
			"stroke-width": strokeWidth.value,
			"stroke-dasharray": CIRCUMFERENCE,
			"stroke-dashoffset": 0
		}, null), createBaseVNode("circle", {
			"class": "v-progress-circular__overlay",
			"fill": "transparent",
			"cx": "50%",
			"cy": "50%",
			"r": 20,
			"stroke-width": strokeWidth.value,
			"stroke-dasharray": CIRCUMFERENCE,
			"stroke-dashoffset": strokeDashOffset.value,
			"stroke-linecap": props.rounded ? "round" : void 0
		}, null)]), slots.default && createBaseVNode("div", { "class": "v-progress-circular__content" }, [slots.default({ value: normalizedValue.value })])] }));
		return {};
	}
});
// Composables
const oppositeMap = {
	center: "center",
	top: "bottom",
	bottom: "top",
	left: "right",
	right: "left"
};
const makeLocationProps = propsFactory({ location: String }, "location");
function useLocation(props) {
	let opposite = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
	let offset = arguments.length > 2 ? arguments[2] : void 0;
	const { a: isRtl } = useRtl();
	const locationStyles = computed(() => {
		if (!props.location) return {};
		const { a: side, b: align } = parseAnchor(props.location.split(" ").length > 1 ? props.location : `${props.location} center`, isRtl.value);
		function getOffset(side) {
			return offset ? offset(side) : 0;
		}
		const styles = {};
		if (side !== "center") {
			if (opposite) styles[oppositeMap[side]] = `calc(100% - ${getOffset(side)}px)`;
			else styles[side] = 0;
		}
		if (align !== "center") {
			if (opposite) styles[oppositeMap[align]] = `calc(100% - ${getOffset(align)}px)`;
			else styles[align] = 0;
		} else {
			if (side === "center") styles.top = styles.left = "50%";
			else {
				styles[{
					top: "left",
					bottom: "left",
					left: "top",
					right: "top"
				}[side]] = "50%";
			}
			styles.transform = {
				top: "translateX(-50%)",
				bottom: "translateX(-50%)",
				left: "translateY(-50%)",
				right: "translateY(-50%)",
				center: "translate(-50%, -50%)"
			}[side];
		}
		return styles;
	});
	return { a: locationStyles };
}
// Composables
const makeLoaderProps = propsFactory({ loading: [Boolean, String] }, "loader");
function useLoader(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const loaderClasses = toRef(() => ({ [`${name}--loading`]: props.loading }));
	return { a: loaderClasses };
}
// Utilities
const positionValues = [
	"static",
	"relative",
	"fixed",
	"absolute",
	"sticky"
];
// Composables
const makePositionProps = propsFactory({ position: {
	type: String,
	validator: (v) => positionValues.includes(v)
} }, "position");
function usePosition(props) {
	let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
	const positionClasses = toRef(() => {
		return props.position ? `${name}--${props.position}` : void 0;
	});
	return { a: positionClasses };
}
// Utilities
function useRoute() {
	const vm = getCurrentInstance("useRoute");
	return computed(() => vm?.proxy?.$route);
}
function useLink(props, attrs) {
	const RouterLink = resolveDynamicComponent();
	const isLink = toRef(() => !!(props.href || props.to));
	const isClickable = computed(() => {
		return isLink.value || hasEvent(attrs) || hasEvent(props);
	});
	if (typeof RouterLink === "string" || !("useLink" in RouterLink)) {
		const href = toRef(() => props.href);
		return {
			isLink,
			isRouterLink: toRef(() => false),
			isClickable,
			href,
			linkProps: reactive({ href })
		};
	}
	// vue-router useLink `to` prop needs to be reactive and useLink will crash if undefined
	const routerLink = RouterLink.useLink({
		to: toRef(() => props.to || ""),
		replace: toRef(() => props.replace)
	});
	// Actual link needs to be undefined when to prop is not used
	const link = computed(() => props.to ? routerLink : void 0);
	const route = useRoute();
	const isActive = computed(() => {
		if (!link.value) return false;
		if (!props.exact) return link.value.isActive?.value ?? false;
		if (!route.value) return link.value.isExactActive?.value ?? false;
		return link.value.isExactActive?.value && deepEqual(link.value.route.value.query, route.value.query);
	});
	const href = computed(() => props.to ? link.value?.route.value.href : props.href);
	const isRouterLink = toRef(() => !!props.to);
	return {
		isLink,
		isRouterLink,
		isClickable,
		isActive,
		route: link.value?.route,
		navigate: link.value?.navigate,
		href,
		linkProps: reactive({
			href,
			"aria-current": toRef(() => isActive.value ? "page" : void 0),
			"aria-disabled": toRef(() => props.disabled && isLink.value ? "true" : void 0),
			tabindex: toRef(() => props.disabled && isLink.value ? "-1" : void 0)
		})
	};
}
const makeRouterProps = propsFactory({
	href: String,
	replace: Boolean,
	to: [String, Object],
	exact: Boolean
}, "router");
// Utilities
// Types
function useSelectLink(link, select) {
	watch(() => link.isActive?.value, (isActive) => {
		if (link.isLink.value && isActive != null && select) {
			nextTick(() => {
				select(isActive);
			});
		}
	}, { immediate: true });
}
// Styles
const stopSymbol = Symbol("rippleStop");
function transform(el, value) {
	el.style.transform = value;
	el.style.webkitTransform = value;
}
function isTouchEvent(e) {
	return e.constructor.name === "TouchEvent";
}
function isKeyboardEvent(e) {
	return e.constructor.name === "KeyboardEvent";
}
const calculate = function(e, el) {
	let value = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
	let localX = 0;
	let localY = 0;
	if (!isKeyboardEvent(e)) {
		const offset = el.getBoundingClientRect();
		const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
		localX = target.clientX - offset.left;
		localY = target.clientY - offset.top;
	}
	let radius = 0;
	let scale = .3;
	if (el._ripple?.circle) {
		scale = .15;
		radius = el.clientWidth / 2;
		radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
	} else {
		radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
	}
	const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
	const centerY = `${(el.clientHeight - radius * 2) / 2}px`;
	const x = value.center ? centerX : `${localX - radius}px`;
	const y = value.center ? centerY : `${localY - radius}px`;
	return {
		a: radius,
		b: scale,
		c: x,
		d: y,
		e: centerX,
		f: centerY
	};
};
const ripples = {
	a(e, el) {
		let value = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		if (!el?._ripple?.enabled) {
			return;
		}
		const container = document.createElement("span");
		const animation = document.createElement("span");
		container.appendChild(animation);
		container.className = "v-ripple__container";
		if (value.class) {
			container.className += ` ${value.class}`;
		}
		const { a: radius, b: scale, c: x, d: y, e: centerX, f: centerY } = calculate(e, el, value);
		const size = `${radius * 2}px`;
		animation.className = "v-ripple__animation";
		animation.style.width = size;
		animation.style.height = size;
		el.appendChild(container);
		const computed = window.getComputedStyle(el);
		if (computed && computed.position === "static") {
			el.style.position = "relative";
			el.dataset.previousPosition = "static";
		}
		animation.classList.add("v-ripple__animation--enter");
		animation.classList.add("v-ripple__animation--visible");
		transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
		animation.dataset.activated = String(performance.now());
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				animation.classList.remove("v-ripple__animation--enter");
				animation.classList.add("v-ripple__animation--in");
				transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
			});
		});
	},
	b(el) {
		if (!el?._ripple?.enabled) return;
		const ripples = el.getElementsByClassName("v-ripple__animation");
		if (ripples.length === 0) return;
		const animation = Array.from(ripples).findLast((ripple) => !ripple.dataset.isHiding);
		if (!animation) return;
		else animation.dataset.isHiding = "true";
		const diff = performance.now() - Number(animation.dataset.activated);
		const delay = Math.max(250 - diff, 0);
		setTimeout(() => {
			animation.classList.remove("v-ripple__animation--in");
			animation.classList.add("v-ripple__animation--out");
			setTimeout(() => {
				const ripples = el.getElementsByClassName("v-ripple__animation");
				if (ripples.length === 1 && el.dataset.previousPosition) {
					el.style.position = el.dataset.previousPosition;
					delete el.dataset.previousPosition;
				}
				if (animation.parentNode?.parentNode === el) el.removeChild(animation.parentNode);
			}, 300);
		}, delay);
	}
};
function isRippleEnabled(value) {
	return typeof value === "undefined" || !!value;
}
function rippleShow(e) {
	const value = {};
	const element = e.currentTarget;
	if (!element?._ripple || element._ripple.touched || e[stopSymbol]) return;
	// Don't allow the event to trigger ripples on any other elements
	e[stopSymbol] = true;
	if (isTouchEvent(e)) {
		element._ripple.touched = true;
		element._ripple.isTouch = true;
	} else {
		// It's possible for touch events to fire
		// as mouse events on Android/iOS, this
		// will skip the event call if it has
		// already been registered as touch
		if (element._ripple.isTouch) return;
	}
	value.center = element._ripple.centered || isKeyboardEvent(e);
	if (element._ripple.class) {
		value.class = element._ripple.class;
	}
	if (isTouchEvent(e)) {
		// already queued that shows or hides the ripple
		if (element._ripple.showTimerCommit) return;
		element._ripple.showTimerCommit = () => {
			ripples.a(e, element, value);
		};
		element._ripple.showTimer = window.setTimeout(() => {
			if (element?._ripple?.showTimerCommit) {
				element._ripple.showTimerCommit();
				element._ripple.showTimerCommit = null;
			}
		}, 80);
	} else {
		ripples.a(e, element, value);
	}
}
function rippleStop(e) {
	e[stopSymbol] = true;
}
function rippleHide(e) {
	const element = e.currentTarget;
	if (!element?._ripple) return;
	window.clearTimeout(element._ripple.showTimer);
	// The touch interaction occurs before the show timer is triggered.
	// We still want to show ripple effect.
	if (e.type === "touchend" && element._ripple.showTimerCommit) {
		element._ripple.showTimerCommit();
		element._ripple.showTimerCommit = null;
		// re-queue ripple hiding
		element._ripple.showTimer = window.setTimeout(() => {
			rippleHide(e);
		});
		return;
	}
	window.setTimeout(() => {
		if (element._ripple) {
			element._ripple.touched = false;
		}
	});
	ripples.b(element);
}
function rippleCancelShow(e) {
	const element = e.currentTarget;
	if (!element?._ripple) return;
	if (element._ripple.showTimerCommit) {
		element._ripple.showTimerCommit = null;
	}
	window.clearTimeout(element._ripple.showTimer);
}
let keyboardRipple = false;
function keyboardRippleShow(e, keys) {
	if (!keyboardRipple && keys.includes(e.key)) {
		keyboardRipple = true;
		rippleShow(e);
	}
}
function keyboardRippleHide(e) {
	keyboardRipple = false;
	rippleHide(e);
}
function focusRippleHide(e) {
	if (keyboardRipple) {
		keyboardRipple = false;
		rippleHide(e);
	}
}
function updateRipple(el, binding, wasEnabled) {
	const { value, modifiers } = binding;
	const enabled = isRippleEnabled(value);
	if (!enabled) {
		ripples.b(el);
	}
	el._ripple = el._ripple ?? {};
	el._ripple.enabled = enabled;
	el._ripple.centered = modifiers.center;
	el._ripple.circle = modifiers.circle;
	const bindingValue = isObject(value) ? value : {};
	if (bindingValue.class) {
		el._ripple.class = bindingValue.class;
	}
	const allowedKeys = bindingValue.keys ?? ["Enter", "Space"];
	el._ripple.keyDownHandler = (e) => (keyboardRippleShow(e, allowedKeys), void 0);
	if (enabled && !wasEnabled) {
		if (modifiers.stop) {
			el.addEventListener("touchstart", rippleStop, { passive: true });
			el.addEventListener("mousedown", rippleStop);
			return;
		}
		el.addEventListener("touchstart", rippleShow, { passive: true });
		el.addEventListener("touchend", rippleHide, { passive: true });
		el.addEventListener("touchmove", rippleCancelShow, { passive: true });
		el.addEventListener("touchcancel", rippleHide);
		el.addEventListener("mousedown", rippleShow);
		el.addEventListener("mouseup", rippleHide);
		el.addEventListener("mouseleave", rippleHide);
		el.addEventListener("keydown", el._ripple.keyDownHandler);
		el.addEventListener("keyup", keyboardRippleHide);
		el.addEventListener("blur", focusRippleHide);
		// Anchor tags can be dragged, causes other hides to fail - #1537
		el.addEventListener("dragstart", rippleHide, { passive: true });
	} else if (!enabled && wasEnabled) {
		removeListeners(el);
	}
}
function removeListeners(el) {
	el.removeEventListener("touchstart", rippleStop);
	el.removeEventListener("mousedown", rippleStop);
	el.removeEventListener("touchstart", rippleShow);
	el.removeEventListener("touchend", rippleHide);
	el.removeEventListener("touchmove", rippleCancelShow);
	el.removeEventListener("touchcancel", rippleHide);
	el.removeEventListener("mousedown", rippleShow);
	el.removeEventListener("mouseup", rippleHide);
	el.removeEventListener("mouseleave", rippleHide);
	if (el._ripple?.keyDownHandler) {
		el.removeEventListener("keydown", el._ripple.keyDownHandler);
	}
	el.removeEventListener("keyup", keyboardRippleHide);
	el.removeEventListener("blur", focusRippleHide);
	el.removeEventListener("dragstart", rippleHide);
}
function mounted(el, binding) {
	updateRipple(el, binding, false);
}
function unmounted(el) {
	removeListeners(el);
	delete el._ripple;
}
function updated(el, binding) {
	if (binding.value === binding.oldValue) {
		return;
	}
	const wasEnabled = isRippleEnabled(binding.oldValue);
	updateRipple(el, binding, wasEnabled);
}
const Ripple = {
	mounted,
	unmounted,
	updated
};
const makeVBtnProps = propsFactory({
	active: {
		type: Boolean,
		default: void 0
	},
	activeColor: String,
	baseColor: String,
	symbol: {
		type: null,
		default: VBtnToggleSymbol
	},
	flat: Boolean,
	icon: [
		Boolean,
		String,
		Function,
		Object
	],
	prependIcon: IconValue,
	appendIcon: IconValue,
	block: Boolean,
	readonly: Boolean,
	slim: Boolean,
	stacked: Boolean,
	spaced: String,
	ripple: {
		type: [Boolean, Object],
		default: true
	},
	text: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	...makeBorderProps(),
	...makeComponentProps(),
	...makeDensityProps(),
	...makeDimensionProps(),
	...makeElevationProps(),
	...makeGroupItemProps(),
	...makeLoaderProps(),
	...makeLocationProps(),
	...makePositionProps(),
	...makeRoundedProps(),
	...makeRouterProps(),
	...makeSizeProps(),
	...makeTagProps({ tag: "button" }),
	...makeThemeProps(),
	...makeVariantProps({ variant: "elevated" })
}, "VBtn");
const VBtn = genericComponent()({
	name: "VBtn",
	props: makeVBtnProps(),
	emits: { "group:selected": () => true },
	setup(props, _ref) {
		let { attrs, slots } = _ref;
		const { themeClasses } = provideTheme(props);
		const { a: borderClasses } = useBorder(props);
		const { a: densityClasses } = useDensity(props);
		const { a: dimensionStyles } = useDimension(props);
		const { a: elevationClasses } = useElevation(props);
		const { a: loaderClasses } = useLoader(props);
		const { a: locationStyles } = useLocation(props);
		const { a: positionClasses } = usePosition(props);
		const { a: roundedClasses } = useRounded(props);
		const { sizeClasses, sizeStyles } = useSize(props);
		const group = useGroupItem(props, props.symbol, false);
		const link = useLink(props, attrs);
		const isActive = computed(() => {
			if (props.active !== void 0) {
				return props.active;
			}
			if (link.isRouterLink.value) {
				return link.isActive?.value;
			}
			return group?.isSelected.value;
		});
		const color = toRef(() => isActive.value ? props.activeColor ?? props.color : props.color);
		const variantProps = computed(() => {
			const showColor = group?.isSelected.value && (!link.isLink.value || link.isActive?.value) || !group || link.isActive?.value;
			return {
				color: showColor ? color.value ?? props.baseColor : props.baseColor,
				variant: props.variant
			};
		});
		const { a: colorClasses, b: colorStyles, c: variantClasses } = useVariant(variantProps);
		const isDisabled = computed(() => group?.disabled.value || props.disabled);
		const isElevated = toRef(() => {
			return props.variant === "elevated" && !(props.disabled || props.flat || props.border);
		});
		const valueAttr = computed(() => {
			if (props.value === void 0 || typeof props.value === "symbol") return void 0;
			return Object(props.value) === props.value ? JSON.stringify(props.value, null, 0) : props.value;
		});
		function onClick(e) {
			if (isDisabled.value || link.isLink.value && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || attrs.target === "_blank")) return;
			if (link.isRouterLink.value) {
				link.navigate?.(e);
			} else {
				// Group active state for links is handled by useSelectLink
				group?.toggle();
			}
		}
		useSelectLink(link, group?.select);
		useRender(() => {
			const Tag = link.isLink.value ? "a" : props.tag;
			const hasPrepend = !!(props.prependIcon || slots.prepend);
			const hasAppend = !!(props.appendIcon || slots.append);
			const hasIcon = !!(props.icon && props.icon !== true);
			return withDirectives(createVNode(Tag, mergeProps(link.linkProps, {
				"type": Tag === "a" ? void 0 : "button",
				"class": [
					"v-btn",
					group?.selectedClass.value,
					{
						"v-btn--active": isActive.value,
						"v-btn--block": props.block,
						"v-btn--disabled": isDisabled.value,
						"v-btn--elevated": isElevated.value,
						"v-btn--flat": props.flat,
						"v-btn--icon": !!props.icon,
						"v-btn--loading": props.loading,
						"v-btn--readonly": props.readonly,
						"v-btn--slim": props.slim,
						"v-btn--stacked": props.stacked
					},
					props.spaced ? ["v-btn--spaced", `v-btn--spaced-${props.spaced}`] : [],
					themeClasses.value,
					borderClasses.value,
					colorClasses.value,
					densityClasses.value,
					elevationClasses.value,
					loaderClasses.value,
					positionClasses.value,
					roundedClasses.value,
					sizeClasses.value,
					variantClasses.value,
					props.class
				],
				"style": [
					colorStyles.value,
					dimensionStyles.value,
					locationStyles.value,
					sizeStyles.value,
					props.style
				],
				"aria-busy": props.loading ? true : void 0,
				"disabled": isDisabled.value && Tag !== "a" || void 0,
				"tabindex": props.loading || props.readonly ? -1 : void 0,
				"onClick": onClick,
				"value": valueAttr.value
			}), { default: () => [
				genOverlays(),
				!props.icon && hasPrepend && createBaseVNode("span", {
					"key": "prepend",
					"class": "v-btn__prepend"
				}, [!slots.prepend ? createVNode(VIcon, {
					"key": "prepend-icon",
					"icon": props.prependIcon
				}, null) : createVNode(VDefaultsProvider, {
					"key": "prepend-defaults",
					"disabled": !props.prependIcon,
					"defaults": { VIcon: { icon: props.prependIcon } }
				}, slots.prepend)]),
				createBaseVNode("span", {
					"class": "v-btn__content",
					"data-no-activator": ""
				}, [!slots.default && hasIcon ? createVNode(VIcon, {
					"key": "content-icon",
					"icon": props.icon
				}, null) : createVNode(VDefaultsProvider, {
					"key": "content-defaults",
					"disabled": !hasIcon,
					"defaults": { VIcon: { icon: props.icon } }
				}, { default: () => [slots.default?.() ?? toDisplayString(props.text)] })]),
				!props.icon && hasAppend && createBaseVNode("span", {
					"key": "append",
					"class": "v-btn__append"
				}, [!slots.append ? createVNode(VIcon, {
					"key": "append-icon",
					"icon": props.appendIcon
				}, null) : createVNode(VDefaultsProvider, {
					"key": "append-defaults",
					"disabled": !props.appendIcon,
					"defaults": { VIcon: { icon: props.appendIcon } }
				}, slots.append)]),
				!!props.loading && createBaseVNode("span", {
					"key": "loader",
					"class": "v-btn__loader"
				}, [slots.loader?.() ?? createVNode(VProgressCircular, {
					"color": typeof props.loading === "boolean" ? void 0 : props.loading,
					"indeterminate": true,
					"width": "2"
				}, null)])
			] }), [[
				Ripple,
				!isDisabled.value && props.ripple,
				"",
				{ center: !!props.icon }
			]]);
		});
		return { group };
	}
});
// Utilities
const DisplaySymbol = Symbol.for("vuetify:display");
const defaultDisplayOptions = {
	mobileBreakpoint: "lg",
	thresholds: {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920,
		xxl: 2560
	}
};
const parseDisplayOptions = function() {
	let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultDisplayOptions;
	return mergeDeep(defaultDisplayOptions, options);
};
function getClientWidth(ssr) {
	return IN_BROWSER && !ssr ? window.innerWidth : typeof ssr === "object" && ssr.clientWidth || 0;
}
function getClientHeight(ssr) {
	return IN_BROWSER && !ssr ? window.innerHeight : typeof ssr === "object" && ssr.clientHeight || 0;
}
function getPlatform(ssr) {
	const userAgent = IN_BROWSER && !ssr ? window.navigator.userAgent : "ssr";
	function match(regexp) {
		return Boolean(userAgent.match(regexp));
	}
	const android = match(/android/i);
	const ios = match(/iphone|ipad|ipod/i);
	const cordova = match(/cordova/i);
	const electron = match(/electron/i);
	const chrome = match(/chrome/i);
	const edge = match(/edge/i);
	const firefox = match(/firefox/i);
	const opera = match(/opera/i);
	const win = match(/win/i);
	const mac = match(/mac/i);
	const linux = match(/linux/i);
	return {
		android,
		ios,
		cordova,
		electron,
		chrome,
		edge,
		firefox,
		opera,
		win,
		mac,
		linux,
		touch: SUPPORTS_TOUCH,
		ssr: userAgent === "ssr"
	};
}
function createDisplay(options, ssr) {
	const { thresholds, mobileBreakpoint } = parseDisplayOptions(options);
	const height = shallowRef(getClientHeight(ssr));
	const platform = shallowRef(getPlatform(ssr));
	const state = reactive({});
	const width = shallowRef(getClientWidth(ssr));
	function updateSize() {
		height.value = getClientHeight();
		width.value = getClientWidth();
	}
	function update() {
		updateSize();
		platform.value = getPlatform();
	}
	// eslint-disable-next-line max-statements
	watchEffect(() => {
		const xs = width.value < thresholds.sm;
		const sm = width.value < thresholds.md && !xs;
		const md = width.value < thresholds.lg && !(sm || xs);
		const lg = width.value < thresholds.xl && !(md || sm || xs);
		const xl = width.value < thresholds.xxl && !(lg || md || sm || xs);
		const xxl = width.value >= thresholds.xxl;
		const name = xs ? "xs" : sm ? "sm" : md ? "md" : lg ? "lg" : xl ? "xl" : "xxl";
		const breakpointValue = typeof mobileBreakpoint === "number" ? mobileBreakpoint : thresholds[mobileBreakpoint];
		const mobile = width.value < breakpointValue;
		state.xs = xs;
		state.sm = sm;
		state.md = md;
		state.lg = lg;
		state.xl = xl;
		state.xxl = xxl;
		state.smAndUp = !xs;
		state.mdAndUp = !(xs || sm);
		state.lgAndUp = !(xs || sm || md);
		state.xlAndUp = !(xs || sm || md || lg);
		state.smAndDown = !(md || lg || xl || xxl);
		state.mdAndDown = !(lg || xl || xxl);
		state.lgAndDown = !(xl || xxl);
		state.xlAndDown = !xxl;
		state.name = name;
		state.height = height.value;
		state.width = width.value;
		state.mobile = mobile;
		state.mobileBreakpoint = mobileBreakpoint;
		state.platform = platform.value;
		state.thresholds = thresholds;
	});
	if (IN_BROWSER) {
		window.addEventListener("resize", updateSize, { passive: true });
		onScopeDispose(() => {
			window.removeEventListener("resize", updateSize);
		});
	}
	return {
		...toRefs(state),
		update,
		ssr: !!ssr
	};
}
// Utilities
const GoToSymbol = Symbol.for("vuetify:goto");
function genDefaults$1() {
	return {
		container: void 0,
		duration: 300,
		layout: false,
		offset: 0,
		easing: "easeInOutCubic",
		patterns: easingPatterns
	};
}
function createGoTo(options, locale) {
	return {
		rtl: locale.isRtl,
		options: mergeDeep(genDefaults$1(), options)
	};
}
// Utilities
function weekInfo(locale) {
	// https://simplelocalize.io/data/locales/
	// then `new Intl.Locale(...).getWeekInfo()`
	const code = locale.slice(-2).toUpperCase();
	switch (true) {
		case locale === "GB-alt-variant": {
			return {
				firstDay: 0,
				firstWeekSize: 4
			};
		}
		case locale === "001": {
			return {
				firstDay: 1,
				firstWeekSize: 1
			};
		}
		case "AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN JM JP KE\n    KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PY SA SG SV TH TT TW UM US\n    VE VI WS YE ZA ZW".includes(code): {
			return {
				firstDay: 0,
				firstWeekSize: 1
			};
		}
		case "AI AL AM AR AU AZ BA BM BN BY CL CM CN CR CY EC GE HR KG KZ LB LK LV\n    MD ME MK MN MY NZ RO RS SI TJ TM TR UA UY UZ VN XK".includes(code): {
			return {
				firstDay: 1,
				firstWeekSize: 1
			};
		}
		case "AD AN AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GP GR HU IE IS\n    IT LI LT LU MC MQ NL NO PL RE RU SE SK SM VA".includes(code): {
			return {
				firstDay: 1,
				firstWeekSize: 4
			};
		}
		case "AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".includes(code): {
			return {
				firstDay: 6,
				firstWeekSize: 1
			};
		}
		case code === "MV": {
			return {
				firstDay: 5,
				firstWeekSize: 1
			};
		}
		case code === "PT": {
			return {
				firstDay: 0,
				firstWeekSize: 4
			};
		}
		default: return null;
	}
}
function getWeekArray(date, locale, firstDayOfWeek) {
	const weeks = [];
	let currentWeek = [];
	const firstDayOfMonth = startOfMonth(date);
	const lastDayOfMonth = endOfMonth(date);
	const first = firstDayOfWeek ?? weekInfo(locale)?.firstDay ?? 0;
	const firstDayWeekIndex = (firstDayOfMonth.getDay() - first + 7) % 7;
	const lastDayWeekIndex = (lastDayOfMonth.getDay() - first + 7) % 7;
	for (let i = 0; i < firstDayWeekIndex; i++) {
		const adjacentDay = new Date(firstDayOfMonth);
		adjacentDay.setDate(adjacentDay.getDate() - (firstDayWeekIndex - i));
		currentWeek.push(adjacentDay);
	}
	for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
		const day = new Date(date.getFullYear(), date.getMonth(), i);
		// Add the day to the current week
		currentWeek.push(day);
		// If the current week has 7 days, add it to the weeks array and start a new week
		if (currentWeek.length === 7) {
			weeks.push(currentWeek);
			currentWeek = [];
		}
	}
	for (let i = 1; i < 7 - lastDayWeekIndex; i++) {
		const adjacentDay = new Date(lastDayOfMonth);
		adjacentDay.setDate(adjacentDay.getDate() + i);
		currentWeek.push(adjacentDay);
	}
	if (currentWeek.length > 0) {
		weeks.push(currentWeek);
	}
	return weeks;
}
function startOfWeek(date, locale, firstDayOfWeek) {
	let day = (firstDayOfWeek ?? weekInfo(locale)?.firstDay ?? 0) % 7;
	// prevent infinite loop
	if (![
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].includes(day)) {
		day = 0;
	}
	const d = new Date(date);
	while (d.getDay() !== day) {
		d.setDate(d.getDate() - 1);
	}
	return d;
}
function endOfWeek(date, locale) {
	const d = new Date(date);
	const lastDay = ((weekInfo(locale)?.firstDay ?? 0) + 6) % 7;
	while (d.getDay() !== lastDay) {
		d.setDate(d.getDate() + 1);
	}
	return d;
}
function startOfMonth(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function parseLocalDate(value) {
	const parts = value.split("-").map(Number);
	// new Date() uses local time zone when passing individual date component values
	return new Date(parts[0], parts[1] - 1, parts[2]);
}
const _YYYMMDD = /^([12]\d{3}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12]\d|3[01]))$/;
function date(value) {
	if (value == null) return new Date();
	if (value instanceof Date) return value;
	if (typeof value === "string") {
		let parsed;
		if (_YYYMMDD.test(value)) {
			return parseLocalDate(value);
		} else {
			parsed = Date.parse(value);
		}
		if (!isNaN(parsed)) return new Date(parsed);
	}
	return null;
}
const sundayJanuarySecond2000 = new Date(2e3, 0, 2);
function getWeekdays(locale, firstDayOfWeek, weekdayFormat) {
	const daysFromSunday = firstDayOfWeek ?? weekInfo(locale)?.firstDay ?? 0;
	return createRange(7).map((i) => {
		const weekday = new Date(sundayJanuarySecond2000);
		weekday.setDate(sundayJanuarySecond2000.getDate() + daysFromSunday + i);
		return new Intl.DateTimeFormat(locale, { weekday: weekdayFormat ?? "narrow" }).format(weekday);
	});
}
function format(value, formatString, locale, formats) {
	const newDate = date(value) ?? new Date();
	const customFormat = formats?.[formatString];
	if (typeof customFormat === "function") {
		return customFormat(newDate, formatString, locale);
	}
	let options = {};
	switch (formatString) {
		case "fullDate":
			options = {
				year: "numeric",
				month: "short",
				day: "numeric"
			};
			break;
		case "fullDateWithWeekday":
			options = {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			};
			break;
		case "normalDate":
			const day = newDate.getDate();
			const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(newDate);
			return `${day} ${month}`;
		case "normalDateWithWeekday":
			options = {
				weekday: "short",
				day: "numeric",
				month: "short"
			};
			break;
		case "shortDate":
			options = {
				month: "short",
				day: "numeric"
			};
			break;
		case "year":
			options = { year: "numeric" };
			break;
		case "month":
			options = { month: "long" };
			break;
		case "monthShort":
			options = { month: "short" };
			break;
		case "monthAndYear":
			options = {
				month: "long",
				year: "numeric"
			};
			break;
		case "monthAndDate":
			options = {
				month: "long",
				day: "numeric"
			};
			break;
		case "weekday":
			options = { weekday: "long" };
			break;
		case "weekdayShort":
			options = { weekday: "short" };
			break;
		case "dayOfMonth": return new Intl.NumberFormat(locale).format(newDate.getDate());
		case "hours12h":
			options = {
				hour: "numeric",
				hour12: true
			};
			break;
		case "hours24h":
			options = {
				hour: "numeric",
				hour12: false
			};
			break;
		case "minutes":
			options = { minute: "numeric" };
			break;
		case "seconds":
			options = { second: "numeric" };
			break;
		case "fullTime":
			options = {
				hour: "numeric",
				minute: "numeric"
			};
			break;
		case "fullTime12h":
			options = {
				hour: "numeric",
				minute: "numeric",
				hour12: true
			};
			break;
		case "fullTime24h":
			options = {
				hour: "numeric",
				minute: "numeric",
				hour12: false
			};
			break;
		case "fullDateTime":
			options = {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric"
			};
			break;
		case "fullDateTime12h":
			options = {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true
			};
			break;
		case "fullDateTime24h":
			options = {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: false
			};
			break;
		case "keyboardDate":
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			};
			break;
		case "keyboardDateTime":
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "numeric"
			};
			return new Intl.DateTimeFormat(locale, options).format(newDate).replace(/, /g, " ");
		case "keyboardDateTime12h":
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "numeric",
				hour12: true
			};
			return new Intl.DateTimeFormat(locale, options).format(newDate).replace(/, /g, " ");
		case "keyboardDateTime24h":
			options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "numeric",
				minute: "numeric",
				hour12: false
			};
			return new Intl.DateTimeFormat(locale, options).format(newDate).replace(/, /g, " ");
		default: options = customFormat ?? {
			timeZone: "UTC",
			timeZoneName: "short"
		};
	}
	return new Intl.DateTimeFormat(locale, options).format(newDate);
}
function toISO(adapter, value) {
	const date = adapter.toJsDate(value);
	const year = date.getFullYear();
	const month = padStart(String(date.getMonth() + 1), 2, "0");
	const day = padStart(String(date.getDate()), 2, "0");
	return `${year}-${month}-${day}`;
}
function parseISO(value) {
	const [year, month, day] = value.split("-").map(Number);
	return new Date(year, month - 1, day);
}
function addMinutes(date, amount) {
	const d = new Date(date);
	d.setMinutes(d.getMinutes() + amount);
	return d;
}
function addHours(date, amount) {
	const d = new Date(date);
	d.setHours(d.getHours() + amount);
	return d;
}
function addDays(date, amount) {
	const d = new Date(date);
	d.setDate(d.getDate() + amount);
	return d;
}
function addWeeks(date, amount) {
	const d = new Date(date);
	d.setDate(d.getDate() + amount * 7);
	return d;
}
function addMonths(date, amount) {
	const d = new Date(date);
	d.setDate(1);
	d.setMonth(d.getMonth() + amount);
	return d;
}
function getYear(date) {
	return date.getFullYear();
}
function getMonth(date) {
	return date.getMonth();
}
function getWeek(date, locale, firstDayOfWeek, firstDayOfYear) {
	const weekInfoFromLocale = weekInfo(locale);
	const weekStart = firstDayOfWeek ?? weekInfoFromLocale?.firstDay ?? 0;
	const minWeekSize = weekInfoFromLocale?.firstWeekSize ?? 1;
	return firstDayOfYear !== void 0 ? calculateWeekWithFirstDayOfYear(date, locale, weekStart, firstDayOfYear) : calculateWeekWithMinWeekSize(date, locale, weekStart, minWeekSize);
}
function calculateWeekWithFirstDayOfYear(date, locale, weekStart, firstDayOfYear) {
	const firstDayOfYearOffset = (7 + firstDayOfYear - weekStart) % 7;
	const currentWeekStart = startOfWeek(date, locale, weekStart);
	const currentWeekEnd = addDays(currentWeekStart, 6);
	function yearStartWeekdayOffset(year) {
		return (7 + new Date(year, 0, 1).getDay() - weekStart) % 7;
	}
	let year = getYear(currentWeekStart);
	if (year < getYear(currentWeekEnd) && yearStartWeekdayOffset(year + 1) <= firstDayOfYearOffset) {
		year++;
	}
	const yearStart = new Date(year, 0, 1);
	const offset = yearStartWeekdayOffset(year);
	const d1w1 = offset <= firstDayOfYearOffset ? addDays(yearStart, -offset) : addDays(yearStart, 7 - offset);
	return 1 + getDiff(endOfDay(currentWeekStart), startOfDay(d1w1), "weeks");
}
function calculateWeekWithMinWeekSize(date, locale, weekStart, minWeekSize) {
	const currentWeekStart = startOfWeek(date, locale, weekStart);
	const currentWeekEnd = addDays(startOfWeek(date, locale, weekStart), 6);
	function firstWeekSize(year) {
		const yearStart = new Date(year, 0, 1);
		return 7 - getDiff(yearStart, startOfWeek(yearStart, locale, weekStart), "days");
	}
	let year = getYear(currentWeekStart);
	if (year < getYear(currentWeekEnd) && firstWeekSize(year + 1) >= minWeekSize) {
		year++;
	}
	const yearStart = new Date(year, 0, 1);
	const size = firstWeekSize(year);
	const d1w1 = size >= minWeekSize ? addDays(yearStart, size - 7) : addDays(yearStart, size);
	return 1 + getDiff(endOfDay(currentWeekStart), startOfDay(d1w1), "weeks");
}
function getDate(date) {
	return date.getDate();
}
function getNextMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}
function getPreviousMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}
function getHours(date) {
	return date.getHours();
}
function getMinutes(date) {
	return date.getMinutes();
}
function startOfYear(date) {
	return new Date(date.getFullYear(), 0, 1);
}
function endOfYear(date) {
	return new Date(date.getFullYear(), 11, 31);
}
function isWithinRange(date, range) {
	return isAfter(date, range[0]) && isBefore(date, range[1]);
}
function isValid(date) {
	const d = new Date(date);
	return d instanceof Date && !isNaN(d.getTime());
}
function isAfter(date, comparing) {
	return date.getTime() > comparing.getTime();
}
function isAfterDay(date, comparing) {
	return isAfter(startOfDay(date), startOfDay(comparing));
}
function isBefore(date, comparing) {
	return date.getTime() < comparing.getTime();
}
function isEqual(date, comparing) {
	return date.getTime() === comparing.getTime();
}
function isSameDay(date, comparing) {
	return date.getDate() === comparing.getDate() && date.getMonth() === comparing.getMonth() && date.getFullYear() === comparing.getFullYear();
}
function isSameMonth(date, comparing) {
	return date.getMonth() === comparing.getMonth() && date.getFullYear() === comparing.getFullYear();
}
function isSameYear(date, comparing) {
	return date.getFullYear() === comparing.getFullYear();
}
function getDiff(date, comparing, unit) {
	const d = new Date(date);
	const c = new Date(comparing);
	switch (unit) {
		case "years": return d.getFullYear() - c.getFullYear();
		case "quarters": return Math.floor((d.getMonth() - c.getMonth() + (d.getFullYear() - c.getFullYear()) * 12) / 4);
		case "months": return d.getMonth() - c.getMonth() + (d.getFullYear() - c.getFullYear()) * 12;
		case "weeks": return Math.floor((d.getTime() - c.getTime()) / (6e4 * 60 * 24 * 7));
		case "days": return Math.floor((d.getTime() - c.getTime()) / (6e4 * 60 * 24));
		case "hours": return Math.floor((d.getTime() - c.getTime()) / (6e4 * 60));
		case "minutes": return Math.floor((d.getTime() - c.getTime()) / 6e4);
		case "seconds": return Math.floor((d.getTime() - c.getTime()) / 1e3);
		default: {
			return d.getTime() - c.getTime();
		}
	}
}
function setHours(date, count) {
	const d = new Date(date);
	d.setHours(count);
	return d;
}
function setMinutes(date, count) {
	const d = new Date(date);
	d.setMinutes(count);
	return d;
}
function setMonth(date, count) {
	const d = new Date(date);
	d.setMonth(count);
	return d;
}
function setDate(date, day) {
	const d = new Date(date);
	d.setDate(day);
	return d;
}
function setYear(date, year) {
	const d = new Date(date);
	d.setFullYear(year);
	return d;
}
function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
function endOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
class VuetifyDateAdapter {
	constructor(options) {
		this.locale = options.locale;
		this.formats = options.formats;
	}
	date(value) {
		return date(value);
	}
	toJsDate(date) {
		return date;
	}
	toISO(date) {
		return toISO(this, date);
	}
	parseISO(date) {
		return parseISO(date);
	}
	addMinutes(date, amount) {
		return addMinutes(date, amount);
	}
	addHours(date, amount) {
		return addHours(date, amount);
	}
	addDays(date, amount) {
		return addDays(date, amount);
	}
	addWeeks(date, amount) {
		return addWeeks(date, amount);
	}
	addMonths(date, amount) {
		return addMonths(date, amount);
	}
	getWeekArray(date, firstDayOfWeek) {
		const firstDay = firstDayOfWeek !== void 0 ? Number(firstDayOfWeek) : void 0;
		return getWeekArray(date, this.locale, firstDay);
	}
	startOfWeek(date, firstDayOfWeek) {
		const firstDay = firstDayOfWeek !== void 0 ? Number(firstDayOfWeek) : void 0;
		return startOfWeek(date, this.locale, firstDay);
	}
	endOfWeek(date) {
		return endOfWeek(date, this.locale);
	}
	startOfMonth(date) {
		return startOfMonth(date);
	}
	endOfMonth(date) {
		return endOfMonth(date);
	}
	format(date, formatString) {
		return format(date, formatString, this.locale, this.formats);
	}
	isEqual(date, comparing) {
		return isEqual(date, comparing);
	}
	isValid(date) {
		return isValid(date);
	}
	isWithinRange(date, range) {
		return isWithinRange(date, range);
	}
	isAfter(date, comparing) {
		return isAfter(date, comparing);
	}
	isAfterDay(date, comparing) {
		return isAfterDay(date, comparing);
	}
	isBefore(date, comparing) {
		return !isAfter(date, comparing) && !isEqual(date, comparing);
	}
	isSameDay(date, comparing) {
		return isSameDay(date, comparing);
	}
	isSameMonth(date, comparing) {
		return isSameMonth(date, comparing);
	}
	isSameYear(date, comparing) {
		return isSameYear(date, comparing);
	}
	setMinutes(date, count) {
		return setMinutes(date, count);
	}
	setHours(date, count) {
		return setHours(date, count);
	}
	setMonth(date, count) {
		return setMonth(date, count);
	}
	setDate(date, day) {
		return setDate(date, day);
	}
	setYear(date, year) {
		return setYear(date, year);
	}
	getDiff(date, comparing, unit) {
		return getDiff(date, comparing, unit);
	}
	getWeekdays(firstDayOfWeek, weekdayFormat) {
		const firstDay = firstDayOfWeek !== void 0 ? Number(firstDayOfWeek) : void 0;
		return getWeekdays(this.locale, firstDay, weekdayFormat);
	}
	getYear(date) {
		return getYear(date);
	}
	getMonth(date) {
		return getMonth(date);
	}
	getWeek(date, firstDayOfWeek, firstDayOfYear) {
		const firstDay = firstDayOfWeek !== void 0 ? Number(firstDayOfWeek) : void 0;
		const firstWeekStart = firstDayOfYear !== void 0 ? Number(firstDayOfYear) : void 0;
		return getWeek(date, this.locale, firstDay, firstWeekStart);
	}
	getDate(date) {
		return getDate(date);
	}
	getNextMonth(date) {
		return getNextMonth(date);
	}
	getPreviousMonth(date) {
		return getPreviousMonth(date);
	}
	getHours(date) {
		return getHours(date);
	}
	getMinutes(date) {
		return getMinutes(date);
	}
	startOfDay(date) {
		return startOfDay(date);
	}
	endOfDay(date) {
		return endOfDay(date);
	}
	startOfYear(date) {
		return startOfYear(date);
	}
	endOfYear(date) {
		return endOfYear(date);
	}
}
// Composables
const DateOptionsSymbol = Symbol.for("vuetify:date-options");
const DateAdapterSymbol = Symbol.for("vuetify:date-adapter");
function createDate(options, locale) {
	const _options = mergeDeep({
		adapter: VuetifyDateAdapter,
		locale: {
			af: "af-ZA",
			bg: "bg-BG",
			ca: "ca-ES",
			ckb: "",
			cs: "cs-CZ",
			de: "de-DE",
			el: "el-GR",
			en: "en-US",
			et: "et-EE",
			fa: "fa-IR",
			fi: "fi-FI",
			hr: "hr-HR",
			hu: "hu-HU",
			he: "he-IL",
			id: "id-ID",
			it: "it-IT",
			ja: "ja-JP",
			ko: "ko-KR",
			lv: "lv-LV",
			lt: "lt-LT",
			nl: "nl-NL",
			no: "no-NO",
			pl: "pl-PL",
			pt: "pt-PT",
			ro: "ro-RO",
			ru: "ru-RU",
			sk: "sk-SK",
			sl: "sl-SI",
			srCyrl: "sr-SP",
			srLatn: "sr-SP",
			sv: "sv-SE",
			th: "th-TH",
			tr: "tr-TR",
			az: "az-AZ",
			uk: "uk-UA",
			vi: "vi-VN",
			zhHans: "zh-CN",
			zhHant: "zh-TW"
		}
	}, options);
	return {
		options: _options,
		instance: createInstance(_options, locale)
	};
}
function createInstance(options, locale) {
	const instance = reactive(typeof options.adapter === "function" ? new options.adapter({
		locale: options.locale[locale.current.value] ?? locale.current.value,
		formats: options.formats
	}) : options.adapter);
	watch(locale.current, (value) => {
		instance.locale = options.locale[value] ?? value ?? instance.locale;
	});
	return instance;
}
// Composables
// Types
const aliases = {
	collapse: "mdi-chevron-up",
	complete: "mdi-check",
	cancel: "mdi-close-circle",
	close: "mdi-close",
	delete: "mdi-close-circle",
	clear: "mdi-close-circle",
	success: "mdi-check-circle",
	info: "mdi-information",
	warning: "mdi-alert-circle",
	error: "mdi-close-circle",
	prev: "mdi-chevron-left",
	next: "mdi-chevron-right",
	checkboxOn: "mdi-checkbox-marked",
	checkboxOff: "mdi-checkbox-blank-outline",
	checkboxIndeterminate: "mdi-minus-box",
	delimiter: "mdi-circle",
	sortAsc: "mdi-arrow-up",
	sortDesc: "mdi-arrow-down",
	expand: "mdi-chevron-down",
	menu: "mdi-menu",
	subgroup: "mdi-menu-down",
	dropdown: "mdi-menu-down",
	radioOn: "mdi-radiobox-marked",
	radioOff: "mdi-radiobox-blank",
	edit: "mdi-pencil",
	ratingEmpty: "mdi-star-outline",
	ratingFull: "mdi-star",
	ratingHalf: "mdi-star-half-full",
	loading: "mdi-cached",
	first: "mdi-page-first",
	last: "mdi-page-last",
	unfold: "mdi-unfold-more-horizontal",
	file: "mdi-paperclip",
	plus: "mdi-plus",
	minus: "mdi-minus",
	calendar: "mdi-calendar",
	treeviewCollapse: "mdi-menu-down",
	treeviewExpand: "mdi-menu-right",
	tableGroupCollapse: "mdi-chevron-down",
	tableGroupExpand: "mdi-chevron-right",
	eyeDropper: "mdi-eyedropper",
	upload: "mdi-cloud-upload",
	color: "mdi-palette",
	command: "mdi-apple-keyboard-command",
	ctrl: "mdi-apple-keyboard-control",
	space: "mdi-keyboard-space",
	shift: "mdi-apple-keyboard-shift",
	alt: "mdi-apple-keyboard-option",
	enter: "mdi-keyboard-return",
	arrowup: "mdi-arrow-up",
	arrowdown: "mdi-arrow-down",
	arrowleft: "mdi-arrow-left",
	arrowright: "mdi-arrow-right",
	backspace: "mdi-backspace",
	play: "mdi-play",
	pause: "mdi-pause",
	fullscreen: "mdi-fullscreen",
	fullscreenExit: "mdi-fullscreen-exit",
	volumeHigh: "mdi-volume-high",
	volumeMedium: "mdi-volume-medium",
	volumeLow: "mdi-volume-low",
	volumeOff: "mdi-volume-variant-off"
};
const mdi = { component: (props) => h(VClassIcon, {
	...props,
	class: "mdi"
}) };
// Composables
function genDefaults() {
	return {
		svg: { component: VSvgIcon },
		class: { component: VClassIcon }
	};
}
function createIcons(options) {
	const sets = genDefaults();
	const defaultSet = options?.defaultSet ?? "mdi";
	if (defaultSet === "mdi" && true) {
		sets.mdi = mdi;
	}
	return mergeDeep({
		defaultSet,
		sets,
		aliases: {
			...aliases,
			vuetify: ["M8.2241 14.2009L12 21L22 3H14.4459L8.2241 14.2009Z", ["M7.26303 12.4733L7.00113 12L2 3H12.5261C12.5261 3 12.5261 3 12.5261 3L7.26303 12.4733Z", .6]],
			"vuetify-outline": "svg:M7.26 12.47 12.53 3H2L7.26 12.47ZM14.45 3 8.22 14.2 12 21 22 3H14.45ZM18.6 5 12 16.88 10.51 14.2 15.62 5ZM7.26 8.35 5.4 5H9.13L7.26 8.35Z",
			"vuetify-play": ["m6.376 13.184-4.11-7.192C1.505 4.66 2.467 3 4.003 3h8.532l-.953 1.576-.006.01-.396.677c-.429.732-.214 1.507.194 2.015.404.503 1.092.878 1.869.806a3.72 3.72 0 0 1 1.005.022c.276.053.434.143.523.237.138.146.38.635-.25 2.09-.893 1.63-1.553 1.722-1.847 1.677-.213-.033-.468-.158-.756-.406a4.95 4.95 0 0 1-.8-.927c-.39-.564-1.04-.84-1.66-.846-.625-.006-1.316.27-1.693.921l-.478.826-.911 1.506Z", ["M9.093 11.552c.046-.079.144-.15.32-.148a.53.53 0 0 1 .43.207c.285.414.636.847 1.046 1.2.405.35.914.662 1.516.754 1.334.205 2.502-.698 3.48-2.495l.014-.028.013-.03c.687-1.574.774-2.852-.005-3.675-.37-.391-.861-.586-1.333-.676a5.243 5.243 0 0 0-1.447-.044c-.173.016-.393-.073-.54-.257-.145-.18-.127-.316-.082-.392l.393-.672L14.287 3h5.71c1.536 0 2.499 1.659 1.737 2.992l-7.997 13.996c-.768 1.344-2.706 1.344-3.473 0l-3.037-5.314 1.377-2.278.004-.006.004-.007.481-.831Z", .6]]
		}
	}, options);
}
// Composables
function createVuetify() {
	let vuetify = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	const { blueprint, ...rest } = vuetify;
	const options = mergeDeep(blueprint, rest);
	const { aliases = {}, components = {}, directives = {} } = options;
	const scope = effectScope();
	return scope.run(() => {
		const defaults = createDefaults(options.defaults);
		const display = createDisplay(options.display, options.ssr);
		const theme = createTheme(options.theme);
		const icons = createIcons(options.icons);
		const locale = createLocale(options.locale);
		const date = createDate(options.date, locale);
		const goTo = createGoTo(options.goTo, locale);
		function install(app) {
			for (const key in directives) {
				app.directive(key, directives[key]);
			}
			for (const key in components) {
				app.component(key, components[key]);
			}
			for (const key in aliases) {
				app.component(key, defineComponent({
					...aliases[key],
					name: key,
					aliasName: aliases[key].name
				}));
			}
			const appScope = effectScope();
			appScope.run(() => {
				theme.install(app);
			});
			app.onUnmount(() => appScope.stop());
			app.provide(DefaultsSymbol, defaults);
			app.provide(DisplaySymbol, display);
			app.provide(ThemeSymbol, theme);
			app.provide(IconSymbol, icons);
			app.provide(LocaleSymbol, locale);
			app.provide(DateOptionsSymbol, date.options);
			app.provide(DateAdapterSymbol, date.instance);
			app.provide(GoToSymbol, goTo);
			if (IN_BROWSER && options.ssr) {
				if (app.$nuxt) {
					app.$nuxt.hook("app:suspense:resolve", () => {
						display.update();
					});
				} else {
					const { mount } = app;
					app.mount = function() {
						const vm = mount(...arguments);
						nextTick(() => display.update());
						app.mount = mount;
						return vm;
					};
				}
			}
		}
		function unmount() {
			scope.stop();
		}
		return {
			install,
			unmount,
			defaults,
			display,
			theme,
			icons,
			locale,
			date,
			goTo
		};
	});
}
const App = defineComponent$1({ render() {
	return h(VApp, [h(VBtn, "Hello World")]);
} });
createApp(App).use(createVuetify()).mount("#app");
