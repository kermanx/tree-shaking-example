var common = {
	black: "#000",
	white: "#fff"
};
var common$1 = common;
var grey = {
	50: "#fafafa",
	100: "#f5f5f5",
	200: "#eeeeee",
	300: "#e0e0e0",
	400: "#bdbdbd",
	500: "#9e9e9e",
	600: "#757575",
	700: "#616161",
	800: "#424242",
	900: "#212121",
	A100: "#d5d5d5",
	A200: "#aaaaaa",
	A400: "#303030",
	A700: "#616161"
};
var grey$1 = grey;
function _extends() {
	return _extends = Object.assign.bind(), _extends.apply(null, arguments);
}
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = function(o) {
		return typeof o;
	}, _typeof$1(o);
}
function isPlainObject(item) {
	return item && _typeof$1(item) === "object" && item.constructor === Object;
}
function deepmerge(target, source) {
	var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { clone: true };
	var output = options.clone ? _extends({}, target) : target;
	if (isPlainObject(target) && isPlainObject(source)) {
		Object.keys(source).forEach(function(key) {
			// Avoid prototype pollution
			if (key === "__proto__") {
				return;
			}
			if (isPlainObject(source[key]) && key in target) {
				output[key] = deepmerge(target[key], source[key], options);
			} else {
				output[key] = source[key];
			}
		});
	}
	return output;
}
function getDefaultExportFromCjs(x) {
	return x;
}
function toPrimitive(t) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, "string");
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return String(t);
}
function toPropertyKey(t) {
	var i = toPrimitive(t);
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
/**
* WARNING: Don't import this directly.
* Use `MuiError` from `@material-ui/utils/macros/MuiError.macro` instead.
* @param {number} code
*/
function formatMuiErrorMessage(code) {
	// Apply babel-plugin-transform-template-literals in loose mode
	// loose mode is safe iff we're concatenating primitives
	// see https://babeljs.io/docs/en/babel-plugin-transform-template-literals#loose
	/* eslint-disable prefer-template */
	var url = "https://mui.com/production-error/?code=" + code;
	for (var i = 1; i < arguments.length; i += 1) {
		// rest params over-transpile for this case
		// eslint-disable-next-line prefer-rest-params
		url += "&args[]=" + encodeURIComponent(arguments[i]);
	}
	return "Minified Material-UI error #" + code + "; visit " + url + " for the full message.";
	/* eslint-enable prefer-template */
}
/* eslint-disable no-use-before-define */
/**
* Returns a number whose value is limited to the given range.
*
* @param {number} value The value to be clamped
* @param {number} min The lower boundary of the output range
* @param {number} max The upper boundary of the output range
* @returns {number} A number in the range [min, max]
*/
function clamp(value) {
	var min = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	var max = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
	return Math.min(Math.max(min, value), max);
}
/**
* Converts a color from CSS hex format to CSS rgb format.
*
* @param {string} color - Hex color, i.e. #nnn or #nnnnnn
* @returns {string} A CSS rgb color string
*/
function hexToRgb(color) {
	color = color.substr(1);
	var re = new RegExp(".{1,".concat(color.length >= 6 ? 2 : 1, "}"), "g");
	var colors = color.match(re);
	if (colors && colors[0].length === 1) {
		colors = colors.map(function(n) {
			return n + n;
		});
	}
	return colors ? "rgb".concat(colors.length === 4 ? "a" : "", "(").concat(colors.map(function(n, index) {
		return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
	}).join(", "), ")") : "";
}
/**
* Converts a color from hsl format to rgb format.
*
* @param {string} color - HSL color values
* @returns {string} rgb color values
*/
function hslToRgb(color) {
	color = decomposeColor(color);
	var _color = color, values = _color.values;
	var h = values[0];
	var s = values[1] / 100;
	var l = values[2] / 100;
	var a = s * Math.min(l, 1 - l);
	var f = function(n) {
		var k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : (n + h / 30) % 12;
		return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	var type = "rgb";
	var rgb = [
		Math.round(f(0) * 255),
		Math.round(f(8) * 255),
		Math.round(f(4) * 255)
	];
	if (color.type === "hsla") {
		type += "a";
		rgb.push(values[3]);
	}
	return recomposeColor({
		type,
		values: rgb
	});
}
/**
* Returns an object with the type and values of a color.
*
* Note: Does not support rgb % values.
*
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @returns {object} - A MUI color object: {type: string, values: number[]}
*/
function decomposeColor(color) {
	// Idempotent
	if (color.type) {
		return color;
	}
	if (color.charAt(0) === "#") {
		return decomposeColor(hexToRgb(color));
	}
	var marker = color.indexOf("(");
	var type = color.substring(0, marker);
	if ([
		"rgb",
		"rgba",
		"hsl",
		"hsla"
	].indexOf(type) === -1) {
		throw new Error(formatMuiErrorMessage(3, color));
	}
	var values = color.substring(marker + 1, color.length - 1).split(",");
	values = values.map(function(value) {
		return parseFloat(value);
	});
	return {
		type,
		values
	};
}
/**
* Converts a color object with type and values to a string.
*
* @param {object} color - Decomposed color
* @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla'
* @param {array} color.values - [n,n,n] or [n,n,n,n]
* @returns {string} A CSS color string
*/
function recomposeColor(color) {
	var type = color.type;
	var values = color.values;
	if (type.indexOf("rgb") !== -1) {
		// Only convert the first 3 values to int (i.e. not alpha)
		values = values.map(function(n, i) {
			return i < 3 ? parseInt(n, 10) : n;
		});
	} else if (type.indexOf("hsl") !== -1) {
		values[1] = "".concat(values[1], "%");
		values[2] = "".concat(values[2], "%");
	}
	return "".concat(type, "(").concat(values.join(", "), ")");
}
/**
* Calculates the contrast ratio between two colors.
*
* Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
*
* @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @returns {number} A contrast ratio value in the range 0 - 21.
*/
function getContrastRatio(foreground, background) {
	var lumA = getLuminance(foreground);
	var lumB = getLuminance(background);
	return (Math.max(lumA, lumB) + .05) / (Math.min(lumA, lumB) + .05);
}
/**
* The relative brightness of any point in a color space,
* normalized to 0 for darkest black and 1 for lightest white.
*
* Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
*
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @returns {number} The relative brightness of the color in the range 0 - 1
*/
function getLuminance(color) {
	color = decomposeColor(color);
	var rgb = color.type === "hsl" ? decomposeColor(hslToRgb(color)).values : color.values;
	rgb = rgb.map(function(val) {
		val /= 255;
		return val <= .03928 ? val / 12.92 : Math.pow((val + .055) / 1.055, 2.4);
	});
	return Number((.2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]).toFixed(3));
}
/**
* Darkens a color.
*
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @param {number} coefficient - multiplier in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function darken(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clamp(coefficient);
	if (color.type.indexOf("hsl") !== -1) {
		color.values[2] *= 1 - coefficient;
	} else if (color.type.indexOf("rgb") !== -1) {
		for (var i = 0; i < 3; i += 1) {
			color.values[i] *= 1 - coefficient;
		}
	}
	return recomposeColor(color);
}
/**
* Lightens a color.
*
* @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
* @param {number} coefficient - multiplier in the range 0 - 1
* @returns {string} A CSS color string. Hex input values are returned as rgb
*/
function lighten(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clamp(coefficient);
	if (color.type.indexOf("hsl") !== -1) {
		color.values[2] += (100 - color.values[2]) * coefficient;
	} else if (color.type.indexOf("rgb") !== -1) {
		for (var i = 0; i < 3; i += 1) {
			color.values[i] += (255 - color.values[i]) * coefficient;
		}
	}
	return recomposeColor(color);
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
// Sorted ASC by size. That's important.
// It can't be configured as it's used statically for propTypes.
var keys = [
	"xs",
	"sm",
	"md",
	"lg",
	"xl"
];
function createBreakpoints(breakpoints) {
	var _breakpoints$values = breakpoints.values, values = _breakpoints$values === void 0 ? {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920
	} : _breakpoints$values, _breakpoints$unit = breakpoints.unit, unit = _breakpoints$unit === void 0 ? "px" : _breakpoints$unit, _breakpoints$step = breakpoints.step, step = _breakpoints$step === void 0 ? 5 : _breakpoints$step, other = _objectWithoutProperties(breakpoints, [
		"values",
		"unit",
		"step"
	]);
	function up(key) {
		var value = typeof values[key] === "number" ? values[key] : key;
		return "@media (min-width:".concat(value).concat(unit, ")");
	}
	function down(key) {
		var endIndex = keys.indexOf(key) + 1;
		var upperbound = values[keys[endIndex]];
		if (endIndex === keys.length) {
			// xl down applies to all sizes
			return up("xs");
		}
		var value = typeof upperbound === "number" && endIndex > 0 ? upperbound : key;
		return "@media (max-width:".concat(value - step / 100).concat(unit, ")");
	}
	function between(start, end) {
		var endIndex = keys.indexOf(end);
		if (endIndex === keys.length - 1) {
			return up(start);
		}
		return "@media (min-width:".concat(typeof values[start] === "number" ? values[start] : start).concat(unit, ") and ") + "(max-width:".concat((endIndex !== -1 && typeof values[keys[endIndex + 1]] === "number" ? values[keys[endIndex + 1]] : end) - step / 100).concat(unit, ")");
	}
	function only(key) {
		return between(key, key);
	}
	function width(key) {
		return values[key];
	}
	return _extends({
		keys,
		values,
		up,
		down,
		between,
		only,
		width
	}, other);
}
function createMixins(breakpoints, spacing, mixins) {
	var _toolbar;
	return _extends({
		gutters: function() {
			var styles = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			console.warn([
				"Material-UI: theme.mixins.gutters() is deprecated.",
				"You can use the source of the mixin directly:",
				"\n      paddingLeft: theme.spacing(2),\n      paddingRight: theme.spacing(2),\n      [theme.breakpoints.up('sm')]: {\n        paddingLeft: theme.spacing(3),\n        paddingRight: theme.spacing(3),\n      },\n      "
			].join("\n"));
			return _extends({
				paddingLeft: spacing(2),
				paddingRight: spacing(2)
			}, styles, _defineProperty({}, breakpoints.up("sm"), _extends({
				paddingLeft: spacing(3),
				paddingRight: spacing(3)
			}, styles[breakpoints.up("sm")])));
		},
		toolbar: (_toolbar = { minHeight: 56 }, _defineProperty(_toolbar, "".concat(breakpoints.up("xs"), " and (orientation: landscape)"), { minHeight: 48 }), _defineProperty(_toolbar, breakpoints.up("sm"), { minHeight: 64 }), _toolbar)
	}, mixins);
}
var light = {
	text: {
		primary: "rgba(0, 0, 0, 0.87)",
		secondary: "rgba(0, 0, 0, 0.54)",
		disabled: "rgba(0, 0, 0, 0.38)",
		hint: "rgba(0, 0, 0, 0.38)"
	},
	divider: "rgba(0, 0, 0, 0.12)",
	background: {
		paper: "#fff",
		default: "#fafafa"
	},
	action: {
		active: "rgba(0, 0, 0, 0.54)",
		hover: "rgba(0, 0, 0, 0.04)",
		hoverOpacity: .04,
		selected: "rgba(0, 0, 0, 0.08)",
		selectedOpacity: .08,
		disabled: "rgba(0, 0, 0, 0.26)",
		disabledBackground: "rgba(0, 0, 0, 0.12)",
		disabledOpacity: .38,
		focus: "rgba(0, 0, 0, 0.12)",
		focusOpacity: .12,
		activatedOpacity: .12
	}
};
var dark = {
	text: {
		primary: "#fff",
		secondary: "rgba(255, 255, 255, 0.7)",
		disabled: "rgba(255, 255, 255, 0.5)",
		hint: "rgba(255, 255, 255, 0.5)",
		icon: "rgba(255, 255, 255, 0.5)"
	},
	divider: "rgba(255, 255, 255, 0.12)",
	background: {
		paper: "#424242",
		default: "#303030"
	},
	action: {
		active: "#fff",
		hover: "rgba(255, 255, 255, 0.08)",
		hoverOpacity: .08,
		selected: "rgba(255, 255, 255, 0.16)",
		selectedOpacity: .16,
		disabled: "rgba(255, 255, 255, 0.3)",
		disabledBackground: "rgba(255, 255, 255, 0.12)",
		disabledOpacity: .38,
		focus: "rgba(255, 255, 255, 0.12)",
		focusOpacity: .12,
		activatedOpacity: .24
	}
};
function addLightOrDark(intent, direction, shade, tonalOffset) {
	var tonalOffsetLight = tonalOffset.light || tonalOffset;
	var tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
	if (!intent[direction]) {
		if (intent.hasOwnProperty(shade)) {
			intent[direction] = intent[shade];
		} else if (direction === "light") {
			intent.light = lighten(intent.main, tonalOffsetLight);
		} else {
			{
				intent.dark = darken(intent.main, tonalOffsetDark);
			}
		}
	}
}
function createPalette(palette) {
	var _palette$primary = palette.primary, primary = _palette$primary === void 0 ? {
		light: "#7986cb",
		main: "#3f51b5",
		dark: "#303f9f"
	} : _palette$primary, _palette$secondary = palette.secondary, secondary = _palette$secondary === void 0 ? {
		light: "#ff4081",
		main: "#f50057",
		dark: "#c51162"
	} : _palette$secondary, _palette$error = palette.error, error = _palette$error === void 0 ? {
		light: "#e57373",
		main: "#f44336",
		dark: "#d32f2f"
	} : _palette$error, _palette$warning = palette.warning, warning = _palette$warning === void 0 ? {
		light: "#ffb74d",
		main: "#ff9800",
		dark: "#f57c00"
	} : _palette$warning, _palette$info = palette.info, info = _palette$info === void 0 ? {
		light: "#64b5f6",
		main: "#2196f3",
		dark: "#1976d2"
	} : _palette$info, _palette$success = palette.success, success = _palette$success === void 0 ? {
		light: "#81c784",
		main: "#4caf50",
		dark: "#388e3c"
	} : _palette$success, _palette$type = palette.type, type = _palette$type === void 0 ? "light" : _palette$type, _palette$contrastThre = palette.contrastThreshold, contrastThreshold = _palette$contrastThre === void 0 ? 3 : _palette$contrastThre, _palette$tonalOffset = palette.tonalOffset, tonalOffset = _palette$tonalOffset === void 0 ? .2 : _palette$tonalOffset, other = _objectWithoutProperties(palette, [
		"primary",
		"secondary",
		"error",
		"warning",
		"info",
		"success",
		"type",
		"contrastThreshold",
		"tonalOffset"
	]);
	// Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
	// and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
	function getContrastText(background) {
		var contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
		return contrastText;
	}
	var augmentColor = function(color) {
		var mainShade = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 500;
		var lightShade = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 300;
		var darkShade = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 700;
		color = _extends({}, color);
		if (!color.main && color[mainShade]) {
			color.main = color[mainShade];
		}
		if (!color.main) {
			throw new Error(formatMuiErrorMessage(4, mainShade));
		}
		if (typeof color.main !== "string") {
			throw new Error(formatMuiErrorMessage(5, JSON.stringify(color.main)));
		}
		addLightOrDark(color, "light", lightShade, tonalOffset);
		addLightOrDark(color, "dark", darkShade, tonalOffset);
		if (!color.contrastText) {
			color.contrastText = getContrastText(color.main);
		}
		return color;
	};
	var types = {
		dark,
		light
	};
	var paletteOutput = deepmerge(_extends({
		common: common$1,
		type,
		primary: augmentColor(primary),
		secondary: augmentColor(secondary, "A400", "A200", "A700"),
		error: augmentColor(error),
		warning: augmentColor(warning),
		info: augmentColor(info),
		success: augmentColor(success),
		grey: grey$1,
		contrastThreshold,
		getContrastText,
		augmentColor,
		tonalOffset
	}, types[type]), other);
	return paletteOutput;
}
function round(value) {
	return Math.round(value * 1e5) / 1e5;
}
function roundWithDeprecationWarning(value) {
	return round(value);
}
var caseAllCaps = { textTransform: "uppercase" };
var defaultFontFamily = "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif";
/**
* @see @link{https://material.io/design/typography/the-type-system.html}
* @see @link{https://material.io/design/typography/understanding-typography.html}
*/
function createTypography(palette, typography) {
	var _ref = typeof typography === "function" ? typography(palette) : typography, _ref$fontFamily = _ref.fontFamily, fontFamily = _ref$fontFamily === void 0 ? defaultFontFamily : _ref$fontFamily, _ref$fontSize = _ref.fontSize, fontSize = _ref$fontSize === void 0 ? 14 : _ref$fontSize, _ref$fontWeightLight = _ref.fontWeightLight, fontWeightLight = _ref$fontWeightLight === void 0 ? 300 : _ref$fontWeightLight, _ref$fontWeightRegula = _ref.fontWeightRegular, fontWeightRegular = _ref$fontWeightRegula === void 0 ? 400 : _ref$fontWeightRegula, _ref$fontWeightMedium = _ref.fontWeightMedium, fontWeightMedium = _ref$fontWeightMedium === void 0 ? 500 : _ref$fontWeightMedium, _ref$fontWeightBold = _ref.fontWeightBold, fontWeightBold = _ref$fontWeightBold === void 0 ? 700 : _ref$fontWeightBold, _ref$htmlFontSize = _ref.htmlFontSize, htmlFontSize = _ref$htmlFontSize === void 0 ? 16 : _ref$htmlFontSize, allVariants = _ref.allVariants, pxToRem2 = _ref.pxToRem, other = _objectWithoutProperties(_ref, [
		"fontFamily",
		"fontSize",
		"fontWeightLight",
		"fontWeightRegular",
		"fontWeightMedium",
		"fontWeightBold",
		"htmlFontSize",
		"allVariants",
		"pxToRem"
	]);
	var coef = fontSize / 14;
	var pxToRem = pxToRem2 || function(size) {
		return "".concat(size / htmlFontSize * coef, "rem");
	};
	var buildVariant = function(fontWeight, size, lineHeight, letterSpacing, casing) {
		return _extends({
			fontFamily,
			fontWeight,
			fontSize: pxToRem(size),
			lineHeight
		}, fontFamily === defaultFontFamily ? { letterSpacing: "".concat(round(letterSpacing / size), "em") } : {}, casing, allVariants);
	};
	var variants = {
		h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
		h2: buildVariant(fontWeightLight, 60, 1.2, -.5),
		h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
		h4: buildVariant(fontWeightRegular, 34, 1.235, .25),
		h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
		h6: buildVariant(fontWeightMedium, 20, 1.6, .15),
		subtitle1: buildVariant(fontWeightRegular, 16, 1.75, .15),
		subtitle2: buildVariant(fontWeightMedium, 14, 1.57, .1),
		body1: buildVariant(fontWeightRegular, 16, 1.5, .15),
		body2: buildVariant(fontWeightRegular, 14, 1.43, .15),
		button: buildVariant(fontWeightMedium, 14, 1.75, .4, caseAllCaps),
		caption: buildVariant(fontWeightRegular, 12, 1.66, .4),
		overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps)
	};
	return deepmerge(_extends({
		htmlFontSize,
		pxToRem,
		round: roundWithDeprecationWarning,
		fontFamily,
		fontSize,
		fontWeightLight,
		fontWeightRegular,
		fontWeightMedium,
		fontWeightBold
	}, variants), other, { clone: false });
}
var shadowKeyUmbraOpacity = .2;
var shadowKeyPenumbraOpacity = .14;
var shadowAmbientShadowOpacity = .12;
function createShadow() {
	return [
		"".concat(arguments.length <= 0 ? void 0 : arguments[0], "px ").concat(arguments.length <= 1 ? void 0 : arguments[1], "px ").concat(arguments.length <= 2 ? void 0 : arguments[2], "px ").concat(arguments.length <= 3 ? void 0 : arguments[3], "px rgba(0,0,0,").concat(shadowKeyUmbraOpacity, ")"),
		"".concat(arguments.length <= 4 ? void 0 : arguments[4], "px ").concat(arguments.length <= 5 ? void 0 : arguments[5], "px ").concat(arguments.length <= 6 ? void 0 : arguments[6], "px ").concat(arguments.length <= 7 ? void 0 : arguments[7], "px rgba(0,0,0,").concat(shadowKeyPenumbraOpacity, ")"),
		"".concat(arguments.length <= 8 ? void 0 : arguments[8], "px ").concat(arguments.length <= 9 ? void 0 : arguments[9], "px ").concat(arguments.length <= 10 ? void 0 : arguments[10], "px ").concat(arguments.length <= 11 ? void 0 : arguments[11], "px rgba(0,0,0,").concat(shadowAmbientShadowOpacity, ")")
	].join(",");
}
var shadows = [
	"none",
	createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
	createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
	createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
	createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
	createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
	createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
	createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
	createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
	createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
	createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
	createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
	createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
	createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
	createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
	createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
	createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
	createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
	createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
	createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
	createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
	createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
	createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
	createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
	createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)
];
var shadows$1 = shadows;
var shape = { borderRadius: 4 };
var shape$1 = shape;
function _arrayLikeToArray(r, a) {
	a = r.length;
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
	if (null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _unsupportedIterableToArray(r) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r) : void 0;
	}
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function createUnarySpacing(theme) {
	var themeSpacing = theme.a || 8;
	if (typeof themeSpacing === "number") {
		return function(abs) {
			return themeSpacing * abs;
		};
	}
	if (Array.isArray(themeSpacing)) {
		return function(abs) {
			return themeSpacing[abs];
		};
	}
	if (typeof themeSpacing === "function") {
		return themeSpacing;
	}
	return function() {
		return void 0;
	};
}
function createSpacing() {
	var spacingInput = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 8;
	// Already transformed.
	if (spacingInput.mui) {
		return spacingInput;
	}
	// Smaller components, such as icons and type, can align to a 4dp grid.
	// https://material.io/design/layout/understanding-layout.html#usage
	var transform = createUnarySpacing({ a: spacingInput });
	var spacing = function() {
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}
		if (args.length === 0) {
			return transform(1);
		}
		if (args.length === 1) {
			return transform(args[0]);
		}
		return args.map(function(argument) {
			if (typeof argument === "string") {
				return argument;
			}
			var output = transform(argument);
			return typeof output === "number" ? "".concat(output, "px") : output;
		}).join(" ");
	};
	Object.defineProperty(spacing, "unit", { get: function() {
		return spacingInput;
	} });
	spacing.mui = true;
	return spacing;
}
// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
// to learn the context in which each easing should be used.
var easing = {
	easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
	easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
	easeIn: "cubic-bezier(0.4, 0, 1, 1)",
	sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
// to learn when use what timing
var duration = {
	shortest: 150,
	shorter: 200,
	short: 250,
	standard: 300,
	complex: 375,
	enteringScreen: 225,
	leavingScreen: 195
};
function formatMs(milliseconds) {
	return "".concat(Math.round(milliseconds), "ms");
}
/**
* @param {string|Array} props
* @param {object} param
* @param {string} param.prop
* @param {number} param.duration
* @param {string} param.easing
* @param {number} param.delay
*/
var transitions = {
	easing,
	duration,
	create: function() {
		var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["all"];
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var _options$duration = options.duration, durationOption = _options$duration === void 0 ? duration.standard : _options$duration, _options$easing = options.easing, easingOption = _options$easing === void 0 ? easing.easeInOut : _options$easing, _options$delay = options.delay, delay = _options$delay === void 0 ? 0 : _options$delay;
		_objectWithoutProperties(options, [
			"duration",
			"easing",
			"delay"
		]);
		return (Array.isArray(props) ? props : [props]).map(function(animatedProp) {
			return "".concat(animatedProp, " ").concat(typeof durationOption === "string" ? durationOption : formatMs(durationOption), " ").concat(easingOption, " ").concat(typeof delay === "string" ? delay : formatMs(delay));
		}).join(",");
	},
	getAutoHeightDuration: function(height) {
		if (!height) {
			return 0;
		}
		var constant = height / 36;
		return Math.round((4 + 15 * Math.pow(constant, .25) + constant / 5) * 10);
	}
};
// We need to centralize the zIndex definitions as they work
// like global values in the browser.
var zIndex = {
	mobileStepper: 1e3,
	speedDial: 1050,
	appBar: 1100,
	drawer: 1200,
	modal: 1300,
	snackbar: 1400,
	tooltip: 1500
};
var zIndex$1 = zIndex;
function createTheme() {
	var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var _options$breakpoints = options.breakpoints, breakpointsInput = _options$breakpoints === void 0 ? {} : _options$breakpoints, _options$mixins = options.mixins, mixinsInput = _options$mixins === void 0 ? {} : _options$mixins, _options$palette = options.palette, paletteInput = _options$palette === void 0 ? {} : _options$palette, spacingInput = options.spacing, _options$typography = options.typography, typographyInput = _options$typography === void 0 ? {} : _options$typography, other = _objectWithoutProperties(options, [
		"breakpoints",
		"mixins",
		"palette",
		"spacing",
		"typography"
	]);
	var palette = createPalette(paletteInput);
	var breakpoints = createBreakpoints(breakpointsInput);
	var spacing = createSpacing(spacingInput);
	var muiTheme = deepmerge({
		breakpoints,
		direction: "ltr",
		mixins: createMixins(breakpoints, spacing, mixinsInput),
		overrides: {},
		palette,
		props: {},
		shadows: shadows$1,
		typography: createTypography(palette, typographyInput),
		spacing,
		shape: shape$1,
		transitions,
		zIndex: zIndex$1
	}, other);
	for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}
	muiTheme = args.reduce(function(acc, argument) {
		return deepmerge(acc, argument);
	}, muiTheme);
	return muiTheme;
}
var nested = Symbol.for("mui.nested");
/**
* This is the list of the style rule name we use as drop in replacement for the built-in
* pseudo classes (:checked, :disabled, :focused, etc.).
*
* Why do they exist in the first place?
* These classes are used at a specificity of 2.
* It allows them to override previously definied styles as well as
* being untouched by simple user overrides.
*/
var pseudoClasses = [
	"checked",
	"disabled",
	"error",
	"focused",
	"focusVisible",
	"required",
	"expanded",
	"selected"
];
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's inspired by
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
function createGenerateClassName() {
	var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var _options$disableGloba = options.disableGlobal, disableGlobal = _options$disableGloba === void 0 ? false : _options$disableGloba, _options$productionPr = options.productionPrefix, productionPrefix = _options$productionPr === void 0 ? "jss" : _options$productionPr, _options$seed = options.seed, seed = _options$seed === void 0 ? "" : _options$seed;
	var seedPrefix = seed === "" ? "" : "".concat(seed, "-");
	var ruleCounter = 0;
	var getNextCounterId = function() {
		ruleCounter += 1;
		return ruleCounter;
	};
	return function(rule, styleSheet) {
		var name = styleSheet.options.name;
		if (name && name.indexOf("Mui") === 0 && !styleSheet.options.link && !disableGlobal) {
			// We can use a shorthand class name, we never use the keys to style the components.
			if (pseudoClasses.indexOf(rule.key) !== -1) {
				return "Mui-".concat(rule.key);
			}
			var prefix = "".concat(seedPrefix).concat(name, "-").concat(rule.key);
			if (!styleSheet.options.theme[nested] || seed !== "") {
				return prefix;
			}
			return "".concat(prefix, "-").concat(getNextCounterId());
		}
		{
			return "".concat(seedPrefix).concat(productionPrefix).concat(getNextCounterId());
		}
	};
}
/* eslint-disable no-restricted-syntax */
function getThemeProps(params) {
	var theme = params.a, name = params.b, props = params.c;
	if (!theme || !theme.props || !theme.props[name]) {
		return props;
	}
	// https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L221
	var defaultProps = theme.props[name];
	var propName;
	for (propName in defaultProps) {
		if (props[propName] === void 0) {
			props[propName] = defaultProps[propName];
		}
	}
	return props;
}
var _typeof = function(obj) {
	return typeof obj;
};
var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" && document.nodeType === 9;
var isInBrowser = isBrowser;
function _defineProperties(e, r) {
	for (var t = 0; t < 1; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
	}
}
function _createClass(e, r) {
	return _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", { writable: false });
}
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
function _inheritsLoose(t, o) {
	t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
var plainObjectConstrurctor = {}.constructor;
function cloneStyle(style) {
	if (style == null || typeof style !== "object") return style;
	if (Array.isArray(style)) return style.map(cloneStyle);
	if (style.constructor !== plainObjectConstrurctor) return style;
	var newStyle = {};
	for (var name in style) {
		newStyle[name] = cloneStyle(style[name]);
	}
	return newStyle;
}
/**
* Create a rule instance.
*/
function createRule(name, decl, options) {
	if (name === void 0) {
		name = "unnamed";
	}
	var jss = options.jss;
	var declCopy = cloneStyle(decl);
	var rule = jss.plugins.onCreateRule(name, declCopy, options);
	if (rule) return rule;
	return null;
}
var join = function(value, by) {
	var result = "";
	for (var i = 0; i < value.length; i++) {
		// Remove !important from the value, it will be readded later.
		if (value[i] === "!important") break;
		if (result) result += by;
		result += value[i];
	}
	return result;
};
/**
* Converts JSS array value to a CSS string.
*
* `margin: [['5px', '10px']]` > `margin: 5px 10px;`
* `border: ['1px', '2px']` > `border: 1px, 2px;`
* `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
* `color: ['red', !important]` > `color: red !important;`
*/
var toCssValue = function(value) {
	if (!Array.isArray(value)) return value;
	var cssValue = "";
	if (Array.isArray(value[0])) {
		for (var i = 0; i < value.length; i++) {
			if (value[i] === "!important") break;
			if (cssValue) cssValue += ", ";
			cssValue += join(value[i], " ");
		}
	} else cssValue = join(value, ", ");
	if (value[value.length - 1] === "!important") {
		cssValue += " !important";
	}
	return cssValue;
};
function getWhitespaceSymbols(options) {
	if (options && options.format === false) {
		return {
			a: "",
			b: ""
		};
	}
	return {
		a: "\n",
		b: " "
	};
}
/**
* Indent a string.
* http://jsperf.com/array-join-vs-for
*/
function indentStr(str, indent) {
	var result = "";
	for (var index = 0; index < indent; index++) {
		result += "  ";
	}
	return result + str;
}
/**
* Converts a Rule to CSS string.
*/
function toCss(selector, style, options) {
	if (options === void 0) {
		options = {};
	}
	var result = "";
	if (!style) return result;
	var _options = options, _options$indent = _options.indent, indent = _options$indent === void 0 ? 0 : _options$indent;
	var fallbacks = style.fallbacks;
	if (options.format === false) {
		indent = -Infinity;
	}
	var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a, space = _getWhitespaceSymbols.b;
	if (selector) indent++;
	if (fallbacks) {
		// Array syntax {fallbacks: [{prop: value}]}
		if (Array.isArray(fallbacks)) {
			for (var index = 0; index < fallbacks.length; index++) {
				var fallback = fallbacks[index];
				for (var prop in fallback) {
					var value = fallback[prop];
					if (value != null) {
						if (result) result += linebreak;
						result += indentStr(prop + ":" + space + toCssValue(value) + ";", indent);
					}
				}
			}
		} else {
			// Object syntax {fallbacks: {prop: value}}
			for (var _prop in fallbacks) {
				var _value = fallbacks[_prop];
				if (_value != null) {
					if (result) result += linebreak;
					result += indentStr(_prop + ":" + space + toCssValue(_value) + ";", indent);
				}
			}
		}
	}
	for (var _prop2 in style) {
		var _value2 = style[_prop2];
		if (_value2 != null && _prop2 !== "fallbacks") {
			if (result) result += linebreak;
			result += indentStr(_prop2 + ":" + space + toCssValue(_value2) + ";", indent);
		}
	}
	if (!result && !options.allowEmpty) return result;
	if (!selector) return result;
	indent--;
	if (result) result = "" + linebreak + result + linebreak;
	return indentStr("" + selector + space + "{" + result, indent) + indentStr("}", indent);
}
var escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g;
var nativeEscape = typeof CSS !== "undefined" && CSS.escape;
var escape = function(str) {
	return nativeEscape ? nativeEscape(str) : str.replace(escapeRegex, "\\$1");
};
var BaseStyleRule = function() {
	function BaseStyleRule(key, style, options) {
		this.type = "style";
		this.isProcessed = false;
		var sheet = options.sheet, Renderer = options.Renderer;
		this.key = key;
		this.options = options;
		this.style = style;
		if (sheet) this.renderer = sheet.renderer;
		else if (Renderer) this.renderer = new Renderer();
	}
	/**
	* Get or set a style property.
	*/
	var _proto = BaseStyleRule.prototype;
	_proto.prop = function(name, value, options) {
		// It's a getter.
		if (value === void 0) return this.style[name];
		var force = options ? options.force : false;
		if (!force && this.style[name] === value) return this;
		var newValue = value;
		if (!options || options.process !== false) {
			newValue = this.options.jss.plugins.onChangeValue(value, name, this);
		}
		var isEmpty = newValue == null || newValue === false;
		var isDefined = name in this.style;
		if (isEmpty && !isDefined && !force) return this;
		var remove = isEmpty && isDefined;
		if (remove) delete this.style[name];
		else this.style[name] = newValue;
		if (this.renderable && this.renderer) {
			if (remove) this.renderer.removeProperty(this.renderable, name);
			else this.renderer.setProperty(this.renderable, name, newValue);
			return this;
		}
		return this;
	};
	return BaseStyleRule;
}();
var StyleRule = function(_BaseStyleRule) {
	_inheritsLoose(StyleRule, _BaseStyleRule);
	function StyleRule(key, style, options) {
		var _this;
		_this = _BaseStyleRule.call(this, key, style, options) || this;
		var selector = options.selector, scoped = options.scoped, sheet = options.sheet, generateId = options.generateId;
		if (selector) {
			_this.selectorText = selector;
		} else if (scoped !== false) {
			_this.id = generateId(_assertThisInitialized(_assertThisInitialized(_this)), sheet);
			_this.selectorText = "." + escape(_this.id);
		}
		return _this;
	}
	/**
	* Set selector string.
	* Attention: use this with caution. Most browsers didn't implement
	* selectorText setter, so this may result in rerendering of entire Style Sheet.
	*/
	var _proto2 = StyleRule.prototype;
	/**
	* Apply rule to an element inline.
	*/
	_proto2.applyTo = function(renderable) {
		var renderer = this.renderer;
		if (renderer) {
			var json = this.toJSON();
			for (var prop in json) {
				renderer.setProperty(renderable, prop, json[prop]);
			}
		}
		return this;
	};
	_proto2.toJSON = function() {
		var json = {};
		for (var prop in this.style) {
			var value = this.style[prop];
			if (typeof value !== "object") json[prop] = value;
			else if (Array.isArray(value)) json[prop] = toCssValue(value);
		}
		return json;
	};
	_proto2.toString = function(options) {
		var sheet = this.options.sheet;
		var link = sheet ? sheet.options.link : false;
		var opts = link ? _extends({}, options, { allowEmpty: true }) : options;
		return toCss(this.selectorText, this.style, opts);
	};
	_createClass(StyleRule, [{
		key: "selector",
		set: function(selector) {
			if (selector === this.selectorText) return;
			this.selectorText = selector;
			var renderer = this.renderer, renderable = this.renderable;
			if (!renderable || !renderer) return;
			var hasChanged = renderer.setSelector(renderable, selector);
			if (!hasChanged) {
				renderer.replaceRule(renderable, this);
			}
		},
		get: function() {
			return this.selectorText;
		}
	}]);
	return StyleRule;
}(BaseStyleRule);
var pluginStyleRule = { onCreateRule: function(key, style, options) {
	if (key[0] === "@" || options.parent && options.parent.type === "keyframes") {
		return null;
	}
	return new StyleRule(key, style, options);
} };
var defaultToStringOptions = {
	indent: 1,
	children: true
};
var atRegExp = /@([\w-]+)/;
/**
* Conditional rule for @media, @supports
*/
var ConditionalRule = function() {
	function ConditionalRule(key, styles, options) {
		this.type = "conditional";
		this.isProcessed = false;
		this.key = key;
		var atMatch = key.match(atRegExp);
		this.at = atMatch ? atMatch[1] : "unknown";
		this.query = options.name || "@" + this.at;
		this.options = options;
		this.rules = new RuleList(_extends({}, options, { parent: this }));
		for (var name in styles) {
			this.rules.add(name, styles[name]);
		}
		this.rules.process();
	}
	/**
	* Get a rule.
	*/
	var _proto = ConditionalRule.prototype;
	_proto.getRule = function(name) {
		return this.rules.get(name);
	};
	_proto.indexOf = function(rule) {
		return this.rules.indexOf(rule);
	};
	_proto.addRule = function(name, style, options) {
		var rule = this.rules.add(name, style, options);
		if (!rule) return null;
		this.options.jss.plugins.onProcessRule(rule);
		return rule;
	};
	_proto.replaceRule = function(name, style, options) {
		var newRule = this.rules.replace(name, style, options);
		if (newRule) this.options.jss.plugins.onProcessRule(newRule);
		return newRule;
	};
	_proto.toString = function(options) {
		if (options === void 0) {
			options = defaultToStringOptions;
		}
		var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a;
		if (options.indent == null) options.indent = defaultToStringOptions.indent;
		if (options.children == null) options.children = defaultToStringOptions.children;
		if (options.children === false) {
			return this.query + " {}";
		}
		var children = this.rules.toString(options);
		return children ? this.query + " {" + linebreak + children + linebreak + "}" : "";
	};
	return ConditionalRule;
}();
var keyRegExp = /@container|@media|@supports\s+/;
var pluginConditionalRule = { onCreateRule: function(key, styles, options) {
	return keyRegExp.test(key) ? new ConditionalRule(key, styles, options) : null;
} };
var defaultToStringOptions$1 = {
	indent: 1,
	children: true
};
var nameRegExp = /@keyframes\s+([\w-]+)/;
/**
* Rule for @keyframes
*/
var KeyframesRule = function() {
	function KeyframesRule(key, frames, options) {
		this.type = "keyframes";
		this.at = "@keyframes";
		this.isProcessed = false;
		var nameMatch = key.match(nameRegExp);
		if (nameMatch && nameMatch[1]) {
			this.name = nameMatch[1];
		} else {
			this.name = "noname";
		}
		this.key = this.type + "-" + this.name;
		this.options = options;
		var scoped = options.scoped, sheet = options.sheet, generateId = options.generateId;
		this.id = scoped === false ? this.name : escape(generateId(this, sheet));
		this.rules = new RuleList(_extends({}, options, { parent: this }));
		for (var name in frames) {
			this.rules.add(name, frames[name], _extends({}, options, { parent: this }));
		}
		this.rules.process();
	}
	/**
	* Generates a CSS string.
	*/
	var _proto = KeyframesRule.prototype;
	_proto.toString = function(options) {
		if (options === void 0) {
			options = defaultToStringOptions$1;
		}
		var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a;
		if (options.indent == null) options.indent = defaultToStringOptions$1.indent;
		if (options.children == null) options.children = defaultToStringOptions$1.children;
		if (options.children === false) {
			return this.at + " " + this.id + " {}";
		}
		var children = this.rules.toString(options);
		if (children) children = "" + linebreak + children + linebreak;
		return this.at + " " + this.id + " {" + children + "}";
	};
	return KeyframesRule;
}();
var keyRegExp$1 = /@keyframes\s+/;
var refRegExp$1 = /\$([\w-]+)/g;
var findReferencedKeyframe = function(val, keyframes) {
	if (typeof val === "string") {
		return val.replace(refRegExp$1, function(match, name) {
			if (name in keyframes) {
				return keyframes[name];
			}
			return match;
		});
	}
	return val;
};
/**
* Replace the reference for a animation name.
*/
var replaceRef = function(style, prop, keyframes) {
	var value = style[prop];
	var refKeyframe = findReferencedKeyframe(value, keyframes);
	if (refKeyframe !== value) {
		style[prop] = refKeyframe;
	}
};
var pluginKeyframesRule = {
	onCreateRule: function(key, frames, options) {
		return typeof key === "string" && keyRegExp$1.test(key) ? new KeyframesRule(key, frames, options) : null;
	},
	onProcessStyle: function(style, rule, sheet) {
		if (rule.type !== "style" || !sheet) return style;
		if ("animation-name" in style) replaceRef(style, "animation-name", sheet.keyframes);
		if ("animation" in style) replaceRef(style, "animation", sheet.keyframes);
		return style;
	},
	onChangeValue: function(val, prop, rule) {
		var sheet = rule.options.sheet;
		if (!sheet) {
			return val;
		}
		switch (prop) {
			case "animation": return findReferencedKeyframe(val, sheet.keyframes);
			case "animation-name": return findReferencedKeyframe(val, sheet.keyframes);
			default: return val;
		}
	}
};
var KeyframeRule = function(_BaseStyleRule) {
	_inheritsLoose(KeyframeRule, _BaseStyleRule);
	function KeyframeRule() {
		return _BaseStyleRule.apply(this, arguments) || this;
	}
	var _proto = KeyframeRule.prototype;
	/**
	* Generates a CSS string.
	*/
	_proto.toString = function(options) {
		var sheet = this.options.sheet;
		var link = sheet ? sheet.options.link : false;
		var opts = link ? _extends({}, options, { allowEmpty: true }) : options;
		return toCss(this.key, this.style, opts);
	};
	return KeyframeRule;
}(BaseStyleRule);
var pluginKeyframeRule = { onCreateRule: function(key, style, options) {
	if (options.parent && options.parent.type === "keyframes") {
		return new KeyframeRule(key, style, options);
	}
	return null;
} };
var FontFaceRule = function() {
	function FontFaceRule(key, style, options) {
		this.type = "font-face";
		this.at = "@font-face";
		this.isProcessed = false;
		this.key = key;
		this.style = style;
		this.options = options;
	}
	/**
	* Generates a CSS string.
	*/
	var _proto = FontFaceRule.prototype;
	_proto.toString = function(options) {
		var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a;
		if (Array.isArray(this.style)) {
			var str = "";
			for (var index = 0; index < this.style.length; index++) {
				str += toCss(this.at, this.style[index]);
				if (this.style[index + 1]) str += linebreak;
			}
			return str;
		}
		return toCss(this.at, this.style, options);
	};
	return FontFaceRule;
}();
var keyRegExp$2 = /@font-face/;
var pluginFontFaceRule = { onCreateRule: function(key, style, options) {
	return keyRegExp$2.test(key) ? new FontFaceRule(key, style, options) : null;
} };
var ViewportRule = function() {
	function ViewportRule(key, style, options) {
		this.type = "viewport";
		this.at = "@viewport";
		this.isProcessed = false;
		this.key = key;
		this.style = style;
		this.options = options;
	}
	/**
	* Generates a CSS string.
	*/
	var _proto = ViewportRule.prototype;
	_proto.toString = function(options) {
		return toCss(this.key, this.style, options);
	};
	return ViewportRule;
}();
var pluginViewportRule = { onCreateRule: function(key, style, options) {
	return key === "@viewport" || key === "@-ms-viewport" ? new ViewportRule(key, style, options) : null;
} };
var SimpleRule = function() {
	function SimpleRule(key, value, options) {
		this.type = "simple";
		this.isProcessed = false;
		this.key = key;
		this.value = value;
		this.options = options;
	}
	/**
	* Generates a CSS string.
	*/
	// eslint-disable-next-line no-unused-vars
	var _proto = SimpleRule.prototype;
	_proto.toString = function() {
		if (Array.isArray(this.value)) {
			var str = "";
			for (var index = 0; index < this.value.length; index++) {
				str += this.key + " " + this.value[index] + ";";
				if (this.value[index + 1]) str += "\n";
			}
			return str;
		}
		return this.key + " " + this.value + ";";
	};
	return SimpleRule;
}();
var keysMap = {
	"@charset": true,
	"@import": true,
	"@namespace": true
};
var pluginSimpleRule = { onCreateRule: function(key, value, options) {
	return key in keysMap ? new SimpleRule(key, value, options) : null;
} };
var plugins$1 = [
	pluginStyleRule,
	pluginConditionalRule,
	pluginKeyframesRule,
	pluginKeyframeRule,
	pluginFontFaceRule,
	pluginViewportRule,
	pluginSimpleRule
];
var defaultUpdateOptions = { process: true };
var forceUpdateOptions = {
	force: true,
	process: true
};
var RuleList = function() {
	// Rules registry for access by .get() method.
	// It contains the same rule registered by name and by selector.
	// Original styles object.
	// Used to ensure correct rules order.
	function RuleList(options) {
		this.map = {};
		this.raw = {};
		this.index = [];
		this.counter = 0;
		this.options = options;
		this.classes = options.classes;
		this.keyframes = options.keyframes;
	}
	/**
	* Create and register rule.
	*
	* Will not render after Style Sheet was rendered the first time.
	*/
	var _proto = RuleList.prototype;
	_proto.add = function(name, decl, ruleOptions) {
		var _this$options = this.options, parent = _this$options.parent, sheet = _this$options.sheet, jss = _this$options.jss, Renderer = _this$options.Renderer, generateId = _this$options.generateId, scoped = _this$options.scoped;
		var options = _extends({
			classes: this.classes,
			parent,
			sheet,
			jss,
			Renderer,
			generateId,
			scoped,
			name,
			keyframes: this.keyframes,
			selector: void 0
		}, ruleOptions);
		// `sheet.addRule()` opens the door for any duplicate rule name. When this happens
		// we need to make the key unique within this RuleList instance scope.
		var key = name;
		if (name in this.raw) {
			key = name + "-d" + this.counter++;
		}
		// because cache plugin needs to use it as a key to return a cached rule.
		this.raw[key] = decl;
		if (key in this.classes) {
			// E.g. rules inside of @media container
			options.selector = "." + escape(this.classes[key]);
		}
		var rule = createRule(key, decl, options);
		if (!rule) return null;
		this.register(rule);
		var index = options.index === void 0 ? this.index.length : options.index;
		this.index.splice(index, 0, rule);
		return rule;
	};
	_proto.replace = function(name, decl, ruleOptions) {
		var oldRule = this.get(name);
		var oldIndex = this.index.indexOf(oldRule);
		if (oldRule) {
			this.remove(oldRule);
		}
		var options = ruleOptions;
		if (oldIndex !== -1) options = _extends({}, ruleOptions, { index: oldIndex });
		return this.add(name, decl, options);
	};
	_proto.get = function(nameOrSelector) {
		return this.map[nameOrSelector];
	};
	_proto.remove = function(rule) {
		this.unregister(rule);
		delete this.raw[rule.key];
		this.index.splice(this.index.indexOf(rule), 1);
	};
	_proto.indexOf = function(rule) {
		return this.index.indexOf(rule);
	};
	_proto.process = function() {
		var plugins = this.options.jss.plugins;
		// we end up with very hard-to-track-down side effects.
		this.index.slice(0).forEach(plugins.onProcessRule, plugins);
	};
	_proto.register = function(rule) {
		this.map[rule.key] = rule;
		if (rule instanceof StyleRule) {
			this.map[rule.selector] = rule;
			if (rule.id) this.classes[rule.key] = rule.id;
		} else if (rule instanceof KeyframesRule && this.keyframes) {
			this.keyframes[rule.name] = rule.id;
		}
	};
	_proto.unregister = function(rule) {
		delete this.map[rule.key];
		if (rule instanceof StyleRule) {
			delete this.map[rule.selector];
			delete this.classes[rule.key];
		} else if (rule instanceof KeyframesRule) {
			delete this.keyframes[rule.name];
		}
	};
	_proto.update = function() {
		var name;
		var data;
		var options;
		if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) === "string") {
			name = arguments.length <= 0 ? void 0 : arguments[0];
			data = arguments.length <= 1 ? void 0 : arguments[1];
			options = arguments.length <= 2 ? void 0 : arguments[2];
		} else {
			data = arguments.length <= 0 ? void 0 : arguments[0];
			options = arguments.length <= 1 ? void 0 : arguments[1];
			name = null;
		}
		if (name) {
			this.updateOne(this.get(name), data, options);
		} else {
			for (var index = 0; index < this.index.length; index++) {
				this.updateOne(this.index[index], data, options);
			}
		}
	};
	_proto.updateOne = function(rule, data, options) {
		if (options === void 0) {
			options = defaultUpdateOptions;
		}
		var _this$options2 = this.options, plugins = _this$options2.jss.plugins, sheet = _this$options2.sheet;
		if (rule.rules instanceof RuleList) {
			rule.rules.update(data, options);
			return;
		}
		var style = rule.style;
		plugins.onUpdate(data, rule, sheet, options);
		if (options.process && style && style !== rule.style) {
			// We need to run the plugins in case new `style` relies on syntax plugins.
			plugins.onProcessStyle(rule.style, rule, sheet);
			for (var prop in rule.style) {
				var nextValue = rule.style[prop];
				var prevValue = style[prop];
				// We do this comparison to avoid unneeded `rule.prop()` calls, since we have the old `style` object here.
				if (nextValue !== prevValue) {
					rule.prop(prop, nextValue, forceUpdateOptions);
				}
			}
			for (var _prop in style) {
				var _nextValue = rule.style[_prop];
				var _prevValue = style[_prop];
				// We do this comparison to avoid unneeded `rule.prop()` calls, since we have the old `style` object here.
				if (_nextValue == null && _nextValue !== _prevValue) {
					rule.prop(_prop, null, forceUpdateOptions);
				}
			}
		}
	};
	_proto.toString = function(options) {
		var str = "";
		var sheet = this.options.sheet;
		var link = sheet ? sheet.options.link : false;
		var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a;
		for (var index = 0; index < this.index.length; index++) {
			var rule = this.index[index];
			var css = rule.toString(options);
			if (!css && !link) continue;
			if (str) str += linebreak;
			str += css;
		}
		return str;
	};
	return RuleList;
}();
var StyleSheet = function() {
	function StyleSheet(styles, options) {
		this.attached = false;
		this.deployed = false;
		this.classes = {};
		this.keyframes = {};
		this.options = _extends({}, options, {
			sheet: this,
			parent: this,
			classes: this.classes,
			keyframes: this.keyframes
		});
		if (options.Renderer) {
			this.renderer = new options.Renderer(this);
		}
		this.rules = new RuleList(this.options);
		for (var name in styles) {
			this.rules.add(name, styles[name]);
		}
		this.rules.process();
	}
	/**
	* Attach renderable to the render tree.
	*/
	var _proto = StyleSheet.prototype;
	_proto.attach = function() {
		if (this.attached) return this;
		if (this.renderer) this.renderer.attach();
		this.attached = true;
		if (!this.deployed) this.deploy();
		return this;
	};
	_proto.detach = function() {
		if (!this.attached) return this;
		if (this.renderer) this.renderer.detach();
		this.attached = false;
		return this;
	};
	_proto.addRule = function(name, decl, options) {
		var queue = this.queue;
		// In order to preserve the right order, we need to queue all `.addRule` calls,
		// which happen after the first `rules.add()` call.
		if (this.attached && !queue) this.queue = [];
		var rule = this.rules.add(name, decl, options);
		if (!rule) return null;
		this.options.jss.plugins.onProcessRule(rule);
		if (this.attached) {
			if (!this.deployed) return rule;
			// It will be inserted all together when .attach is called.
			if (queue) queue.push(rule);
			else {
				this.insertRule(rule);
				if (this.queue) {
					this.queue.forEach(this.insertRule, this);
					this.queue = void 0;
				}
			}
			return rule;
		}
		// We will redeploy the sheet once user will attach it.
		this.deployed = false;
		return rule;
	};
	_proto.replaceRule = function(nameOrSelector, decl, options) {
		var oldRule = this.rules.get(nameOrSelector);
		if (!oldRule) return this.addRule(nameOrSelector, decl, options);
		var newRule = this.rules.replace(nameOrSelector, decl, options);
		if (newRule) {
			this.options.jss.plugins.onProcessRule(newRule);
		}
		if (this.attached) {
			if (!this.deployed) return newRule;
			// It will be inserted all together when .attach is called.
			if (this.renderer) {
				if (!newRule) {
					this.renderer.deleteRule(oldRule);
				} else if (oldRule.renderable) {
					this.renderer.replaceRule(oldRule.renderable, newRule);
				}
			}
			return newRule;
		}
		// We will redeploy the sheet once user will attach it.
		this.deployed = false;
		return newRule;
	};
	_proto.insertRule = function(rule) {
		if (this.renderer) {
			this.renderer.insertRule(rule);
		}
	};
	_proto.addRules = function(styles, options) {
		var added = [];
		for (var name in styles) {
			var rule = this.addRule(name, styles[name], options);
			if (rule) added.push(rule);
		}
		return added;
	};
	_proto.getRule = function(nameOrSelector) {
		return this.rules.get(nameOrSelector);
	};
	_proto.deleteRule = function(name) {
		var rule = typeof name === "object" ? name : this.rules.get(name);
		if (!rule || this.attached && !rule.renderable) {
			return false;
		}
		this.rules.remove(rule);
		if (this.attached && rule.renderable && this.renderer) {
			return this.renderer.deleteRule(rule.renderable);
		}
		return true;
	};
	_proto.indexOf = function(rule) {
		return this.rules.indexOf(rule);
	};
	_proto.deploy = function() {
		if (this.renderer) this.renderer.deploy();
		this.deployed = true;
		return this;
	};
	_proto.update = function() {
		var _this$rules;
		(_this$rules = this.rules).update.apply(_this$rules, arguments);
		return this;
	};
	_proto.updateOne = function(rule, data, options) {
		this.rules.updateOne(rule, data, options);
		return this;
	};
	_proto.toString = function(options) {
		return this.rules.toString(options);
	};
	return StyleSheet;
}();
var PluginsRegistry = function() {
	function PluginsRegistry() {
		this.plugins = {
			internal: [],
			external: []
		};
		this.registry = {};
	}
	var _proto = PluginsRegistry.prototype;
	/**
	* Call `onCreateRule` hooks and return an object if returned by a hook.
	*/
	_proto.onCreateRule = function(name, decl, options) {
		for (var i = 0; i < this.registry.onCreateRule.length; i++) {
			var rule = this.registry.onCreateRule[i](name, decl, options);
			if (rule) return rule;
		}
		return null;
	};
	_proto.onProcessRule = function(rule) {
		if (rule.isProcessed) return;
		var sheet = rule.options.sheet;
		for (var i = 0; i < this.registry.onProcessRule.length; i++) {
			this.registry.onProcessRule[i](rule, sheet);
		}
		if (rule.style) this.onProcessStyle(rule.style, rule, sheet);
		rule.isProcessed = true;
	};
	_proto.onProcessStyle = function(__unused_EF4A, rule, sheet) {
		for (var i = 0; i < this.registry.onProcessStyle.length; i++) {
			rule.style = this.registry.onProcessStyle[i](rule.style, rule, sheet);
		}
	};
	_proto.onProcessSheet = function(sheet) {
		for (var i = 0; i < this.registry.onProcessSheet.length; i++) {
			this.registry.onProcessSheet[i](sheet);
		}
	};
	_proto.onUpdate = function(data, rule, sheet, options) {
		for (var i = 0; i < this.registry.onUpdate.length; i++) {
			this.registry.onUpdate[i](data, rule, sheet, options);
		}
	};
	_proto.onChangeValue = function(value, prop, rule) {
		var processedValue = value;
		for (var i = 0; i < this.registry.onChangeValue.length; i++) {
			processedValue = this.registry.onChangeValue[i](processedValue, prop, rule);
		}
		return processedValue;
	};
	_proto.use = function(newPlugin, options) {
		if (options === void 0) {
			options = { queue: "external" };
		}
		var plugins = this.plugins[options.queue];
		if (plugins.indexOf(newPlugin) !== -1) {
			return;
		}
		plugins.push(newPlugin);
		this.registry = [].concat(this.plugins.external, this.plugins.internal).reduce(function(registry, plugin) {
			for (var name in plugin) {
				if (name in registry) {
					registry[name].push(plugin[name]);
				}
			}
			return registry;
		}, {
			onCreateRule: [],
			onProcessRule: [],
			onProcessStyle: [],
			onProcessSheet: [],
			onChangeValue: [],
			onUpdate: []
		});
	};
	return PluginsRegistry;
}();
/**
* Sheets registry to access all instances in one place.
*/
var SheetsRegistry = function() {
	function SheetsRegistry() {
		this.registry = [];
	}
	var _proto = SheetsRegistry.prototype;
	/**
	* Register a Style Sheet.
	*/
	_proto.add = function(sheet) {
		var registry = this.registry;
		var index = sheet.options.index;
		if (registry.indexOf(sheet) !== -1) return;
		if (registry.length === 0 || index >= this.index) {
			registry.push(sheet);
			return;
		}
		for (var i = 0; i < registry.length; i++) {
			if (registry[i].options.index > index) {
				registry.splice(i, 0, sheet);
				return;
			}
		}
	};
	_proto.reset = function() {
		this.registry = [];
	};
	_proto.remove = function(sheet) {
		var index = this.registry.indexOf(sheet);
		this.registry.splice(index, 1);
	};
	_proto.toString = function(_temp) {
		var _ref = _temp === void 0 ? {} : _temp, attached = _ref.attached, options = _objectWithoutPropertiesLoose(_ref, ["attached"]);
		var _getWhitespaceSymbols = getWhitespaceSymbols(options), linebreak = _getWhitespaceSymbols.a;
		var css = "";
		for (var i = 0; i < this.registry.length; i++) {
			var sheet = this.registry[i];
			if (attached != null && sheet.attached !== attached) {
				continue;
			}
			if (css) css += linebreak;
			css += sheet.toString(options);
		}
		return css;
	};
	_createClass(SheetsRegistry, [{
		key: "index",
		get: function() {
			return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
		}
	}]);
	return SheetsRegistry;
}();
/**
* This is a global sheets registry. Only DomRenderer will add sheets to it.
* On the server one should use an own SheetsRegistry instance and add the
* sheets to it, because you need to make sure to create a new registry for
* each request in order to not leak sheets across requests.
*/
var sheets = new SheetsRegistry();
/* eslint-disable */
/**
* Now that `globalThis` is available on most platforms
* (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#browser_compatibility)
* we check for `globalThis` first. `globalThis` is necessary for jss
* to run in Agoric's secure version of JavaScript (SES). Under SES,
* `globalThis` exists, but `window`, `self`, and `Function('return
* this')()` are all undefined for security reasons.
*
* https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
*/
var globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" && window.Math === Math ? window : typeof self !== "undefined" && self.Math === Math ? self : Function("return this")();
var ns = "2f1acc6c3a606b082e5eef5e54414ffb";
if (globalThis$1[ns] == null) globalThis$1[ns] = 0;
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.
var moduleId = globalThis$1[ns]++;
/**
* Returns a function which generates unique class names based on counters.
* When new generator function is created, rule counter is reseted.
* We need to reset the rule counter for SSR for each request.
*/
var createGenerateId = function(options) {
	if (options === void 0) {
		options = {};
	}
	var ruleCounter = 0;
	var generateId = function(rule, sheet) {
		ruleCounter += 1;
		var jssId = "";
		var prefix = "";
		if (sheet) {
			if (sheet.options.classNamePrefix) {
				prefix = sheet.options.classNamePrefix;
			}
			if (sheet.options.jss.id != null) {
				jssId = String(sheet.options.jss.id);
			}
		}
		if (options.minify) {
			// Using "c" because a number can't be the first char in a class name.
			return "" + (prefix || "c") + moduleId + jssId + ruleCounter;
		}
		return prefix + rule.key + "-" + moduleId + (jssId ? "-" + jssId : "") + "-" + ruleCounter;
	};
	return generateId;
};
/**
* Cache the value from the first time a function is called.
*/
var memoize = function(fn) {
	var value;
	return function() {
		if (!value) value = fn();
		return value;
	};
};
/**
* Get a style property value.
*/
var getPropertyValue = function(cssRule, prop) {
	try {
		// Support CSSTOM.
		if (cssRule.attributeStyleMap) {
			return cssRule.attributeStyleMap.get(prop);
		}
		return cssRule.style.getPropertyValue(prop);
	} catch {
		// IE may throw if property is unknown.
		return "";
	}
};
/**
* Set a style property.
*/
var setProperty = function(cssRule, prop, value) {
	try {
		var cssValue = value;
		if (Array.isArray(value)) {
			cssValue = toCssValue(value);
		}
		if (cssRule.attributeStyleMap) {
			cssRule.attributeStyleMap.set(prop, cssValue);
		} else {
			var indexOfImportantFlag = cssValue ? cssValue.indexOf("!important") : -1;
			var cssValueWithoutImportantFlag = indexOfImportantFlag > -1 ? cssValue.substr(0, indexOfImportantFlag - 1) : cssValue;
			cssRule.style.setProperty(prop, cssValueWithoutImportantFlag, indexOfImportantFlag > -1 ? "important" : "");
		}
	} catch {
		// IE may throw if property is unknown.
		return false;
	}
	return true;
};
/**
* Remove a style property.
*/
var removeProperty = function(cssRule, prop) {
	try {
		// Support CSSTOM.
		if (cssRule.attributeStyleMap) {
			cssRule.attributeStyleMap.delete(prop);
		} else {
			cssRule.style.removeProperty(prop);
		}
	} catch {}
};
/**
* Set the selector.
*/
var setSelector = function(cssRule, selectorText) {
	cssRule.selectorText = selectorText;
	// Currently works in chrome only.
	return cssRule.selectorText === selectorText;
};
/**
* Gets the `head` element upon the first call and caches it.
* We assume it can't be null.
*/
var getHead = memoize(function() {
	return document.querySelector("head");
});
/**
* Find attached sheet with an index higher than the passed one.
*/
function findHigherSheet(registry, options) {
	for (var i = 0; i < registry.length; i++) {
		var sheet = registry[i];
		if (sheet.attached && sheet.options.index > options.index && sheet.options.insertionPoint === options.insertionPoint) {
			return sheet;
		}
	}
	return null;
}
/**
* Find attached sheet with the highest index.
*/
function findHighestSheet(registry, options) {
	for (var i = registry.length - 1; i >= 0; i--) {
		var sheet = registry[i];
		if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) {
			return sheet;
		}
	}
	return null;
}
/**
* Find a comment with "jss" inside.
*/
function findCommentNode(text) {
	var head = getHead();
	for (var i = 0; i < head.childNodes.length; i++) {
		var node = head.childNodes[i];
		if (node.nodeType === 8 && node.nodeValue.trim() === text) {
			return node;
		}
	}
	return null;
}
/**
* Find a node before which we can insert the sheet.
*/
function findPrevNode(options) {
	var registry = sheets.registry;
	if (registry.length > 0) {
		// Try to insert before the next higher sheet.
		var sheet = findHigherSheet(registry, options);
		if (sheet && sheet.renderer) {
			return {
				parent: sheet.renderer.element.parentNode,
				node: sheet.renderer.element
			};
		}
		sheet = findHighestSheet(registry, options);
		if (sheet && sheet.renderer) {
			return {
				parent: sheet.renderer.element.parentNode,
				node: sheet.renderer.element.nextSibling
			};
		}
	}
	var insertionPoint = options.insertionPoint;
	if (insertionPoint && typeof insertionPoint === "string") {
		var comment = findCommentNode(insertionPoint);
		if (comment) {
			return {
				parent: comment.parentNode,
				node: comment.nextSibling
			};
		}
	}
	return false;
}
/**
* Insert style element into the DOM.
*/
function insertStyle(style, options) {
	var insertionPoint = options.insertionPoint;
	var nextNode = findPrevNode(options);
	if (nextNode !== false && nextNode.parent) {
		nextNode.parent.insertBefore(style, nextNode.node);
		return;
	}
	if (insertionPoint && typeof insertionPoint.nodeType === "number") {
		var insertionPointElement = insertionPoint;
		var parentNode = insertionPointElement.parentNode;
		if (parentNode) parentNode.insertBefore(style, insertionPointElement.nextSibling);
		return;
	}
	getHead().appendChild(style);
}
/**
* Read jss nonce setting from the page if the user has set it.
*/
var getNonce = memoize(function() {
	var node = document.querySelector("meta[property=\"csp-nonce\"]");
	return node ? node.getAttribute("content") : null;
});
var _insertRule = function(container, rule, index) {
	try {
		if ("insertRule" in container) {
			container.insertRule(rule, index);
		} else if ("appendRule" in container) {
			container.appendRule(rule);
		}
	} catch {
		return false;
	}
	return container.cssRules[index];
};
var getValidRuleInsertionIndex = function(container, index) {
	var maxIndex = container.cssRules.length;
	if (index === void 0 || index > maxIndex) {
		// eslint-disable-next-line no-param-reassign
		return maxIndex;
	}
	return index;
};
var createStyle = function() {
	var el = document.createElement("style");
	// insert rules after we insert the style tag.
	// It seems to kick-off the source order specificity algorithm.
	el.textContent = "\n";
	return el;
};
var DomRenderer = function() {
	// Will be empty if link: true option is not set, because
	// it is only for use together with insertRule API.
	function DomRenderer(sheet) {
		this.getPropertyValue = getPropertyValue;
		this.setProperty = setProperty;
		this.removeProperty = removeProperty;
		this.setSelector = setSelector;
		this.hasInsertedRules = false;
		this.cssRules = [];
		// There is no sheet when the renderer is used from a standalone StyleRule.
		if (sheet) sheets.add(sheet);
		this.sheet = sheet;
		var _ref = this.sheet ? this.sheet.options : {}, media = _ref.media, meta = _ref.meta, element = _ref.element;
		this.element = element || createStyle();
		this.element.setAttribute("data-jss", "");
		if (media) this.element.setAttribute("media", media);
		if (meta) this.element.setAttribute("data-meta", meta);
		var nonce = getNonce();
		if (nonce) this.element.setAttribute("nonce", nonce);
	}
	/**
	* Insert style element into render tree.
	*/
	var _proto = DomRenderer.prototype;
	_proto.attach = function() {
		// In the case the element node is external and it is already in the DOM.
		if (this.element.parentNode || !this.sheet) return;
		insertStyle(this.element, this.sheet.options);
		// most browsers create a new CSSStyleSheet, except of all IEs.
		var deployed = Boolean(this.sheet && this.sheet.deployed);
		if (this.hasInsertedRules && deployed) {
			this.hasInsertedRules = false;
			this.deploy();
		}
	};
	_proto.detach = function() {
		if (!this.sheet) return;
		var parentNode = this.element.parentNode;
		if (parentNode) parentNode.removeChild(this.element);
		// Though IE will keep them and we need a consistent behavior.
		if (this.sheet.options.link) {
			this.cssRules = [];
			this.element.textContent = "\n";
		}
	};
	_proto.deploy = function() {
		var sheet = this.sheet;
		if (!sheet) return;
		if (sheet.options.link) {
			this.insertRules(sheet.rules);
			return;
		}
		this.element.textContent = "\n" + sheet.toString() + "\n";
	};
	_proto.insertRules = function(rules, nativeParent) {
		for (var i = 0; i < rules.index.length; i++) {
			this.insertRule(rules.index[i], i, nativeParent);
		}
	};
	_proto.insertRule = function(rule, index, nativeParent) {
		if (nativeParent === void 0) {
			nativeParent = this.element.sheet;
		}
		if (rule.rules) {
			var parent = rule;
			var latestNativeParent = nativeParent;
			if (rule.type === "conditional" || rule.type === "keyframes") {
				var _insertionIndex = getValidRuleInsertionIndex(nativeParent, index);
				latestNativeParent = _insertRule(nativeParent, parent.toString({ children: false }), _insertionIndex);
				if (latestNativeParent === false) {
					return false;
				}
				this.refCssRule(rule, _insertionIndex, latestNativeParent);
			}
			this.insertRules(parent.rules, latestNativeParent);
			return latestNativeParent;
		}
		var ruleStr = rule.toString();
		if (!ruleStr) return false;
		var insertionIndex = getValidRuleInsertionIndex(nativeParent, index);
		var nativeRule = _insertRule(nativeParent, ruleStr, insertionIndex);
		if (nativeRule === false) {
			return false;
		}
		this.hasInsertedRules = true;
		this.refCssRule(rule, insertionIndex, nativeRule);
		return nativeRule;
	};
	_proto.refCssRule = function(rule, index, cssRule) {
		rule.renderable = cssRule;
		// like rules inside media queries or keyframes
		if (rule.options.parent instanceof StyleSheet) {
			this.cssRules.splice(index, 0, cssRule);
		}
	};
	_proto.deleteRule = function(cssRule) {
		var sheet = this.element.sheet;
		var index = this.indexOf(cssRule);
		if (index === -1) return false;
		sheet.deleteRule(index);
		this.cssRules.splice(index, 1);
		return true;
	};
	_proto.indexOf = function(cssRule) {
		return this.cssRules.indexOf(cssRule);
	};
	_proto.replaceRule = function(cssRule, rule) {
		var index = this.indexOf(cssRule);
		if (index === -1) return false;
		this.element.sheet.deleteRule(index);
		this.cssRules.splice(index, 1);
		return this.insertRule(rule, index);
	};
	_proto.getRules = function() {
		return this.element.sheet.cssRules;
	};
	return DomRenderer;
}();
var Jss = function() {
	function Jss(options) {
		this.id = 1;
		this.version = "10.10.0";
		this.plugins = new PluginsRegistry();
		this.options = {
			id: { minify: false },
			createGenerateId,
			Renderer: isInBrowser ? DomRenderer : null,
			plugins: []
		};
		this.generateId = createGenerateId({ minify: false });
		for (var i = 0; i < 7; i++) {
			this.plugins.use(plugins$1[i], { queue: "internal" });
		}
		this.setup(options);
	}
	/**
	* Prepares various options, applies plugins.
	* Should not be used twice on the same instance, because there is no plugins
	* deduplication logic.
	*/
	var _proto = Jss.prototype;
	_proto.setup = function(options) {
		if (options === void 0) {
			options = {};
		}
		if (options.createGenerateId) {
			this.options.createGenerateId = options.createGenerateId;
		}
		if (options.id) {
			this.options.id = _extends({}, this.options.id, options.id);
		}
		if (options.createGenerateId || options.id) {
			this.generateId = this.options.createGenerateId(this.options.id);
		}
		if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint;
		if ("Renderer" in options) {
			this.options.Renderer = options.Renderer;
		}
		if (options.plugins) this.use.apply(this, options.plugins);
		return this;
	};
	_proto.createStyleSheet = function(styles, options) {
		if (options === void 0) {
			options = {};
		}
		var _options = options, index = _options.index;
		if (typeof index !== "number") {
			index = sheets.index === 0 ? 0 : sheets.index + 1;
		}
		var sheet = new StyleSheet(styles, _extends({}, options, {
			jss: this,
			generateId: options.generateId || this.generateId,
			insertionPoint: this.options.insertionPoint,
			Renderer: this.options.Renderer,
			index
		}));
		this.plugins.onProcessSheet(sheet);
		return sheet;
	};
	_proto.removeStyleSheet = function(sheet) {
		sheet.detach();
		sheets.remove(sheet);
		return this;
	};
	_proto.createRule = function(name, style, options) {
		if (style === void 0) {
			style = {};
		}
		if (options === void 0) {
			options = {};
		}
		// Enable rule without name for inline styles.
		if (typeof name === "object") {
			return this.createRule(void 0, name, style);
		}
		var ruleOptions = _extends({}, options, {
			name,
			jss: this,
			Renderer: this.options.Renderer
		});
		if (!ruleOptions.generateId) ruleOptions.generateId = this.generateId;
		if (!ruleOptions.classes) ruleOptions.classes = {};
		if (!ruleOptions.keyframes) ruleOptions.keyframes = {};
		var rule = createRule(name, style, ruleOptions);
		if (rule) this.plugins.onProcessRule(rule);
		return rule;
	};
	_proto.use = function() {
		var _this = this;
		for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
			plugins[_key] = arguments[_key];
		}
		plugins.forEach(function(plugin) {
			_this.plugins.use(plugin);
		});
		return this;
	};
	return Jss;
}();
var createJss = function(options) {
	return new Jss(options);
};
/**
* Export a constant indicating if this browser has CSSTOM support.
* https://developers.google.com/web/updates/2018/03/cssom
*/
var hasCSSTOMSupport = typeof CSS === "object" && CSS != null && "number" in CSS;
/**
* Extracts a styles object with only props that contain function values.
*/
function getDynamicStyles(styles) {
	var to = null;
	for (var key in styles) {
		var value = styles[key];
		var type = typeof value;
		if (type === "function") {
			if (!to) to = {};
			to[key] = value;
		} else if (type === "object" && value !== null && !Array.isArray(value)) {
			var extracted = getDynamicStyles(value);
			if (extracted) {
				if (!to) to = {};
				to[key] = extracted;
			}
		}
	}
	return to;
}
/**
* A better abstraction over CSS.
*
* @copyright Oleg Isonen (Slobodskoi) / Isonen 2014-present
* @website https://github.com/cssinjs/jss
* @license MIT
*/
createJss();
var now = Date.now();
var fnValuesNs = "fnValues" + now;
var fnRuleNs = "fnStyle" + (now + 1);
var functionPlugin = function() {
	return {
		onCreateRule: function(name, decl, options) {
			if (typeof decl !== "function") return null;
			var rule = createRule(name, {}, options);
			rule[fnRuleNs] = decl;
			return rule;
		},
		onProcessStyle: function(style, rule) {
			// We need to extract function values from the declaration, so that we can keep core unaware of them.
			// We need to do that only once.
			// We don't need to extract functions on each style update, since this can happen only once.
			// We don't support function values inside of function rules.
			if (fnValuesNs in rule || fnRuleNs in rule) return style;
			var fnValues = {};
			for (var prop in style) {
				var value = style[prop];
				if (typeof value !== "function") continue;
				delete style[prop];
				fnValues[prop] = value;
			}
			rule[fnValuesNs] = fnValues;
			return style;
		},
		onUpdate: function(data, rule, __unused_B395, options) {
			var styleRule = rule;
			var fnRule = styleRule[fnRuleNs];
			// will be returned from that function.
			if (fnRule) {
				// Empty object will remove all currently defined props
				// in case function rule returns a falsy value.
				styleRule.style = fnRule(data) || {};
			}
			var fnValues = styleRule[fnValuesNs];
			if (fnValues) {
				for (var _prop in fnValues) {
					styleRule.prop(_prop, fnValues[_prop](data), options);
				}
			}
		}
	};
};
var functions = functionPlugin;
var GlobalContainerRule = function() {
	function GlobalContainerRule(key, styles, options) {
		this.type = "global";
		this.at = "@global";
		this.isProcessed = false;
		this.key = key;
		this.options = options;
		this.rules = new RuleList(_extends({}, options, { parent: this }));
		for (var selector in styles) {
			this.rules.add(selector, styles[selector]);
		}
		this.rules.process();
	}
	/**
	* Get a rule.
	*/
	var _proto = GlobalContainerRule.prototype;
	_proto.getRule = function(name) {
		return this.rules.get(name);
	};
	_proto.addRule = function(name, style, options) {
		var rule = this.rules.add(name, style, options);
		if (rule) this.options.jss.plugins.onProcessRule(rule);
		return rule;
	};
	_proto.replaceRule = function(name, style, options) {
		var newRule = this.rules.replace(name, style, options);
		if (newRule) this.options.jss.plugins.onProcessRule(newRule);
		return newRule;
	};
	_proto.indexOf = function(rule) {
		return this.rules.indexOf(rule);
	};
	_proto.toString = function(options) {
		return this.rules.toString(options);
	};
	return GlobalContainerRule;
}();
var GlobalPrefixedRule = function() {
	function GlobalPrefixedRule(key, style, options) {
		this.type = "global";
		this.at = "@global";
		this.isProcessed = false;
		this.key = key;
		this.options = options;
		var selector = key.substr(8);
		this.rule = options.jss.createRule(selector, style, _extends({}, options, { parent: this }));
	}
	var _proto2 = GlobalPrefixedRule.prototype;
	_proto2.toString = function(options) {
		return this.rule ? this.rule.toString(options) : "";
	};
	return GlobalPrefixedRule;
}();
var separatorRegExp$1 = /\s*,\s*/g;
function addScope(selector, scope) {
	var parts = selector.split(separatorRegExp$1);
	var scoped = "";
	for (var i = 0; i < parts.length; i++) {
		scoped += scope + " " + parts[i].trim();
		if (parts[i + 1]) scoped += ", ";
	}
	return scoped;
}
function handleNestedGlobalContainerRule(rule, sheet) {
	var options = rule.options, style = rule.style;
	var rules = style ? style["@global"] : null;
	if (!rules) return;
	for (var name in rules) {
		sheet.addRule(name, rules[name], _extends({}, options, { selector: addScope(name, rule.selector) }));
	}
	delete style["@global"];
}
function handlePrefixedGlobalRule(rule, sheet) {
	var options = rule.options, style = rule.style;
	for (var prop in style) {
		if (prop[0] !== "@" || prop.substr(0, 7) !== "@global") continue;
		var selector = addScope(prop.substr(7), rule.selector);
		sheet.addRule(selector, style[prop], _extends({}, options, { selector }));
		delete style[prop];
	}
}
/**
* Convert nested rules to separate, remove them from original styles.
*/
function jssGlobal() {
	function onCreateRule(name, styles, options) {
		if (!name) return null;
		if (name === "@global") {
			return new GlobalContainerRule(name, styles, options);
		}
		if (name[0] === "@" && name.substr(0, 8) === "@global ") {
			return new GlobalPrefixedRule(name, styles, options);
		}
		var parent = options.parent;
		if (parent) {
			if (parent.type === "global" || parent.options.parent && parent.options.parent.type === "global") {
				options.scoped = false;
			}
		}
		if (!options.selector && options.scoped === false) {
			options.selector = name;
		}
		return null;
	}
	function onProcessRule(rule, sheet) {
		if (rule.type !== "style" || !sheet) return;
		handleNestedGlobalContainerRule(rule, sheet);
		handlePrefixedGlobalRule(rule, sheet);
	}
	return {
		onCreateRule,
		onProcessRule
	};
}
var separatorRegExp = /\s*,\s*/g;
var parentRegExp = /&/g;
var refRegExp = /\$([\w-]+)/g;
/**
* Convert nested rules to separate, remove them from original styles.
*/
function jssNested() {
	// Get a function to be used for $ref replacement.
	function getReplaceRef(container, sheet) {
		return function(__unused_278F, key) {
			var rule = container.getRule(key) || sheet && sheet.getRule(key);
			if (rule) {
				return rule.selector;
			}
			return key;
		};
	}
	function replaceParentRefs(nestedProp, parentProp) {
		var parentSelectors = parentProp.split(separatorRegExp);
		var nestedSelectors = nestedProp.split(separatorRegExp);
		var result = "";
		for (var i = 0; i < parentSelectors.length; i++) {
			var parent = parentSelectors[i];
			for (var j = 0; j < nestedSelectors.length; j++) {
				var nested = nestedSelectors[j];
				if (result) result += ", ";
				result += nested.indexOf("&") !== -1 ? nested.replace(parentRegExp, parent) : parent + " " + nested;
			}
		}
		return result;
	}
	function getOptions(rule, container, prevOptions) {
		// Options has been already created, now we only increase index.
		if (prevOptions) return _extends({}, prevOptions, { index: prevOptions.index + 1 });
		var nestingLevel = rule.options.nestingLevel;
		nestingLevel = nestingLevel === void 0 ? 1 : nestingLevel + 1;
		var options = _extends({}, rule.options, {
			nestingLevel,
			index: container.indexOf(rule) + 1
		});
		delete options.name;
		return options;
	}
	function onProcessStyle(style, rule, sheet) {
		if (rule.type !== "style") return style;
		var styleRule = rule;
		var container = styleRule.options.parent;
		var options;
		var replaceRef;
		for (var prop in style) {
			var isNested = prop.indexOf("&") !== -1;
			var isNestedConditional = prop[0] === "@";
			if (!isNested && !isNestedConditional) continue;
			options = getOptions(styleRule, container, options);
			if (isNested) {
				var selector = replaceParentRefs(prop, styleRule.selector);
				// all nested rules within the sheet.
				if (!replaceRef) replaceRef = getReplaceRef(container, sheet);
				selector = selector.replace(refRegExp, replaceRef);
				var name = styleRule.key + "-" + prop;
				if ("replaceRule" in container) {
					// for backward compatibility
					container.replaceRule(name, style[prop], _extends({}, options, { selector }));
				} else {
					container.addRule(name, style[prop], _extends({}, options, { selector }));
				}
			} else if (isNestedConditional) {
				// Place conditional right after the parent rule to ensure right ordering.
				container.addRule(prop, {}, options).addRule(styleRule.key, style[prop], { selector: styleRule.selector });
			}
			delete style[prop];
		}
		return style;
	}
	return { onProcessStyle };
}
/* eslint-disable no-var, prefer-template */
var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache$2 = {};
function toHyphenLower(match) {
	return "-" + match.toLowerCase();
}
function hyphenateStyleName(name) {
	if (cache$2.hasOwnProperty(name)) {
		return cache$2[name];
	}
	var hName = name.replace(uppercasePattern, toHyphenLower);
	return cache$2[name] = msPattern.test(hName) ? "-" + hName : hName;
}
/**
* Convert camel cased property names to dash separated.
*/
function convertCase(style) {
	var converted = {};
	for (var prop in style) {
		var key = prop.indexOf("--") === 0 ? prop : hyphenateStyleName(prop);
		converted[key] = style[prop];
	}
	if (style.fallbacks) {
		if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase);
		else converted.fallbacks = convertCase(style.fallbacks);
	}
	return converted;
}
/**
* Allow camel cased property names by converting them back to dasherized.
*/
function camelCase() {
	function onProcessStyle(style) {
		if (Array.isArray(style)) {
			// Handle rules like @font-face, which can have multiple styles in an array
			for (var index = 0; index < style.length; index++) {
				style[index] = convertCase(style[index]);
			}
			return style;
		}
		return convertCase(style);
	}
	function onChangeValue(value, prop, rule) {
		if (prop.indexOf("--") === 0) {
			return value;
		}
		var hyphenatedProp = hyphenateStyleName(prop);
		if (prop === hyphenatedProp) return value;
		rule.prop(hyphenatedProp, value);
		return null;
	}
	return {
		onProcessStyle,
		onChangeValue
	};
}
var px = hasCSSTOMSupport && CSS ? CSS.px : "px";
var ms = hasCSSTOMSupport && CSS ? CSS.ms : "ms";
var percent = hasCSSTOMSupport && CSS ? CSS.percent : "%";
/**
* Generated jss-plugin-default-unit CSS property units
*/
var defaultUnits = {
	"animation-delay": ms,
	"animation-duration": ms,
	"background-position": px,
	"background-position-x": px,
	"background-position-y": px,
	"background-size": px,
	border: px,
	"border-bottom": px,
	"border-bottom-left-radius": px,
	"border-bottom-right-radius": px,
	"border-bottom-width": px,
	"border-left": px,
	"border-left-width": px,
	"border-radius": px,
	"border-right": px,
	"border-right-width": px,
	"border-top": px,
	"border-top-left-radius": px,
	"border-top-right-radius": px,
	"border-top-width": px,
	"border-width": px,
	"border-block": px,
	"border-block-end": px,
	"border-block-end-width": px,
	"border-block-start": px,
	"border-block-start-width": px,
	"border-block-width": px,
	"border-inline": px,
	"border-inline-end": px,
	"border-inline-end-width": px,
	"border-inline-start": px,
	"border-inline-start-width": px,
	"border-inline-width": px,
	"border-start-start-radius": px,
	"border-start-end-radius": px,
	"border-end-start-radius": px,
	"border-end-end-radius": px,
	margin: px,
	"margin-bottom": px,
	"margin-left": px,
	"margin-right": px,
	"margin-top": px,
	"margin-block": px,
	"margin-block-end": px,
	"margin-block-start": px,
	"margin-inline": px,
	"margin-inline-end": px,
	"margin-inline-start": px,
	padding: px,
	"padding-bottom": px,
	"padding-left": px,
	"padding-right": px,
	"padding-top": px,
	"padding-block": px,
	"padding-block-end": px,
	"padding-block-start": px,
	"padding-inline": px,
	"padding-inline-end": px,
	"padding-inline-start": px,
	"mask-position-x": px,
	"mask-position-y": px,
	"mask-size": px,
	height: px,
	width: px,
	"min-height": px,
	"max-height": px,
	"min-width": px,
	"max-width": px,
	bottom: px,
	left: px,
	top: px,
	right: px,
	inset: px,
	"inset-block": px,
	"inset-block-end": px,
	"inset-block-start": px,
	"inset-inline": px,
	"inset-inline-end": px,
	"inset-inline-start": px,
	"box-shadow": px,
	"text-shadow": px,
	"column-gap": px,
	"column-rule": px,
	"column-rule-width": px,
	"column-width": px,
	"font-size": px,
	"font-size-delta": px,
	"letter-spacing": px,
	"text-decoration-thickness": px,
	"text-indent": px,
	"text-stroke": px,
	"text-stroke-width": px,
	"word-spacing": px,
	motion: px,
	"motion-offset": px,
	outline: px,
	"outline-offset": px,
	"outline-width": px,
	perspective: px,
	"perspective-origin-x": percent,
	"perspective-origin-y": percent,
	"transform-origin": percent,
	"transform-origin-x": percent,
	"transform-origin-y": percent,
	"transform-origin-z": percent,
	"transition-delay": ms,
	"transition-duration": ms,
	"vertical-align": px,
	"flex-basis": px,
	"shape-margin": px,
	size: px,
	gap: px,
	grid: px,
	"grid-gap": px,
	"row-gap": px,
	"grid-row-gap": px,
	"grid-column-gap": px,
	"grid-template-rows": px,
	"grid-template-columns": px,
	"grid-auto-rows": px,
	"grid-auto-columns": px,
	"box-shadow-x": px,
	"box-shadow-y": px,
	"box-shadow-blur": px,
	"box-shadow-spread": px,
	"font-line-height": px,
	"text-shadow-x": px,
	"text-shadow-y": px,
	"text-shadow-blur": px
};
/**
* Clones the object and adds a camel cased property version.
*/
function addCamelCasedVersion(obj) {
	var regExp = /(-[a-z])/g;
	var replace = function(str) {
		return str[1].toUpperCase();
	};
	var newObj = {};
	for (var key in obj) {
		newObj[key] = obj[key];
		newObj[key.replace(regExp, replace)] = obj[key];
	}
	return newObj;
}
var units = addCamelCasedVersion(defaultUnits);
/**
* Recursive deep style passing function
*/
function iterate(prop, value, options) {
	if (value == null) return value;
	if (Array.isArray(value)) {
		for (var i = 0; i < value.length; i++) {
			value[i] = iterate(prop, value[i], options);
		}
	} else if (typeof value === "object") {
		if (prop === "fallbacks") {
			for (var innerProp in value) {
				value[innerProp] = iterate(innerProp, value[innerProp], options);
			}
		} else {
			for (var _innerProp in value) {
				value[_innerProp] = iterate(prop + "-" + _innerProp, value[_innerProp], options);
			}
		}
	} else if (typeof value === "number" && isNaN(value) === false) {
		var unit = options[prop] || units[prop];
		if (unit && !(value === 0 && unit === px)) {
			return typeof unit === "function" ? unit(value).toString() : "" + value + unit;
		}
		return value.toString();
	}
	return value;
}
/**
* Add unit to numeric values.
*/
function defaultUnit() {
	var camelCasedOptions = addCamelCasedVersion();
	function onProcessStyle(style, rule) {
		if (rule.type !== "style") return style;
		for (var prop in style) {
			style[prop] = iterate(prop, style[prop], camelCasedOptions);
		}
		return style;
	}
	function onChangeValue(value, prop) {
		return iterate(prop, value, camelCasedOptions);
	}
	return {
		onProcessStyle,
		onChangeValue
	};
}
// Export javascript style and css style vendor prefixes.
var js = "";
var css = "";
var vendor = "a";
var browser = "a";
var isTouch = isInBrowser && "ontouchstart" in document.documentElement;
if (isInBrowser) {
	// Order matters. We need to check Webkit the last one because
	// other vendors use to add Webkit prefixes to some properties
	var jsCssMap = {
		Moz: "-moz-",
		ms: "-ms-",
		O: "-o-",
		Webkit: "-webkit-"
	};
	var _document$createEleme = document.createElement("p"), style = _document$createEleme.style;
	var testProp = "Transform";
	for (var key in jsCssMap) {
		if (key + testProp in style) {
			js = key;
			css = jsCssMap[key];
			break;
		}
	}
	if (js === "Webkit" && "msHyphens" in style) {
		js = "ms";
		css = "-ms-";
		browser = "b";
	}
	if (js === "Webkit" && "-apple-trailing-word" in style) {
		vendor = "b";
	}
}
/**
* Vendor prefix string for the current browser.
*
* @type {{js: String, css: String, vendor: String, browser: String}}
* @api public
*/
var prefix = {
	a: js,
	b: css,
	c: vendor,
	d: browser,
	e: isTouch
};
/**
* Test if a keyframe at-rule should be prefixed or not
*
* @param {String} vendor prefix string for the current browser.
* @return {String}
* @api public
*/
function supportedKeyframes(key) {
	// Keyframes is already prefixed. e.g. key = '@-webkit-keyframes a'
	if (key[1] === "-") return key;
	// https://caniuse.com/#search=keyframes
	if (prefix.a === "ms") return key;
	return "@" + prefix.b + "keyframes" + key.substr(10);
}
// https://caniuse.com/#search=appearance
var appearence = {
	noPrefill: ["appearance"],
	supportedProperty: function(prop) {
		if (prop !== "appearance") return false;
		if (prefix.a === "ms") return "-webkit-" + prop;
		return prefix.b + prop;
	}
};
// https://caniuse.com/#search=color-adjust
var colorAdjust = {
	noPrefill: ["color-adjust"],
	supportedProperty: function(prop) {
		if (prop !== "color-adjust") return false;
		if (prefix.a === "Webkit") return prefix.b + "print-" + prop;
		return prop;
	}
};
var regExp = /[-\s]+(.)?/g;
/**
* Replaces the letter with the capital letter
*
* @param {String} match
* @param {String} c
* @return {String}
* @api private
*/
function toUpper(__unused_5D23, c) {
	return c ? c.toUpperCase() : "";
}
/**
* Convert dash separated strings to camel-cased.
*
* @param {String} str
* @return {String}
* @api private
*/
function camelize(str) {
	return str.replace(regExp, toUpper);
}
/**
* Convert dash separated strings to pascal cased.
*
* @param {String} str
* @return {String}
* @api private
*/
function pascalize(str) {
	return camelize("-" + str);
}
// but we can use a longhand property instead.
// https://caniuse.com/#search=mask
var mask = {
	noPrefill: ["mask"],
	supportedProperty: function(prop, style) {
		if (!/^mask/.test(prop)) return false;
		if (prefix.a === "Webkit") {
			var longhand = "mask-image";
			if (camelize(longhand) in style) {
				return prop;
			}
			if (prefix.a + pascalize(longhand) in style) {
				return prefix.b + prop;
			}
		}
		return prop;
	}
};
// https://caniuse.com/#search=text-orientation
var textOrientation = {
	noPrefill: ["text-orientation"],
	supportedProperty: function(prop) {
		if (prop !== "text-orientation") return false;
		if (prefix.c === "b" && !prefix.e) {
			return prefix.b + prop;
		}
		return prop;
	}
};
// https://caniuse.com/#search=transform
var transform = {
	noPrefill: ["transform"],
	supportedProperty: function(prop, __unused_507A, options) {
		if (prop !== "transform") return false;
		if (options.transform) {
			return prop;
		}
		return prefix.b + prop;
	}
};
// https://caniuse.com/#search=transition
var transition = {
	noPrefill: ["transition"],
	supportedProperty: function(prop, __unused_507A_0, options) {
		if (prop !== "transition") return false;
		if (options.transition) {
			return prop;
		}
		return prefix.b + prop;
	}
};
// https://caniuse.com/#search=writing-mode
var writingMode = {
	noPrefill: ["writing-mode"],
	supportedProperty: function(prop) {
		if (prop !== "writing-mode") return false;
		if (prefix.a === "Webkit" || prefix.a === "ms" && prefix.d !== "a") {
			return prefix.b + prop;
		}
		return prop;
	}
};
// https://caniuse.com/#search=user-select
var userSelect = {
	noPrefill: ["user-select"],
	supportedProperty: function(prop) {
		if (prop !== "user-select") return false;
		if (prefix.a === "Moz" || prefix.a === "ms" || prefix.c === "b") {
			return prefix.b + prop;
		}
		return prop;
	}
};
// https://caniuse.com/#search=multicolumn
// https://github.com/postcss/autoprefixer/issues/491
// https://github.com/postcss/autoprefixer/issues/177
var breakPropsOld = { supportedProperty: function(prop, style) {
	if (!/^break-/.test(prop)) return false;
	if (prefix.a === "Webkit") {
		var jsProp = "WebkitColumn" + pascalize(prop);
		return jsProp in style ? prefix.b + "column-" + prop : false;
	}
	if (prefix.a === "Moz") {
		var _jsProp = "page" + pascalize(prop);
		return _jsProp in style ? "page-" + prop : false;
	}
	return false;
} };
// See https://github.com/postcss/autoprefixer/issues/324.
var inlineLogicalOld = { supportedProperty: function(prop, style) {
	if (!/^(border|margin|padding)-inline/.test(prop)) return false;
	if (prefix.a === "Moz") return prop;
	var newProp = prop.replace("-inline", "");
	return prefix.a + pascalize(newProp) in style ? prefix.b + newProp : false;
} };
// Camelization is required because we can't test using.
// CSS syntax for e.g. in FF.
var unprefixed = { supportedProperty: function(prop, style) {
	return camelize(prop) in style ? prop : false;
} };
var prefixed = { supportedProperty: function(prop, style) {
	var pascalized = pascalize(prop);
	if (prop[0] === "-") return prop;
	if (prop[0] === "-" && prop[1] === "-") return prop;
	if (prefix.a + pascalized in style) return prefix.b + prop;
	if (prefix.a !== "Webkit" && "Webkit" + pascalized in style) return "-webkit-" + prop;
	return false;
} };
// https://caniuse.com/#search=scroll-snap
var scrollSnap = { supportedProperty: function(prop) {
	if (prop.substring(0, 11) !== "scroll-snap") return false;
	if (prefix.a === "ms") {
		return "" + prefix.b + prop;
	}
	return prop;
} };
// https://caniuse.com/#search=overscroll-behavior
var overscrollBehavior = { supportedProperty: function(prop) {
	if (prop !== "overscroll-behavior") return false;
	if (prefix.a === "ms") {
		return prefix.b + "scroll-chaining";
	}
	return prop;
} };
var propMap = {
	"flex-grow": "flex-positive",
	"flex-shrink": "flex-negative",
	"flex-basis": "flex-preferred-size",
	"justify-content": "flex-pack",
	order: "flex-order",
	"align-items": "flex-align",
	"align-content": "flex-line-pack"
};
var flex2012 = { supportedProperty: function(prop, style) {
	var newProp = propMap[prop];
	if (!newProp) return false;
	return prefix.a + pascalize(newProp) in style ? prefix.b + newProp : false;
} };
var propMap$1 = {
	flex: "box-flex",
	"flex-grow": "box-flex",
	"flex-direction": ["box-orient", "box-direction"],
	order: "box-ordinal-group",
	"align-items": "box-align",
	"flex-flow": ["box-orient", "box-direction"],
	"justify-content": "box-pack"
};
var propKeys = Object.keys(propMap$1);
var prefixCss = function(p) {
	return prefix.b + p;
};
var flex2009 = { supportedProperty: function(prop, style, _ref) {
	var multiple = _ref.multiple;
	if (propKeys.indexOf(prop) > -1) {
		var newProp = propMap$1[prop];
		if (!Array.isArray(newProp)) {
			return prefix.a + pascalize(newProp) in style ? prefix.b + newProp : false;
		}
		if (!multiple) return false;
		for (var i = 0; i < newProp.length; i++) {
			if (!(prefix.a + pascalize(newProp[0]) in style)) {
				return false;
			}
		}
		return newProp.map(prefixCss);
	}
	return false;
} };
// plugins = [
//   ...plugins,
//    breakPropsOld,
//    inlineLogicalOld,
//    unprefixed,
//    prefixed,
//    scrollSnap,
//    flex2012,
//    flex2009
// ]
// Plugins without 'noPrefill' value, going last.
// 'flex-*' plugins should be at the bottom.
// 'flex2009' going after 'flex2012'.
// 'prefixed' going after 'unprefixed'
var plugins = [
	appearence,
	colorAdjust,
	mask,
	textOrientation,
	transform,
	transition,
	writingMode,
	userSelect,
	breakPropsOld,
	inlineLogicalOld,
	unprefixed,
	prefixed,
	scrollSnap,
	overscrollBehavior,
	flex2012,
	flex2009
];
var propertyDetectors = plugins.filter(function(p) {
	return p.supportedProperty;
}).map(function(p) {
	return p.supportedProperty;
});
var noPrefill = plugins.filter(function(p) {
	return p.noPrefill;
}).reduce(function(a, p) {
	a.push.apply(a, _toConsumableArray(p.noPrefill));
	return a;
}, []);
var el;
var cache = {};
if (isInBrowser) {
	el = document.createElement("p");
	// Once tested, result is cached. It gives us up to 70% perf boost.
	// http://jsperf.com/element-style-object-access-vs-plain-object
	//
	// Prefill cache with known css properties to reduce amount of
	// properties we need to feature test at runtime.
	// http://davidwalsh.name/vendor-prefix
	var computed = window.getComputedStyle(document.documentElement, "");
	for (var key$1 in computed) {
		// eslint-disable-next-line no-restricted-globals
		if (!isNaN(key$1)) cache[computed[key$1]] = computed[key$1];
	}
	// cache prefill method.
	noPrefill.forEach(function(x) {
		return delete cache[x], true;
	});
}
/**
* Test if a property is supported, returns supported property with vendor
* prefix if required. Returns `false` if not supported.
*
* @param {String} prop dash separated
* @param {Object} [options]
* @return {String|Boolean}
* @api public
*/
function supportedProperty(prop, options) {
	{
		{
			options = {};
		}
	}
	// For server-side rendering.
	if (!el) return prop;
	if (cache[prop] != null) {
		return cache[prop];
	}
	if (prop === "transition" || prop === "transform") {
		options[prop] = prop in el.style;
	}
	for (var i = 0; i < propertyDetectors.length; i++) {
		cache[prop] = propertyDetectors[i](prop, el.style, options);
		if (cache[prop]) break;
	}
	// Firefox can even throw an error for invalid properties, e.g., "0".
	try {
		el.style[prop] = "";
	} catch {
		return false;
	}
	return cache[prop];
}
var cache$1 = {};
var transitionProperties = {
	transition: 1,
	"transition-property": 1,
	"-webkit-transition": 1,
	"-webkit-transition-property": 1
};
var transPropsRegExp = /(^\s*[\w-]+)|, (\s*[\w-]+)(?![^()]*\))/g;
var el$1;
/**
* Returns prefixed value transition/transform if needed.
*
* @param {String} match
* @param {String} p1
* @param {String} p2
* @return {String}
* @api private
*/
function prefixTransitionCallback(__unused_D10E, p1, p2) {
	if (p1 === "var") return "var";
	if (p1 === "all") return "all";
	if (p2 === "all") return ", all";
	var prefixedValue = p1 ? supportedProperty(p1) : ", " + supportedProperty(p2);
	if (!prefixedValue) return p1 || p2;
	return prefixedValue;
}
if (isInBrowser) el$1 = document.createElement("p");
/**
* Returns prefixed value if needed. Returns `false` if value is not supported.
*
* @param {String} property
* @param {String} value
* @return {String|Boolean}
* @api public
*/
function supportedValue(property, value) {
	// For server-side rendering.
	var prefixedValue = value;
	if (!el$1 || property === "content") return value;
	// We want only prefixable values here.
	// eslint-disable-next-line no-restricted-globals
	if (typeof prefixedValue !== "string" || !isNaN(parseInt(prefixedValue, 10))) {
		return prefixedValue;
	}
	var cacheKey = property + prefixedValue;
	if (cache$1[cacheKey] != null) {
		return cache$1[cacheKey];
	}
	try {
		// Test value as it is.
		el$1.style[property] = prefixedValue;
	} catch {
		// Return false if value not supported.
		cache$1[cacheKey] = false;
		return false;
	}
	if (transitionProperties[property]) {
		prefixedValue = prefixedValue.replace(transPropsRegExp, prefixTransitionCallback);
	} else if (el$1.style[property] === "") {
		// Value with a vendor prefix.
		prefixedValue = prefix.b + prefixedValue;
		if (prefixedValue === "-ms-flex") el$1.style[property] = "-ms-flexbox";
		el$1.style[property] = prefixedValue;
		if (el$1.style[property] === "") {
			cache$1[cacheKey] = false;
			return false;
		}
	}
	el$1.style[property] = "";
	cache$1[cacheKey] = prefixedValue;
	return cache$1[cacheKey];
}
/**
* Add vendor prefix to a property name when needed.
*/
function jssVendorPrefixer() {
	function onProcessRule(rule) {
		if (rule.type === "keyframes") {
			var atRule = rule;
			atRule.at = supportedKeyframes(atRule.at);
		}
	}
	function prefixStyle(style) {
		for (var prop in style) {
			var value = style[prop];
			if (prop === "fallbacks" && Array.isArray(value)) {
				style[prop] = value.map(prefixStyle);
				continue;
			}
			var changeProp = false;
			var supportedProp = supportedProperty(prop);
			if (supportedProp && supportedProp !== prop) changeProp = true;
			var changeValue = false;
			var supportedValue$1 = supportedValue(supportedProp, toCssValue(value));
			if (supportedValue$1 && supportedValue$1 !== value) changeValue = true;
			if (changeProp || changeValue) {
				if (changeProp) delete style[prop];
				style[supportedProp || prop] = supportedValue$1 || value;
			}
		}
		return style;
	}
	function onProcessStyle(style, rule) {
		if (rule.type !== "style") return style;
		return prefixStyle(style);
	}
	function onChangeValue(value, prop) {
		return supportedValue(prop, toCssValue(value)) || value;
	}
	return {
		onProcessRule,
		onProcessStyle,
		onChangeValue
	};
}
/**
* Sort props by length.
*/
function jssPropsSort() {
	var sort = function(prop0, prop1) {
		if (prop0.length === prop1.length) {
			return prop0 > prop1 ? 1 : -1;
		}
		return prop0.length - prop1.length;
	};
	return { onProcessStyle: function(style, rule) {
		if (rule.type !== "style") return style;
		var newStyle = {};
		var props = Object.keys(style).sort(sort);
		for (var i = 0; i < props.length; i++) {
			newStyle[props[i]] = style[props[i]];
		}
		return newStyle;
	} };
}
function jssPreset() {
	return { plugins: [
		functions(),
		jssGlobal(),
		jssNested(),
		camelCase(),
		defaultUnit(),
		typeof window === "undefined" ? null : jssVendorPrefixer(),
		jssPropsSort()
	] };
}
var react = {};
var react_production = {};
function requireReact_production() {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = { a: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
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
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = false;
		if (null === children) invokeCallback = true;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = true;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = true;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func) {
		if (null == children) return;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(0, child, count++), void 0;
		});
		return;
	}
	var Children = { a: function(children, forEachFunc) {
		mapChildren(children, function() {
			forEachFunc.apply(0, arguments);
		});
	} };
	react_production.b = Children;
	react_production.i = ReactSharedInternals;
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
	react_production.q = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	react_production.z = function(Context) {
		return ReactSharedInternals.a.useContext(Context);
	};
	react_production.C = function(create, deps) {
		return ReactSharedInternals.a.useEffect(create, deps);
	};
	react_production.I = function(create, deps) {
		return ReactSharedInternals.a.useMemo(create, deps);
	};
	react_production.L = function(initialValue) {
		return ReactSharedInternals.a.useRef(initialValue);
	};
	return react_production;
}
var hasRequiredReact;
function requireReact() {
	if (hasRequiredReact) return react.a;
	hasRequiredReact = 1;
	{
		react.a = requireReact_production();
	}
	return react.a;
}
var reactExports = requireReact();
var React = getDefaultExportFromCjs(reactExports);
function mergeClasses() {
	var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var baseClasses = options.baseClasses, newClasses = options.newClasses;
	if (!newClasses) {
		return baseClasses;
	}
	var nextClasses = _extends({}, baseClasses);
	Object.keys(newClasses).forEach(function(key) {
		if (newClasses[key]) {
			nextClasses[key] = "".concat(baseClasses[key], " ").concat(newClasses[key]);
		}
	});
	return nextClasses;
}
// Used https://github.com/thinkloop/multi-key-cache as inspiration
var multiKeyStore = {
	a: function(cache, key1, key2, value) {
		var subCache = cache.get(key1);
		if (!subCache) {
			subCache = new Map();
			cache.set(key1, subCache);
		}
		subCache.set(key2, value);
	},
	b: function(cache, key1, key2) {
		var subCache = cache.get(key1);
		return subCache ? subCache.get(key2) : void 0;
	},
	c: function(cache, key1, key2) {
		var subCache = cache.get(key1);
		subCache.delete(key2);
	}
};
var multiKeyStore$1 = multiKeyStore;
var ThemeContext = React.n(null);
var ThemeContext$1 = ThemeContext;
function useTheme() {
	var theme = React.z(ThemeContext$1);
	return theme;
}
var jss = createJss(jssPreset());
//
// The counter-based approach doesn't tolerate any mistake.
// It's much safer to use the same counter everywhere.
var generateClassName = createGenerateClassName();
var sheetsManager = new Map();
var defaultOptions = {
	disableGeneration: false,
	generateClassName,
	jss,
	sheetsCache: null,
	sheetsManager,
	sheetsRegistry: null
};
var StylesContext = React.n(defaultOptions);
/* eslint-disable import/prefer-default-export */
// Global index counter to preserve source order.
// We create the style sheet during the creation of the component,
// children are handled after the parents, so the order of style elements would be parent->child.
// It is a problem though when a parent passes a className
// which needs to override any child's styles.
// StyleSheet of the child has a higher specificity, because of the source order.
// So our solution is to render sheets them in the reverse order child->sheet, so
// that parent has a higher specificity.
var indexCounter = -1e9;
function increment() {
	indexCounter += 1;
	return indexCounter;
}
// We use the same empty object to ref count the styles that don't need a theme object.
var noopTheme = {};
var noopTheme$1 = noopTheme;
function getStylesCreator(stylesOrCreator) {
	var themingEnabled = typeof stylesOrCreator === "function";
	return { create: function(theme, name) {
		var styles;
		try {
			styles = themingEnabled ? stylesOrCreator(theme) : stylesOrCreator;
		} catch (err) {
			throw err;
		}
		if (!name || !theme.overrides || !theme.overrides[name]) {
			return styles;
		}
		var overrides = theme.overrides[name];
		var stylesWithOverrides = _extends({}, styles);
		Object.keys(overrides).forEach(function(key) {
			stylesWithOverrides[key] = deepmerge(stylesWithOverrides[key], overrides[key]);
		});
		return stylesWithOverrides;
	} };
}
function getClasses(_ref, classes, Component) {
	var state = _ref.state, stylesOptions = _ref.stylesOptions;
	if (stylesOptions.disableGeneration) {
		return classes || {};
	}
	if (!state.cacheClasses) {
		state.cacheClasses = {
			value: null,
			lastProp: null,
			lastJSS: {}
		};
	}
	// requiring the generation of a new finalized classes object.
	var generate = false;
	if (state.classes !== state.cacheClasses.lastJSS) {
		state.cacheClasses.lastJSS = state.classes;
		generate = true;
	}
	if (classes !== state.cacheClasses.lastProp) {
		state.cacheClasses.lastProp = classes;
		generate = true;
	}
	if (generate) {
		state.cacheClasses.value = mergeClasses({
			baseClasses: state.cacheClasses.lastJSS,
			newClasses: classes,
			Component
		});
	}
	return state.cacheClasses.value;
}
function attach(_ref2, props) {
	var state = _ref2.state, theme = _ref2.theme, stylesOptions = _ref2.stylesOptions, stylesCreator = _ref2.stylesCreator, name = _ref2.name;
	if (stylesOptions.disableGeneration) {
		return;
	}
	var sheetManager = multiKeyStore$1.b(stylesOptions.sheetsManager, stylesCreator, theme);
	if (!sheetManager) {
		sheetManager = {
			refs: 0,
			staticSheet: null,
			dynamicStyles: null
		};
		multiKeyStore$1.a(stylesOptions.sheetsManager, stylesCreator, theme, sheetManager);
	}
	var options = _extends({}, stylesCreator.options, stylesOptions, {
		theme,
		flip: typeof stylesOptions.flip === "boolean" ? stylesOptions.flip : theme.direction === "rtl"
	});
	options.generateId = options.serverGenerateClassName || options.generateClassName;
	var sheetsRegistry = stylesOptions.sheetsRegistry;
	if (sheetManager.refs === 0) {
		var staticSheet;
		if (stylesOptions.sheetsCache) {
			staticSheet = multiKeyStore$1.b(stylesOptions.sheetsCache, stylesCreator, theme);
		}
		var styles = stylesCreator.create(theme, name);
		if (!staticSheet) {
			staticSheet = stylesOptions.jss.createStyleSheet(styles, _extends({ link: false }, options));
			staticSheet.attach();
			if (stylesOptions.sheetsCache) {
				multiKeyStore$1.a(stylesOptions.sheetsCache, stylesCreator, theme, staticSheet);
			}
		}
		if (sheetsRegistry) {
			sheetsRegistry.add(staticSheet);
		}
		sheetManager.staticSheet = staticSheet;
		sheetManager.dynamicStyles = getDynamicStyles(styles);
	}
	if (sheetManager.dynamicStyles) {
		var dynamicSheet = stylesOptions.jss.createStyleSheet(sheetManager.dynamicStyles, _extends({ link: true }, options));
		dynamicSheet.update(props);
		dynamicSheet.attach();
		state.dynamicSheet = dynamicSheet;
		state.classes = mergeClasses({
			baseClasses: sheetManager.staticSheet.classes,
			newClasses: dynamicSheet.classes
		});
		if (sheetsRegistry) {
			sheetsRegistry.add(dynamicSheet);
		}
	} else {
		state.classes = sheetManager.staticSheet.classes;
	}
	sheetManager.refs += 1;
}
function update(_ref3, props) {
	var state = _ref3.state;
	if (state.dynamicSheet) {
		state.dynamicSheet.update(props);
	}
}
function detach(_ref4) {
	var state = _ref4.state, theme = _ref4.theme, stylesOptions = _ref4.stylesOptions, stylesCreator = _ref4.stylesCreator;
	if (stylesOptions.disableGeneration) {
		return;
	}
	var sheetManager = multiKeyStore$1.b(stylesOptions.sheetsManager, stylesCreator, theme);
	sheetManager.refs -= 1;
	var sheetsRegistry = stylesOptions.sheetsRegistry;
	if (sheetManager.refs === 0) {
		multiKeyStore$1.c(stylesOptions.sheetsManager, stylesCreator, theme);
		stylesOptions.jss.removeStyleSheet(sheetManager.staticSheet);
		if (sheetsRegistry) {
			sheetsRegistry.remove(sheetManager.staticSheet);
		}
	}
	if (state.dynamicSheet) {
		stylesOptions.jss.removeStyleSheet(state.dynamicSheet);
		if (sheetsRegistry) {
			sheetsRegistry.remove(state.dynamicSheet);
		}
	}
}
function useSynchronousEffect(func, values) {
	var key = React.L([]);
	var output;
	var currentKey = React.I(function() {
		return {};
	}, values);
	// "the first render", or "memo dropped the value"
	if (key.current !== currentKey) {
		key.current = currentKey;
		output = func();
	}
	React.C(function() {
		return function() {
			if (output) {
				output();
			}
		};
	}, [currentKey]);
}
function makeStyles(stylesOrCreator) {
	var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var name = options.name, classNamePrefixOption = options.classNamePrefix, Component = options.Component, _options$defaultTheme = options.defaultTheme, defaultTheme = _options$defaultTheme === void 0 ? noopTheme$1 : _options$defaultTheme, stylesOptions2 = _objectWithoutProperties(options, [
		"name",
		"classNamePrefix",
		"Component",
		"defaultTheme"
	]);
	var stylesCreator = getStylesCreator(stylesOrCreator);
	var classNamePrefix = name || classNamePrefixOption || "makeStyles";
	stylesCreator.options = {
		index: increment(),
		name,
		meta: classNamePrefix,
		classNamePrefix
	};
	var useStyles = function() {
		var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		var theme = useTheme() || defaultTheme;
		var stylesOptions = _extends({}, React.z(StylesContext), stylesOptions2);
		var instance = React.L();
		var shouldUpdate = React.L();
		useSynchronousEffect(function() {
			var current = {
				name,
				state: {},
				stylesCreator,
				stylesOptions,
				theme
			};
			attach(current, props);
			shouldUpdate.current = false;
			instance.current = current;
			return function() {
				detach(current);
			};
		}, [theme, stylesCreator]);
		React.C(function() {
			if (shouldUpdate.current) {
				update(instance.current, props);
			}
			shouldUpdate.current = true;
		});
		var classes = getClasses(instance.current, props.classes, Component);
		return classes;
	};
	return useStyles;
}
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	else for (t in e) e[t] && (n && (n += " "), n += t);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = ""; f < arguments.length;) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
var reactIs = {};
var reactIs_production_min = {};
function requireReactIs_production_min() {
	var c = Symbol.for("react.element"), d = Symbol.for("react.portal"), e = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), k = Symbol.for("react.context"), l = Symbol.for("react.async_mode"), m = Symbol.for("react.concurrent_mode"), n = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), r = Symbol.for("react.memo"), t = Symbol.for("react.lazy");
	function z(a) {
		if ("object" === typeof a && null !== a) {
			var u = a.$$typeof;
			switch (u) {
				case c: switch (a = a.type, a) {
					case l:
					case m:
					case e:
					case g:
					case f:
					case p: return a;
					default: switch (a = a && a.$$typeof, a) {
						case k:
						case n:
						case t:
						case r:
						case h: return a;
						default: return u;
					}
				}
				case d: return u;
			}
		}
	}
	reactIs_production_min.f = n;
	reactIs_production_min.i = r;
	reactIs_production_min.v = function(a) {
		return z(a) === r;
	};
	return reactIs_production_min;
}
function requireReactIs() {
	{
		reactIs.a = requireReactIs_production_min();
	}
	return reactIs.a;
}
var hoistNonReactStatics_cjs;
function requireHoistNonReactStatics_cjs() {
	var reactIs = requireReactIs();
	/**
	* Copyright 2015, Yahoo! Inc.
	* Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	*/
	var REACT_STATICS = {
		childContextTypes: true,
		contextType: true,
		contextTypes: true,
		defaultProps: true,
		displayName: true,
		getDefaultProps: true,
		getDerivedStateFromError: true,
		getDerivedStateFromProps: true,
		mixins: true,
		propTypes: true,
		type: true
	};
	var KNOWN_STATICS = {
		name: true,
		length: true,
		prototype: true,
		caller: true,
		callee: true,
		arguments: true,
		arity: true
	};
	var FORWARD_REF_STATICS = {
		"$$typeof": true,
		render: true,
		defaultProps: true,
		displayName: true,
		propTypes: true
	};
	var MEMO_STATICS = {
		"$$typeof": true,
		compare: true,
		defaultProps: true,
		displayName: true,
		propTypes: true,
		type: true
	};
	var TYPE_STATICS = {};
	TYPE_STATICS[reactIs.f] = FORWARD_REF_STATICS;
	TYPE_STATICS[reactIs.i] = MEMO_STATICS;
	function getStatics(component) {
		// React v16.11 and below
		if (reactIs.v(component)) {
			return MEMO_STATICS;
		}
		return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
	}
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
		if (typeof sourceComponent !== "string") {
			// don't hoist over string (html) components
			if (objectPrototype) {
				var inheritedComponent = getPrototypeOf(sourceComponent);
				if (inheritedComponent && inheritedComponent !== objectPrototype) {
					hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
				}
			}
			var keys = getOwnPropertyNames(sourceComponent);
			if (getOwnPropertySymbols) {
				keys = keys.concat(getOwnPropertySymbols(sourceComponent));
			}
			var targetStatics = getStatics(targetComponent);
			var sourceStatics = getStatics(sourceComponent);
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
					var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
					try {
						// Avoid failures from read-only properties
						defineProperty(targetComponent, key, descriptor);
					} catch {}
				}
			}
		}
		return targetComponent;
	}
	hoistNonReactStatics_cjs = hoistNonReactStatics;
	return hoistNonReactStatics_cjs;
}
var hoistNonReactStatics_cjsExports = requireHoistNonReactStatics_cjs();
var hoistNonReactStatics = getDefaultExportFromCjs(hoistNonReactStatics_cjsExports);
// It does not modify the component passed to it;
// instead, it returns a new component, with a `classes` property.
var withStyles$1 = function(stylesOrCreator) {
	var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	return function(Component) {
		var defaultTheme = options.defaultTheme, _options$withTheme = options.withTheme, withTheme = _options$withTheme === void 0 ? false : _options$withTheme, name = options.name, stylesOptions = _objectWithoutProperties(options, [
			"defaultTheme",
			"withTheme",
			"name"
		]);
		var classNamePrefix = name;
		var useStyles = makeStyles(stylesOrCreator, _extends({
			defaultTheme,
			Component,
			name: name || void 0,
			classNamePrefix
		}, stylesOptions));
		var WithStyles = React.q(function(props, ref) {
			var innerRef = props.innerRef, other = _objectWithoutProperties(props, ["classes", "innerRef"]);
			// the actual props Component might receive due to merging with defaultProps.
			// So copying it here would give us the same result in the wrapper as well.
			var classes = useStyles(_extends({}, Component.defaultProps, props));
			var theme;
			var more = other;
			if (typeof name === "string" || withTheme) {
				// name and withTheme are invariant in the outer scope
				// eslint-disable-next-line react-hooks/rules-of-hooks
				theme = useTheme() || defaultTheme;
				if (name) {
					more = getThemeProps({
						a: theme,
						b: name,
						c: other
					});
				}
				// So we don't have to use the `withTheme()` Higher-order Component.
				if (withTheme && !more.theme) {
					more.theme = theme;
				}
			}
			return React.o(Component, _extends({
				ref: innerRef || ref,
				classes
			}, more));
		});
		hoistNonReactStatics(WithStyles, Component);
		return WithStyles;
	};
};
var withStylesWithoutDefault = withStyles$1;
var defaultTheme = createTheme();
var defaultTheme$1 = defaultTheme;
function withStyles(stylesOrCreator, options) {
	return withStylesWithoutDefault(stylesOrCreator, _extends({ defaultTheme: defaultTheme$1 }, options));
}
function requireReactDom() {
	function checkDCE() {
		/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
			return;
		}
		try {
			// Verify that the code above has been dead code eliminated (DCE'd).
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			// DevTools shouldn't crash React, no matter what.
			// We should still report in case we break this code.
			console.error(err);
		}
	}
	{
		// DCE check should happen before ReactDOM bundle executes so that
		// DevTools can report bad minification during injection.
		checkDCE();
	}
	return;
}
var styles = function(theme) {
	var elevations = {};
	theme.shadows.forEach(function(shadow, index) {
		elevations["elevation".concat(index)] = { boxShadow: shadow };
	});
	return _extends({
		root: {
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.primary,
			transition: theme.transitions.create("box-shadow")
		},
		rounded: { borderRadius: theme.shape.borderRadius },
		outlined: { border: "1px solid ".concat(theme.palette.divider) }
	}, elevations);
};
var Paper = reactExports.q(function(props, ref) {
	var classes = props.classes, className = props.className, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, _props$square = props.square, square = _props$square === void 0 ? false : _props$square, _props$elevation = props.elevation, elevation = _props$elevation === void 0 ? 1 : _props$elevation, _props$variant = props.variant, variant = _props$variant === void 0 ? "elevation" : _props$variant, other = _objectWithoutProperties(props, [
		"classes",
		"className",
		"component",
		"square",
		"elevation",
		"variant"
	]);
	return reactExports.o(Component, _extends({
		className: clsx(classes.root, className, variant === "outlined" ? classes.outlined : classes["elevation".concat(elevation)], !square && classes.rounded),
		ref
	}, other));
});
var Paper$1 = withStyles(styles, { name: "MuiPaper" })(Paper);
var server_browser = {};
var reactDomServerLegacy_browser_production = {};
function requireReactDomServerLegacy_browser_production() {
	var React = requireReact(), __unused_0767 = requireReactDom();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_SCOPE_TYPE = Symbol.for("react.scope"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden"), REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var isArrayImpl = Array.isArray;
	function murmurhash3_32_gc(key, seed) {
		var remainder = key.length & 3;
		var bytes = key.length - remainder;
		var h1 = seed;
		for (seed = 0; seed < bytes;) {
			var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
			++seed;
			k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			k1 = k1 << 15 | k1 >>> 17;
			k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			h1 ^= k1;
			h1 = h1 << 13 | h1 >>> 19;
			h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
			h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
		}
		k1 = 0;
		switch (remainder) {
			case 3: k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
			case 2: k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
			case 1: k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
		}
		h1 ^= key.length;
		h1 ^= h1 >>> 16;
		h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		h1 ^= h1 >>> 13;
		h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		return (h1 ^ h1 >>> 16) >>> 0;
	}
	var assign = Object.assign, hasOwnProperty = Object.prototype.hasOwnProperty, VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return true;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = true;
		illegalAttributeNameCache[attributeName] = true;
		return false;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" ")), aliases = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
		if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text) return "" + text;
		text = "" + text;
		var match = matchHtmlRegExp.exec(text);
		if (match) {
			var html = "", index, lastIndex = 0;
			for (index = match.index; index < text.length; index++) {
				switch (text.charCodeAt(index)) {
					case 34:
						match = "&quot;";
						break;
					case 38:
						match = "&amp;";
						break;
					case 39:
						match = "&#x27;";
						break;
					case 60:
						match = "&lt;";
						break;
					case 62:
						match = "&gt;";
						break;
					default: continue;
				}
				lastIndex !== index && (html += text.slice(lastIndex, index));
				lastIndex = index + 1;
				html += match;
			}
			text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
		}
		return text;
	}
	var uppercasePattern = /([A-Z])/g, msPattern = /^ms-/, isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	var ReactSharedInternals = React.i, sharedNotPendingObject = {
		pending: false,
		data: null,
		method: null,
		action: null
	};
	var PRELOAD_NO_CREDS = [], currentlyFlushingRenderState = null, scriptRegex = /(<\/|<)(s)(cript)/gi;
	function scriptReplacer(__unused_65F2, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\u0073" : "\\u0053") + suffix;
	}
	function createResumableState() {
		return {
			idPrefix: "",
			nextFormID: 0,
			streamingFormat: 0,
			bootstrapScriptContent: void 0,
			bootstrapScripts: void 0,
			bootstrapModules: void 0,
			instructions: 0,
			hasBody: false,
			hasHtml: false,
			unknownResources: {},
			dnsResources: {},
			connectResources: {
				default: {},
				anonymous: {},
				credentials: {}
			},
			imageResources: {},
			styleResources: {},
			scriptResources: {},
			moduleUnknownResources: {},
			moduleScriptResources: {}
		};
	}
	function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
		return {
			insertionMode,
			selectedValue,
			tagScope,
			viewTransition
		};
	}
	function getChildFormatContext(parentContext, type, props) {
		var subtreeScope = parentContext.tagScope & -25;
		switch (type) {
			case "noscript": return createFormatContext(2, null, subtreeScope | 1, null);
			case "select": return createFormatContext(2, null != props.value ? props.value : props.defaultValue, subtreeScope, null);
			case "svg": return createFormatContext(4, null, subtreeScope, null);
			case "picture": return createFormatContext(2, null, subtreeScope | 2, null);
			case "math": return createFormatContext(5, null, subtreeScope, null);
			case "foreignObject": return createFormatContext(2, null, subtreeScope, null);
			case "table": return createFormatContext(6, null, subtreeScope, null);
			case "thead":
			case "tbody":
			case "tfoot": return createFormatContext(7, null, subtreeScope, null);
			case "colgroup": return createFormatContext(9, null, subtreeScope, null);
			case "tr": return createFormatContext(8, null, subtreeScope, null);
			case "head":
				if (2 > parentContext.insertionMode) return createFormatContext(3, null, subtreeScope, null);
				break;
			case "html": if (0 === parentContext.insertionMode) return createFormatContext(1, null, subtreeScope, null);
		}
		return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : parentContext.tagScope !== subtreeScope ? createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, null) : parentContext;
	}
	function getSuspenseViewTransition(parentViewTransition) {
		return null === parentViewTransition ? null : {
			update: parentViewTransition.update,
			enter: "none",
			exit: "none",
			share: parentViewTransition.update,
			name: parentViewTransition.autoName,
			autoName: parentViewTransition.autoName,
			nameIdx: 0
		};
	}
	function getSuspenseFallbackFormatContext(resumableState, parentContext) {
		parentContext.tagScope & 32 && (resumableState.instructions |= 128);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, parentContext.tagScope | 12, getSuspenseViewTransition(parentContext.viewTransition));
	}
	function getSuspenseContentFormatContext(resumableState, parentContext) {
		resumableState = getSuspenseViewTransition(parentContext.viewTransition);
		var subtreeScope = parentContext.tagScope | 16;
		null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, resumableState);
	}
	var styleNameCache = new Map();
	function pushStyleAttribute(target, style) {
		if ("object" !== typeof style) throw Error(formatProdErrorMessage(62));
		var isFirst = true, styleName;
		for (styleName in style) if (hasOwnProperty.call(style, styleName)) {
			var styleValue = style[styleName];
			if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
				if (0 === styleName.indexOf("--")) {
					var nameChunk = escapeTextForBrowser(styleName);
					styleValue = escapeTextForBrowser(("" + styleValue).trim());
				} else nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = escapeTextForBrowser(styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
				isFirst ? (isFirst = false, target.push(" style=\"", nameChunk, ":", styleValue)) : target.push(";", nameChunk, ":", styleValue);
			}
		}
		isFirst || target.push("\"");
	}
	function pushBooleanAttribute(target, name, value) {
		value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"\"");
	}
	function pushStringAttribute(target, name, value) {
		"function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
	}
	var actionJavaScriptURL = escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')");
	function pushAdditionalFormField(value, key) {
		this.push("<input type=\"hidden\"");
		validateAdditionalFormField(value);
		pushStringAttribute(this, "name", key);
		pushStringAttribute(this, "value", value);
		this.push("/>");
	}
	function validateAdditionalFormField(value) {
		if ("string" !== typeof value) throw Error(formatProdErrorMessage(480));
	}
	function getCustomFormFields(resumableState, formAction) {
		if ("function" === typeof formAction.$$FORM_ACTION) {
			var id = resumableState.nextFormID++;
			resumableState = resumableState.idPrefix + id;
			try {
				var customFields = formAction.$$FORM_ACTION(resumableState);
				if (customFields) {
					var formData = customFields.data;
					null != formData && formData.forEach(validateAdditionalFormField);
				}
				return customFields;
			} catch (x) {
				if ("object" === typeof x && null !== x && "function" === typeof x.then) throw x;
			}
		}
		return null;
	}
	function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
		var formData = null;
		if ("function" === typeof formAction) {
			var customFields = getCustomFormFields(resumableState, formAction);
			null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(" ", "formAction", "=\"", actionJavaScriptURL, "\""), formTarget = (formMethod = (formEncType = (formAction = name = null, null), null), null), injectFormReplayingRuntime(resumableState, renderState));
		}
		null != name && pushAttribute(target, "name", name);
		null != formAction && pushAttribute(target, "formAction", formAction);
		null != formEncType && pushAttribute(target, "formEncType", formEncType);
		null != formMethod && pushAttribute(target, "formMethod", formMethod);
		null != formTarget && pushAttribute(target, "formTarget", formTarget);
		return formData;
	}
	function pushAttribute(target, name, value) {
		switch (name) {
			case "className":
				pushStringAttribute(target, "class", value);
				break;
			case "tabIndex":
				pushStringAttribute(target, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				pushStringAttribute(target, name, value);
				break;
			case "style":
				pushStyleAttribute(target, value);
				break;
			case "src":
			case "href": if ("" === value) break;
			case "action":
			case "formAction":
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "ref": break;
			case "autoFocus":
			case "multiple":
			case "muted":
				pushBooleanAttribute(target, name.toLowerCase(), value);
				break;
			case "xlinkHref":
				if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(" ", "xlink:href", "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				"function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"\"");
				break;
			case "capture":
			case "download":
				true === value ? target.push(" ", name, "=\"\"") : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				"function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "rowSpan":
			case "start":
				"function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "xlinkActuate":
				pushStringAttribute(target, "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				pushStringAttribute(target, "xlink:arcrole", value);
				break;
			case "xlinkRole":
				pushStringAttribute(target, "xlink:role", value);
				break;
			case "xlinkShow":
				pushStringAttribute(target, "xlink:show", value);
				break;
			case "xlinkTitle":
				pushStringAttribute(target, "xlink:title", value);
				break;
			case "xlinkType":
				pushStringAttribute(target, "xlink:type", value);
				break;
			case "xmlBase":
				pushStringAttribute(target, "xml:base", value);
				break;
			case "xmlLang":
				pushStringAttribute(target, "xml:lang", value);
				break;
			case "xmlSpace":
				pushStringAttribute(target, "xml:space", value);
				break;
			default: if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
				if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
					switch (typeof value) {
						case "function":
						case "symbol": return;
						case "boolean":
							var prefix$8 = name.toLowerCase().slice(0, 5);
							if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
					}
					target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				}
			}
		}
	}
	function pushInnerHTML(target, innerHTML, children) {
		if (null != innerHTML) {
			if (null != children) throw Error(formatProdErrorMessage(60));
			if ("object" !== typeof innerHTML || !("__html" in innerHTML)) throw Error(formatProdErrorMessage(61));
			innerHTML = innerHTML.__html;
			null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
		}
	}
	function flattenOptionChildren(children) {
		var content = "";
		React.b.a(children, function(child) {
			null != child && (content += child);
		});
		return content;
	}
	function injectFormReplayingRuntime(resumableState, renderState) {
		if (0 === (resumableState.instructions & 16)) {
			resumableState.instructions |= 16;
			var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
			(preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(">", "addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});", "<\/script>")) : bootstrapChunks.unshift(renderState.startInlineScript, ">", "addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});", "<\/script>");
		}
	}
	function pushLinkImpl(target, props) {
		target.push(startChunkForTag("link"));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "link"));
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push("/>");
		return;
	}
	var styleRegex = /(<\/|<)(s)(tyle)/gi;
	function styleReplacer(__unused_65F2_0, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\73 " : "\\53 ") + suffix;
	}
	function pushSelfClosing(target, props, tag) {
		target.push(startChunkForTag(tag));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, tag));
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push("/>");
		return;
	}
	function pushTitleImpl(target, props) {
		target.push(startChunkForTag("title"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
		"function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
		pushInnerHTML(target, innerHTML, children);
		target.push(endChunkForTag("title"));
		return;
	}
	function pushScriptImpl(target, props) {
		target.push(startChunkForTag("script"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, children);
		"string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
		target.push(endChunkForTag("script"));
		return;
	}
	function pushStartSingletonElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, tag);
		return tag;
	}
	function pushStartGenericElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, tag);
		return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
	}
	var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, validatedTagCache = new Map();
	function startChunkForTag(tag) {
		var tagStartChunk = validatedTagCache.get(tag);
		if (void 0 === tagStartChunk) {
			if (!VALID_TAG_REGEX.test(tag)) throw Error(formatProdErrorMessage(65, tag));
			tagStartChunk = "<" + tag;
			validatedTagCache.set(tag, tagStartChunk);
		}
		return tagStartChunk;
	}
	function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
		switch (type) {
			case "div":
			case "span":
			case "svg":
			case "path": break;
			case "a":
				target$jscomp$0.push(startChunkForTag("a"));
				var children = null, innerHTML = null, propKey;
				for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "children":
							children = propValue;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML = propValue;
							break;
						case "href":
							"" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
							break;
						default: pushAttribute(target$jscomp$0, propKey, propValue);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML, children);
				if ("string" === typeof children) {
					target$jscomp$0.push(escapeTextForBrowser(children));
					var JSCompiler_inline_result = null;
				} else JSCompiler_inline_result = children;
				return JSCompiler_inline_result;
			case "g":
			case "p":
			case "li": break;
			case "select":
				target$jscomp$0.push(startChunkForTag("select"));
				var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
				for (propKey$jscomp$0 in props) if (hasOwnProperty.call(props, propKey$jscomp$0)) {
					var propValue$jscomp$0 = props[propKey$jscomp$0];
					if (null != propValue$jscomp$0) switch (propKey$jscomp$0) {
						case "children":
							children$jscomp$0 = propValue$jscomp$0;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$0 = propValue$jscomp$0;
							break;
						case "defaultValue":
						case "value": break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$0, propValue$jscomp$0);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
				return children$jscomp$0;
			case "option":
				var selectedValue = formatContext.selectedValue;
				target$jscomp$0.push(startChunkForTag("option"));
				var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
				for (propKey$jscomp$1 in props) if (hasOwnProperty.call(props, propKey$jscomp$1)) {
					var propValue$jscomp$1 = props[propKey$jscomp$1];
					if (null != propValue$jscomp$1) switch (propKey$jscomp$1) {
						case "children":
							children$jscomp$1 = propValue$jscomp$1;
							break;
						case "selected":
							selected = propValue$jscomp$1;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$1 = propValue$jscomp$1;
							break;
						case "value": value = propValue$jscomp$1;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$1, propValue$jscomp$1);
					}
				}
				if (null != selectedValue) {
					var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
					if (isArrayImpl(selectedValue)) for (var i = 0; i < selectedValue.length; i++) {
						if ("" + selectedValue[i] === stringValue) {
							target$jscomp$0.push(" selected=\"\"");
							break;
						}
					}
					else "" + selectedValue === stringValue && target$jscomp$0.push(" selected=\"\"");
				} else selected && target$jscomp$0.push(" selected=\"\"");
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
				return children$jscomp$1;
			case "textarea":
				target$jscomp$0.push(startChunkForTag("textarea"));
				var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
				for (propKey$jscomp$2 in props) if (hasOwnProperty.call(props, propKey$jscomp$2)) {
					var propValue$jscomp$2 = props[propKey$jscomp$2];
					if (null != propValue$jscomp$2) switch (propKey$jscomp$2) {
						case "children":
							children$jscomp$2 = propValue$jscomp$2;
							break;
						case "value":
							value$jscomp$0 = propValue$jscomp$2;
							break;
						case "defaultValue":
							defaultValue = propValue$jscomp$2;
							break;
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(91));
						default: pushAttribute(target$jscomp$0, propKey$jscomp$2, propValue$jscomp$2);
					}
				}
				null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
				target$jscomp$0.push(">");
				if (null != children$jscomp$2) {
					if (null != value$jscomp$0) throw Error(formatProdErrorMessage(92));
					if (isArrayImpl(children$jscomp$2)) {
						if (1 < children$jscomp$2.length) throw Error(formatProdErrorMessage(93));
						value$jscomp$0 = "" + children$jscomp$2[0];
					}
					value$jscomp$0 = "" + children$jscomp$2;
				}
				"string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push("\n");
				null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
				return null;
			case "input":
				target$jscomp$0.push(startChunkForTag("input"));
				var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
				for (propKey$jscomp$3 in props) if (hasOwnProperty.call(props, propKey$jscomp$3)) {
					var propValue$jscomp$3 = props[propKey$jscomp$3];
					if (null != propValue$jscomp$3) switch (propKey$jscomp$3) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "input"));
						case "name":
							name = propValue$jscomp$3;
							break;
						case "formAction":
							formAction = propValue$jscomp$3;
							break;
						case "formEncType":
							formEncType = propValue$jscomp$3;
							break;
						case "formMethod":
							formMethod = propValue$jscomp$3;
							break;
						case "formTarget":
							formTarget = propValue$jscomp$3;
							break;
						case "defaultChecked":
							defaultChecked = propValue$jscomp$3;
							break;
						case "defaultValue":
							defaultValue$jscomp$0 = propValue$jscomp$3;
							break;
						case "checked":
							checked = propValue$jscomp$3;
							break;
						case "value":
							value$jscomp$1 = propValue$jscomp$3;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$3, propValue$jscomp$3);
					}
				}
				var formData = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name);
				null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
				null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
				target$jscomp$0.push("/>");
				null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
				return null;
			case "button":
				target$jscomp$0.push(startChunkForTag("button"));
				var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
				for (propKey$jscomp$4 in props) if (hasOwnProperty.call(props, propKey$jscomp$4)) {
					var propValue$jscomp$4 = props[propKey$jscomp$4];
					if (null != propValue$jscomp$4) switch (propKey$jscomp$4) {
						case "children":
							children$jscomp$3 = propValue$jscomp$4;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$2 = propValue$jscomp$4;
							break;
						case "name":
							name$jscomp$0 = propValue$jscomp$4;
							break;
						case "formAction":
							formAction$jscomp$0 = propValue$jscomp$4;
							break;
						case "formEncType":
							formEncType$jscomp$0 = propValue$jscomp$4;
							break;
						case "formMethod":
							formMethod$jscomp$0 = propValue$jscomp$4;
							break;
						case "formTarget":
							formTarget$jscomp$0 = propValue$jscomp$4;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$4, propValue$jscomp$4);
					}
				}
				var formData$jscomp$0 = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction$jscomp$0, formEncType$jscomp$0, formMethod$jscomp$0, formTarget$jscomp$0, name$jscomp$0);
				target$jscomp$0.push(">");
				null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
				if ("string" === typeof children$jscomp$3) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
					var JSCompiler_inline_result$jscomp$0 = null;
				} else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
				return JSCompiler_inline_result$jscomp$0;
			case "form":
				target$jscomp$0.push(startChunkForTag("form"));
				var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
				for (propKey$jscomp$5 in props) if (hasOwnProperty.call(props, propKey$jscomp$5)) {
					var propValue$jscomp$5 = props[propKey$jscomp$5];
					if (null != propValue$jscomp$5) switch (propKey$jscomp$5) {
						case "children":
							children$jscomp$4 = propValue$jscomp$5;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$3 = propValue$jscomp$5;
							break;
						case "action":
							formAction$jscomp$1 = propValue$jscomp$5;
							break;
						case "encType":
							formEncType$jscomp$1 = propValue$jscomp$5;
							break;
						case "method":
							formMethod$jscomp$1 = propValue$jscomp$5;
							break;
						case "target":
							formTarget$jscomp$1 = propValue$jscomp$5;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$5, propValue$jscomp$5);
					}
				}
				var formData$jscomp$1 = null, formActionName = null;
				if ("function" === typeof formAction$jscomp$1) {
					var customFields = getCustomFormFields(resumableState, formAction$jscomp$1);
					null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(" ", "action", "=\"", actionJavaScriptURL, "\""), formTarget$jscomp$1 = (formMethod$jscomp$1 = (formEncType$jscomp$1 = formAction$jscomp$1 = null, null), null), injectFormReplayingRuntime(resumableState, renderState));
				}
				null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
				null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
				null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
				null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
				target$jscomp$0.push(">");
				null !== formActionName && (target$jscomp$0.push("<input type=\"hidden\""), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push("/>"), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
				if ("string" === typeof children$jscomp$4) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
					var JSCompiler_inline_result$jscomp$1 = null;
				} else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
				return JSCompiler_inline_result$jscomp$1;
			case "menuitem":
				target$jscomp$0.push(startChunkForTag("menuitem"));
				for (var propKey$jscomp$6 in props) if (hasOwnProperty.call(props, propKey$jscomp$6)) {
					var propValue$jscomp$6 = props[propKey$jscomp$6];
					if (null != propValue$jscomp$6) switch (propKey$jscomp$6) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(400));
						default: pushAttribute(target$jscomp$0, propKey$jscomp$6, propValue$jscomp$6);
					}
				}
				target$jscomp$0.push(">");
				return null;
			case "object":
				target$jscomp$0.push(startChunkForTag("object"));
				var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
				for (propKey$jscomp$7 in props) if (hasOwnProperty.call(props, propKey$jscomp$7)) {
					var propValue$jscomp$7 = props[propKey$jscomp$7];
					if (null != propValue$jscomp$7) switch (propKey$jscomp$7) {
						case "children":
							children$jscomp$5 = propValue$jscomp$7;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$4 = propValue$jscomp$7;
							break;
						case "data":
							var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
							if ("" === sanitizedValue) break;
							target$jscomp$0.push(" ", "data", "=\"", escapeTextForBrowser(sanitizedValue), "\"");
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$7, propValue$jscomp$7);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
				if ("string" === typeof children$jscomp$5) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
					var JSCompiler_inline_result$jscomp$2 = null;
				} else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
				return JSCompiler_inline_result$jscomp$2;
			case "title":
				var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp) var JSCompiler_inline_result$jscomp$3 = (pushTitleImpl(target$jscomp$0, props), null);
				else isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
				return JSCompiler_inline_result$jscomp$3;
			case "link":
				var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
					pushLinkImpl(target$jscomp$0, props);
					var JSCompiler_inline_result$jscomp$4 = null;
				} else if ("stylesheet" === props.rel) if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError) JSCompiler_inline_result$jscomp$4 = (pushLinkImpl(target$jscomp$0, props), null);
				else {
					var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
					if (null !== resourceState) {
						resumableState.styleResources[href] = null;
						styleQueue || (styleQueue = {
							precedence: escapeTextForBrowser(precedence),
							rules: [],
							hrefs: [],
							sheets: new Map()
						}, renderState.styles.set(precedence, styleQueue));
						var resource = {
							state: 0,
							props: assign({}, props, {
								"data-precedence": props.precedence,
								precedence: null
							})
						};
						if (resourceState) {
							2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
							var preloadResource = renderState.preloads.stylesheets.get(href);
							preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
						}
						styleQueue.sheets.set(href, resource);
						hoistableState && hoistableState.stylesheets.add(resource);
					} else if (styleQueue) {
						var resource$9 = styleQueue.sheets.get(href);
						resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
					}
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$4 = null;
				}
				else props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = (pushLinkImpl(target$jscomp$0, props), null) : (textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$4 = (isFallback$jscomp$0 || pushLinkImpl(renderState.hoistableChunks, props), null));
				return JSCompiler_inline_result$jscomp$4;
			case "script":
				var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
				if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp) var JSCompiler_inline_result$jscomp$5 = (pushScriptImpl(target$jscomp$0, props), null);
				else {
					var key = props.src;
					if ("module" === props.type) {
						var resources = resumableState.moduleScriptResources;
						var preloads = renderState.preloads.moduleScripts;
					} else resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
					var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
					if (null !== resourceState$jscomp$0) {
						resources[key] = null;
						var scriptProps = props;
						if (resourceState$jscomp$0) {
							2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
							var preloadResource$jscomp$0 = preloads.get(key);
							preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
						}
						var resource$jscomp$0 = [];
						renderState.scripts.add(resource$jscomp$0);
						pushScriptImpl(resource$jscomp$0, scriptProps);
					}
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$5 = null;
				}
				return JSCompiler_inline_result$jscomp$5;
			case "style":
				var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
					target$jscomp$0.push(startChunkForTag("style"));
					var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
					for (propKey$jscomp$8 in props) if (hasOwnProperty.call(props, propKey$jscomp$8)) {
						var propValue$jscomp$8 = props[propKey$jscomp$8];
						if (null != propValue$jscomp$8) switch (propKey$jscomp$8) {
							case "children":
								children$jscomp$6 = propValue$jscomp$8;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$5 = propValue$jscomp$8;
								break;
							default: pushAttribute(target$jscomp$0, propKey$jscomp$8, propValue$jscomp$8);
						}
					}
					target$jscomp$0.push(">");
					var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
					"function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
					pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
					target$jscomp$0.push(endChunkForTag("style"));
					var JSCompiler_inline_result$jscomp$6 = null;
				} else {
					var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
					if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
						resumableState.styleResources[href$jscomp$0] = null;
						styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
							precedence: escapeTextForBrowser(precedence$jscomp$0),
							rules: [],
							hrefs: [],
							sheets: new Map()
						}, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
						var nonceStyle = renderState.nonce.style;
						if (!nonceStyle || nonceStyle === nonce) {
							styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
							var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
							for (propKey$jscomp$9 in props) if (hasOwnProperty.call(props, propKey$jscomp$9)) {
								var propValue$jscomp$9 = props[propKey$jscomp$9];
								if (null != propValue$jscomp$9) switch (propKey$jscomp$9) {
									case "children":
										children$jscomp$7 = propValue$jscomp$9;
										break;
									case "dangerouslySetInnerHTML": innerHTML$jscomp$6 = propValue$jscomp$9;
								}
							}
							var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
							"function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(("" + child$jscomp$0).replace(styleRegex, styleReplacer));
							pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
						}
					}
					styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$6 = void 0;
				}
				return JSCompiler_inline_result$jscomp$6;
			case "meta":
				var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp) var JSCompiler_inline_result$jscomp$7 = (pushSelfClosing(target$jscomp$0, props, "meta"), null);
				else textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$7 = (isFallback$jscomp$1 || ("string" === typeof props.charSet ? pushSelfClosing(renderState.charsetChunks, props, "meta") : "viewport" === props.name ? pushSelfClosing(renderState.viewportChunks, props, "meta") : pushSelfClosing(renderState.hoistableChunks, props, "meta")), null);
				return JSCompiler_inline_result$jscomp$7;
			case "listing":
			case "pre":
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
				for (propKey$jscomp$10 in props) if (hasOwnProperty.call(props, propKey$jscomp$10)) {
					var propValue$jscomp$10 = props[propKey$jscomp$10];
					if (null != propValue$jscomp$10) switch (propKey$jscomp$10) {
						case "children":
							children$jscomp$8 = propValue$jscomp$10;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$7 = propValue$jscomp$10;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$10, propValue$jscomp$10);
					}
				}
				target$jscomp$0.push(">");
				if (null != innerHTML$jscomp$7) {
					if (null != children$jscomp$8) throw Error(formatProdErrorMessage(60));
					if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7)) throw Error(formatProdErrorMessage(61));
					var html = innerHTML$jscomp$7.__html;
					null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push("\n", html) : target$jscomp$0.push("" + html));
				}
				"string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push("\n");
				return children$jscomp$8;
			case "img":
				var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
				if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
					null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
					var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
					if (resource$jscomp$1) {
						if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size) promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
					} else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
						resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
						var input = props.crossOrigin;
						var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
						var headers = renderState.headers, header;
						headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
							imageSrcSet: props.srcSet,
							imageSizes: props.sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							nonce: props.nonce,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.refererPolicy
						}), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
							rel: "preload",
							as: "image",
							href: srcSet ? void 0 : src,
							imageSrcSet: srcSet,
							imageSizes: sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.referrerPolicy
						}), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
					}
				}
				return pushSelfClosing(target$jscomp$0, props, "img"), null;
			case "base":
			case "area":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "param":
			case "source":
			case "track":
			case "wbr": return pushSelfClosing(target$jscomp$0, props, type), null;
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": break;
			case "head":
				if (2 > formatContext.insertionMode) {
					var preamble = preambleState || renderState.preamble;
					if (preamble.headChunks) throw Error(formatProdErrorMessage(545, "`<head>`"));
					null !== preambleState && target$jscomp$0.push("<!--head-->");
					preamble.headChunks = [];
					var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(preamble.headChunks, props, "head");
				} else JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(target$jscomp$0, props, "head");
				return JSCompiler_inline_result$jscomp$9;
			case "body":
				if (2 > formatContext.insertionMode) {
					var preamble$jscomp$0 = preambleState || renderState.preamble;
					if (preamble$jscomp$0.bodyChunks) throw Error(formatProdErrorMessage(545, "`<body>`"));
					null !== preambleState && target$jscomp$0.push("<!--body-->");
					preamble$jscomp$0.bodyChunks = [];
					var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(preamble$jscomp$0.bodyChunks, props, "body");
				} else JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(target$jscomp$0, props, "body");
				return JSCompiler_inline_result$jscomp$10;
			case "html":
				if (0 === formatContext.insertionMode) {
					var preamble$jscomp$1 = preambleState || renderState.preamble;
					if (preamble$jscomp$1.htmlChunks) throw Error(formatProdErrorMessage(545, "`<html>`"));
					null !== preambleState && target$jscomp$0.push("<!--html-->");
					preamble$jscomp$1.htmlChunks = [""];
					var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(preamble$jscomp$1.htmlChunks, props, "html");
				} else JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(target$jscomp$0, props, "html");
				return JSCompiler_inline_result$jscomp$11;
			default: if (-1 !== type.indexOf("-")) {
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
				for (propKey$jscomp$11 in props) if (hasOwnProperty.call(props, propKey$jscomp$11)) {
					var propValue$jscomp$11 = props[propKey$jscomp$11];
					if (null != propValue$jscomp$11) {
						var attributeName = propKey$jscomp$11;
						switch (propKey$jscomp$11) {
							case "children":
								children$jscomp$9 = propValue$jscomp$11;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$8 = propValue$jscomp$11;
								break;
							case "style":
								pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
								break;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "ref": break;
							case "className": attributeName = "class";
							default: if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
								if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
								else if ("object" === typeof propValue$jscomp$11) continue;
								target$jscomp$0.push(" ", attributeName, "=\"", escapeTextForBrowser(propValue$jscomp$11), "\"");
							}
						}
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
				return children$jscomp$9;
			}
		}
		return pushStartGenericElement(target$jscomp$0, props, type);
	}
	var endTagCache = new Map();
	function endChunkForTag(tag) {
		var chunk = endTagCache.get(tag);
		void 0 === chunk && (chunk = "</" + tag + ">", endTagCache.set(tag, chunk));
		return chunk;
	}
	function hoistPreambleState(renderState, preambleState) {
		renderState = renderState.preamble;
		null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
		null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
		null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
	}
	function writeBootstrap(destination, renderState) {
		renderState = renderState.bootstrapChunks;
		for (var i = 0; i < renderState.length - 1; i++) destination.push(renderState[i]);
		return i < renderState.length ? (i = renderState[i], renderState.length = 0, destination.push(i)) : true;
	}
	function writeStartPendingSuspenseBoundary(destination, renderState, id) {
		destination.push("<!--$?--><template id=\"");
		if (null === id) throw Error(formatProdErrorMessage(395));
		destination.push(renderState.boundaryPrefix);
		renderState = id.toString(16);
		destination.push(renderState);
		return destination.push("\"></template>");
	}
	function writeStartSegment(destination, renderState, formatContext, id) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return destination.push("<div hidden id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 4: return destination.push("<svg aria-hidden=\"true\" style=\"display:none\" id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 5: return destination.push("<math aria-hidden=\"true\" style=\"display:none\" id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 6: return destination.push("<table hidden id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 7: return destination.push("<table hidden><tbody id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 8: return destination.push("<table hidden><tr id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 9: return destination.push("<table hidden><colgroup id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			default: throw Error(formatProdErrorMessage(397));
		}
	}
	function writeEndSegment(destination, formatContext) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return destination.push("</div>");
			case 4: return destination.push("</svg>");
			case 5: return destination.push("</math>");
			case 6: return destination.push("</table>");
			case 7: return destination.push("</tbody></table>");
			case 8: return destination.push("</tr></table>");
			case 9: return destination.push("</colgroup></table>");
			default: throw Error(formatProdErrorMessage(397));
		}
	}
	var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
	function escapeJSStringsForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInInstructionScripts, function(match) {
			switch (match) {
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
	function escapeJSObjectForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInScripts, function(match) {
			switch (match) {
				case "&": return "\\u0026";
				case ">": return "\\u003e";
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var currentlyRenderingBoundaryHasStylesToHoist = false, destinationHasCapacity = true;
	function flushStyleTagsLateForBoundary(styleQueue) {
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
		if (hrefs.length) {
			this.push(currentlyFlushingRenderState.startInlineStyle);
			this.push(" media=\"not all\" data-precedence=\"");
			this.push(styleQueue.precedence);
			for (this.push("\" data-href=\""); i < hrefs.length - 1; i++) this.push(hrefs[i]), this.push(" ");
			this.push(hrefs[i]);
			this.push("\">");
			for (i = 0; i < rules.length; i++) this.push(rules[i]);
			destinationHasCapacity = this.push("</style>");
			currentlyRenderingBoundaryHasStylesToHoist = true;
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function hasStylesToHoist(stylesheet) {
		return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
	}
	function writeHoistablesForBoundary(destination, hoistableState, renderState) {
		currentlyRenderingBoundaryHasStylesToHoist = false;
		destinationHasCapacity = true;
		currentlyFlushingRenderState = renderState;
		hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
		currentlyFlushingRenderState = null;
		hoistableState.stylesheets.forEach(hasStylesToHoist);
		currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
		return destinationHasCapacity;
	}
	function flushResource(resource) {
		for (var i = 0; i < resource.length; i++) this.push(resource[i]);
		resource.length = 0;
	}
	var stylesheetFlushingQueue = [];
	function flushStyleInPreamble(stylesheet) {
		pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
		for (var i = 0; i < stylesheetFlushingQueue.length; i++) this.push(stylesheetFlushingQueue[i]);
		stylesheetFlushingQueue.length = 0;
		stylesheet.state = 2;
	}
	function flushStylesInPreamble(styleQueue) {
		var hasStylesheets = 0 < styleQueue.sheets.size;
		styleQueue.sheets.forEach(flushStyleInPreamble, this);
		styleQueue.sheets.clear();
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
		if (!hasStylesheets || hrefs.length) {
			this.push(currentlyFlushingRenderState.startInlineStyle);
			this.push(" data-precedence=\"");
			this.push(styleQueue.precedence);
			styleQueue = 0;
			if (hrefs.length) {
				for (this.push("\" data-href=\""); styleQueue < hrefs.length - 1; styleQueue++) this.push(hrefs[styleQueue]), this.push(" ");
				this.push(hrefs[styleQueue]);
			}
			this.push("\">");
			for (styleQueue = 0; styleQueue < rules.length; styleQueue++) this.push(rules[styleQueue]);
			this.push("</style>");
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function preloadLateStyle(stylesheet) {
		if (0 === stylesheet.state) {
			stylesheet.state = 1;
			var props = stylesheet.props;
			pushLinkImpl(stylesheetFlushingQueue, {
				rel: "preload",
				as: "style",
				href: stylesheet.props.href,
				crossOrigin: props.crossOrigin,
				fetchPriority: props.fetchPriority,
				integrity: props.integrity,
				media: props.media,
				hrefLang: props.hrefLang,
				referrerPolicy: props.referrerPolicy
			});
			for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++) this.push(stylesheetFlushingQueue[stylesheet]);
			stylesheetFlushingQueue.length = 0;
		}
	}
	function preloadLateStyles(styleQueue) {
		styleQueue.sheets.forEach(preloadLateStyle, this);
		styleQueue.sheets.clear();
	}
	function pushCompletedShellIdAttribute(target, resumableState) {
		0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(" id=\"", escapeTextForBrowser("_" + resumableState.idPrefix + "R_"), "\""));
	}
	function writeStyleResourceDependenciesInJS(destination, hoistableState) {
		destination.push("[");
		var nextArrayOpenBrackChunk = "[";
		hoistableState.stylesheets.forEach(function(resource) {
			if (2 !== resource.state) if (3 === resource.state) destination.push(nextArrayOpenBrackChunk), resource = escapeJSObjectForInstructionScripts("" + resource.props.href), destination.push(resource), destination.push("]"), nextArrayOpenBrackChunk = ",[";
			else {
				destination.push(nextArrayOpenBrackChunk);
				var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
				coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
				destination.push(coercedHref);
				precedence = "" + precedence;
				destination.push(",");
				precedence = escapeJSObjectForInstructionScripts(precedence);
				destination.push(precedence);
				for (var propKey in props) if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence)) switch (propKey) {
					case "href":
					case "rel":
					case "precedence":
					case "data-precedence": break;
					case "children":
					case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "link"));
					default: writeStyleResourceAttributeInJS(destination, propKey, precedence);
				}
				destination.push("]");
				nextArrayOpenBrackChunk = ",[";
				resource.state = 3;
			}
		});
		destination.push("]");
	}
	function writeStyleResourceAttributeInJS(destination, name, value) {
		var attributeName = name.toLowerCase();
		switch (typeof value) {
			case "function":
			case "symbol": return;
		}
		switch (name) {
			case "innerHTML":
			case "dangerouslySetInnerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "style":
			case "ref": return;
			case "className":
				attributeName = "class";
				name = "" + value;
				break;
			case "hidden":
				if (false === value) return;
				name = "";
				break;
			case "src":
			case "href":
				value = sanitizeURL(value);
				name = "" + value;
				break;
			default:
				if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name)) return;
				name = "" + value;
		}
		destination.push(",");
		attributeName = escapeJSObjectForInstructionScripts(attributeName);
		destination.push(attributeName);
		destination.push(",");
		attributeName = escapeJSObjectForInstructionScripts(name);
		destination.push(attributeName);
	}
	function createHoistableState() {
		return {
			styles: new Set(),
			stylesheets: new Set(),
			suspenseyImages: false
		};
	}
	function adoptPreloadCredentials(target, preloadState) {
		null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
		null == target.integrity && (target.integrity = preloadState[1]);
	}
	function getPreloadAsHeader(href, as, params) {
		href = ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer);
		as = ("" + as).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer);
		as = "<" + href + ">; rel=preload; as=\"" + as + "\"";
		for (var paramName in params) hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + "=\"" + ("" + href).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer) + "\""));
		return as;
	}
	var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
	function escapeHrefForLinkHeaderURLContextReplacer(match) {
		switch (match) {
			case "<": return "%3C";
			case ">": return "%3E";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
	function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
		switch (match) {
			case "\"": return "%22";
			case "'": return "%27";
			case ";": return "%3B";
			case ",": return "%2C";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	function hoistStyleQueueDependency(styleQueue) {
		this.styles.add(styleQueue);
	}
	function hoistStylesheetDependency(stylesheet) {
		this.stylesheets.add(stylesheet);
	}
	function hoistHoistables(parentState, childState) {
		childState.styles.forEach(hoistStyleQueueDependency, parentState);
		childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
		childState.suspenseyImages && (parentState.suspenseyImages = true);
	}
	function createRenderState() {
		var bootstrapChunks = [];
		var JSCompiler_object_inline_preconnects_1687 = new Set(), JSCompiler_object_inline_fontPreloads_1688 = new Set(), JSCompiler_object_inline_highImagePreloads_1689 = new Set(), JSCompiler_object_inline_styles_1690 = new Map(), JSCompiler_object_inline_bootstrapScripts_1691 = new Set(), JSCompiler_object_inline_scripts_1692 = new Set(), JSCompiler_object_inline_bulkPreloads_1693 = new Set(), JSCompiler_object_inline_preloads_1694 = {
			images: new Map(),
			stylesheets: new Map(),
			scripts: new Map(),
			moduleScripts: new Map()
		};
		return {
			placeholderPrefix: "P:",
			segmentPrefix: "S:",
			boundaryPrefix: "B:",
			startInlineScript: "<script",
			startInlineStyle: "<style",
			preamble: {
				htmlChunks: null,
				headChunks: null,
				bodyChunks: null
			},
			externalRuntimeScript: null,
			bootstrapChunks,
			importMapChunks: [],
			onHeaders: void 0,
			headers: null,
			resets: {
				font: {},
				dns: {},
				connect: {
					default: {},
					anonymous: {},
					credentials: {}
				},
				image: {},
				style: {}
			},
			charsetChunks: [],
			viewportChunks: [],
			hoistableChunks: [],
			preconnects: JSCompiler_object_inline_preconnects_1687,
			fontPreloads: JSCompiler_object_inline_fontPreloads_1688,
			highImagePreloads: JSCompiler_object_inline_highImagePreloads_1689,
			styles: JSCompiler_object_inline_styles_1690,
			bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1691,
			scripts: JSCompiler_object_inline_scripts_1692,
			bulkPreloads: JSCompiler_object_inline_bulkPreloads_1693,
			preloads: JSCompiler_object_inline_preloads_1694,
			nonce: {
				script: void 0,
				style: void 0
			},
			stylesToHoist: false,
			generateStaticMarkup: false
		};
	}
	function pushTextInstance(target, text, renderState, textEmbedded) {
		if (renderState.generateStaticMarkup) return target.push(escapeTextForBrowser(text)), false;
		"" === text ? target = textEmbedded : (textEmbedded && target.push("<!-- -->"), target.push(escapeTextForBrowser(text)), target = true);
		return target;
	}
	function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
		renderState.generateStaticMarkup || lastPushedText && textEmbedded && target.push("<!-- -->");
	}
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return type.displayName || "Context";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch {}
		}
		return null;
	}
	var emptyContextObject = {}, currentActiveSnapshot = null;
	function popToNearestCommonAncestor(prev, next) {
		if (prev !== next) {
			prev.context._currentValue2 = prev.parentValue;
			prev = prev.parent;
			var parentNext = next.parent;
			if (null === prev) {
				if (null !== parentNext) throw Error(formatProdErrorMessage(401));
			} else {
				if (null === parentNext) throw Error(formatProdErrorMessage(401));
				popToNearestCommonAncestor(prev, parentNext);
			}
			next.context._currentValue2 = next.value;
		}
	}
	function popAllPrevious(prev) {
		prev.context._currentValue2 = prev.parentValue;
		prev = prev.parent;
		null !== prev && popAllPrevious(prev);
	}
	function pushAllNext(next) {
		var parentNext = next.parent;
		null !== parentNext && pushAllNext(parentNext);
		next.context._currentValue2 = next.value;
	}
	function popPreviousToCommonLevel(prev, next) {
		prev.context._currentValue2 = prev.parentValue;
		prev = prev.parent;
		if (null === prev) throw Error(formatProdErrorMessage(402));
		prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
	}
	function popNextToCommonLevel(prev, next) {
		var parentNext = next.parent;
		if (null === parentNext) throw Error(formatProdErrorMessage(402));
		prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
		next.context._currentValue2 = next.value;
	}
	function switchContext(newSnapshot) {
		var prev = currentActiveSnapshot;
		prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload) {
			inst = inst._reactInternals;
			null !== inst.queue && inst.queue.push(payload);
		},
		enqueueReplaceState: function(inst, payload) {
			inst = inst._reactInternals;
			inst.replace = true;
			inst.queue = [payload];
		},
		enqueueForceUpdate: function() {}
	}, emptyTreeContext = {
		id: 1,
		overflow: ""
	};
	function pushTreeContext(baseContext, totalChildren, index) {
		var baseIdWithLeadingBit = baseContext.id;
		baseContext = baseContext.overflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			return {
				id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
				overflow: length + baseContext
			};
		}
		return {
			id: 1 << length | index << baseLength | baseIdWithLeadingBit,
			overflow: baseContext
		};
	}
	var clz32 = Math.clz32;
	function noop() {}
	var SuspenseException = Error(formatProdErrorMessage(460));
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default:
				"string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState = thenable, thenableState.status = "pending", thenableState.then(function(fulfilledValue) {
					if ("pending" === thenable.status) {
						var fulfilledThenable = thenable;
						fulfilledThenable.status = "fulfilled";
						fulfilledThenable.value = fulfilledValue;
					}
				}, function(error) {
					if ("pending" === thenable.status) {
						var rejectedThenable = thenable;
						rejectedThenable.status = "rejected";
						rejectedThenable.reason = error;
					}
				}));
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenable.reason;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	var objectIs = Object.is, currentlyRenderingComponent = null, currentlyRenderingTask = null, currentlyRenderingRequest = null, currentlyRenderingKeyPath = null, firstWorkInProgressHook = null, workInProgressHook = null, isReRender = false, didScheduleRenderPhaseUpdate = false, localIdCounter = 0, actionStateCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, thenableState = null, renderPhaseUpdates = null, numberOfReRenders = 0;
	function resolveCurrentlyRenderingComponent() {
		if (null === currentlyRenderingComponent) throw Error(formatProdErrorMessage(321));
		return currentlyRenderingComponent;
	}
	function createHook() {
		return {
			memoizedState: null,
			queue: null,
			next: null
		};
	}
	function createWorkInProgressHook() {
		null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
		return workInProgressHook;
	}
	function getThenableStateAfterSuspending() {
		var state = thenableState;
		thenableState = null;
		return state;
	}
	function resetHooksState() {
		currentlyRenderingKeyPath = (currentlyRenderingRequest = (currentlyRenderingTask = currentlyRenderingComponent = null, null), null);
		didScheduleRenderPhaseUpdate = false;
		firstWorkInProgressHook = null;
		numberOfReRenders = 0;
		workInProgressHook = renderPhaseUpdates = null;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function useReducer(reducer, initialArg, init) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		if (isReRender) {
			var queue = workInProgressHook.queue;
			initialArg = queue.dispatch;
			if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
				renderPhaseUpdates.delete(queue);
				queue = workInProgressHook.memoizedState;
				do
					queue = reducer(queue, init.action), init = init.next;
				while (null !== init);
				workInProgressHook.memoizedState = queue;
				return [queue, initialArg];
			}
			return [workInProgressHook.memoizedState, initialArg];
		}
		reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
		workInProgressHook.memoizedState = reducer;
		reducer = workInProgressHook.queue = {
			last: null,
			dispatch: null
		};
		reducer = reducer.dispatch = dispatchAction.bind(0, currentlyRenderingComponent, reducer);
		return [workInProgressHook.memoizedState, reducer];
	}
	function useMemo(nextCreate, deps) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		if (null !== workInProgressHook) {
			var prevState = workInProgressHook.memoizedState;
			if (null !== prevState && null !== deps) {
				var prevDeps = prevState[1];
				a: if (null === prevDeps) prevDeps = false;
				else {
					for (var i = 0; i < prevDeps.length && i < deps.length; i++) if (!objectIs(deps[i], prevDeps[i])) {
						prevDeps = false;
						break a;
					}
					prevDeps = true;
				}
				if (prevDeps) return prevState[0];
			}
		}
		nextCreate = nextCreate();
		workInProgressHook.memoizedState = [nextCreate, deps];
		return nextCreate;
	}
	function dispatchAction(componentIdentity, queue, action) {
		if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
		if (componentIdentity === currentlyRenderingComponent) if (didScheduleRenderPhaseUpdate = true, componentIdentity = {
			action,
			next: null
		}, null === renderPhaseUpdates && (renderPhaseUpdates = new Map()), action = renderPhaseUpdates.get(queue), void 0 === action) renderPhaseUpdates.set(queue, componentIdentity);
		else {
			for (queue = action; null !== queue.next;) queue = queue.next;
			queue.next = componentIdentity;
		}
	}
	function throwOnUseEffectEventCall() {
		throw Error(formatProdErrorMessage(440));
	}
	function unsupportedStartTransition() {
		throw Error(formatProdErrorMessage(394));
	}
	function unsupportedSetOptimisticState() {
		throw Error(formatProdErrorMessage(479));
	}
	function useActionState(action, initialState, permalink) {
		resolveCurrentlyRenderingComponent();
		var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
		if ("function" === typeof action.$$FORM_ACTION) {
			var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
			request = request.formState;
			var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
			if (null !== request && "function" === typeof isSignatureEqual) {
				var postbackKey = request[1];
				isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
			}
			var boundAction = action.bind(null, initialState);
			action = function(payload) {
				boundAction(payload);
			};
			"function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix) {
				prefix = boundAction.$$FORM_ACTION(prefix);
				void 0 !== permalink && (permalink += "", prefix.action = permalink);
				var formData = prefix.data;
				formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0)), formData.append("$ACTION_KEY", nextPostbackStateKey));
				return prefix;
			});
			return [
				initialState,
				action,
				false
			];
		}
		var boundAction$22 = action.bind(null, initialState);
		return [
			initialState,
			function(payload) {
				boundAction$22(payload);
			},
			false
		];
	}
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		return trackUsedThenable(thenableState, thenable, index);
	}
	function unsupportedRefresh() {
		throw Error(formatProdErrorMessage(393));
	}
	var HooksDispatcher = {
		readContext: function(context) {
			return context._currentValue2;
		},
		use: function(usable) {
			if (null !== usable && "object" === typeof usable) {
				if ("function" === typeof usable.then) return unwrapThenable(usable);
				if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue2;
			}
			throw Error(formatProdErrorMessage(438, String(usable)));
		},
		useContext: function(context) {
			resolveCurrentlyRenderingComponent();
			return context._currentValue2;
		},
		useMemo,
		useReducer,
		useRef: function(initialValue) {
			currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
			workInProgressHook = createWorkInProgressHook();
			var previousRef = workInProgressHook.memoizedState;
			return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
		},
		useState: function(initialState) {
			return useReducer(basicStateReducer, initialState);
		},
		useInsertionEffect: noop,
		useLayoutEffect: noop,
		useCallback: function(callback, deps) {
			return useMemo(function() {
				return callback;
			}, deps);
		},
		useImperativeHandle: noop,
		useEffect: noop,
		useDebugValue: noop,
		useDeferredValue: function(value, initialValue) {
			resolveCurrentlyRenderingComponent();
			return void 0 !== initialValue ? initialValue : value;
		},
		useTransition: function() {
			resolveCurrentlyRenderingComponent();
			return [false, unsupportedStartTransition];
		},
		useId: function() {
			var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
			var overflow = JSCompiler_inline_result.overflow;
			JSCompiler_inline_result = JSCompiler_inline_result.id;
			JSCompiler_inline_result = (JSCompiler_inline_result & ~(1 << 32 - clz32(JSCompiler_inline_result) - 1)).toString(32) + overflow;
			var resumableState = currentResumableState;
			if (null === resumableState) throw Error(formatProdErrorMessage(404));
			overflow = localIdCounter++;
			JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
			0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
			return JSCompiler_inline_result + "_";
		},
		useSyncExternalStore: function(__unused_9C50, __unused_84CE, getServerSnapshot) {
			if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
			return getServerSnapshot();
		},
		useOptimistic: function(passthrough) {
			resolveCurrentlyRenderingComponent();
			return [passthrough, unsupportedSetOptimisticState];
		},
		useActionState,
		useFormState: useActionState,
		useHostTransitionStatus: function() {
			resolveCurrentlyRenderingComponent();
			return sharedNotPendingObject;
		},
		useMemoCache: function(size) {
			for (var data = Array(size), i = 0; i < size; i++) data[i] = REACT_MEMO_CACHE_SENTINEL;
			return data;
		},
		useCacheRefresh: function() {
			return unsupportedRefresh;
		},
		useEffectEvent: function() {
			return throwOnUseEffectEventCall;
		}
	}, currentResumableState = null, prefix, suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = false;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = true;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if ("object" === typeof Reflect && Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$24) {
								control = x$24;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$25) {
							control = x$25;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
						do
							if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
								var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
								fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
								return frame;
							}
						while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					}
					break;
				}
			}
		} finally {
			reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeComponentStackByType(type) {
		if ("string" === typeof type) return describeBuiltInComponentFrame(type);
		if ("function" === typeof type) return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
		if ("object" === typeof type && null !== type) {
			switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE: return describeNativeComponentFrame(type.render, false);
				case REACT_MEMO_TYPE: return describeNativeComponentFrame(type.type, false);
				case REACT_LAZY_TYPE:
					var lazyComponent = type, payload = lazyComponent._payload;
					lazyComponent = lazyComponent._init;
					try {
						type = lazyComponent(payload);
					} catch {
						return describeBuiltInComponentFrame("Lazy");
					}
					return describeComponentStackByType(type);
			}
			if ("string" === typeof type.name) {
				a: {
					payload = type.name;
					lazyComponent = type.env;
					var location = type.debugLocation;
					if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = void 0, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
						payload = "\n" + type;
						break a;
					}
					payload = describeBuiltInComponentFrame(payload + (lazyComponent ? " [" + lazyComponent + "]" : ""));
				}
				return payload;
			}
		}
		switch (type) {
			case REACT_SUSPENSE_LIST_TYPE: return describeBuiltInComponentFrame("SuspenseList");
			case REACT_SUSPENSE_TYPE: return describeBuiltInComponentFrame("Suspense");
		}
		return "";
	}
	function isEligibleForOutlining(__unused_8DAA, boundary) {
		return (500 < boundary.byteSize || false) && null === boundary.contentPreamble;
	}
	function RequestInstance(resumableState, renderState, rootFormatContext, __unused_3273, onError, __unused_5E10, onShellReady) {
		var abortSet = new Set();
		this.destination = null;
		this.flushScheduled = false;
		this.resumableState = resumableState;
		this.renderState = renderState;
		this.rootFormatContext = rootFormatContext;
		this.progressiveChunkSize = Infinity;
		this.status = 10;
		this.fatalError = null;
		this.pendingRootTasks = (this.allPendingTasks = this.nextSegmentId = 0, 0);
		this.completedPreambleSegments = this.completedRootSegment = null;
		this.byteSize = 0;
		this.abortableTasks = abortSet;
		this.pingedTasks = [];
		this.clientRenderedBoundaries = [];
		this.completedBoundaries = [];
		this.partialBoundaries = [];
		this.trackedPostpones = null;
		this.onError = onError;
		this.onPostpone = noop;
		this.onAllReady = noop;
		this.onShellReady = onShellReady;
		this.onShellError = noop;
		this.onFatalError = noop;
		this.formState = null;
	}
	function createRequest(children, resumableState, renderState, rootFormatContext, __unused_3273_0, onError, __unused_5E10_0, onShellReady) {
		resumableState = new RequestInstance(resumableState, renderState, rootFormatContext, 0, onError, 0, onShellReady);
		renderState = createPendingSegment(0, 0, null, rootFormatContext, false, false);
		renderState.parentFlushed = true;
		children = createRenderTask(resumableState, null, children, -1, null, renderState, null, null, resumableState.abortableTasks, null, rootFormatContext, null, emptyTreeContext, null, null);
		pushComponentStack(children);
		resumableState.pingedTasks.push(children);
		return resumableState;
	}
	function pingTask(request, task) {
		request.pingedTasks.push(task);
		1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, performWork(request));
	}
	function createSuspenseBoundary(request, row, fallbackAbortableTasks, contentPreamble) {
		fallbackAbortableTasks = {
			status: 0,
			rootSegmentID: -1,
			parentFlushed: false,
			pendingTasks: 0,
			row,
			completedSegments: [],
			byteSize: 0,
			fallbackAbortableTasks,
			errorDigest: null,
			contentState: createHoistableState(),
			fallbackState: createHoistableState(),
			contentPreamble: null,
			fallbackPreamble: null,
			trackedContentKeyPath: null,
			trackedFallbackNode: null
		};
		null !== row && (row.pendingTasks++, contentPreamble = row.boundaries, null !== contentPreamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, contentPreamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
		return fallbackAbortableTasks;
	}
	function createRenderTask(request, thenableState, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		var task = {
			replay: null,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment,
			blockedPreamble,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createReplayTask(request, thenableState, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		replay.pendingTasks++;
		var task = {
			replay,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment: null,
			blockedPreamble: null,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createPendingSegment(__unused_1E40, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
		return {
			status: 0,
			parentFlushed: false,
			id: -1,
			index,
			chunks: [],
			children: [],
			preambleChildren: [],
			parentFormatContext,
			boundary,
			lastPushedText,
			textEmbedded
		};
	}
	function pushComponentStack(task) {
		var node = task.node;
		if ("object" === typeof node && null !== node) switch (node.$$typeof) {
			case REACT_ELEMENT_TYPE: task.componentStack = {
				parent: task.componentStack,
				type: node.type
			};
		}
	}
	function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
		return null === componentStack ? null : {
			parent: componentStack.parent,
			type: "Suspense Fallback"
		};
	}
	function getThrownInfo(node$jscomp$0) {
		var errorInfo = {};
		node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
			configurable: true,
			enumerable: true,
			get: function() {
				try {
					var info = "", node = node$jscomp$0;
					do
						info += describeComponentStackByType(node.type), node = node.parent;
					while (node);
					var JSCompiler_inline_result = info;
				} catch (x) {
					JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
				}
				Object.defineProperty(errorInfo, "componentStack", { value: JSCompiler_inline_result });
				return JSCompiler_inline_result;
			}
		});
		return errorInfo;
	}
	function logRecoverableError(request, error, errorInfo) {
		request = request.onError;
		error = request(error, errorInfo);
		if (null == error || "string" === typeof error) return error;
	}
	function fatalError(request, error) {
		var onShellError = request.onShellError, onFatalError = request.onFatalError;
		onShellError(error);
		onFatalError(error);
		null !== request.destination ? (request.status = 14, request.destination.destroy(error)) : (request.status = 13, request.fatalError = error);
	}
	function finishSuspenseListRow(request, row) {
		unblockSuspenseListRow(request, row.next, row.hoistables);
	}
	function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
		for (; null !== unblockedRow;) {
			null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
			var unblockedBoundaries = unblockedRow.boundaries;
			if (null !== unblockedBoundaries) {
				unblockedRow.boundaries = null;
				for (var i = 0; i < unblockedBoundaries.length; i++) {
					var unblockedBoundary = unblockedBoundaries[i];
					null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
					finishedTask(request, unblockedBoundary, null, null);
				}
			}
			unblockedRow.pendingTasks--;
			if (0 < unblockedRow.pendingTasks) break;
			inheritedHoistables = unblockedRow.hoistables;
			unblockedRow = unblockedRow.next;
		}
	}
	function tryToResolveTogetherRow(request, togetherRow) {
		var boundaries = togetherRow.boundaries;
		if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
			for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
				var rowBoundary = boundaries[i];
				if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(0, rowBoundary)) {
					allCompleteAndInlinable = false;
					break;
				}
			}
			allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
		}
	}
	function createSuspenseListRow(previousRow) {
		var newRow = {
			pendingTasks: 1,
			boundaries: null,
			hoistables: createHoistableState(),
			inheritedHoistables: null,
			together: false,
			next: null
		};
		null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
		return newRow;
	}
	function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
		var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
		task.keyPath = keyPath;
		keyPath = rows.length;
		var previousSuspenseListRow = null;
		if (null !== task.replay) {
			var resumeSlots = task.replay.slots;
			if (null !== resumeSlots && "object" === typeof resumeSlots) for (var n = 0; n < keyPath; n++) {
				var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				var resumeSegmentID = resumeSlots[i];
				"number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
				0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
			}
			else for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++) n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		} else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder) for (revealOrder = 0; revealOrder < keyPath; revealOrder++) resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, revealOrder), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		else {
			revealOrder = task.blockedSegment;
			resumeSlots = revealOrder.children.length;
			n = revealOrder.chunks.length;
			for (i = keyPath - 1; 0 <= i; i--) {
				node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				resumeSegmentID = createPendingSegment(0, n, null, task.formatContext, 0 === i ? revealOrder.lastPushedText : true, true);
				revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
				task.blockedSegment = resumeSegmentID;
				try {
					renderNode(request, task, node, i), pushSegmentFinale(resumeSegmentID.chunks, request.renderState, resumeSegmentID.lastPushedText, resumeSegmentID.textEmbedded), resumeSegmentID.status = 1, 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
				} catch (thrownValue) {
					throw resumeSegmentID.status = 12 === request.status ? 3 : 4, thrownValue;
				}
			}
			task.blockedSegment = revealOrder;
			revealOrder.lastPushedText = false;
		}
		null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
		task.treeContext = prevTreeContext;
		task.row = prevRow;
		task.keyPath = prevKeyPath;
	}
	function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
		var prevThenableState = task.thenableState;
		task.thenableState = null;
		currentlyRenderingComponent = {};
		currentlyRenderingTask = task;
		currentlyRenderingRequest = request;
		currentlyRenderingKeyPath = keyPath;
		actionStateCounter = localIdCounter = 0;
		actionStateMatchingIndex = -1;
		thenableIndexCounter = 0;
		thenableState = prevThenableState;
		for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate;) didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
		resetHooksState();
		return request;
	}
	function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex) {
		var didEmitActionStateMarkers = false;
		if (0 !== actionStateCount && null !== request.formState) {
			var segment = task.blockedSegment;
			if (null !== segment) {
				didEmitActionStateMarkers = true;
				segment = segment.chunks;
				for (var i = 0; i < actionStateCount; i++) i === actionStateMatchingIndex ? segment.push("<!--F!-->") : segment.push("<!--F-->");
			}
		}
		actionStateCount = task.keyPath;
		task.keyPath = keyPath;
		hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
		task.keyPath = actionStateCount;
	}
	function renderElement(request, task, keyPath, type, props, ref) {
		if ("function" === typeof type) if (type.prototype && type.prototype.isReactComponent) {
			var newProps = props;
			if ("ref" in props) {
				newProps = {};
				for (var propName in props) "ref" !== propName && (newProps[propName] = props[propName]);
			}
			var defaultProps = type.defaultProps;
			if (defaultProps) {
				newProps === props && (newProps = assign({}, newProps, props));
				for (var propName$43 in defaultProps) void 0 === newProps[propName$43] && (newProps[propName$43] = defaultProps[propName$43]);
			}
			props = newProps;
			newProps = emptyContextObject;
			defaultProps = type.contextType;
			"object" === typeof defaultProps && null !== defaultProps && (newProps = defaultProps._currentValue2);
			newProps = new type(props, newProps);
			var initialState = void 0 !== newProps.state ? newProps.state : null;
			newProps.updater = classComponentUpdater;
			newProps.props = props;
			newProps.state = initialState;
			defaultProps = {
				queue: [],
				replace: false
			};
			newProps._reactInternals = defaultProps;
			ref = type.contextType;
			newProps.context = "object" === typeof ref && null !== ref ? ref._currentValue2 : emptyContextObject;
			ref = type.getDerivedStateFromProps;
			"function" === typeof ref && (ref = ref(props, initialState), initialState = null === ref || void 0 === ref ? initialState : assign({}, initialState, ref), newProps.state = initialState);
			if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof newProps.getSnapshotBeforeUpdate && ("function" === typeof newProps.UNSAFE_componentWillMount || "function" === typeof newProps.componentWillMount)) if (type = newProps.state, "function" === typeof newProps.componentWillMount && newProps.componentWillMount(), "function" === typeof newProps.UNSAFE_componentWillMount && newProps.UNSAFE_componentWillMount(), type !== newProps.state && classComponentUpdater.enqueueReplaceState(newProps, newProps.state, null), null !== defaultProps.queue && 0 < defaultProps.queue.length) if (type = defaultProps.queue, ref = defaultProps.replace, defaultProps.queue = null, defaultProps.replace = false, ref && 1 === type.length) newProps.state = type[0];
			else {
				defaultProps = ref ? type[0] : newProps.state;
				initialState = true;
				for (ref = ref ? 1 : 0; ref < type.length; ref++) propName$43 = type[ref], propName$43 = "function" === typeof propName$43 ? propName$43.call(newProps, defaultProps, props, void 0) : propName$43, null != propName$43 && (initialState ? (initialState = false, defaultProps = assign({}, defaultProps, propName$43)) : assign(defaultProps, propName$43));
				newProps.state = defaultProps;
			}
			else defaultProps.queue = null;
			type = newProps.render();
			if (12 === request.status) throw null;
			props = task.keyPath;
			task.keyPath = keyPath;
			renderNodeDestructive(request, task, type, -1);
			task.keyPath = props;
		} else {
			type = renderWithHooks(request, task, keyPath, type, props, void 0);
			if (12 === request.status) throw null;
			finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
		}
		else if ("string" === typeof type) if (newProps = task.blockedSegment, null === newProps) newProps = props.children, defaultProps = task.formatContext, initialState = task.keyPath, task.formatContext = getChildFormatContext(defaultProps, type, props), task.keyPath = keyPath, renderNode(request, task, newProps, -1), task.formatContext = defaultProps, task.keyPath = initialState;
		else {
			initialState = pushStartInstance(newProps.chunks, type, props, request.resumableState, request.renderState, task.blockedPreamble, task.hoistableState, task.formatContext, newProps.lastPushedText);
			newProps.lastPushedText = false;
			defaultProps = task.formatContext;
			ref = task.keyPath;
			task.keyPath = keyPath;
			if (3 === (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode) {
				keyPath = createPendingSegment(0, 0, null, task.formatContext, false, false);
				newProps.preambleChildren.push(keyPath);
				task.blockedSegment = keyPath;
				try {
					keyPath.status = 6, renderNode(request, task, initialState, -1), pushSegmentFinale(keyPath.chunks, request.renderState, keyPath.lastPushedText, keyPath.textEmbedded), keyPath.status = 1;
				} finally {
					task.blockedSegment = newProps;
				}
			} else renderNode(request, task, initialState, -1);
			task.formatContext = defaultProps;
			task.keyPath = ref;
			a: {
				task = newProps.chunks;
				request = request.resumableState;
				switch (type) {
					case "title":
					case "style":
					case "script":
					case "area":
					case "base":
					case "br":
					case "col":
					case "embed":
					case "hr":
					case "img":
					case "input":
					case "keygen":
					case "link":
					case "meta":
					case "param":
					case "source":
					case "track":
					case "wbr": break a;
					case "body":
						if (1 >= defaultProps.insertionMode) {
							request.hasBody = true;
							break a;
						}
						break;
					case "html":
						if (0 === defaultProps.insertionMode) {
							request.hasHtml = true;
							break a;
						}
						break;
					case "head": if (1 >= defaultProps.insertionMode) break a;
				}
				task.push(endChunkForTag(type));
			}
			newProps.lastPushedText = false;
		}
		else {
			switch (type) {
				case REACT_LEGACY_HIDDEN_TYPE:
				case REACT_STRICT_MODE_TYPE:
				case REACT_PROFILER_TYPE:
				case REACT_FRAGMENT_TYPE:
					type = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, props.children, -1);
					task.keyPath = type;
					return;
				case REACT_ACTIVITY_TYPE:
					type = task.blockedSegment;
					null === type ? "hidden" !== props.mode && (type = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = type) : "hidden" !== props.mode && (request.renderState.generateStaticMarkup || type.chunks.push("<!--&-->"), type.lastPushedText = false, newProps = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = newProps, request.renderState.generateStaticMarkup || type.chunks.push("<!--/&-->"), type.lastPushedText = false);
					return;
				case REACT_SUSPENSE_LIST_TYPE:
					a: {
						type = props.children;
						props = props.revealOrder;
						if ("forwards" === props || "backwards" === props || "unstable_legacy-backwards" === props) {
							if (isArrayImpl(type)) {
								renderSuspenseListRows(request, task, keyPath, type, props);
								break a;
							}
							if (newProps = getIteratorFn(type)) {
								if (newProps = newProps.call(type)) {
									defaultProps = newProps.next();
									if (!defaultProps.done) {
										do
											defaultProps = newProps.next();
										while (!defaultProps.done);
										renderSuspenseListRows(request, task, keyPath, type, props);
									}
									break a;
								}
							}
						}
						"together" === props ? (props = task.keyPath, newProps = task.row, defaultProps = task.row = createSuspenseListRow(null), defaultProps.boundaries = [], defaultProps.together = true, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), 0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps), task.keyPath = props, task.row = newProps, null !== newProps && 0 < defaultProps.pendingTasks && (newProps.pendingTasks++, defaultProps.next = newProps)) : (props = task.keyPath, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), task.keyPath = props);
					}
					return;
				case REACT_VIEW_TRANSITION_TYPE:
				case REACT_SCOPE_TYPE: throw Error(formatProdErrorMessage(343));
				case REACT_SUSPENSE_TYPE:
					a: if (null !== task.replay) {
						type = task.keyPath;
						newProps = task.formatContext;
						defaultProps = task.row;
						task.keyPath = keyPath;
						task.formatContext = getSuspenseContentFormatContext(0, newProps);
						task.row = null;
						keyPath = props.children;
						try {
							renderNode(request, task, keyPath, -1);
						} finally {
							task.keyPath = type, task.formatContext = newProps, task.row = defaultProps;
						}
					} else {
						type = task.keyPath;
						ref = task.formatContext;
						var prevRow = task.row, parentBoundary = task.blockedBoundary;
						propName$43 = task.blockedPreamble;
						var parentHoistableState = task.hoistableState;
						propName = task.blockedSegment;
						var fallback = props.fallback;
						props = props.children;
						var fallbackAbortSet = new Set();
						var newBoundary = createSuspenseBoundary(request, task.row, fallbackAbortSet, null);
						null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
						var boundarySegment = createPendingSegment(0, propName.chunks.length, newBoundary, task.formatContext, false, false);
						propName.children.push(boundarySegment);
						propName.lastPushedText = false;
						var contentRootSegment = createPendingSegment(0, 0, null, task.formatContext, false, false);
						contentRootSegment.parentFlushed = true;
						if (null !== request.trackedPostpones) {
							newProps = task.componentStack;
							defaultProps = [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							];
							initialState = [
								defaultProps[1],
								defaultProps[2],
								[],
								null
							];
							request.trackedPostpones.workingMap.set(defaultProps, initialState);
							newBoundary.trackedFallbackNode = initialState;
							task.blockedSegment = boundarySegment;
							task.blockedPreamble = newBoundary.fallbackPreamble;
							task.keyPath = defaultProps;
							task.formatContext = getSuspenseFallbackFormatContext(request.resumableState, ref);
							task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
							boundarySegment.status = 6;
							try {
								renderNode(request, task, fallback, -1), pushSegmentFinale(boundarySegment.chunks, request.renderState, boundarySegment.lastPushedText, boundarySegment.textEmbedded), boundarySegment.status = 1;
							} catch (thrownValue) {
								throw boundarySegment.status = 12 === request.status ? 3 : 4, thrownValue;
							} finally {
								task.blockedSegment = propName, task.blockedPreamble = propName$43, task.keyPath = type, task.formatContext = ref;
							}
							task = createRenderTask(request, null, props, -1, newBoundary, contentRootSegment, newBoundary.contentPreamble, newBoundary.contentState, task.abortSet, keyPath, getSuspenseContentFormatContext(0, task.formatContext), task.context, task.treeContext, null, newProps);
							pushComponentStack(task);
							request.pingedTasks.push(task);
						} else {
							task.blockedBoundary = newBoundary;
							task.blockedPreamble = newBoundary.contentPreamble;
							task.hoistableState = newBoundary.contentState;
							task.blockedSegment = contentRootSegment;
							task.keyPath = keyPath;
							task.formatContext = getSuspenseContentFormatContext(0, ref);
							task.row = null;
							contentRootSegment.status = 6;
							try {
								if (renderNode(request, task, props, -1), pushSegmentFinale(contentRootSegment.chunks, request.renderState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded), contentRootSegment.status = 1, queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
									if (newBoundary.status = 1, !isEligibleForOutlining(0, newBoundary)) {
										null !== prevRow && 0 === --prevRow.pendingTasks && finishSuspenseListRow(request, prevRow);
										0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
										break a;
									}
								} else null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
							} catch (thrownValue$30) {
								newBoundary.status = 4, 12 === request.status ? (contentRootSegment.status = 3, newProps = request.fatalError) : (contentRootSegment.status = 4, newProps = thrownValue$30), defaultProps = getThrownInfo(task.componentStack), initialState = logRecoverableError(request, newProps, defaultProps), newBoundary.errorDigest = initialState, untrackBoundary(request, newBoundary);
							} finally {
								task.blockedBoundary = parentBoundary, task.blockedPreamble = propName$43, task.hoistableState = parentHoistableState, task.blockedSegment = propName, task.keyPath = type, task.formatContext = ref, task.row = prevRow;
							}
							task = createRenderTask(request, null, fallback, -1, parentBoundary, boundarySegment, newBoundary.fallbackPreamble, newBoundary.fallbackState, fallbackAbortSet, [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
							pushComponentStack(task);
							request.pingedTasks.push(task);
						}
					}
					return;
			}
			if ("object" === typeof type && null !== type) switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE:
					if ("ref" in props) for (fallback in newProps = {}, props) "ref" !== fallback && (newProps[fallback] = props[fallback]);
					else newProps = props;
					type = renderWithHooks(request, task, keyPath, type.render, newProps, ref);
					finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
					return;
				case REACT_MEMO_TYPE:
					renderElement(request, task, keyPath, type.type, props, ref);
					return;
				case REACT_CONTEXT_TYPE:
					defaultProps = props.children;
					newProps = task.keyPath;
					props = props.value;
					initialState = type._currentValue2;
					type._currentValue2 = props;
					ref = currentActiveSnapshot;
					currentActiveSnapshot = type = {
						parent: ref,
						depth: null === ref ? 0 : ref.depth + 1,
						context: type,
						parentValue: initialState,
						value: props
					};
					task.context = type;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, defaultProps, -1);
					request = currentActiveSnapshot;
					if (null === request) throw Error(formatProdErrorMessage(403));
					request.context._currentValue2 = request.parentValue;
					request = currentActiveSnapshot = request.parent;
					task.context = request;
					task.keyPath = newProps;
					return;
				case REACT_CONSUMER_TYPE:
					props = props.children;
					type = props(type._context._currentValue2);
					props = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, type, -1);
					task.keyPath = props;
					return;
				case REACT_LAZY_TYPE:
					newProps = type._init;
					type = newProps(type._payload);
					if (12 === request.status) throw null;
					renderElement(request, task, keyPath, type, props, ref);
					return;
			}
			throw Error(formatProdErrorMessage(130, null == type ? type : typeof type, ""));
		}
	}
	function resumeNode(request, task, segmentId, node, childIndex) {
		var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(0, 0, null, task.formatContext, false, false);
		resumedSegment.id = segmentId;
		resumedSegment.parentFlushed = true;
		try {
			task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
		} finally {
			task.replay = prevReplay, task.blockedSegment = null;
		}
	}
	function renderNodeDestructive(request, task, node, childIndex) {
		null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
	}
	function retryNode(request, task) {
		var node = task.node, childIndex = task.childIndex;
		if (null !== node) {
			if ("object" === typeof node) {
				switch (node.$$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = node.type, key = node.key, props = node.props;
						node = props.ref;
						var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key ? -1 === childIndex ? 0 : childIndex : key;
						key = [
							task.keyPath,
							name,
							keyOrIndex
						];
						if (null !== task.replay) a: {
							var replay = task.replay;
							childIndex = replay.nodes;
							for (node = 0; node < childIndex.length; node++) {
								var node$jscomp$0 = childIndex[node];
								if (keyOrIndex === node$jscomp$0[1]) {
									if (4 === node$jscomp$0.length) {
										if (null !== name && name !== node$jscomp$0[0]) throw Error(formatProdErrorMessage(490, node$jscomp$0[0], name));
										var childNodes = node$jscomp$0[2];
										name = node$jscomp$0[3];
										keyOrIndex = task.node;
										task.replay = {
											nodes: childNodes,
											slots: name,
											pendingTasks: 1
										};
										try {
											renderElement(request, task, key, type, props, ref);
											if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
											task.replay.pendingTasks--;
										} catch (x) {
											if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw task.node === keyOrIndex ? task.replay = replay : childIndex.splice(node, 1), x;
											task.replay.pendingTasks--;
											props = getThrownInfo(task.componentStack);
											key = request;
											request = task.blockedBoundary;
											type = x;
											props = logRecoverableError(key, type, props);
											abortRemainingReplayNodes(key, request, childNodes, name, type, props);
										}
										task.replay = replay;
									} else {
										if (type !== REACT_SUSPENSE_TYPE) throw Error(formatProdErrorMessage(490, "Suspense", getComponentNameFromType(type) || "Unknown"));
										b: {
											replay = void 0;
											type = node$jscomp$0[5];
											ref = node$jscomp$0[2];
											name = node$jscomp$0[3];
											keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
											node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
											var prevKeyPath = task.keyPath, prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children, fallback = props.fallback, fallbackAbortSet = new Set();
											props = createSuspenseBoundary(request, task.row, fallbackAbortSet, null);
											props.parentFlushed = true;
											props.rootSegmentID = type;
											task.blockedBoundary = props;
											task.hoistableState = props.contentState;
											task.keyPath = key;
											task.formatContext = getSuspenseContentFormatContext(0, prevContext);
											task.row = null;
											task.replay = {
												nodes: ref,
												slots: name,
												pendingTasks: 1
											};
											try {
												renderNode(request, task, content, -1);
												if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
												task.replay.pendingTasks--;
												if (0 === props.pendingTasks && 0 === props.status) {
													props.status = 1;
													request.completedBoundaries.push(props);
													break b;
												}
											} catch (error) {
												props.status = 4, childNodes = getThrownInfo(task.componentStack), replay = logRecoverableError(request, error, childNodes), props.errorDigest = replay, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(props);
											} finally {
												task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = prevKeyPath, task.formatContext = prevContext, task.row = prevRow;
											}
											childNodes = createReplayTask(request, null, {
												nodes: keyOrIndex,
												slots: node$jscomp$0,
												pendingTasks: 0
											}, fallback, -1, parentBoundary, props.fallbackState, fallbackAbortSet, [
												key[0],
												"Suspense Fallback",
												key[2]
											], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
											pushComponentStack(childNodes);
											request.pingedTasks.push(childNodes);
										}
									}
									childIndex.splice(node, 1);
									break a;
								}
							}
						}
						else renderElement(request, task, key, type, props, ref);
						return;
					case REACT_PORTAL_TYPE: throw Error(formatProdErrorMessage(257));
					case REACT_LAZY_TYPE:
						childNodes = node._init;
						node = childNodes(node._payload);
						if (12 === request.status) throw null;
						renderNodeDestructive(request, task, node, childIndex);
						return;
				}
				if (isArrayImpl(node)) {
					renderChildrenArray(request, task, node, childIndex);
					return;
				}
				if (childNodes = getIteratorFn(node)) {
					if (childNodes = childNodes.call(node)) {
						node = childNodes.next();
						if (!node.done) {
							props = [];
							do
								props.push(node.value), node = childNodes.next();
							while (!node.done);
							renderChildrenArray(request, task, props, childIndex);
						}
						return;
					}
				}
				if ("function" === typeof node.then) return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
				if (node.$$typeof === REACT_CONTEXT_TYPE) return renderNodeDestructive(request, task, node._currentValue2, childIndex);
				childIndex = Object.prototype.toString.call(node);
				throw Error(formatProdErrorMessage(31, "[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex));
			}
			if ("string" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, node, request.renderState, childIndex.lastPushedText));
			else if ("number" === typeof node || "bigint" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, "" + node, request.renderState, childIndex.lastPushedText));
		}
	}
	function renderChildrenArray(request, task, children, childIndex) {
		var prevKeyPath = task.keyPath;
		if (-1 !== childIndex && (task.keyPath = [
			task.keyPath,
			"Fragment",
			childIndex
		], null !== task.replay)) {
			for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
				var node = replayNodes[j];
				if (node[1] === childIndex) {
					childIndex = node[2];
					node = node[3];
					task.replay = {
						nodes: childIndex,
						slots: node,
						pendingTasks: 1
					};
					try {
						renderChildrenArray(request, task, children, -1);
						if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
						task.replay.pendingTasks--;
					} catch (x) {
						if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw x;
						task.replay.pendingTasks--;
						children = getThrownInfo(task.componentStack);
						var boundary = task.blockedBoundary, error = x;
						children = logRecoverableError(request, error, children);
						abortRemainingReplayNodes(request, boundary, childIndex, node, error, children);
					}
					task.replay = replay;
					replayNodes.splice(j, 1);
					break;
				}
			}
			task.keyPath = prevKeyPath;
			return;
		}
		replay = task.treeContext;
		replayNodes = children.length;
		if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
			for (childIndex = 0; childIndex < replayNodes; childIndex++) node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode(request, task, node, childIndex);
			task.treeContext = replay;
			task.keyPath = prevKeyPath;
			return;
		}
		for (j = 0; j < replayNodes; j++) childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode(request, task, childIndex, j);
		task.treeContext = replay;
		task.keyPath = prevKeyPath;
	}
	function trackPostponedBoundary(request, trackedPostpones, boundary) {
		boundary.status = 5;
		boundary.rootSegmentID = request.nextSegmentId++;
		request = boundary.trackedContentKeyPath;
		if (null === request) throw Error(formatProdErrorMessage(486));
		var fallbackReplayNode = boundary.trackedFallbackNode, children = [], boundaryNode = trackedPostpones.workingMap.get(request);
		if (void 0 === boundaryNode) return boundary = [
			request[1],
			request[2],
			children,
			null,
			fallbackReplayNode,
			boundary.rootSegmentID
		], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
		boundaryNode[4] = fallbackReplayNode;
		boundaryNode[5] = boundary.rootSegmentID;
		return boundaryNode;
	}
	function trackPostpone(request, trackedPostpones, task, segment) {
		segment.status = 5;
		var keyPath = task.keyPath, boundary = task.blockedBoundary;
		if (null === boundary) segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
		else {
			if (null !== boundary && 0 === boundary.status) {
				var boundaryNode = trackPostponedBoundary(request, trackedPostpones, boundary);
				if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
					-1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
					boundaryNode[3] = segment.id;
					return;
				}
			}
			-1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
			if (-1 === task.childIndex) null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [
				keyPath[1],
				keyPath[2],
				[],
				segment.id
			], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
			else {
				if (null === keyPath) if (request = trackedPostpones.rootSlots, null === request) request = trackedPostpones.rootSlots = {};
				else {
					if ("number" === typeof request) throw Error(formatProdErrorMessage(491));
				}
				else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode) request = {}, boundaryNode = [
					keyPath[1],
					keyPath[2],
					[],
					request
				], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
				else if (request = boundaryNode[3], null === request) request = boundaryNode[3] = {};
				else if ("number" === typeof request) throw Error(formatProdErrorMessage(491));
				request[task.childIndex] = segment.id;
			}
		}
	}
	function untrackBoundary(request, boundary) {
		request = request.trackedPostpones;
		null !== request && (boundary = boundary.trackedContentKeyPath, null !== boundary && (boundary = request.workingMap.get(boundary), void 0 !== boundary && (boundary.length = 4, boundary[2] = [], boundary[3] = null)));
	}
	function spawnNewSuspendedReplayTask(request, task, thenableState) {
		return createReplayTask(request, thenableState, task.replay, task.node, task.childIndex, task.blockedBoundary, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function spawnNewSuspendedRenderTask(request, task, thenableState) {
		var segment = task.blockedSegment, newSegment = createPendingSegment(0, segment.chunks.length, null, task.formatContext, segment.lastPushedText, true);
		segment.children.push(newSegment);
		segment.lastPushedText = false;
		return createRenderTask(request, thenableState, task.node, task.childIndex, task.blockedBoundary, newSegment, task.blockedPreamble, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function renderNode(request, task, node, childIndex) {
		var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
		if (null === segment) {
			segment = task.replay;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue) {
				if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
						node.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						node = spawnNewSuspendedReplayTask(request, task, node);
						request.pingedTasks.push(node);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
				}
			}
		} else {
			var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue$62) {
				if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$62 === SuspenseException ? getSuspendedThenable() : thrownValue$62, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						segment = node;
						node = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedRenderTask(request, task, node).ping;
						segment.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						segment = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
						segment = spawnNewSuspendedRenderTask(request, task, segment);
						request.pingedTasks.push(segment);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
				}
			}
		}
		task.formatContext = previousFormatContext;
		task.context = previousContext;
		task.keyPath = previousKeyPath;
		task.treeContext = previousTreeContext;
		switchContext(previousContext);
		throw node;
	}
	function abortTaskSoft(task) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
	}
	function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (4 === node.length) abortRemainingReplayNodes(request$jscomp$0, boundary, node[2], node[3], error, errorDigest$jscomp$0);
			else {
				node = node[5];
				var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(0, null, new Set());
				resumedBoundary.parentFlushed = true;
				resumedBoundary.rootSegmentID = node;
				resumedBoundary.status = 4;
				resumedBoundary.errorDigest = errorDigest;
				resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
			}
		}
		nodes.length = 0;
		if (null !== slots) {
			if (null === boundary) throw Error(formatProdErrorMessage(487));
			4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
			if ("object" === typeof slots) for (var index in slots) delete slots[index];
		}
	}
	function abortTask(task, request, error) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		if (null !== segment) {
			if (6 === segment.status) return;
			segment.status = 3;
		}
		var errorInfo = getThrownInfo(task.componentStack);
		if (null === boundary) {
			if (13 !== request.status && 14 !== request.status) {
				boundary = task.replay;
				if (null === boundary) {
					null !== request.trackedPostpones && null !== segment ? (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment)) : (logRecoverableError(request, error, errorInfo), fatalError(request, error));
					return;
				}
				boundary.pendingTasks--;
				0 === boundary.pendingTasks && 0 < boundary.nodes.length && (segment = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(request, null, boundary.nodes, boundary.slots, error, segment));
				request.pendingRootTasks--;
				0 === request.pendingRootTasks && completeShell(request);
			}
		} else {
			var trackedPostpones$63 = request.trackedPostpones;
			if (4 !== boundary.status) {
				if (null !== trackedPostpones$63 && null !== segment) return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$63, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
					return abortTask(fallbackTask, request, error);
				}), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
				boundary.status = 4;
				segment = logRecoverableError(request, error, errorInfo);
				boundary.status = 4;
				boundary.errorDigest = segment;
				untrackBoundary(request, boundary);
				boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
			}
			boundary.pendingTasks--;
			segment = boundary.row;
			null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
			boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
				return abortTask(fallbackTask, request, error);
			});
			boundary.fallbackAbortableTasks.clear();
		}
		task = task.row;
		null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
		request.allPendingTasks--;
		0 === request.allPendingTasks && completeAll(request);
	}
	function safelyEmitEarlyPreloads(request, shellComplete) {
		try {
			var renderState = request.renderState, onHeaders = renderState.onHeaders;
			if (onHeaders) {
				var headers = renderState.headers;
				if (headers) {
					renderState.headers = null;
					var linkHeader = headers.preconnects;
					headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
					headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
					if (!shellComplete) {
						var queueIter = renderState.styles.values(), queueStep = queueIter.next();
						b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next()) for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
							var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
								crossOrigin: props$jscomp$0.crossOrigin,
								integrity: props$jscomp$0.integrity,
								nonce: props$jscomp$0.nonce,
								type: props$jscomp$0.type,
								fetchPriority: props$jscomp$0.fetchPriority,
								referrerPolicy: props$jscomp$0.referrerPolicy,
								media: props$jscomp$0.media
							});
							if (0 <= (headers.remainingCapacity -= header.length + 2)) renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
							else break b;
						}
					}
					linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
				}
			}
		} catch (error) {
			logRecoverableError(request, error, {});
		}
	}
	function completeShell(request) {
		null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
		null === request.trackedPostpones && preparePreamble(request);
		request.onShellError = noop;
		request = request.onShellReady;
		request();
	}
	function completeAll(request) {
		safelyEmitEarlyPreloads(request, null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status);
		preparePreamble(request);
		request = request.onAllReady;
		request();
	}
	function queueCompletedSegment(boundary, segment) {
		if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
			var childSegment = segment.children[0];
			childSegment.id = segment.id;
			childSegment.parentFlushed = true;
			1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
		} else boundary.completedSegments.push(segment);
	}
	function finishedTask(request, boundary, row, segment) {
		null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
		request.allPendingTasks--;
		if (null === boundary) {
			if (null !== segment && segment.parentFlushed) {
				if (null !== request.completedRootSegment) throw Error(formatProdErrorMessage(389));
				request.completedRootSegment = segment;
			}
			request.pendingRootTasks--;
			0 === request.pendingRootTasks && completeShell(request);
		} else if (boundary.pendingTasks--, 4 !== boundary.status) if (0 === boundary.pendingTasks) if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status) row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(0, boundary) || (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.contentPreamble && preparePreamble(request);
		else {
			if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
				if (null !== request.trackedPostpones) {
					row = request.trackedPostpones;
					var postponedRow = boundary.next;
					if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment)) for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
						var postponedBoundary = segment[postponedRow];
						trackPostponedBoundary(request, row, postponedBoundary);
						finishedTask(request, postponedBoundary, null, null);
					}
				}
				0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
			}
		}
		else null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
		0 === request.allPendingTasks && completeAll(request);
	}
	function performWork(request$jscomp$2) {
		if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
			var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.a;
			ReactSharedInternals.a = HooksDispatcher;
			var prevResumableState = currentResumableState;
			currentResumableState = request$jscomp$2.resumableState;
			try {
				var pingedTasks = request$jscomp$2.pingedTasks, i;
				for (i = 0; i < pingedTasks.length; i++) {
					var task = pingedTasks[i], request = request$jscomp$2, segment = task.blockedSegment;
					if (null === segment) {
						var request$jscomp$0 = request;
						if (0 !== task.replay.pendingTasks) {
							switchContext(task.context);
							try {
								"number" === typeof task.replay.slots ? resumeNode(request$jscomp$0, task, task.replay.slots, task.node, task.childIndex) : retryNode(request$jscomp$0, task);
								if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
								task.replay.pendingTasks--;
								task.abortSet.delete(task);
								finishedTask(request$jscomp$0, task.blockedBoundary, task.row, null);
							} catch (thrownValue) {
								resetHooksState();
								var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
								if ("object" === typeof x && null !== x && "function" === typeof x.then) {
									var ping = task.ping;
									x.then(ping, ping);
									task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								} else {
									task.replay.pendingTasks--;
									task.abortSet.delete(task);
									var errorInfo = getThrownInfo(task.componentStack);
									request = void 0;
									var request$jscomp$1 = request$jscomp$0, boundary = task.blockedBoundary, error$jscomp$0 = 12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots;
									request = logRecoverableError(request$jscomp$1, error$jscomp$0, errorInfo);
									abortRemainingReplayNodes(request$jscomp$1, boundary, replayNodes, resumeSlots, error$jscomp$0, request);
									request$jscomp$0.pendingRootTasks--;
									0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
									request$jscomp$0.allPendingTasks--;
									0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
								}
							}
						}
					} else if (request$jscomp$0 = void 0, request$jscomp$1 = segment, 0 === request$jscomp$1.status) {
						request$jscomp$1.status = 6;
						switchContext(task.context);
						var childrenLength = request$jscomp$1.children.length, chunkLength = request$jscomp$1.chunks.length;
						try {
							retryNode(request, task), pushSegmentFinale(request$jscomp$1.chunks, request.renderState, request$jscomp$1.lastPushedText, request$jscomp$1.textEmbedded), task.abortSet.delete(task), request$jscomp$1.status = 1, finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
						} catch (thrownValue) {
							resetHooksState();
							request$jscomp$1.children.length = childrenLength;
							request$jscomp$1.chunks.length = chunkLength;
							var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : 12 === request.status ? request.fatalError : thrownValue;
							if (12 === request.status && null !== request.trackedPostpones) {
								var trackedPostpones = request.trackedPostpones, thrownInfo = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								logRecoverableError(request, x$jscomp$0, thrownInfo);
								trackPostpone(request, trackedPostpones, task, request$jscomp$1);
								finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
							} else if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0 && "function" === typeof x$jscomp$0.then) {
								request$jscomp$1.status = 0;
								task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								var ping$jscomp$0 = task.ping;
								x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
							} else {
								var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								request$jscomp$1.status = 4;
								var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
								null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
								request.allPendingTasks--;
								request$jscomp$0 = logRecoverableError(request, x$jscomp$0, errorInfo$jscomp$0);
								if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
								else if (boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status) {
									boundary$jscomp$0.status = 4;
									boundary$jscomp$0.errorDigest = request$jscomp$0;
									untrackBoundary(request, boundary$jscomp$0);
									var boundaryRow = boundary$jscomp$0.row;
									null !== boundaryRow && 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow);
									boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
									0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.contentPreamble && preparePreamble(request);
								}
								0 === request.allPendingTasks && completeAll(request);
							}
						}
					}
				}
				pingedTasks.splice(0, i);
				null !== request$jscomp$2.destination && flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
			} catch (error) {
				logRecoverableError(request$jscomp$2, error, {}), fatalError(request$jscomp$2, error);
			} finally {
				currentResumableState = prevResumableState, ReactSharedInternals.a = prevDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext);
			}
		}
	}
	function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
		segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
		for (var pendingPreambles = false, i = 0; i < segment.children.length; i++) pendingPreambles = preparePreambleFromSegment(request, segment.children[i], collectedPreambleSegments) || pendingPreambles;
		return pendingPreambles;
	}
	function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
		var boundary = segment.boundary;
		if (null === boundary) return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
		var preamble = boundary.contentPreamble, fallbackPreamble = boundary.fallbackPreamble;
		if (null === preamble || null === fallbackPreamble) return false;
		switch (boundary.status) {
			case 1:
				hoistPreambleState(request.renderState, preamble);
				request.byteSize += boundary.byteSize;
				segment = boundary.completedSegments[0];
				if (!segment) throw Error(formatProdErrorMessage(391));
				return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			case 5: if (null !== request.trackedPostpones) return true;
			case 4: if (1 === segment.status) return hoistPreambleState(request.renderState, fallbackPreamble), preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			default: return true;
		}
	}
	function preparePreamble(request) {
		if (request.completedRootSegment && null === request.completedPreambleSegments) {
			var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(request, request.completedRootSegment, collectedPreambleSegments), preamble = request.renderState.preamble;
			false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
		}
	}
	function flushSubtree(request, destination, segment, hoistableState) {
		segment.parentFlushed = true;
		switch (segment.status) {
			case 0: segment.id = request.nextSegmentId++;
			case 5: return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, destination.push("<template id=\""), destination.push(request.placeholderPrefix), request = hoistableState.toString(16), destination.push(request), destination.push("\"></template>");
			case 1:
				segment.status = 2;
				var r = true, chunks = segment.chunks, chunkIdx = 0;
				segment = segment.children;
				for (var childIdx = 0; childIdx < segment.length; childIdx++) {
					for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++) destination.push(chunks[chunkIdx]);
					r = flushSegment(request, destination, r, hoistableState);
				}
				for (; chunkIdx < chunks.length - 1; chunkIdx++) destination.push(chunks[chunkIdx]);
				chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
				return r;
			case 3: return true;
			default: throw Error(formatProdErrorMessage(390));
		}
	}
	var flushedByteSize = 0;
	function flushSegment(request, destination, segment, hoistableState) {
		var boundary = segment.boundary;
		if (null === boundary) return flushSubtree(request, destination, segment, hoistableState);
		boundary.parentFlushed = true;
		if (4 === boundary.status) {
			var row = boundary.row;
			null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
			request.renderState.generateStaticMarkup || (boundary = boundary.errorDigest, destination.push("<!--$!-->"), destination.push("<template"), boundary && (destination.push(" data-dgst=\""), boundary = escapeTextForBrowser(boundary), destination.push(boundary), destination.push("\"")), destination.push("></template>"));
			flushSubtree(request, destination, segment, hoistableState);
			request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
			return request;
		}
		if (1 !== boundary.status) return 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
		if (!flushingPartialBoundaries && isEligibleForOutlining(0, boundary) && flushedByteSize + boundary.byteSize > request.progressiveChunkSize) return boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
		flushedByteSize += boundary.byteSize;
		hoistableState && hoistHoistables(hoistableState, boundary.contentState);
		segment = boundary.row;
		null !== segment && isEligibleForOutlining(0, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
		request.renderState.generateStaticMarkup || destination.push("<!--$-->");
		segment = boundary.completedSegments;
		if (1 !== segment.length) throw Error(formatProdErrorMessage(391));
		flushSegment(request, destination, segment[0], hoistableState);
		request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
		return request;
	}
	function flushSegmentContainer(request, destination, segment, hoistableState) {
		writeStartSegment(destination, request.renderState, segment.parentFormatContext, segment.id);
		flushSegment(request, destination, segment, hoistableState);
		return writeEndSegment(destination, segment.parentFormatContext);
	}
	function flushCompletedBoundary(request, destination, boundary) {
		flushedByteSize = boundary.byteSize;
		for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++) flushPartiallyCompletedSegment(request, destination, boundary, completedSegments[i]);
		completedSegments.length = 0;
		completedSegments = boundary.row;
		null !== completedSegments && isEligibleForOutlining(0, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
		writeHoistablesForBoundary(destination, boundary.contentState, request.renderState);
		completedSegments = request.resumableState;
		request = request.renderState;
		i = boundary.rootSegmentID;
		boundary = boundary.contentState;
		var requiresStyleInsertion = request.stylesToHoist;
		request.stylesToHoist = false;
		destination.push(request.startInlineScript);
		destination.push(">");
		requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, destination.push("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};")), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};")), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, destination.push("$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll(\"link[data-precedence],style[data-precedence]\"),v=[],k=0;b=e[k++];)\"not all\"===b.getAttribute(\"media\")?v.push(b):(\"LINK\"===b.tagName&&$RM.set(b.getAttribute(\"href\"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement(\"link\");a.href=d;a.rel=\n\"stylesheet\";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute(\"media\");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute(\"data-precedence\");a.removeAttribute(\"media\")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n\"$~\";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,\"CSS failed to load\"))};$RR(\"")) : destination.push("$RR(\"")) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};")), destination.push("$RC(\""));
		completedSegments = i.toString(16);
		destination.push(request.boundaryPrefix);
		destination.push(completedSegments);
		destination.push("\",\"");
		destination.push(request.segmentPrefix);
		destination.push(completedSegments);
		requiresStyleInsertion ? (destination.push("\","), writeStyleResourceDependenciesInJS(destination, boundary)) : destination.push("\"");
		boundary = destination.push(")<\/script>");
		return writeBootstrap(destination, request) && boundary;
	}
	function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
		if (2 === segment.status) return true;
		var hoistableState = boundary.contentState, segmentID = segment.id;
		if (-1 === segmentID) {
			if (-1 === (segment.id = boundary.rootSegmentID)) throw Error(formatProdErrorMessage(392));
			return flushSegmentContainer(request, destination, segment, hoistableState);
		}
		if (segmentID === boundary.rootSegmentID) return flushSegmentContainer(request, destination, segment, hoistableState);
		flushSegmentContainer(request, destination, segment, hoistableState);
		boundary = request.resumableState;
		request = request.renderState;
		destination.push(request.startInlineScript);
		destination.push(">");
		0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, destination.push("$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\"")) : destination.push("$RS(\"");
		destination.push(request.segmentPrefix);
		segmentID = segmentID.toString(16);
		destination.push(segmentID);
		destination.push("\",\"");
		destination.push(request.placeholderPrefix);
		destination.push(segmentID);
		destination = destination.push("\")<\/script>");
		return destination;
	}
	var flushingPartialBoundaries = false;
	function flushCompletedQueues(request, destination) {
		try {
			if (!(0 < request.pendingRootTasks)) {
				var i, completedRootSegment = request.completedRootSegment;
				if (null !== completedRootSegment) {
					if (5 === completedRootSegment.status) return;
					var completedPreambleSegments = request.completedPreambleSegments;
					if (null === completedPreambleSegments) return;
					flushedByteSize = request.byteSize;
					var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
					if (htmlChunks) {
						for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++) destination.push(htmlChunks[i$jscomp$0]);
						if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) destination.push(headChunks[i$jscomp$0]);
						else {
							var chunk = startChunkForTag("head");
							destination.push(chunk);
							destination.push(">");
						}
					} else if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) destination.push(headChunks[i$jscomp$0]);
					var charsetChunks = renderState.charsetChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++) destination.push(charsetChunks[i$jscomp$0]);
					charsetChunks.length = 0;
					renderState.preconnects.forEach(flushResource, destination);
					renderState.preconnects.clear();
					var viewportChunks = renderState.viewportChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++) destination.push(viewportChunks[i$jscomp$0]);
					viewportChunks.length = 0;
					renderState.fontPreloads.forEach(flushResource, destination);
					renderState.fontPreloads.clear();
					renderState.highImagePreloads.forEach(flushResource, destination);
					renderState.highImagePreloads.clear();
					currentlyFlushingRenderState = renderState;
					renderState.styles.forEach(flushStylesInPreamble, destination);
					currentlyFlushingRenderState = null;
					var importMapChunks = renderState.importMapChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++) destination.push(importMapChunks[i$jscomp$0]);
					importMapChunks.length = 0;
					renderState.bootstrapScripts.forEach(flushResource, destination);
					renderState.scripts.forEach(flushResource, destination);
					renderState.scripts.clear();
					renderState.bulkPreloads.forEach(flushResource, destination);
					renderState.bulkPreloads.clear();
					resumableState.instructions |= 32;
					var hoistableChunks = renderState.hoistableChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++) destination.push(hoistableChunks[i$jscomp$0]);
					for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
						var segments = completedPreambleSegments[resumableState];
						for (renderState = 0; renderState < segments.length; renderState++) flushSegment(request, destination, segments[renderState], null);
					}
					var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
					if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
						var chunk$jscomp$0 = endChunkForTag("head");
						destination.push(chunk$jscomp$0);
					}
					var bodyChunks = preamble$jscomp$0.bodyChunks;
					if (bodyChunks) for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++) destination.push(bodyChunks[completedPreambleSegments]);
					flushSegment(request, destination, completedRootSegment, null);
					request.completedRootSegment = null;
					var renderState$jscomp$0 = request.renderState;
					if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
						var resumableState$jscomp$0 = request.resumableState;
						if (0 === (resumableState$jscomp$0.instructions & 64)) {
							resumableState$jscomp$0.instructions |= 64;
							destination.push(renderState$jscomp$0.startInlineScript);
							if (0 === (resumableState$jscomp$0.instructions & 32)) {
								resumableState$jscomp$0.instructions |= 32;
								var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
								destination.push(" id=\"");
								var chunk$jscomp$1 = escapeTextForBrowser(shellId);
								destination.push(chunk$jscomp$1);
								destination.push("\"");
							}
							destination.push(">");
							destination.push("requestAnimationFrame(function(){$RT=performance.now()});");
							destination.push("<\/script>");
						}
					}
					writeBootstrap(destination, renderState$jscomp$0);
				}
				var renderState$jscomp$1 = request.renderState;
				completedRootSegment = 0;
				var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
				for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++) destination.push(viewportChunks$jscomp$0[completedRootSegment]);
				viewportChunks$jscomp$0.length = 0;
				renderState$jscomp$1.preconnects.forEach(flushResource, destination);
				renderState$jscomp$1.preconnects.clear();
				renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.fontPreloads.clear();
				renderState$jscomp$1.highImagePreloads.forEach(flushResource, destination);
				renderState$jscomp$1.highImagePreloads.clear();
				renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
				renderState$jscomp$1.scripts.forEach(flushResource, destination);
				renderState$jscomp$1.scripts.clear();
				renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.bulkPreloads.clear();
				var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
				for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++) destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
				hoistableChunks$jscomp$0.length = 0;
				var clientRenderedBoundaries = request.clientRenderedBoundaries;
				for (i = 0; i < clientRenderedBoundaries.length; i++) {
					var boundary = clientRenderedBoundaries[i];
					renderState$jscomp$1 = destination;
					var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
					renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
					renderState$jscomp$1.push(">");
					0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, renderState$jscomp$1.push("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX(\"")) : renderState$jscomp$1.push("$RX(\"");
					renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
					var chunk$jscomp$2 = id.toString(16);
					renderState$jscomp$1.push(chunk$jscomp$2);
					renderState$jscomp$1.push("\"");
					if (errorDigest) {
						renderState$jscomp$1.push(",");
						var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(errorDigest || "");
						renderState$jscomp$1.push(chunk$jscomp$3);
					}
					var JSCompiler_inline_result = renderState$jscomp$1.push(")<\/script>");
					if (!JSCompiler_inline_result) {
						request.destination = null;
						i++;
						clientRenderedBoundaries.splice(0, i);
						return;
					}
				}
				clientRenderedBoundaries.splice(0, i);
				var completedBoundaries = request.completedBoundaries;
				for (i = 0; i < completedBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
					request.destination = null;
					i++;
					completedBoundaries.splice(0, i);
					return;
				}
				completedBoundaries.splice(0, i);
				flushingPartialBoundaries = true;
				var partialBoundaries = request.partialBoundaries;
				for (i = 0; i < partialBoundaries.length; i++) {
					var boundary$69 = partialBoundaries[i];
					a: {
						clientRenderedBoundaries = request;
						boundary = destination;
						flushedByteSize = boundary$69.byteSize;
						var completedSegments = boundary$69.completedSegments;
						for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++) if (!flushPartiallyCompletedSegment(clientRenderedBoundaries, boundary, boundary$69, completedSegments[JSCompiler_inline_result])) {
							JSCompiler_inline_result++;
							completedSegments.splice(0, JSCompiler_inline_result);
							var JSCompiler_inline_result$jscomp$0 = false;
							break a;
						}
						completedSegments.splice(0, JSCompiler_inline_result);
						var row = boundary$69.row;
						null !== row && row.together && 1 === boundary$69.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(clientRenderedBoundaries, row, row.hoistables) : row.pendingTasks--);
						JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(boundary, boundary$69.contentState, clientRenderedBoundaries.renderState);
					}
					if (!JSCompiler_inline_result$jscomp$0) {
						request.destination = null;
						i++;
						partialBoundaries.splice(0, i);
						return;
					}
				}
				partialBoundaries.splice(0, i);
				flushingPartialBoundaries = false;
				var largeBoundaries = request.completedBoundaries;
				for (i = 0; i < largeBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
					request.destination = null;
					i++;
					largeBoundaries.splice(0, i);
					return;
				}
				largeBoundaries.splice(0, i);
			}
		} finally {
			flushingPartialBoundaries = false, 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length && (request.flushScheduled = false, i = request.resumableState, i.hasBody && (partialBoundaries = endChunkForTag("body"), destination.push(partialBoundaries)), i.hasHtml && (i = endChunkForTag("html"), destination.push(i)), request.status = 14, destination.push(null), request.destination = null);
		}
	}
	function startFlowing(request, destination) {
		if (13 === request.status) request.status = 14, destination.destroy(request.fatalError);
		else if (14 !== request.status && null === request.destination) {
			request.destination = destination;
			try {
				flushCompletedQueues(request, destination);
			} catch (error) {
				logRecoverableError(request, error, {}), fatalError(request, error);
			}
		}
	}
	function abort(request, reason) {
		if (11 === request.status || 10 === request.status) request.status = 12;
		try {
			var abortableTasks = request.abortableTasks;
			if (0 < abortableTasks.size) {
				var error = reason;
				request.fatalError = error;
				abortableTasks.forEach(function(task) {
					return abortTask(task, request, error);
				});
				abortableTasks.clear();
			}
			null !== request.destination && flushCompletedQueues(request, request.destination);
		} catch (error$71) {
			logRecoverableError(request, error$71, {}), fatalError(request, error$71);
		}
	}
	function addToReplayParent(node, parentKeyPath, trackedPostpones) {
		if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
		else {
			var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
			void 0 === parentNode && (parentNode = [
				parentKeyPath[1],
				parentKeyPath[2],
				[],
				null
			], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
			parentNode[2].push(node);
		}
	}
	function onError() {}
	function renderToStringImpl(children, options, __unused_B894, abortReason) {
		var didFatal = false, fatalError = null, result = "", readyToStream = false;
		options = createResumableState();
		children = createRequest(children, options, createRenderState(), createFormatContext(0, null, 0, null), 0, onError, 0, function() {
			readyToStream = true;
		});
		children.flushScheduled = null !== children.destination;
		performWork(children);
		10 === children.status && (children.status = 11);
		null === children.trackedPostpones && safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
		abort(children, abortReason);
		startFlowing(children, {
			push: function(chunk) {
				null !== chunk && (result += chunk);
				return true;
			},
			destroy: function(error) {
				didFatal = true;
				fatalError = error;
			}
		});
		if (didFatal && fatalError !== abortReason) throw fatalError;
		if (!readyToStream) throw Error(formatProdErrorMessage(426));
		return result;
	}
	reactDomServerLegacy_browser_production.b = function(children) {
		return renderToStringImpl(children, 0, 0, "The server used \"renderToString\" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to \"renderToReadableStream\" which supports Suspense on the server");
	};
	return reactDomServerLegacy_browser_production;
}
function requireReactDomServer_browser_production() {
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + 460;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	var channel = new MessageChannel(), taskQueue = [];
	channel.port1.onmessage = function() {
		var task = taskQueue.shift();
		task && task();
	};
	var textEncoder = new TextEncoder();
	function stringToChunk(content) {
		return textEncoder.encode(content);
	}
	function stringToPrecomputedChunk(content) {
		return textEncoder.encode(content);
	}
	var __unused_7647 = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	var __unused_396A = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" ")), __unused_7B93 = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
		text = "" + text;
		var match = matchHtmlRegExp.exec(text);
		if (match) {
			var html = "", index, lastIndex = 0;
			for (index = match.index; index < 64; index++) {
				switch (text.charCodeAt(index)) {
					case 34:
						match = "&quot;";
						break;
					case 38:
						match = "&amp;";
						break;
					case 39:
						match = "&#x27;";
						break;
					case 60:
						match = "&lt;";
						break;
					case 62:
						match = "&gt;";
						break;
					default: continue;
				}
				lastIndex !== index && (html += text.slice(lastIndex, index));
				lastIndex = index + 1;
				html += match;
			}
			text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
		}
		return text;
	}
	stringToPrecomputedChunk("\"></template>");
	var __unused_6C8F = stringToPrecomputedChunk("<script"), __unused_F3C8 = stringToPrecomputedChunk("<\/script>"), __unused_785C = stringToPrecomputedChunk("<script src=\""), __unused_A498 = stringToPrecomputedChunk("<script type=\"module\" src=\""), __unused_2945 = stringToPrecomputedChunk(" nonce=\""), __unused_F80A = stringToPrecomputedChunk(" integrity=\""), __unused_3A4D = stringToPrecomputedChunk(" crossorigin=\""), __unused_25D6 = stringToPrecomputedChunk(" async=\"\"><\/script>"), __unused_9546 = stringToPrecomputedChunk("<style");
	var __unused_AAF3 = stringToPrecomputedChunk("<script type=\"importmap\">"), __unused_A13D = stringToPrecomputedChunk("<\/script>");
	var __unused_4CB3 = stringToPrecomputedChunk("<!-- -->");
	var __unused_E618 = new Map(), __unused_CF46 = stringToPrecomputedChunk(" style=\""), __unused_DFFC = stringToPrecomputedChunk(":"), __unused_8591 = stringToPrecomputedChunk(";");
	var __unused_95AC = stringToPrecomputedChunk(" "), __unused_6F4C = stringToPrecomputedChunk("=\""), __unused_A076 = stringToPrecomputedChunk("\""), __unused_21A5 = stringToPrecomputedChunk("=\"\"");
	var __unused_DE22 = stringToPrecomputedChunk(escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')")), __unused_42AB = stringToPrecomputedChunk("<input type=\"hidden\"");
	var __unused_9F65 = stringToPrecomputedChunk(">"), __unused_D224 = stringToPrecomputedChunk("/>");
	var __unused_2FA0 = stringToPrecomputedChunk(" selected=\"\""), __unused_6E04 = stringToPrecomputedChunk("addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});");
	var __unused_099A = stringToPrecomputedChunk("<!--F!-->"), __unused_4ED7 = stringToPrecomputedChunk("<!--F-->");
	var __unused_3435 = stringToPrecomputedChunk("<!--head-->"), __unused_0D86 = stringToPrecomputedChunk("<!--body-->"), __unused_918E = stringToPrecomputedChunk("<!--html-->");
	var __unused_D28B = stringToPrecomputedChunk("\n"), __unused_B30A = new Map();
	var __unused_F243 = stringToPrecomputedChunk("<!DOCTYPE html>");
	var __unused_C535 = new Map();
	var __unused_08EB = stringToPrecomputedChunk("requestAnimationFrame(function(){$RT=performance.now()});"), __unused_97A9 = stringToPrecomputedChunk("<template id=\""), __unused_EE15 = stringToPrecomputedChunk("\"></template>"), __unused_3355 = stringToPrecomputedChunk("<!--&-->"), __unused_6496 = stringToPrecomputedChunk("<!--/&-->"), __unused_C922 = stringToPrecomputedChunk("<!--$-->"), __unused_3032 = stringToPrecomputedChunk("<!--$?--><template id=\""), __unused_8D16 = stringToPrecomputedChunk("\"></template>"), __unused_40F8 = stringToPrecomputedChunk("<!--$!-->"), __unused_AF4C = stringToPrecomputedChunk("<!--/$-->"), __unused_7CB8 = stringToPrecomputedChunk("<template"), __unused_84BF = stringToPrecomputedChunk("\""), __unused_A128 = stringToPrecomputedChunk(" data-dgst=\"");
	stringToPrecomputedChunk(" data-msg=\"");
	stringToPrecomputedChunk(" data-stck=\"");
	stringToPrecomputedChunk(" data-cstck=\"");
	var __unused_D464 = stringToPrecomputedChunk("></template>");
	var __unused_3E6F = stringToPrecomputedChunk("<div hidden id=\""), __unused_D199 = stringToPrecomputedChunk("\">"), __unused_C367 = stringToPrecomputedChunk("</div>"), __unused_844F = stringToPrecomputedChunk("<svg aria-hidden=\"true\" style=\"display:none\" id=\""), __unused_47BE = stringToPrecomputedChunk("\">"), __unused_FDB3 = stringToPrecomputedChunk("</svg>"), __unused_DAA1 = stringToPrecomputedChunk("<math aria-hidden=\"true\" style=\"display:none\" id=\""), __unused_E915 = stringToPrecomputedChunk("\">"), __unused_38E9 = stringToPrecomputedChunk("</math>"), __unused_B537 = stringToPrecomputedChunk("<table hidden id=\""), __unused_7614 = stringToPrecomputedChunk("\">"), __unused_C4C0 = stringToPrecomputedChunk("</table>"), __unused_3F65 = stringToPrecomputedChunk("<table hidden><tbody id=\""), __unused_3CFD = stringToPrecomputedChunk("\">"), __unused_B7A0 = stringToPrecomputedChunk("</tbody></table>"), __unused_FBF7 = stringToPrecomputedChunk("<table hidden><tr id=\""), __unused_B84E = stringToPrecomputedChunk("\">"), __unused_0009 = stringToPrecomputedChunk("</tr></table>"), __unused_6923 = stringToPrecomputedChunk("<table hidden><colgroup id=\""), __unused_3F0E = stringToPrecomputedChunk("\">"), __unused_F723 = stringToPrecomputedChunk("</colgroup></table>");
	var __unused_5D00 = stringToPrecomputedChunk("$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\""), __unused_7B4E = stringToPrecomputedChunk("$RS(\""), __unused_08FC = stringToPrecomputedChunk("\",\""), __unused_D3F0 = stringToPrecomputedChunk("\")<\/script>");
	stringToPrecomputedChunk("<template data-rsi=\"\" data-sid=\"");
	stringToPrecomputedChunk("\" data-pid=\"");
	var __unused_B0C2 = stringToPrecomputedChunk("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};");
	stringToChunk("$RV=function(A,g){function k(a,b){var e=a.getAttribute(b);e&&(b=a.style,l.push(a,b.viewTransitionName,b.viewTransitionClass),\"auto\"!==e&&(b.viewTransitionClass=e),(a=a.getAttribute(\"vt-name\"))||(a=\"_T_\"+K++ +\"_\"),b.viewTransitionName=a,B=!0)}var B=!1,K=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var h=g[f].querySelectorAll(\"[vt-share]\"),d=0;d<h.length;d++){var c=h[d];m.set(c.getAttribute(\"vt-name\"),c)}var u=[];for(h=0;h<g.length;h+=2){var C=g[h],x=C.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){c=C;for(f=0;c;){if(8===c.nodeType){var r=c.data;if(\"/$\"===r)if(0===f)break;else f--;else\"$\"!==r&&\"$?\"!==r&&\"$~\"!==r&&\"$!\"!==r||f++}else if(1===c.nodeType){d=c;var D=d.getAttribute(\"vt-name\"),y=m.get(D);k(d,y?\"vt-share\":\"vt-exit\");y&&(k(y,\"vt-share\"),m.set(D,null));var E=d.querySelectorAll(\"[vt-share]\");for(d=0;d<E.length;d++){var F=E[d],G=F.getAttribute(\"vt-name\"),\nH=m.get(G);H&&(k(F,\"vt-share\"),k(H,\"vt-share\"),m.set(G,null))}}c=c.nextSibling}for(var I=g[h+1],t=I.firstElementChild;t;)null!==m.get(t.getAttribute(\"vt-name\"))&&k(t,\"vt-enter\"),t=t.nextElementSibling;c=x;do for(var n=c.firstElementChild;n;){var J=n.getAttribute(\"vt-update\");J&&\"none\"!==J&&!l.includes(n)&&k(n,\"vt-update\");n=n.nextElementSibling}while((c=c.parentNode)&&1===c.nodeType&&\"none\"!==c.getAttribute(\"vt-update\"));u.push.apply(u,I.querySelectorAll('img[src]:not([loading=\"lazy\"])'))}}}if(B){var z=\ndocument.__reactViewTransition=document.startViewTransition({update:function(){A(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],b={},e=0;e<u.length;b={g:b.g},e++)if(b.g=u[e],!b.g.complete){var p=b.g.getBoundingClientRect();0<p.bottom&&0<p.right&&p.top<window.innerHeight&&p.left<window.innerWidth&&(p=new Promise(function(w){return function(q){w.g.addEventListener(\"load\",q);w.g.addEventListener(\"error\",q)}}(b)),a.push(p))}return Promise.race([Promise.all(a),new Promise(function(w){var q=\nperformance.now();setTimeout(w,2300>q&&2E3<q?2300-q:500)})])},types:[]});z.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var b=l[a],e=b.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];\"\"===b.getAttribute(\"style\")&&b.removeAttribute(\"style\")}});z.finished.finally(function(){document.__reactViewTransition===z&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}A(g)}.bind(null,$RV);");
	var __unused_F0CB = stringToPrecomputedChunk("$RC(\""), __unused_2345 = stringToPrecomputedChunk("$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll(\"link[data-precedence],style[data-precedence]\"),v=[],k=0;b=e[k++];)\"not all\"===b.getAttribute(\"media\")?v.push(b):(\"LINK\"===b.tagName&&$RM.set(b.getAttribute(\"href\"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement(\"link\");a.href=d;a.rel=\n\"stylesheet\";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute(\"media\");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute(\"data-precedence\");a.removeAttribute(\"media\")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n\"$~\";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,\"CSS failed to load\"))};$RR(\""), __unused_3A16 = stringToPrecomputedChunk("$RR(\""), __unused_C3A8 = stringToPrecomputedChunk("\",\""), __unused_FEAF = stringToPrecomputedChunk("\","), __unused_1A30 = stringToPrecomputedChunk("\""), __unused_D75A = stringToPrecomputedChunk(")<\/script>");
	stringToPrecomputedChunk("<template data-rci=\"\" data-bid=\"");
	stringToPrecomputedChunk("<template data-rri=\"\" data-bid=\"");
	stringToPrecomputedChunk("\" data-sid=\"");
	stringToPrecomputedChunk("\" data-sty=\"");
	var __unused_D3DC = stringToPrecomputedChunk("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};"), __unused_FBF3 = stringToPrecomputedChunk("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX(\""), __unused_C981 = stringToPrecomputedChunk("$RX(\""), __unused_8BF6 = stringToPrecomputedChunk("\""), __unused_26BC = stringToPrecomputedChunk(","), __unused_6A1A = stringToPrecomputedChunk(")<\/script>");
	stringToPrecomputedChunk("<template data-rxi=\"\" data-bid=\"");
	stringToPrecomputedChunk("\" data-dgst=\"");
	stringToPrecomputedChunk("\" data-msg=\"");
	stringToPrecomputedChunk("\" data-stck=\"");
	stringToPrecomputedChunk("\" data-cstck=\"");
	var __unused_67F3 = stringToPrecomputedChunk(" media=\"not all\" data-precedence=\""), __unused_B833 = stringToPrecomputedChunk("\" data-href=\""), __unused_D208 = stringToPrecomputedChunk("\">"), __unused_AC93 = stringToPrecomputedChunk("</style>");
	var __unused_8C83 = stringToPrecomputedChunk(" data-precedence=\""), __unused_F596 = stringToPrecomputedChunk("\" data-href=\""), __unused_FB79 = stringToPrecomputedChunk(" "), __unused_4917 = stringToPrecomputedChunk("\">"), __unused_B566 = stringToPrecomputedChunk("</style>");
	stringToPrecomputedChunk("<link rel=\"expect\" href=\"#");
	stringToPrecomputedChunk("\" blocking=\"render\"/>");
	var __unused_42F5 = stringToPrecomputedChunk(" id=\"");
	var __unused_2545 = stringToPrecomputedChunk("["), __unused_FD2A = stringToPrecomputedChunk(",["), __unused_3999 = stringToPrecomputedChunk(","), __unused_BEFA = stringToPrecomputedChunk("]");
	var __unused_4539 = Error(formatProdErrorMessage(460));
	return;
}
function requireServer_browser() {
	var l;
	{
		l = requireReactDomServerLegacy_browser_production();
		requireReactDomServer_browser_production();
	}
	server_browser.b = l.b;
	return server_browser;
}
var server_browserExports = requireServer_browser();
var ReactDOMServer = getDefaultExportFromCjs(server_browserExports);
const answer = ReactDOMServer.b(React.o(Paper$1, null, "Hello"));
export { answer };
