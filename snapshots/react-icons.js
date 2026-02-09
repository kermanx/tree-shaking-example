var react = {};
var react_production = {};
function requireReact_production() {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	react_production.n = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	react_production.o = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	return react_production;
}
function requireReact() {
	{
		react.a = requireReact_production();
	}
	return react.a;
}
var reactExports = requireReact();
var DefaultContext = {
	color: void 0,
	size: void 0,
	className: void 0,
	style: void 0,
	attr: void 0
};
var IconContext = reactExports.n(DefaultContext);
var __assign = function() {
	__assign = Object.assign;
	return __assign.apply(0, arguments);
};
function Tree2Element(tree) {
	return tree && tree.map(function(node, i) {
		return reactExports.o(node.tag, __assign({ key: i }, node.attr), Tree2Element(node.child));
	});
}
function GenIcon(data) {
	return function() {
		return reactExports.o(IconBase, __assign({ attr: __assign({}, data.b) }, void 0), Tree2Element(data.a));
	};
}
function IconBase() {
	return reactExports.o(IconContext.Consumer);
}
var FaBeer = function() {
	return GenIcon({
		"b": { "viewBox": "0 0 448 512" },
		"a": [{
			"tag": "path",
			"attr": { "d": "M368 96h-48V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 56v400c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24v-42.11l80.606-35.977C429.396 365.063 448 336.388 448 304.86V176c0-44.112-35.888-80-80-80zm16 208.86a16.018 16.018 0 0 1-9.479 14.611L320 343.805V160h48c8.822 0 16 7.178 16 16v128.86zM208 384c-8.836 0-16-7.164-16-16V144c0-8.836 7.164-16 16-16s16 7.164 16 16v224c0 8.836-7.164 16-16 16zm-96 0c-8.836 0-16-7.164-16-16V144c0-8.836 7.164-16 16-16s16 7.164 16 16v224c0 8.836-7.164 16-16 16z" }
		}]
	})();
};
console.log("FaBeer" + FaBeer().props.children[0].props.d);
