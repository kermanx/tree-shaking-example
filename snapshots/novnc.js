/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
/*
* Logging/debug routines
*/
let _logLevel = "warn";
let Debug;
let Info;
let Warn;
let Error$1;
function initLogging$1(level) {
	if (typeof level === "undefined") {
		level = _logLevel;
	} else {
		_logLevel = level;
	}
	Debug = Info = Warn = Error$1 = () => {};
	if (typeof window.console !== "undefined") {
		/* eslint-disable no-console, no-fallthrough */
		switch (level) {
			case "debug": Debug = console.debug.bind(window.console);
			case "info": Info = console.info.bind(window.console);
			case "warn": Warn = console.warn.bind(window.console);
			case "error": Error$1 = console.error.bind(window.console);
			case "none": break;
			default: throw new window.Error("invalid logging type '" + level + "'");
		}
	}
}
// Initialize logging level
initLogging$1();
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2018 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
/*
* Localization utilities
*/
class Localizer {
	constructor() {
		// Currently configured language
		this.language = "en";
		// Current dictionary of translations
		this._dictionary = void 0;
	}
	// Configure suitable language based on user preferences
	async setup(supportedLanguages, baseURL) {
		this.language = "en";
		this._dictionary = void 0;
		this._setupLanguage(supportedLanguages);
		await this._setupDictionary(baseURL);
	}
	_setupLanguage(supportedLanguages) {
		/*
		* Navigator.languages only available in Chrome (32+) and FireFox (32+)
		* Fall back to navigator.language for other browsers
		*/
		let userLanguages;
		if (typeof window.navigator.languages == "object") {
			userLanguages = window.navigator.languages;
		} else {
			userLanguages = [navigator.language || navigator.userLanguage];
		}
		for (let i = 0; i < userLanguages.length; i++) {
			const userLang = userLanguages[i].toLowerCase().replace("_", "-").split("-");
			// First pass: perfect match
			for (let j = 0; j < supportedLanguages.length; j++) {
				const supLang = supportedLanguages[j].toLowerCase().replace("_", "-").split("-");
				if (userLang[0] !== supLang[0]) {
					continue;
				}
				if (userLang[1] !== supLang[1]) {
					continue;
				}
				this.language = supportedLanguages[j];
				return;
			}
			// Second pass: English fallback
			if (userLang[0] === "en") {
				return;
			}
			// Third pass pass: other fallback
			for (let j = 0; j < supportedLanguages.length; j++) {
				const supLang = supportedLanguages[j].toLowerCase().replace("_", "-").split("-");
				if (userLang[0] !== supLang[0]) {
					continue;
				}
				if (supLang[1] !== void 0) {
					continue;
				}
				this.language = supportedLanguages[j];
				return;
			}
		}
	}
	async _setupDictionary(baseURL) {
		if (baseURL) {
			if (!baseURL.endsWith("/")) {
				baseURL = baseURL + "/";
			}
		} else {
			baseURL = "";
		}
		if (this.language === "en") {
			return;
		}
		let response = await fetch(baseURL + this.language + ".json");
		if (!response.ok) {
			throw Error("" + response.status + " " + response.statusText);
		}
		this._dictionary = await response.json();
	}
	// Retrieve localised text
	get(id) {
		if (typeof this._dictionary !== "undefined" && this._dictionary[id]) {
			return this._dictionary[id];
		} else {
			return id;
		}
	}
	// Traverses the DOM and translates relevant fields
	// See https://html.spec.whatwg.org/multipage/dom.html#attr-translate
	translateDOM() {
		const self = this;
		function process(elem, enabled) {
			function isAnyOf(searchElement, items) {
				return items.indexOf(searchElement) !== -1;
			}
			function translateString(str) {
				// We assume surrounding whitespace, and whitespace around line
				// breaks is just for source formatting
				str = str.split("\n").map((s) => s.trim()).join(" ").trim();
				return self.get(str);
			}
			function translateAttribute(elem, attr) {
				const str = translateString(elem.getAttribute(attr));
				elem.setAttribute(attr, str);
			}
			function translateTextNode(node) {
				const str = translateString(node.data);
				node.data = str;
			}
			if (elem.hasAttribute("translate")) {
				if (isAnyOf(elem.getAttribute("translate"), ["", "yes"])) {
					enabled = true;
				} else if (isAnyOf(elem.getAttribute("translate"), ["no"])) {
					enabled = false;
				}
			}
			if (enabled) {
				if (elem.hasAttribute("abbr") && elem.tagName === "TH") {
					translateAttribute(elem, "abbr");
				}
				if (elem.hasAttribute("alt") && isAnyOf(elem.tagName, [
					"AREA",
					"IMG",
					"INPUT"
				])) {
					translateAttribute(elem, "alt");
				}
				if (elem.hasAttribute("download") && isAnyOf(elem.tagName, ["A", "AREA"])) {
					translateAttribute(elem, "download");
				}
				if (elem.hasAttribute("label") && isAnyOf(elem.tagName, [
					"MENUITEM",
					"MENU",
					"OPTGROUP",
					"OPTION",
					"TRACK"
				])) {
					translateAttribute(elem, "label");
				}
				// FIXME: Should update "lang"
				if (elem.hasAttribute("placeholder") && isAnyOf(elem.tagName, ["INPUT", "TEXTAREA"])) {
					translateAttribute(elem, "placeholder");
				}
				if (elem.hasAttribute("title")) {
					translateAttribute(elem, "title");
				}
				if (elem.hasAttribute("value") && elem.tagName === "INPUT" && isAnyOf(elem.getAttribute("type"), [
					"reset",
					"button",
					"submit"
				])) {
					translateAttribute(elem, "value");
				}
			}
			for (let i = 0; i < elem.childNodes.length; i++) {
				const node = elem.childNodes[i];
				if (node.nodeType === node.ELEMENT_NODE) {
					process(node, enabled);
				} else if (node.nodeType === node.TEXT_NODE && enabled) {
					translateTextNode(node);
				}
			}
		}
		process(document.body, true);
	}
}
const l10n = new Localizer();
var _ = l10n.get.bind(l10n);
/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var Base64 = {
	a: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(""),
	b(data) {
		let result = "";
		const length = data.length;
		const lengthpad = length % 3;
		// Convert every three bytes to 4 ascii characters.
		for (let i = 0; i < length - 2; i += 3) {
			result += this.a[data[i] >> 2];
			result += this.a[((data[i] & 3) << 4) + (data[i + 1] >> 4)];
			result += this.a[((data[i + 1] & 15) << 2) + (data[i + 2] >> 6)];
			result += this.a[data[i + 2] & 63];
		}
		// Convert the remaining 1 or 2 bytes, pad out to 4 characters.
		const j = length - lengthpad;
		if (lengthpad === 2) {
			result += this.a[data[j] >> 2];
			result += this.a[((data[j] & 3) << 4) + (data[j + 1] >> 4)];
			result += this.a[(data[j + 1] & 15) << 2];
			result += this.a[64];
		} else if (lengthpad === 1) {
			result += this.a[data[j] >> 2];
			result += this.a[(data[j] & 3) << 4];
			result += this.a[64];
			result += this.a[64];
		}
		return result;
	},
	c: [
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		62,
		-1,
		-1,
		-1,
		63,
		52,
		53,
		54,
		55,
		56,
		57,
		58,
		59,
		60,
		61,
		-1,
		-1,
		-1,
		0,
		-1,
		-1,
		-1,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		25,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		26,
		27,
		28,
		29,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
		40,
		41,
		42,
		43,
		44,
		45,
		46,
		47,
		48,
		49,
		50,
		51,
		-1,
		-1,
		-1,
		-1,
		-1
	],
	d(data) {
		let dataLength = data.indexOf("=") - 0;
		if (dataLength < 0) {
			dataLength = data.length - 0;
		}
		/* Every four characters is 3 resulting numbers */
		const resultLength = (dataLength >> 2) * 3 + Math.floor(dataLength % 4 / 1.5);
		const result = new Array(resultLength);
		// Convert one by one.
		let leftbits = 0;
		let leftdata = 0;
		for (let idx = 0, i = 0; i < data.length; i++) {
			const c = this.c[data.charCodeAt(i) & 127];
			const padding = data.charAt(i) === "=";
			// Skip illegal characters and whitespace
			if (c === -1) {
				Error$1("Illegal character code " + data.charCodeAt(i) + " at position " + i);
				continue;
			}
			// Collect data into leftdata, update bitcount
			leftdata = leftdata << 6 | c;
			leftbits += 6;
			// If we have 8 or more bits, append 8 bits to the result
			if (leftbits >= 8) {
				leftbits -= 8;
				// Append if not padding.
				if (!padding) {
					result[idx++] = leftdata >> leftbits & 255;
				}
				leftdata &= (1 << leftbits) - 1;
			}
		}
		// If there are any bits left, the base64 string was corrupted
		if (leftbits) {
			const err = new Error("Corrupted base64 string");
			err.name = "Base64-Error";
			throw err;
		}
		return result;
	}
};
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
* Browser feature support detection
*/
// Async clipboard detection
/* Evaluates if there is browser support for the async clipboard API and
* relevant clipboard permissions. Returns 'unsupported' if permission states
* cannot be resolved. On the other hand, detecting 'granted' or 'prompt'
* permission states for both read and write indicates full API support with no
* imposed native browser paste prompt. Conversely, detecting 'denied' indicates
* the user elected to disable clipboard.
*/
async function browserAsyncClipboardSupport() {
	if (!(navigator?.permissions?.query && navigator?.clipboard?.writeText && navigator?.clipboard?.readText)) {
		return "unsupported";
	}
	try {
		const writePerm = await navigator.permissions.query({
			name: "clipboard-write",
			allowWithoutGesture: true
		});
		const readPerm = await navigator.permissions.query({
			name: "clipboard-read",
			allowWithoutGesture: false
		});
		if (writePerm.state === "denied" || readPerm.state === "denied") {
			return "denied";
		}
		if ((writePerm.state === "granted" || writePerm.state === "prompt") && (readPerm.state === "granted" || readPerm.state === "prompt")) {
			return "available";
		}
	} catch {
		return "unsupported";
	}
	return "unsupported";
}
// Touch detection
let isTouchDevice = "ontouchstart" in document.documentElement || document.ontouchstart !== void 0 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
window.addEventListener("touchstart", function onFirstTouch() {
	isTouchDevice = true;
	window.removeEventListener("touchstart", onFirstTouch, false);
}, false);
// The goal is to find a certain physical width, the devicePixelRatio
// brings us a bit closer but is not optimal.
let dragThreshold = 10 * (window.devicePixelRatio || 1);
let _supportsCursorURIs = false;
try {
	const target = document.createElement("canvas");
	target.style.cursor = "url(\"data:image/x-icon;base64,AAACAAEACAgAAAIAAgA4AQAAFgAAACgAAAAIAAAAEAAAAAEAIAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAA==\") 2 2, default";
	if (target.style.cursor.indexOf("url") === 0) {
		_supportsCursorURIs = true;
	} else {
		Warn("Data URI scheme cursor not supported");
	}
} catch (exc) {
	Error$1("Data URI scheme cursor test exception: " + exc);
}
const supportsCursorURIs = _supportsCursorURIs;
let _hasScrollbarGutter = true;
try {
	// Create invisible container
	const container = document.createElement("div");
	container.style.visibility = "hidden";
	container.style.overflow = "scroll";
	document.body.appendChild(container);
	// Create a div and place it in the container
	const child = document.createElement("div");
	container.appendChild(child);
	// Calculate the difference between the container's full width
	// and the child's width - the difference is the scrollbars
	const scrollbarWidth = container.offsetWidth - child.offsetWidth;
	// Clean up
	container.parentNode.removeChild(container);
	_hasScrollbarGutter = scrollbarWidth != 0;
} catch (exc) {
	Error$1("Scrollbar test exception: " + exc);
}
const hasScrollbarGutter = _hasScrollbarGutter;
let supportsWebCodecsH264Decode;
async function _checkWebCodecsH264DecodeSupport() {
	if (!("VideoDecoder" in window)) {
		return false;
	}
	// We'll need to make do with some placeholders here
	const config = {
		codec: "avc1.42401f",
		codedWidth: 1920,
		codedHeight: 1080,
		optimizeForLatency: true
	};
	let support = await VideoDecoder.isConfigSupported(config);
	if (!support.supported) {
		return false;
	}
	// Firefox incorrectly reports supports for H.264 under some
	// circumstances, so we need to actually test a real frame
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1932392
	const data = new Uint8Array(Base64.d("AAAAAWdCwBTZnpuAgICgAAADACAAAAZB4oVNAAAAAWjJYyyAAAABBgX//4Hc" + "Rem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY0IHIzMTA4IDMxZTE5Zjkg" + "LSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDIz" + "IC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9u" + "czogY2FiYWM9MCByZWY9NSBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgxOjB4" + "MTExIG1lPWhleCBzdWJtZT04IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4" + "ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0yIDh4" + "OGRjdD0wIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJv" + "bWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0x" + "IHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9" + "MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVz" + "PTAgd2VpZ2h0cD0wIGtleWludD1pbmZpbml0ZSBrZXlpbnRfbWluPTI1IHNj" + "ZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NTAgcmM9" + "YWJyIG1idHJlZT0xIGJpdHJhdGU9NDAwIHJhdGV0b2w9MS4wIHFjb21wPTAu" + "NjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFx" + "PTE6MS4wMACAAAABZYiEBrxmKAAPVccAAS044AA5DRJMnkycJk4TPw=="));
	let gotframe = false;
	let error = null;
	let decoder = new VideoDecoder({
		output: (frame) => {
			gotframe = true;
			frame.close();
		},
		error: (e) => {
			error = e;
		}
	});
	let chunk = new EncodedVideoChunk({
		timestamp: 0,
		type: "key",
		data
	});
	decoder.configure(config);
	decoder.decode(chunk);
	try {
		await decoder.flush();
	} catch (e) {
		// Firefox incorrectly throws an exception here
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1932566
		error = e;
	}
	// Firefox fails to deliver the error on Windows, so we need to
	// check if we got a frame instead
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1932579
	if (!gotframe) {
		return false;
	}
	if (error !== null) {
		return false;
	}
	return true;
}
supportsWebCodecsH264Decode = await _checkWebCodecsH264DecodeSupport();
/*
* The functions for detection of platforms and browsers below are exported
* but the use of these should be minimized as much as possible.
*
* It's better to use feature detection than platform detection.
*/
/* OS */
function isMac() {
	return !!/mac/i.exec(navigator.platform);
}
function isWindows() {
	return !!/win/i.exec(navigator.platform);
}
function isIOS() {
	return !!/ipad/i.exec(navigator.platform) || !!/iphone/i.exec(navigator.platform) || !!/ipod/i.exec(navigator.platform);
}
function isAndroid() {
	/* Android sets navigator.platform to Linux :/ */
	return !!navigator.userAgent.match("Android ");
}
function isChromeOS() {
	/* ChromeOS sets navigator.platform to Linux :/ */
	return !!navigator.userAgent.match(" CrOS ");
}
/* Browser */
function isSafari() {
	return !!navigator.userAgent.match("Safari/...") && !navigator.userAgent.match("Chrome/...") && !navigator.userAgent.match("Chromium/...") && !navigator.userAgent.match("Epiphany/...");
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2018 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
/*
* Cross-browser event and position routines
*/
function getPointerEvent(e) {
	return e.changedTouches ? e.changedTouches[0] : e.touches ? e.touches[0] : e;
}
function stopEvent(e) {
	e.stopPropagation();
	e.preventDefault();
}
// Emulate Element.setCapture() when not supported
let _captureRecursion = false;
let _elementForUnflushedEvents = null;
document.captureElement = null;
function _captureProxy(e) {
	// Recursion protection as we'll see our own event
	if (_captureRecursion) return;
	// Clone the event as we cannot dispatch an already dispatched event
	const newEv = new e.constructor(e.type, e);
	_captureRecursion = true;
	if (document.captureElement) {
		document.captureElement.dispatchEvent(newEv);
	} else {
		_elementForUnflushedEvents.dispatchEvent(newEv);
	}
	_captureRecursion = false;
	// Avoid double events
	e.stopPropagation();
	// Respect the wishes of the redirected event handlers
	if (newEv.defaultPrevented) {
		e.preventDefault();
	}
	// Implicitly release the capture on button release
	if (e.type === "mouseup") {
		releaseCapture();
	}
}
// Follow cursor style of target element
function _capturedElemChanged() {
	const proxyElem = document.getElementById("noVNC_mouse_capture_elem");
	proxyElem.style.cursor = window.getComputedStyle(document.captureElement).cursor;
}
const _captureObserver = new MutationObserver(_capturedElemChanged);
function setCapture(target) {
	if (target.setCapture) {
		target.setCapture();
		document.captureElement = target;
	} else {
		// Release any existing capture in case this method is
		// called multiple times without coordination
		releaseCapture();
		let proxyElem = document.getElementById("noVNC_mouse_capture_elem");
		if (proxyElem === null) {
			proxyElem = document.createElement("div");
			proxyElem.id = "noVNC_mouse_capture_elem";
			proxyElem.style.position = "fixed";
			proxyElem.style.top = "0px";
			proxyElem.style.left = "0px";
			proxyElem.style.width = "100%";
			proxyElem.style.height = "100%";
			proxyElem.style.zIndex = 1e4;
			proxyElem.style.display = "none";
			document.body.appendChild(proxyElem);
			// This is to make sure callers don't get confused by having
			// our blocking element as the target
			proxyElem.addEventListener("contextmenu", _captureProxy);
			proxyElem.addEventListener("mousemove", _captureProxy);
			proxyElem.addEventListener("mouseup", _captureProxy);
		}
		document.captureElement = target;
		// Track cursor and get initial cursor
		_captureObserver.observe(target, { attributes: true });
		_capturedElemChanged();
		proxyElem.style.display = "";
		// We listen to events on window in order to keep tracking if it
		// happens to leave the viewport
		window.addEventListener("mousemove", _captureProxy);
		window.addEventListener("mouseup", _captureProxy);
	}
}
function releaseCapture() {
	if (document.releaseCapture) {
		document.releaseCapture();
		document.captureElement = null;
	} else {
		if (!document.captureElement) {
			return;
		}
		// There might be events already queued. The event proxy needs
		// access to the captured element for these queued events.
		// E.g. contextmenu (right-click) in Microsoft Edge
		//
		// Before removing the capturedElem pointer we save it to a
		// temporary variable that the unflushed events can use.
		_elementForUnflushedEvents = document.captureElement;
		document.captureElement = null;
		_captureObserver.disconnect();
		const proxyElem = document.getElementById("noVNC_mouse_capture_elem");
		proxyElem.style.display = "none";
		window.removeEventListener("mousemove", _captureProxy);
		window.removeEventListener("mouseup", _captureProxy);
	}
}
/* eslint-disable key-spacing */
var KeyTable = {
	a: 269025026,
	b: 269025027,
	c: 269025040,
	d: 269025041,
	e: 269025042,
	f: 269025043,
	g: 269025044,
	h: 269025045,
	i: 269025046,
	j: 269025047,
	k: 269025048,
	l: 269025049,
	m: 269025051,
	n: 269025052,
	o: 269025053,
	p: 269025056,
	q: 269025057,
	r: 269025062,
	s: 269025063,
	t: 269025064,
	u: 269025065,
	v: 269025066,
	w: 269025067,
	x: 269025068,
	y: 269025069,
	z: 269025070,
	A: 269025072,
	B: 269025073,
	C: 269025074,
	D: 269025075,
	E: 269025083,
	F: 269025086,
	G: 269025110,
	H: 269025111,
	I: 269025112,
	J: 269025116,
	K: 269025121,
	L: 269025128,
	M: 269025131,
	N: 269025133,
	O: 269025134,
	P: 269025138,
	Q: 269025143,
	R: 269025147,
	S: 269025148,
	T: 269025149,
	U: 269025161,
	V: 269025163,
	W: 269025164,
	X: 269025167,
	Y: 269025168,
	Z: 269025170,
	$: 269025175,
	_: 269025177,
	aa: 269025178,
	ba: 269025179,
	ca: 269025192,
	da: 269025202,
	ea: 269024802
};
/*
* Mapping from Unicode codepoints to X11/RFB keysyms
*
* This file was automatically generated from keysymdef.h
* DO NOT EDIT!
*/
/* Functions at the bottom */
const codepoints = {
	256: 960,
	257: 992,
	258: 451,
	259: 483,
	260: 417,
	261: 433,
	262: 454,
	263: 486,
	264: 710,
	265: 742,
	266: 709,
	267: 741,
	268: 456,
	269: 488,
	270: 463,
	271: 495,
	272: 464,
	273: 496,
	274: 938,
	275: 954,
	278: 972,
	279: 1004,
	280: 458,
	281: 490,
	282: 460,
	283: 492,
	284: 728,
	285: 760,
	286: 683,
	287: 699,
	288: 725,
	289: 757,
	290: 939,
	291: 955,
	292: 678,
	293: 694,
	294: 673,
	295: 689,
	296: 933,
	297: 949,
	298: 975,
	299: 1007,
	302: 967,
	303: 999,
	304: 681,
	305: 697,
	308: 684,
	309: 700,
	310: 979,
	311: 1011,
	312: 930,
	313: 453,
	314: 485,
	315: 934,
	316: 950,
	317: 421,
	318: 437,
	321: 419,
	322: 435,
	323: 465,
	324: 497,
	325: 977,
	326: 1009,
	327: 466,
	328: 498,
	330: 957,
	331: 959,
	332: 978,
	333: 1010,
	336: 469,
	337: 501,
	338: 5052,
	339: 5053,
	340: 448,
	341: 480,
	342: 931,
	343: 947,
	344: 472,
	345: 504,
	346: 422,
	347: 438,
	348: 734,
	349: 766,
	350: 426,
	351: 442,
	352: 425,
	353: 441,
	354: 478,
	355: 510,
	356: 427,
	357: 443,
	358: 940,
	359: 956,
	360: 989,
	361: 1021,
	362: 990,
	363: 1022,
	364: 733,
	365: 765,
	366: 473,
	367: 505,
	368: 475,
	369: 507,
	370: 985,
	371: 1017,
	376: 5054,
	377: 428,
	378: 444,
	379: 431,
	380: 447,
	381: 430,
	382: 446,
	402: 2294,
	466: 16777681,
	711: 439,
	728: 418,
	729: 511,
	731: 434,
	733: 445,
	901: 1966,
	902: 1953,
	904: 1954,
	905: 1955,
	906: 1956,
	908: 1959,
	910: 1960,
	911: 1963,
	912: 1974,
	913: 1985,
	914: 1986,
	915: 1987,
	916: 1988,
	917: 1989,
	918: 1990,
	919: 1991,
	920: 1992,
	921: 1993,
	922: 1994,
	923: 1995,
	924: 1996,
	925: 1997,
	926: 1998,
	927: 1999,
	928: 2e3,
	929: 2001,
	931: 2002,
	932: 2004,
	933: 2005,
	934: 2006,
	935: 2007,
	936: 2008,
	937: 2009,
	938: 1957,
	939: 1961,
	940: 1969,
	941: 1970,
	942: 1971,
	943: 1972,
	944: 1978,
	945: 2017,
	946: 2018,
	947: 2019,
	948: 2020,
	949: 2021,
	950: 2022,
	951: 2023,
	952: 2024,
	953: 2025,
	954: 2026,
	955: 2027,
	956: 2028,
	957: 2029,
	958: 2030,
	959: 2031,
	960: 2032,
	961: 2033,
	962: 2035,
	963: 2034,
	964: 2036,
	965: 2037,
	966: 2038,
	967: 2039,
	968: 2040,
	969: 2041,
	970: 1973,
	971: 1977,
	972: 1975,
	973: 1976,
	974: 1979,
	1025: 1715,
	1026: 1713,
	1027: 1714,
	1028: 1716,
	1029: 1717,
	1030: 1718,
	1031: 1719,
	1032: 1720,
	1033: 1721,
	1034: 1722,
	1035: 1723,
	1036: 1724,
	1038: 1726,
	1039: 1727,
	1040: 1761,
	1041: 1762,
	1042: 1783,
	1043: 1767,
	1044: 1764,
	1045: 1765,
	1046: 1782,
	1047: 1786,
	1048: 1769,
	1049: 1770,
	1050: 1771,
	1051: 1772,
	1052: 1773,
	1053: 1774,
	1054: 1775,
	1055: 1776,
	1056: 1778,
	1057: 1779,
	1058: 1780,
	1059: 1781,
	1060: 1766,
	1061: 1768,
	1062: 1763,
	1063: 1790,
	1064: 1787,
	1065: 1789,
	1066: 1791,
	1067: 1785,
	1068: 1784,
	1069: 1788,
	1070: 1760,
	1071: 1777,
	1072: 1729,
	1073: 1730,
	1074: 1751,
	1075: 1735,
	1076: 1732,
	1077: 1733,
	1078: 1750,
	1079: 1754,
	1080: 1737,
	1081: 1738,
	1082: 1739,
	1083: 1740,
	1084: 1741,
	1085: 1742,
	1086: 1743,
	1087: 1744,
	1088: 1746,
	1089: 1747,
	1090: 1748,
	1091: 1749,
	1092: 1734,
	1093: 1736,
	1094: 1731,
	1095: 1758,
	1096: 1755,
	1097: 1757,
	1098: 1759,
	1099: 1753,
	1100: 1752,
	1101: 1756,
	1102: 1728,
	1103: 1745,
	1105: 1699,
	1106: 1697,
	1107: 1698,
	1108: 1700,
	1109: 1701,
	1110: 1702,
	1111: 1703,
	1112: 1704,
	1113: 1705,
	1114: 1706,
	1115: 1707,
	1116: 1708,
	1118: 1710,
	1119: 1711,
	1168: 1725,
	1169: 1709,
	1488: 3296,
	1489: 3297,
	1490: 3298,
	1491: 3299,
	1492: 3300,
	1493: 3301,
	1494: 3302,
	1495: 3303,
	1496: 3304,
	1497: 3305,
	1498: 3306,
	1499: 3307,
	1500: 3308,
	1501: 3309,
	1502: 3310,
	1503: 3311,
	1504: 3312,
	1505: 3313,
	1506: 3314,
	1507: 3315,
	1508: 3316,
	1509: 3317,
	1510: 3318,
	1511: 3319,
	1512: 3320,
	1513: 3321,
	1514: 3322,
	1548: 1452,
	1563: 1467,
	1567: 1471,
	1569: 1473,
	1570: 1474,
	1571: 1475,
	1572: 1476,
	1573: 1477,
	1574: 1478,
	1575: 1479,
	1576: 1480,
	1577: 1481,
	1578: 1482,
	1579: 1483,
	1580: 1484,
	1581: 1485,
	1582: 1486,
	1583: 1487,
	1584: 1488,
	1585: 1489,
	1586: 1490,
	1587: 1491,
	1588: 1492,
	1589: 1493,
	1590: 1494,
	1591: 1495,
	1592: 1496,
	1593: 1497,
	1594: 1498,
	1600: 1504,
	1601: 1505,
	1602: 1506,
	1603: 1507,
	1604: 1508,
	1605: 1509,
	1606: 1510,
	1607: 1511,
	1608: 1512,
	1609: 1513,
	1610: 1514,
	1611: 1515,
	1612: 1516,
	1613: 1517,
	1614: 1518,
	1615: 1519,
	1616: 1520,
	1617: 1521,
	1618: 1522,
	3585: 3489,
	3586: 3490,
	3587: 3491,
	3588: 3492,
	3589: 3493,
	3590: 3494,
	3591: 3495,
	3592: 3496,
	3593: 3497,
	3594: 3498,
	3595: 3499,
	3596: 3500,
	3597: 3501,
	3598: 3502,
	3599: 3503,
	3600: 3504,
	3601: 3505,
	3602: 3506,
	3603: 3507,
	3604: 3508,
	3605: 3509,
	3606: 3510,
	3607: 3511,
	3608: 3512,
	3609: 3513,
	3610: 3514,
	3611: 3515,
	3612: 3516,
	3613: 3517,
	3614: 3518,
	3615: 3519,
	3616: 3520,
	3617: 3521,
	3618: 3522,
	3619: 3523,
	3620: 3524,
	3621: 3525,
	3622: 3526,
	3623: 3527,
	3624: 3528,
	3625: 3529,
	3626: 3530,
	3627: 3531,
	3628: 3532,
	3629: 3533,
	3630: 3534,
	3631: 3535,
	3632: 3536,
	3633: 3537,
	3634: 3538,
	3635: 3539,
	3636: 3540,
	3637: 3541,
	3638: 3542,
	3639: 3543,
	3640: 3544,
	3641: 3545,
	3642: 3546,
	3647: 3551,
	3648: 3552,
	3649: 3553,
	3650: 3554,
	3651: 3555,
	3652: 3556,
	3653: 3557,
	3654: 3558,
	3655: 3559,
	3656: 3560,
	3657: 3561,
	3658: 3562,
	3659: 3563,
	3660: 3564,
	3661: 3565,
	3664: 3568,
	3665: 3569,
	3666: 3570,
	3667: 3571,
	3668: 3572,
	3669: 3573,
	3670: 3574,
	3671: 3575,
	3672: 3576,
	3673: 3577,
	8194: 2722,
	8195: 2721,
	8196: 2723,
	8197: 2724,
	8199: 2725,
	8200: 2726,
	8201: 2727,
	8202: 2728,
	8210: 2747,
	8211: 2730,
	8212: 2729,
	8213: 1967,
	8215: 3295,
	8216: 2768,
	8217: 2769,
	8218: 2813,
	8220: 2770,
	8221: 2771,
	8222: 2814,
	8224: 2801,
	8225: 2802,
	8226: 2790,
	8229: 2735,
	8230: 2734,
	8240: 2773,
	8242: 2774,
	8243: 2775,
	8248: 2812,
	8254: 1150,
	8361: 3839,
	8364: 8364,
	8453: 2744,
	8470: 1712,
	8471: 2811,
	8478: 2772,
	8482: 2761,
	8531: 2736,
	8532: 2737,
	8533: 2738,
	8534: 2739,
	8535: 2740,
	8536: 2741,
	8537: 2742,
	8538: 2743,
	8539: 2755,
	8540: 2756,
	8541: 2757,
	8542: 2758,
	8592: 2299,
	8593: 2300,
	8594: 2301,
	8595: 2302,
	8658: 2254,
	8660: 2253,
	8706: 2287,
	8711: 2245,
	8728: 3018,
	8730: 2262,
	8733: 2241,
	8734: 2242,
	8743: 2270,
	8744: 2271,
	8745: 2268,
	8746: 2269,
	8747: 2239,
	8756: 2240,
	8764: 2248,
	8771: 2249,
	8773: 16785992,
	8800: 2237,
	8801: 2255,
	8804: 2236,
	8805: 2238,
	8834: 2266,
	8835: 2267,
	8866: 3068,
	8867: 3036,
	8868: 3010,
	8869: 3022,
	8968: 3027,
	8970: 3012,
	8981: 2810,
	8992: 2212,
	8993: 2213,
	9109: 3020,
	9115: 2219,
	9117: 2220,
	9118: 2221,
	9120: 2222,
	9121: 2215,
	9123: 2216,
	9124: 2217,
	9126: 2218,
	9128: 2223,
	9132: 2224,
	9143: 2209,
	9146: 2543,
	9147: 2544,
	9148: 2546,
	9149: 2547,
	9225: 2530,
	9226: 2533,
	9227: 2537,
	9228: 2531,
	9229: 2532,
	9251: 2732,
	9252: 2536,
	9472: 2211,
	9474: 2214,
	9484: 2210,
	9488: 2539,
	9492: 2541,
	9496: 2538,
	9500: 2548,
	9508: 2549,
	9516: 2551,
	9524: 2550,
	9532: 2542,
	9618: 2529,
	9642: 2791,
	9643: 2785,
	9644: 2779,
	9645: 2786,
	9646: 2783,
	9647: 2767,
	9650: 2792,
	9651: 2787,
	9654: 2781,
	9655: 2765,
	9660: 2793,
	9661: 2788,
	9664: 2780,
	9665: 2764,
	9670: 2528,
	9675: 2766,
	9679: 2782,
	9702: 2784,
	9734: 2789,
	9742: 2809,
	9747: 2762,
	9756: 2794,
	9758: 2795,
	9792: 2808,
	9794: 2807,
	9827: 2796,
	9829: 2798,
	9830: 2797,
	9837: 2806,
	9839: 2805,
	10003: 2803,
	10007: 2804,
	10013: 2777,
	10016: 2800,
	10216: 2748,
	10217: 2750,
	12289: 1188,
	12290: 1185,
	12300: 1186,
	12301: 1187,
	12443: 1246,
	12444: 1247,
	12449: 1191,
	12450: 1201,
	12451: 1192,
	12452: 1202,
	12453: 1193,
	12454: 1203,
	12455: 1194,
	12456: 1204,
	12457: 1195,
	12458: 1205,
	12459: 1206,
	12461: 1207,
	12463: 1208,
	12465: 1209,
	12467: 1210,
	12469: 1211,
	12471: 1212,
	12473: 1213,
	12475: 1214,
	12477: 1215,
	12479: 1216,
	12481: 1217,
	12483: 1199,
	12484: 1218,
	12486: 1219,
	12488: 1220,
	12490: 1221,
	12491: 1222,
	12492: 1223,
	12493: 1224,
	12494: 1225,
	12495: 1226,
	12498: 1227,
	12501: 1228,
	12504: 1229,
	12507: 1230,
	12510: 1231,
	12511: 1232,
	12512: 1233,
	12513: 1234,
	12514: 1235,
	12515: 1196,
	12516: 1236,
	12517: 1197,
	12518: 1237,
	12519: 1198,
	12520: 1238,
	12521: 1239,
	12522: 1240,
	12523: 1241,
	12524: 1242,
	12525: 1243,
	12527: 1244,
	12530: 1190,
	12531: 1245,
	12539: 1189,
	12540: 1200
};
var keysyms = { a(u) {
	// Latin-1 is one-to-one mapping
	if (u >= 32 && u <= 255) {
		return u;
	}
	// Lookup table (fairly random)
	const keysym = codepoints[u];
	if (keysym !== void 0) {
		return keysym;
	}
	// General mapping as final fallback
	return 16777216 | u;
} };
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2018 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
/*
* Mapping between Microsoft® Windows® Virtual-Key codes and
* HTML key codes.
*/
var vkeys = {
	8: "Backspace",
	9: "Tab",
	10: "NumpadClear",
	13: "Enter",
	16: "ShiftLeft",
	17: "ControlLeft",
	18: "AltLeft",
	19: "Pause",
	20: "CapsLock",
	21: "Lang1",
	25: "Lang2",
	27: "Escape",
	28: "Convert",
	29: "NonConvert",
	32: "Space",
	33: "PageUp",
	34: "PageDown",
	35: "End",
	36: "Home",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	41: "Select",
	44: "PrintScreen",
	45: "Insert",
	46: "Delete",
	47: "Help",
	48: "Digit0",
	49: "Digit1",
	50: "Digit2",
	51: "Digit3",
	52: "Digit4",
	53: "Digit5",
	54: "Digit6",
	55: "Digit7",
	56: "Digit8",
	57: "Digit9",
	91: "MetaLeft",
	92: "MetaRight",
	93: "ContextMenu",
	95: "Sleep",
	96: "Numpad0",
	97: "Numpad1",
	98: "Numpad2",
	99: "Numpad3",
	100: "Numpad4",
	101: "Numpad5",
	102: "Numpad6",
	103: "Numpad7",
	104: "Numpad8",
	105: "Numpad9",
	106: "NumpadMultiply",
	107: "NumpadAdd",
	108: "NumpadDecimal",
	109: "NumpadSubtract",
	110: "NumpadDecimal",
	111: "NumpadDivide",
	112: "F1",
	113: "F2",
	114: "F3",
	115: "F4",
	116: "F5",
	117: "F6",
	118: "F7",
	119: "F8",
	120: "F9",
	121: "F10",
	122: "F11",
	123: "F12",
	124: "F13",
	125: "F14",
	126: "F15",
	127: "F16",
	128: "F17",
	129: "F18",
	130: "F19",
	131: "F20",
	132: "F21",
	133: "F22",
	134: "F23",
	135: "F24",
	144: "NumLock",
	145: "ScrollLock",
	166: "BrowserBack",
	167: "BrowserForward",
	168: "BrowserRefresh",
	169: "BrowserStop",
	170: "BrowserSearch",
	171: "BrowserFavorites",
	172: "BrowserHome",
	173: "AudioVolumeMute",
	174: "AudioVolumeDown",
	175: "AudioVolumeUp",
	176: "MediaTrackNext",
	177: "MediaTrackPrevious",
	178: "MediaStop",
	179: "MediaPlayPause",
	180: "LaunchMail",
	181: "MediaSelect",
	182: "LaunchApp1",
	183: "LaunchApp2",
	225: "AltRight"
};
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2018 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
/*
* Fallback mapping between HTML key codes (physical keys) and
* HTML key values. This only works for keys that don't vary
* between layouts. We also omit those who manage fine by mapping the
* Unicode representation.
*
* See https://www.w3.org/TR/uievents-code/ for possible codes.
* See https://www.w3.org/TR/uievents-key/ for possible values.
*/
/* eslint-disable key-spacing */
var fixedkeys = {
	"Backspace": "Backspace",
	"AltLeft": "Alt",
	"AltRight": "Alt",
	"CapsLock": "CapsLock",
	"ContextMenu": "ContextMenu",
	"ControlLeft": "Control",
	"ControlRight": "Control",
	"Enter": "Enter",
	"MetaLeft": "Meta",
	"MetaRight": "Meta",
	"ShiftLeft": "Shift",
	"ShiftRight": "Shift",
	"Tab": "Tab",
	"Delete": "Delete",
	"End": "End",
	"Help": "Help",
	"Home": "Home",
	"Insert": "Insert",
	"PageDown": "PageDown",
	"PageUp": "PageUp",
	"ArrowDown": "ArrowDown",
	"ArrowLeft": "ArrowLeft",
	"ArrowRight": "ArrowRight",
	"ArrowUp": "ArrowUp",
	"NumLock": "NumLock",
	"NumpadBackspace": "Backspace",
	"NumpadClear": "Clear",
	"Escape": "Escape",
	"F1": "F1",
	"F2": "F2",
	"F3": "F3",
	"F4": "F4",
	"F5": "F5",
	"F6": "F6",
	"F7": "F7",
	"F8": "F8",
	"F9": "F9",
	"F10": "F10",
	"F11": "F11",
	"F12": "F12",
	"F13": "F13",
	"F14": "F14",
	"F15": "F15",
	"F16": "F16",
	"F17": "F17",
	"F18": "F18",
	"F19": "F19",
	"F20": "F20",
	"F21": "F21",
	"F22": "F22",
	"F23": "F23",
	"F24": "F24",
	"F25": "F25",
	"F26": "F26",
	"F27": "F27",
	"F28": "F28",
	"F29": "F29",
	"F30": "F30",
	"F31": "F31",
	"F32": "F32",
	"F33": "F33",
	"F34": "F34",
	"F35": "F35",
	"PrintScreen": "PrintScreen",
	"ScrollLock": "ScrollLock",
	"Pause": "Pause",
	"BrowserBack": "BrowserBack",
	"BrowserFavorites": "BrowserFavorites",
	"BrowserForward": "BrowserForward",
	"BrowserHome": "BrowserHome",
	"BrowserRefresh": "BrowserRefresh",
	"BrowserSearch": "BrowserSearch",
	"BrowserStop": "BrowserStop",
	"Eject": "Eject",
	"LaunchApp1": "LaunchMyComputer",
	"LaunchApp2": "LaunchCalendar",
	"LaunchMail": "LaunchMail",
	"MediaPlayPause": "MediaPlay",
	"MediaStop": "MediaStop",
	"MediaTrackNext": "MediaTrackNext",
	"MediaTrackPrevious": "MediaTrackPrevious",
	"Power": "Power",
	"Sleep": "Sleep",
	"AudioVolumeDown": "AudioVolumeDown",
	"AudioVolumeMute": "AudioVolumeMute",
	"AudioVolumeUp": "AudioVolumeUp",
	"WakeUp": "WakeUp"
};
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2018 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
/*
* Mapping between HTML key values and VNC/X11 keysyms for "special"
* keys that cannot be handled via their Unicode codepoint.
*
* See https://www.w3.org/TR/uievents-key/ for possible values.
*/
const DOMKeyTable = {};
function addStandard(key, standard) {
	if (key in DOMKeyTable) throw new Error("Duplicate entry for key \"" + key + "\"");
	DOMKeyTable[key] = [
		standard,
		standard,
		standard,
		standard
	];
}
function addLeftRight(key, left, right) {
	if (key in DOMKeyTable) throw new Error("Duplicate entry for key \"" + key + "\"");
	DOMKeyTable[key] = [
		left,
		left,
		right,
		left
	];
}
function addNumpad(key, standard, numpad) {
	if (key in DOMKeyTable) throw new Error("Duplicate entry for key \"" + key + "\"");
	DOMKeyTable[key] = [
		standard,
		standard,
		standard,
		numpad
	];
}
// 3.2. Modifier Keys
addLeftRight("Alt", 65513, 65514);
addStandard("AltGraph", 65027);
addStandard("CapsLock", 65509);
addLeftRight("Control", 65507, 65508);
// - Fn
// - FnLock
addLeftRight("Meta", 65515, 65516);
addStandard("NumLock", 65407);
addStandard("ScrollLock", 65300);
addLeftRight("Shift", 65505, 65506);
// - Symbol
// - SymbolLock
// - Hyper
// - Super
// 3.3. Whitespace Keys
addNumpad("Enter", 65293, 65421);
addStandard("Tab", 65289);
addNumpad(" ", 32, 65408);
// 3.4. Navigation Keys
addNumpad("ArrowDown", 65364, 65433);
addNumpad("ArrowLeft", 65361, 65430);
addNumpad("ArrowRight", 65363, 65432);
addNumpad("ArrowUp", 65362, 65431);
addNumpad("End", 65367, 65436);
addNumpad("Home", 65360, 65429);
addNumpad("PageDown", 65366, 65435);
addNumpad("PageUp", 65365, 65434);
// 3.5. Editing Keys
addStandard("Backspace", 65288);
// Browsers send "Clear" for the numpad 5 without NumLock because
// Windows uses VK_Clear for that key. But Unix expects KP_Begin for
// that scenario.
addNumpad("Clear", 65291, 65437);
addStandard("Copy", KeyTable.H);
// - CrSel
addStandard("Cut", KeyTable.I);
addNumpad("Delete", 65535, 65439);
// - EraseEof
// - ExSel
addNumpad("Insert", 65379, 65438);
addStandard("Paste", KeyTable.N);
addStandard("Redo", 65382);
addStandard("Undo", 65381);
// 3.6. UI Keys
// - Accept
// - Again (could just be XK_Redo)
// - Attn
addStandard("Cancel", 65385);
addStandard("ContextMenu", 65383);
addStandard("Escape", 65307);
addStandard("Execute", 65378);
addStandard("Find", 65384);
addStandard("Help", 65386);
addStandard("Pause", 65299);
// - Play
// - Props
addStandard("Select", 65376);
addStandard("ZoomIn", KeyTable.V);
addStandard("ZoomOut", KeyTable.W);
// 3.7. Device Keys
addStandard("BrightnessDown", KeyTable.b);
addStandard("BrightnessUp", KeyTable.a);
addStandard("Eject", KeyTable.x);
addStandard("LogOff", KeyTable.K);
addStandard("Power", KeyTable.v);
addStandard("PowerOff", KeyTable.q);
addStandard("PrintScreen", 65377);
addStandard("Hibernate", KeyTable.ca);
addStandard("Standby", KeyTable.c);
addStandard("WakeUp", KeyTable.w);
// 3.8. IME and Composition Keys
addStandard("AllCandidates", 65341);
addStandard("Alphanumeric", 65328);
addStandard("CodeInput", 65335);
addStandard("Compose", 65312);
addStandard("Convert", 65315);
// - Dead
// - FinalMode
addStandard("GroupFirst", 65036);
addStandard("GroupLast", 65038);
addStandard("GroupNext", 65032);
addStandard("GroupPrevious", 65034);
// - ModeChange (XK_Mode_switch is often used for AltGr)
// - NextCandidate
addStandard("NonConvert", 65314);
addStandard("PreviousCandidate", 65342);
// - Process
addStandard("SingleCandidate", 65340);
addStandard("HangulMode", 65329);
addStandard("HanjaMode", 65332);
addStandard("JunjaMode", 65336);
addStandard("Eisu", 65328);
addStandard("Hankaku", 65321);
addStandard("Hiragana", 65317);
addStandard("HiraganaKatakana", 65319);
addStandard("KanaMode", 65326);
addStandard("KanjiMode", 65313);
addStandard("Katakana", 65318);
addStandard("Romaji", 65316);
addStandard("Zenkaku", 65320);
addStandard("ZenkakuHankaku", 65322);
// 3.9. General-Purpose Function Keys
addStandard("F1", 65470);
addStandard("F2", 65471);
addStandard("F3", 65472);
addStandard("F4", 65473);
addStandard("F5", 65474);
addStandard("F6", 65475);
addStandard("F7", 65476);
addStandard("F8", 65477);
addStandard("F9", 65478);
addStandard("F10", 65479);
addStandard("F11", 65480);
addStandard("F12", 65481);
addStandard("F13", 65482);
addStandard("F14", 65483);
addStandard("F15", 65484);
addStandard("F16", 65485);
addStandard("F17", 65486);
addStandard("F18", 65487);
addStandard("F19", 65488);
addStandard("F20", 65489);
addStandard("F21", 65490);
addStandard("F22", 65491);
addStandard("F23", 65492);
addStandard("F24", 65493);
addStandard("F25", 65494);
addStandard("F26", 65495);
addStandard("F27", 65496);
addStandard("F28", 65497);
addStandard("F29", 65498);
addStandard("F30", 65499);
addStandard("F31", 65500);
addStandard("F32", 65501);
addStandard("F33", 65502);
addStandard("F34", 65503);
addStandard("F35", 65504);
// - Soft1...
// 3.10. Multimedia Keys
// - ChannelDown
// - ChannelUp
addStandard("Close", KeyTable.G);
addStandard("MailForward", KeyTable.Y);
addStandard("MailReply", KeyTable.P);
addStandard("MailSend", KeyTable.R);
// - MediaClose
addStandard("MediaFastForward", KeyTable.$);
addStandard("MediaPause", KeyTable.B);
addStandard("MediaPlay", KeyTable.g);
// - MediaPlayPause
addStandard("MediaRecord", KeyTable.n);
addStandard("MediaRewind", KeyTable.F);
addStandard("MediaStop", KeyTable.h);
addStandard("MediaTrackNext", KeyTable.j);
addStandard("MediaTrackPrevious", KeyTable.i);
addStandard("New", KeyTable.L);
addStandard("Open", KeyTable.M);
addStandard("Print", 65377);
addStandard("Save", KeyTable.Q);
addStandard("SpellCheck", KeyTable.S);
// 3.11. Multimedia Numpad Keys
// - Key11
// - Key12
// 3.12. Audio Keys
// - AudioBalanceLeft
// - AudioBalanceRight
// - AudioBassBoostDown
// - AudioBassBoostToggle
// - AudioBassBoostUp
// - AudioFaderFront
// - AudioFaderRear
// - AudioSurroundModeNext
// - AudioTrebleDown
// - AudioTrebleUp
addStandard("AudioVolumeDown", KeyTable.d);
addStandard("AudioVolumeUp", KeyTable.f);
addStandard("AudioVolumeMute", KeyTable.e);
// - MicrophoneToggle
// - MicrophoneVolumeDown
// - MicrophoneVolumeUp
addStandard("MicrophoneVolumeMute", KeyTable.da);
// 3.13. Speech Keys
// - SpeechCorrectionList
// - SpeechInputToggle
// 3.14. Application Keys
addStandard("LaunchApplication1", KeyTable.D);
addStandard("LaunchApplication2", KeyTable.o);
addStandard("LaunchCalendar", KeyTable.p);
// - LaunchContacts
addStandard("LaunchMail", KeyTable.l);
addStandard("LaunchMediaPlayer", KeyTable.C);
addStandard("LaunchMusicPlayer", KeyTable.Z);
addStandard("LaunchPhone", KeyTable.O);
addStandard("LaunchScreenSaver", KeyTable.y);
addStandard("LaunchSpreadsheet", KeyTable.J);
addStandard("LaunchWebBrowser", KeyTable.z);
addStandard("LaunchWebCam", KeyTable.X);
addStandard("LaunchWordProcessor", KeyTable.U);
// 3.15. Browser Keys
addStandard("BrowserBack", KeyTable.r);
addStandard("BrowserFavorites", KeyTable.A);
addStandard("BrowserForward", KeyTable.s);
addStandard("BrowserHome", KeyTable.k);
addStandard("BrowserRefresh", KeyTable.u);
addStandard("BrowserSearch", KeyTable.m);
addStandard("BrowserStop", KeyTable.t);
// 3.16. Mobile Phone Keys
// - A whole bunch...
// 3.17. TV Keys
// - A whole bunch...
// 3.18. Media Controller Keys
// - A whole bunch...
addStandard("Dimmer", KeyTable.E);
addStandard("MediaAudioTrack", KeyTable.ba);
addStandard("RandomToggle", KeyTable._);
addStandard("SplitScreenToggle", KeyTable.T);
addStandard("Subtitle", KeyTable.aa);
addStandard("VideoModeNext", KeyTable.ea);
// Extra: Numpad
addNumpad("=", 61, 65469);
addNumpad("+", 43, 65451);
addNumpad("-", 45, 65453);
addNumpad("*", 42, 65450);
addNumpad("/", 47, 65455);
addNumpad(".", 46, 65454);
addNumpad(",", 44, 65452);
addNumpad("0", 48, 65456);
addNumpad("1", 49, 65457);
addNumpad("2", 50, 65458);
addNumpad("3", 51, 65459);
addNumpad("4", 52, 65460);
addNumpad("5", 53, 65461);
addNumpad("6", 54, 65462);
addNumpad("7", 55, 65463);
addNumpad("8", 56, 65464);
addNumpad("9", 57, 65465);
// Get 'KeyboardEvent.code', handling legacy browsers
function getKeycode(evt) {
	// Are we getting proper key identifiers?
	// (unfortunately Firefox and Chrome are crappy here and gives
	// us an empty string on some platforms, rather than leaving it
	// undefined)
	if (evt.code) {
		// Mozilla isn't fully in sync with the spec yet
		switch (evt.code) {
			case "OSLeft": return "MetaLeft";
			case "OSRight": return "MetaRight";
		}
		return evt.code;
	}
	// The de-facto standard is to use Windows Virtual-Key codes
	// in the 'keyCode' field for non-printable characters
	if (evt.keyCode in vkeys) {
		let code = vkeys[evt.keyCode];
		// macOS has messed up this code for some reason
		if (isMac() && code === "ContextMenu") {
			code = "MetaRight";
		}
		// The keyCode doesn't distinguish between left and right
		// for the standard modifiers
		if (evt.location === 2) {
			switch (code) {
				case "ShiftLeft": return "ShiftRight";
				case "ControlLeft": return "ControlRight";
				case "AltLeft": return "AltRight";
			}
		}
		// Nor a bunch of the numpad keys
		if (evt.location === 3) {
			switch (code) {
				case "Delete": return "NumpadDecimal";
				case "Insert": return "Numpad0";
				case "End": return "Numpad1";
				case "ArrowDown": return "Numpad2";
				case "PageDown": return "Numpad3";
				case "ArrowLeft": return "Numpad4";
				case "ArrowRight": return "Numpad6";
				case "Home": return "Numpad7";
				case "ArrowUp": return "Numpad8";
				case "PageUp": return "Numpad9";
				case "Enter": return "NumpadEnter";
			}
		}
		return code;
	}
	return "Unidentified";
}
// Get 'KeyboardEvent.key', handling legacy browsers
function getKey(evt) {
	// Are we getting a proper key value?
	if (evt.key !== void 0 && evt.key !== "Unidentified") {
		// Mozilla isn't fully in sync with the spec yet
		switch (evt.key) {
			case "OS": return "Meta";
			case "LaunchMyComputer": return "LaunchApplication1";
			case "LaunchCalculator": return "LaunchApplication2";
		}
		// iOS leaks some OS names
		switch (evt.key) {
			case "UIKeyInputUpArrow": return "ArrowUp";
			case "UIKeyInputDownArrow": return "ArrowDown";
			case "UIKeyInputLeftArrow": return "ArrowLeft";
			case "UIKeyInputRightArrow": return "ArrowRight";
			case "UIKeyInputEscape": return "Escape";
		}
		// Broken behaviour in Chrome
		if (evt.key === "\0" && evt.code === "NumpadDecimal") {
			return "Delete";
		}
		return evt.key;
	}
	// Try to deduce it based on the physical key
	const code = getKeycode(evt);
	if (code in fixedkeys) {
		return fixedkeys[code];
	}
	// If that failed, then see if we have a printable character
	if (evt.charCode) {
		return String.fromCharCode(evt.charCode);
	}
	// At this point we have nothing left to go on
	return "Unidentified";
}
// Get the most reliable keysym value we can get from a key event
function getKeysym(evt) {
	const key = getKey(evt);
	if (key === "Unidentified") {
		return null;
	}
	// First look up special keys
	if (key in DOMKeyTable) {
		let location = evt.location;
		// Safari screws up location for the right cmd key
		if (key === "Meta" && location === 0) {
			location = 2;
		}
		// And for Clear
		if (key === "Clear" && location === 3) {
			let code = getKeycode(evt);
			if (code === "NumLock") {
				location = 0;
			}
		}
		if (location === void 0 || location > 3) {
			location = 0;
		}
		// The original Meta key now gets confused with the Windows key
		// https://bugs.chromium.org/p/chromium/issues/detail?id=1020141
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1232918
		if (key === "Meta") {
			let code = getKeycode(evt);
			if (code === "AltLeft") {
				return 65511;
			} else if (code === "AltRight") {
				return 65512;
			}
		}
		// macOS has Clear instead of NumLock, but the remote system is
		// probably not macOS, so lying here is probably best...
		if (key === "Clear") {
			let code = getKeycode(evt);
			if (code === "NumLock") {
				return 65407;
			}
		}
		// Windows sends alternating symbols for some keys when using a
		// Japanese layout. We have no way of synchronising with the IM
		// running on the remote system, so we send some combined keysym
		// instead and hope for the best.
		if (isWindows()) {
			switch (key) {
				case "Zenkaku":
				case "Hankaku": return 65322;
				case "Romaji":
				case "KanaMode": return 65316;
			}
		}
		return DOMKeyTable[key][location];
	}
	// Now we need to look at the Unicode symbol instead
	// Special key? (FIXME: Should have been caught earlier)
	if (key.length !== 1) {
		return null;
	}
	const codepoint = key.charCodeAt();
	if (codepoint) {
		return keysyms.a(codepoint);
	}
	return null;
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
//
// Keyboard event handler
//
class Keyboard {
	constructor(target) {
		this._target = target || null;
		this._keyDownList = {};
		// (even if they are happy)
		this._altGrArmed = false;
		// keep these here so we can refer to them later
		this._eventHandlers = {
			"keyup": this._handleKeyUp.bind(this),
			"keydown": this._handleKeyDown.bind(this),
			"blur": this._allKeysUp.bind(this)
		};
		// ===== EVENT HANDLERS =====
		this.onkeyevent = () => {};
	}
	// ===== PRIVATE METHODS =====
	_sendKeyEvent(keysym, code, down, numlock = null, capslock = null) {
		if (down) {
			this._keyDownList[code] = keysym;
		} else {
			// Do we really think this key is down?
			if (!(code in this._keyDownList)) {
				return;
			}
			delete this._keyDownList[code];
		}
		Debug("onkeyevent " + (down ? "down" : "up") + ", keysym: " + keysym, ", code: " + code + ", numlock: " + numlock + ", capslock: " + capslock);
		this.onkeyevent(keysym, code, down, numlock, capslock);
	}
	_getKeyCode(e) {
		const code = getKeycode(e);
		if (code !== "Unidentified") {
			return code;
		}
		// Unstable, but we don't have anything else to go on
		if (e.keyCode) {
			// 229 is used for composition events
			if (e.keyCode !== 229) {
				return "Platform" + e.keyCode;
			}
		}
		// A precursor to the final DOM3 standard. Unfortunately it
		// is not layout independent, so it is as bad as using keyCode
		if (e.keyIdentifier) {
			// Non-character key?
			if (e.keyIdentifier.substr(0, 2) !== "U+") {
				return e.keyIdentifier;
			}
			const codepoint = parseInt(e.keyIdentifier.substr(2), 16);
			const char = String.fromCharCode(codepoint).toUpperCase();
			return "Platform" + char.charCodeAt();
		}
		return "Unidentified";
	}
	_handleKeyDown(e) {
		const code = this._getKeyCode(e);
		let keysym = getKeysym(e);
		let numlock = e.getModifierState("NumLock");
		let capslock = e.getModifierState("CapsLock");
		// getModifierState for NumLock is not supported on mac and ios and always returns false.
		// Set to null to indicate unknown/unsupported instead.
		if (isMac() || isIOS()) {
			numlock = null;
		}
		// Windows doesn't have a proper AltGr, but handles it using
		// fake Ctrl+Alt. However the remote end might not be Windows,
		// so we need to merge those in to a single AltGr event. We
		// detect this case by seeing the two key events directly after
		// each other with a very short time between them (<50ms).
		if (this._altGrArmed) {
			this._altGrArmed = false;
			clearTimeout(this._altGrTimeout);
			if (code === "AltRight" && e.timeStamp - this._altGrCtrlTime < 50) {
				// FIXME: We fail to detect this if either Ctrl key is
				//        first manually pressed as Windows then no
				//        longer sends the fake Ctrl down event. It
				//        does however happily send real Ctrl events
				//        even when AltGr is already down. Some
				//        browsers detect this for us though and set the
				//        key to "AltGraph".
				keysym = 65027;
			} else {
				this._sendKeyEvent(65507, "ControlLeft", true, numlock, capslock);
			}
		}
		// We cannot handle keys we cannot track, but we also need
		// to deal with virtual keyboards which omit key info
		if (code === "Unidentified") {
			if (keysym) {
				// If it's a virtual keyboard then it should be
				// sufficient to just send press and release right
				// after each other
				this._sendKeyEvent(keysym, code, true, numlock, capslock);
				this._sendKeyEvent(keysym, code, false, numlock, capslock);
			}
			stopEvent(e);
			return;
		}
		// Alt behaves more like AltGraph on macOS, so shuffle the
		// keys around a bit to make things more sane for the remote
		// server. This method is used by RealVNC and TigerVNC (and
		// possibly others).
		if (isMac() || isIOS()) {
			switch (keysym) {
				case 65515:
					keysym = 65513;
					break;
				case 65516:
					keysym = 65515;
					break;
				case 65513:
					keysym = 65406;
					break;
				case 65514:
					keysym = 65027;
					break;
			}
		}
		// Is this key already pressed? If so, then we must use the
		// same keysym or we'll confuse the server
		if (code in this._keyDownList) {
			keysym = this._keyDownList[code];
		}
		// macOS doesn't send proper key releases if a key is pressed
		// while meta is held down
		if ((isMac() || isIOS()) && e.metaKey && code !== "MetaLeft" && code !== "MetaRight") {
			this._sendKeyEvent(keysym, code, true, numlock, capslock);
			this._sendKeyEvent(keysym, code, false, numlock, capslock);
			stopEvent(e);
			return;
		}
		// macOS doesn't send proper key events for modifiers, only
		// state change events. That gets extra confusing for CapsLock
		// which toggles on each press, but not on release. So pretend
		// it was a quick press and release of the button.
		if ((isMac() || isIOS()) && code === "CapsLock") {
			this._sendKeyEvent(65509, "CapsLock", true, numlock, capslock);
			this._sendKeyEvent(65509, "CapsLock", false, numlock, capslock);
			stopEvent(e);
			return;
		}
		// Windows doesn't send proper key releases for a bunch of
		// Japanese IM keys so we have to fake the release right away
		const jpBadKeys = [
			65322,
			65328,
			65318,
			65317,
			65316
		];
		if (isWindows() && jpBadKeys.includes(keysym)) {
			this._sendKeyEvent(keysym, code, true, numlock, capslock);
			this._sendKeyEvent(keysym, code, false, numlock, capslock);
			stopEvent(e);
			return;
		}
		stopEvent(e);
		// Possible start of AltGr sequence? (see above)
		if (code === "ControlLeft" && isWindows() && !("ControlLeft" in this._keyDownList)) {
			this._altGrArmed = true;
			this._altGrTimeout = setTimeout(this._interruptAltGrSequence.bind(this), 100);
			this._altGrCtrlTime = e.timeStamp;
			return;
		}
		this._sendKeyEvent(keysym, code, true, numlock, capslock);
	}
	_handleKeyUp(e) {
		stopEvent(e);
		const code = this._getKeyCode(e);
		// We can't get a release in the middle of an AltGr sequence, so
		// abort that detection
		this._interruptAltGrSequence();
		// See comment in _handleKeyDown()
		if ((isMac() || isIOS()) && code === "CapsLock") {
			this._sendKeyEvent(65509, "CapsLock", true);
			this._sendKeyEvent(65509, "CapsLock", false);
			return;
		}
		this._sendKeyEvent(this._keyDownList[code], code, false);
		// Windows has a rather nasty bug where it won't send key
		// release events for a Shift button if the other Shift is still
		// pressed
		if (isWindows() && (code === "ShiftLeft" || code === "ShiftRight")) {
			if ("ShiftRight" in this._keyDownList) {
				this._sendKeyEvent(this._keyDownList["ShiftRight"], "ShiftRight", false);
			}
			if ("ShiftLeft" in this._keyDownList) {
				this._sendKeyEvent(this._keyDownList["ShiftLeft"], "ShiftLeft", false);
			}
		}
	}
	_interruptAltGrSequence() {
		if (this._altGrArmed) {
			this._altGrArmed = false;
			clearTimeout(this._altGrTimeout);
			this._sendKeyEvent(65507, "ControlLeft", true);
		}
	}
	_allKeysUp() {
		Debug(">> Keyboard.allKeysUp");
		// Prevent control key being processed after losing focus.
		this._interruptAltGrSequence();
		for (let code in this._keyDownList) {
			this._sendKeyEvent(this._keyDownList[code], code, false);
		}
		Debug("<< Keyboard.allKeysUp");
	}
	// ===== PUBLIC METHODS =====
	grab() {
		//Log.Debug(">> Keyboard.grab");
		this._target.addEventListener("keydown", this._eventHandlers.keydown);
		this._target.addEventListener("keyup", this._eventHandlers.keyup);
		// Release (key up) if window loses focus
		window.addEventListener("blur", this._eventHandlers.blur);
		//Log.Debug("<< Keyboard.grab");
	}
	ungrab() {
		//Log.Debug(">> Keyboard.ungrab");
		this._target.removeEventListener("keydown", this._eventHandlers.keydown);
		this._target.removeEventListener("keyup", this._eventHandlers.keyup);
		window.removeEventListener("blur", this._eventHandlers.blur);
		// Release (key up) all keys that are in a down state
		this._allKeysUp();
		//Log.Debug(">> Keyboard.ungrab");
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2020 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
function toUnsigned32bit(toConvert) {
	return toConvert >>> 0;
}
function toSigned32bit(toConvert) {
	return toConvert | 0;
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
// Decode from UTF-8
function decodeUTF8(utf8string, allowLatin1 = false) {
	try {
		return decodeURIComponent(escape(utf8string));
	} catch (e) {
		if (e instanceof URIError) {
			if (allowLatin1) {
				// If we allow Latin1 we can ignore any decoding fails
				// and in these cases return the original string
				return utf8string;
			}
		}
		throw e;
	}
}
// Encode to UTF-8
function encodeUTF8(DOMString) {
	return unescape(encodeURIComponent(DOMString));
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2020 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
/*
* HTML element utility functions
*/
function clientToElement(x, y, elem) {
	const bounds = elem.getBoundingClientRect();
	let pos = {
		a: 0,
		b: 0
	};
	// Clip to target bounds
	if (x < bounds.left) {
		pos.a = 0;
	} else if (x >= bounds.right) {
		pos.a = bounds.width - 1;
	} else {
		pos.a = x - bounds.left;
	}
	if (y < bounds.top) {
		pos.b = 0;
	} else if (y >= bounds.bottom) {
		pos.b = bounds.height - 1;
	} else {
		pos.b = y - bounds.top;
	}
	return pos;
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
class EventTargetMixin {
	constructor() {
		this._listeners = new Map();
	}
	addEventListener(type, callback) {
		if (!this._listeners.has(type)) {
			this._listeners.set(type, new Set());
		}
		this._listeners.get(type).add(callback);
	}
	removeEventListener(type, callback) {
		if (this._listeners.has(type)) {
			this._listeners.get(type).delete(callback);
		}
	}
	dispatchEvent(event) {
		if (!this._listeners.has(event.type)) {
			return true;
		}
		this._listeners.get(event.type).forEach((callback) => callback.call(this, event));
		return !event.defaultPrevented;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
class Display {
	constructor(target) {
		this._drawCtx = null;
		this._renderQ = [];
		this._flushPromise = null;
		// the full frame buffer (logical canvas) size
		this._fbWidth = 0;
		this._fbHeight = 0;
		this._prevDrawStyle = "";
		Debug(">> Display.constructor");
		// The visible canvas
		this._target = target;
		if (!this._target) {
			throw new Error("Target must be set");
		}
		if (typeof this._target === "string") {
			throw new Error("target must be a DOM element");
		}
		if (!this._target.getContext) {
			throw new Error("no getContext method");
		}
		this._targetCtx = this._target.getContext("2d");
		// the visible canvas viewport (i.e. what actually gets seen)
		this._viewportLoc = {
			"x": 0,
			"y": 0,
			"w": this._target.width,
			"h": this._target.height
		};
		// The hidden canvas, where we do the actual rendering
		this._backbuffer = document.createElement("canvas");
		this._drawCtx = this._backbuffer.getContext("2d");
		this._damageBounds = {
			left: 0,
			top: 0,
			right: this._backbuffer.width,
			bottom: this._backbuffer.height
		};
		Debug("User Agent: " + navigator.userAgent);
		Debug("<< Display.constructor");
		// ===== PROPERTIES =====
		this._scale = 1;
		this._clipViewport = false;
	}
	// ===== PROPERTIES =====
	get scale() {
		return this._scale;
	}
	set scale(scale) {
		this._rescale(scale);
	}
	get clipViewport() {
		return this._clipViewport;
	}
	set clipViewport(viewport) {
		this._clipViewport = viewport;
		// May need to readjust the viewport dimensions
		const vp = this._viewportLoc;
		this.viewportChangeSize(vp.w, vp.h);
		this.viewportChangePos(0, 0);
	}
	get width() {
		return this._fbWidth;
	}
	get height() {
		return this._fbHeight;
	}
	// ===== PUBLIC METHODS =====
	viewportChangePos(deltaX, deltaY) {
		const vp = this._viewportLoc;
		deltaX = Math.floor(deltaX);
		deltaY = Math.floor(deltaY);
		if (!this._clipViewport) {
			deltaX = -vp.w;
			deltaY = -vp.h;
		}
		const vx2 = vp.x + vp.w - 1;
		const vy2 = vp.y + vp.h - 1;
		// Position change
		if (deltaX < 0 && vp.x + deltaX < 0) {
			deltaX = -vp.x;
		}
		if (vx2 + deltaX >= this._fbWidth) {
			deltaX -= vx2 + deltaX - this._fbWidth + 1;
		}
		if (vp.y + deltaY < 0) {
			deltaY = -vp.y;
		}
		if (vy2 + deltaY >= this._fbHeight) {
			deltaY -= vy2 + deltaY - this._fbHeight + 1;
		}
		if (deltaX === 0 && deltaY === 0) {
			return;
		}
		Debug("viewportChange deltaX: " + deltaX + ", deltaY: " + deltaY);
		vp.x += deltaX;
		vp.y += deltaY;
		this._damage(vp.x, vp.y, vp.w, vp.h);
		this.flip();
	}
	viewportChangeSize(width, height) {
		if (!this._clipViewport || typeof width === "undefined" || typeof height === "undefined") {
			Debug("Setting viewport to full display region");
			width = this._fbWidth;
			height = this._fbHeight;
		}
		width = Math.floor(width);
		height = Math.floor(height);
		if (width > this._fbWidth) {
			width = this._fbWidth;
		}
		if (height > this._fbHeight) {
			height = this._fbHeight;
		}
		const vp = this._viewportLoc;
		if (vp.w !== width || vp.h !== height) {
			vp.w = width;
			vp.h = height;
			const canvas = this._target;
			canvas.width = width;
			canvas.height = height;
			// The position might need to be updated if we've grown
			this.viewportChangePos(0, 0);
			this._damage(vp.x, vp.y, vp.w, vp.h);
			this.flip();
			// Update the visible size of the target canvas
			this._rescale(this._scale);
		}
	}
	absX(x) {
		if (this._scale === 0) {
			return 0;
		}
		return toSigned32bit(x / this._scale + this._viewportLoc.x);
	}
	absY(y) {
		if (this._scale === 0) {
			return 0;
		}
		return toSigned32bit(y / this._scale + this._viewportLoc.y);
	}
	resize(width, height) {
		this._prevDrawStyle = "";
		this._fbWidth = width;
		this._fbHeight = height;
		const canvas = this._backbuffer;
		if (canvas.width !== width || canvas.height !== height) {
			// We have to save the canvas data since changing the size will clear it
			let saveImg = null;
			if (canvas.width > 0 && canvas.height > 0) {
				saveImg = this._drawCtx.getImageData(0, 0, canvas.width, canvas.height);
			}
			if (canvas.width !== width) {
				canvas.width = width;
			}
			if (canvas.height !== height) {
				canvas.height = height;
			}
			if (saveImg) {
				this._drawCtx.putImageData(saveImg, 0, 0);
			}
		}
		// Readjust the viewport as it may be incorrectly sized
		// and positioned
		const vp = this._viewportLoc;
		this.viewportChangeSize(vp.w, vp.h);
		this.viewportChangePos(0, 0);
	}
	getImageData() {
		return this._drawCtx.getImageData(0, 0, this.width, this.height);
	}
	toDataURL(type, encoderOptions) {
		return this._backbuffer.toDataURL(type, encoderOptions);
	}
	toBlob(callback, type, quality) {
		return this._backbuffer.toBlob(callback, type, quality);
	}
	// Track what parts of the visible canvas that need updating
	_damage(x, y, w, h) {
		if (x < this._damageBounds.left) {
			this._damageBounds.left = x;
		}
		if (y < this._damageBounds.top) {
			this._damageBounds.top = y;
		}
		if (x + w > this._damageBounds.right) {
			this._damageBounds.right = x + w;
		}
		if (y + h > this._damageBounds.bottom) {
			this._damageBounds.bottom = y + h;
		}
	}
	// Update the visible canvas with the contents of the
	// rendering canvas
	flip(fromQueue) {
		if (this._renderQ.length !== 0 && !fromQueue) {
			this._renderQPush({ "type": "flip" });
		} else {
			let x = this._damageBounds.left;
			let y = this._damageBounds.top;
			let w = this._damageBounds.right - x;
			let h = this._damageBounds.bottom - y;
			let vx = x - this._viewportLoc.x;
			let vy = y - this._viewportLoc.y;
			if (vx < 0) {
				w += vx;
				x -= vx;
				vx = 0;
			}
			if (vy < 0) {
				h += vy;
				y -= vy;
				vy = 0;
			}
			if (vx + w > this._viewportLoc.w) {
				w = this._viewportLoc.w - vx;
			}
			if (vy + h > this._viewportLoc.h) {
				h = this._viewportLoc.h - vy;
			}
			if (w > 0 && h > 0) {
				// FIXME: We may need to disable image smoothing here
				//        as well (see copyImage()), but we haven't
				//        noticed any problem yet.
				this._targetCtx.drawImage(this._backbuffer, x, y, w, h, vx, vy, w, h);
			}
			this._damageBounds.left = this._damageBounds.top = 65535;
			this._damageBounds.right = this._damageBounds.bottom = 0;
		}
	}
	pending() {
		return this._renderQ.length > 0;
	}
	flush() {
		if (this._renderQ.length === 0) {
			return Promise.resolve();
		} else {
			if (this._flushPromise === null) {
				this._flushPromise = new Promise((resolve) => {
					this._flushResolve = resolve;
				});
			}
			return this._flushPromise;
		}
	}
	fillRect(x, y, width, height, color, fromQueue) {
		if (this._renderQ.length !== 0 && !fromQueue) {
			this._renderQPush({
				"type": "fill",
				"x": x,
				"y": y,
				"width": width,
				"height": height,
				"color": color
			});
		} else {
			this._setFillColor(color);
			this._drawCtx.fillRect(x, y, width, height);
			this._damage(x, y, width, height);
		}
	}
	copyImage(oldX, oldY, newX, newY, w, h, fromQueue) {
		if (this._renderQ.length !== 0 && !fromQueue) {
			this._renderQPush({
				"type": "copy",
				"oldX": oldX,
				"oldY": oldY,
				"x": newX,
				"y": newY,
				"width": w,
				"height": h
			});
		} else {
			// Due to this bug among others [1] we need to disable the image-smoothing to
			// avoid getting a blur effect when copying data.
			//
			// 1. https://bugzilla.mozilla.org/show_bug.cgi?id=1194719
			//
			// We need to set these every time since all properties are reset
			// when the the size is changed
			this._drawCtx.mozImageSmoothingEnabled = false;
			this._drawCtx.webkitImageSmoothingEnabled = false;
			this._drawCtx.msImageSmoothingEnabled = false;
			this._drawCtx.imageSmoothingEnabled = false;
			this._drawCtx.drawImage(this._backbuffer, oldX, oldY, w, h, newX, newY, w, h);
			this._damage(newX, newY, w, h);
		}
	}
	imageRect(x, y, width, height, mime, arr) {
		/* The internal logic cannot handle empty images, so bail early */
		if (width === 0 || height === 0) {
			return;
		}
		const img = new Image();
		img.src = "data: " + mime + ";base64," + Base64.b(arr);
		this._renderQPush({
			"type": "img",
			"img": img,
			"x": x,
			"y": y,
			"width": width,
			"height": height
		});
	}
	videoFrame(x, y, width, height, frame) {
		this._renderQPush({
			"type": "frame",
			"frame": frame,
			"x": x,
			"y": y,
			"width": width,
			"height": height
		});
	}
	blitImage(x, y, width, height, arr, offset, fromQueue) {
		if (this._renderQ.length !== 0 && !fromQueue) {
			// NB(directxman12): it's technically more performant here to use preallocated arrays,
			// but it's a lot of extra work for not a lot of payoff -- if we're using the render queue,
			// this probably isn't getting called *nearly* as much
			const newArr = new Uint8Array(width * height * 4);
			newArr.set(new Uint8Array(arr.buffer, 0, newArr.length));
			this._renderQPush({
				"type": "blit",
				"data": newArr,
				"x": x,
				"y": y,
				"width": width,
				"height": height
			});
		} else {
			// NB(directxman12): arr must be an Type Array view
			let data = new Uint8ClampedArray(arr.buffer, arr.byteOffset + offset, width * height * 4);
			let img = new ImageData(data, width, height);
			this._drawCtx.putImageData(img, x, y);
			this._damage(x, y, width, height);
		}
	}
	drawImage(img, ...args) {
		this._drawCtx.drawImage(img, ...args);
		if (args.length <= 4) {
			const [x, y] = args;
			this._damage(x, y, img.width, img.height);
		} else {
			const [, , sw, sh, dx, dy] = args;
			this._damage(dx, dy, sw, sh);
		}
	}
	autoscale(containerWidth, containerHeight) {
		let scaleRatio;
		if (containerWidth === 0 || containerHeight === 0) {
			scaleRatio = 0;
		} else {
			const vp = this._viewportLoc;
			const targetAspectRatio = containerWidth / containerHeight;
			const fbAspectRatio = vp.w / vp.h;
			if (fbAspectRatio >= targetAspectRatio) {
				scaleRatio = containerWidth / vp.w;
			} else {
				scaleRatio = containerHeight / vp.h;
			}
		}
		this._rescale(scaleRatio);
	}
	// ===== PRIVATE METHODS =====
	_rescale(factor) {
		this._scale = factor;
		const vp = this._viewportLoc;
		// NB(directxman12): If you set the width directly, or set the
		//                   style width to a number, the canvas is cleared.
		//                   However, if you set the style width to a string
		//                   ('NNNpx'), the canvas is scaled without clearing.
		const width = factor * vp.w + "px";
		const height = factor * vp.h + "px";
		if (this._target.style.width !== width || this._target.style.height !== height) {
			this._target.style.width = width;
			this._target.style.height = height;
		}
	}
	_setFillColor(color) {
		const newStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		if (newStyle !== this._prevDrawStyle) {
			this._drawCtx.fillStyle = newStyle;
			this._prevDrawStyle = newStyle;
		}
	}
	_renderQPush(action) {
		this._renderQ.push(action);
		if (this._renderQ.length === 1) {
			// If this can be rendered immediately it will be, otherwise
			// the scanner will wait for the relevant event
			this._scanRenderQ();
		}
	}
	_resumeRenderQ() {
		// "this" is the object that is ready, not the
		// display object
		this.removeEventListener("load", this._noVNCDisplay._resumeRenderQ);
		this._noVNCDisplay._scanRenderQ();
	}
	_scanRenderQ() {
		let ready = true;
		while (ready && this._renderQ.length > 0) {
			const a = this._renderQ[0];
			switch (a.type) {
				case "flip":
					this.flip(true);
					break;
				case "copy":
					this.copyImage(a.oldX, a.oldY, a.x, a.y, a.width, a.height, true);
					break;
				case "fill":
					this.fillRect(a.x, a.y, a.width, a.height, a.color, true);
					break;
				case "blit":
					this.blitImage(a.x, a.y, a.width, a.height, a.data, 0, true);
					break;
				case "img":
					if (a.img.complete) {
						if (a.img.width !== a.width || a.img.height !== a.height) {
							Error$1("Decoded image has incorrect dimensions. Got " + a.img.width + "x" + a.img.height + ". Expected " + a.width + "x" + a.height + ".");
							return;
						}
						this.drawImage(a.img, a.x, a.y);
						// This helps the browser free the memory right
						// away, rather than ballooning
						a.img.src = "";
					} else {
						a.img._noVNCDisplay = this;
						a.img.addEventListener("load", this._resumeRenderQ);
						// We need to wait for this image to 'load'
						// to keep things in-order
						ready = false;
					}
					break;
				case "frame":
					if (a.frame.ready) {
						// The encoded frame may be larger than the rect due to
						// limitations of the encoder, so we need to crop the
						// frame.
						let frame = a.frame.frame;
						if (frame.codedWidth < a.width || frame.codedHeight < a.height) {
							Warn("Decoded video frame does not cover its full rectangle area. Expecting at least " + a.width + "x" + a.height + " but got " + frame.codedWidth + "x" + frame.codedHeight);
						}
						const sw = a.width;
						const sh = a.height;
						const dx = a.x;
						const dy = a.y;
						const dw = sw;
						const dh = sh;
						this.drawImage(frame, 0, 0, sw, sh, dx, dy, dw, dh);
						frame.close();
					} else {
						let display = this;
						a.frame.promise.then(() => {
							display._scanRenderQ();
						});
						ready = false;
					}
					break;
			}
			if (ready) {
				this._renderQ.shift();
			}
		}
		if (this._renderQ.length === 0 && this._flushPromise !== null) {
			this._flushResolve();
			this._flushPromise = null;
			this._flushResolve = null;
		}
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (c) 2025 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
class AsyncClipboard {
	constructor(target) {
		this._target = target || null;
		this._isAvailable = null;
		this._eventHandlers = { "focus": this._handleFocus.bind(this) };
		// ===== EVENT HANDLERS =====
		this.onpaste = () => {};
	}
	// ===== PRIVATE METHODS =====
	async _ensureAvailable() {
		if (this._isAvailable !== null) return this._isAvailable;
		try {
			const status = await browserAsyncClipboardSupport();
			this._isAvailable = status === "available";
		} catch {
			this._isAvailable = false;
		}
		return this._isAvailable;
	}
	async _handleFocus() {
		if (!await this._ensureAvailable()) return;
		try {
			const text = await navigator.clipboard.readText();
			this.onpaste(text);
		} catch (error) {
			Error$1("Clipboard read failed: ", error);
		}
	}
	// ===== PUBLIC METHODS =====
	writeClipboard(text) {
		// Can lazily check cached availability
		if (!this._isAvailable) return false;
		navigator.clipboard.writeText(text).catch((error) => Error$1("Clipboard write failed: ", error));
		return true;
	}
	grab() {
		if (!this._target) return;
		this._ensureAvailable().then((isAvailable) => {
			if (isAvailable) {
				this._target.addEventListener("focus", this._eventHandlers.focus);
			}
		});
	}
	ungrab() {
		if (!this._target) return;
		this._target.removeEventListener("focus", this._eventHandlers.focus);
	}
}
// reduce buffer size, avoiding mem copy
function arraySet(dest, src, src_offs, len, dest_offs) {
	if (src.subarray && dest.subarray) {
		dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
		return;
	}
	// Fallback to ordinary array
	for (var i = 0; i < len; i++) {
		dest[dest_offs + i] = src[src_offs + i];
	}
}
var Buf8 = Uint8Array;
var Buf16 = Uint16Array;
var Buf32 = Int32Array;
// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.
function adler32(adler, buf, len, pos) {
	var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
	while (len !== 0) {
		// Set limit ~ twice less than 5552, to keep
		// s2 in 31-bits, because we force signed ints.
		// in other case %= will fail.
		n = len > 2e3 ? 2e3 : len;
		len -= n;
		do {
			s1 = s1 + buf[pos++] | 0;
			s2 = s2 + s1 | 0;
		} while (--n);
		s1 %= 65521;
		s2 %= 65521;
	}
	return s1 | s2 << 16 | 0;
}
// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.
// Use ordinary array, since untyped makes no boost here
function makeTable() {
	var c, table = [];
	for (var n = 0; n < 256; n++) {
		c = n;
		for (var k = 0; k < 8; k++) {
			c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		}
		table[n] = c;
	}
	return table;
}
// Create table on load. Just 255 signed longs. Not a problem.
makeTable();
/*
Decode literal, length, and distance codes and write out the resulting
literal and match bytes until either not enough input or output is
available, an end-of-block is encountered, or a data error is encountered.
When large enough input and output buffers are supplied to inflate(), for
example, a 16K input buffer and a 64K output buffer, more than 95% of the
inflate execution time is spent in this routine.

Entry assumptions:

state.mode === LEN
strm.avail_in >= 6
strm.avail_out >= 258
start >= strm.avail_out
state.bits < 8

On return, state.mode is one of:

LEN -- ran out of enough output space or enough available input
TYPE -- reached end of block code, inflate() to interpret next block
BAD -- error in block data

Notes:

- The maximum input bits used by a length/distance pair is 15 bits for the
length code, 5 bits for the length extra, 15 bits for the distance code,
and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
Therefore if strm.avail_in >= 6, then there is enough input to avoid
checking for available input while decoding.

- The maximum bytes that a single length/distance pair can output is 258
bytes, which is the maximum length that can be coded.  inflate_fast()
requires strm.avail_out >= 258 for each loop to avoid checking for
output space.
*/
function inflate_fast(strm, start) {
	var state;
	var _in;
	var last;
	var _out;
	var beg;
	var end;
	//#ifdef INFLATE_STRICT
	var dmax;
	//#endif
	var wsize;
	var whave;
	var wnext;
	// Use `s_window` instead `window`, avoid conflict with instrumentation tools
	var s_window;
	var hold;
	var bits;
	var lcode;
	var dcode;
	var lmask;
	var dmask;
	var here;
	var op;
	/*  window position, window bytes to copy */
	var len;
	var dist;
	var from;
	var from_source;
	var input, output;
	/* copy state to local variables */
	state = strm.state;
	//here = state.here;
	_in = strm.next_in;
	input = strm.input;
	last = _in + (strm.avail_in - 5);
	_out = strm.next_out;
	output = strm.output;
	beg = _out - (start - strm.avail_out);
	end = _out + (strm.avail_out - 257);
	//#ifdef INFLATE_STRICT
	dmax = state.dmax;
	//#endif
	wsize = state.wsize;
	whave = state.whave;
	wnext = state.wnext;
	s_window = state.window;
	hold = state.hold;
	bits = state.bits;
	lcode = state.lencode;
	dcode = state.distcode;
	lmask = (1 << state.lenbits) - 1;
	dmask = (1 << state.distbits) - 1;
	/* decode literals and length/distances until end-of-block or not enough
	input data or output space */
	top: do {
		if (bits < 15) {
			hold += input[_in++] << bits;
			bits += 8;
			hold += input[_in++] << bits;
			bits += 8;
		}
		here = lcode[hold & lmask];
		dolen: for (;;) {
			op = here >>> 24;
			hold >>>= op;
			bits -= op;
			op = here >>> 16 & 255;
			if (op === 0) {
				//Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
				//        "inflate:         literal '%c'\n" :
				//        "inflate:         literal 0x%02x\n", here.val));
				output[_out++] = here & 65535;
			} else if (op & 16) {
				len = here & 65535;
				op &= 15;
				if (op) {
					if (bits < op) {
						hold += input[_in++] << bits;
						bits += 8;
					}
					len += hold & (1 << op) - 1;
					hold >>>= op;
					bits -= op;
				}
				//Tracevv((stderr, "inflate:         length %u\n", len));
				if (bits < 15) {
					hold += input[_in++] << bits;
					bits += 8;
					hold += input[_in++] << bits;
					bits += 8;
				}
				here = dcode[hold & dmask];
				dodist: for (;;) {
					op = here >>> 24;
					hold >>>= op;
					bits -= op;
					op = here >>> 16 & 255;
					if (op & 16) {
						dist = here & 65535;
						op &= 15;
						if (bits < op) {
							hold += input[_in++] << bits;
							bits += 8;
							if (bits < op) {
								hold += input[_in++] << bits;
								bits += 8;
							}
						}
						dist += hold & (1 << op) - 1;
						//#ifdef INFLATE_STRICT
						if (dist > dmax) {
							strm.msg = "invalid distance too far back";
							state.mode = 30;
							break top;
						}
						//#endif
						hold >>>= op;
						bits -= op;
						//Tracevv((stderr, "inflate:         distance %u\n", dist));
						op = _out - beg;
						if (dist > op) {
							op = dist - op;
							if (op > whave) {
								if (state.sane) {
									strm.msg = "invalid distance too far back";
									state.mode = 30;
									break top;
								}
							}
							from = 0;
							from_source = s_window;
							if (wnext === 0) {
								from += wsize - op;
								if (op < len) {
									len -= op;
									do {
										output[_out++] = s_window[from++];
									} while (--op);
									from = _out - dist;
									from_source = output;
								}
							} else if (wnext < op) {
								from += wsize + wnext - op;
								op -= wnext;
								if (op < len) {
									len -= op;
									do {
										output[_out++] = s_window[from++];
									} while (--op);
									from = 0;
									if (wnext < len) {
										op = wnext;
										len -= op;
										do {
											output[_out++] = s_window[from++];
										} while (--op);
										from = _out - dist;
										from_source = output;
									}
								}
							} else {
								from += wnext - op;
								if (op < len) {
									len -= op;
									do {
										output[_out++] = s_window[from++];
									} while (--op);
									from = _out - dist;
									from_source = output;
								}
							}
							while (len > 2) {
								output[_out++] = from_source[from++];
								output[_out++] = from_source[from++];
								output[_out++] = from_source[from++];
								len -= 3;
							}
							if (len) {
								output[_out++] = from_source[from++];
								if (len > 1) {
									output[_out++] = from_source[from++];
								}
							}
						} else {
							from = _out - dist;
							do {
								output[_out++] = output[from++];
								output[_out++] = output[from++];
								output[_out++] = output[from++];
								len -= 3;
							} while (len > 2);
							if (len) {
								output[_out++] = output[from++];
								if (len > 1) {
									output[_out++] = output[from++];
								}
							}
						}
					} else if ((op & 64) === 0) {
						here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
						continue dodist;
					} else {
						strm.msg = "invalid distance code";
						state.mode = 30;
						break top;
					}
					break;
				}
			} else if ((op & 64) === 0) {
				here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
				continue dolen;
			} else if (op & 32) {
				//Tracevv((stderr, "inflate:         end of block\n"));
				state.mode = 12;
				break top;
			} else {
				strm.msg = "invalid literal/length code";
				state.mode = 30;
				break top;
			}
			break;
		}
	} while (_in < last && _out < end);
	/* return unused bytes (on entry, bits < 8, so in won't go too far back) */
	len = bits >> 3;
	_in -= len;
	bits -= len << 3;
	hold &= (1 << bits) - 1;
	/* update state and return */
	strm.next_in = _in;
	strm.next_out = _out;
	strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
	strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
	state.hold = hold;
	state.bits = bits;
	return;
}
var lbase = [
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
];
var lext = [
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	72,
	78
];
var dbase = [
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
];
var dext = [
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
];
function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
	var bits = opts.bits;
	//here = opts.here; /* table entry for duplication */
	var len;
	var sym;
	var min, max;
	var root;
	var curr;
	var drop;
	var left;
	var used;
	var huff;
	var incr;
	var fill;
	var low;
	var mask;
	var next;
	var base;
	var base_index = 0;
	//  var shoextra;    /* extra bits table to use */
	var end;
	var count = new Buf16(16);
	var offs = new Buf16(16);
	var extra;
	var extra_index = 0;
	var here_bits, here_op, here_val;
	/*
	Process a set of code lengths to create a canonical Huffman code.  The
	code lengths are lens[0..codes-1].  Each length corresponds to the
	symbols 0..codes-1.  The Huffman code is generated by first sorting the
	symbols by length from short to long, and retaining the symbol order
	for codes with equal lengths.  Then the code starts with all zero bits
	for the first code of the shortest length, and the codes are integer
	increments for the same length, and zeros are appended as the length
	increases.  For the deflate format, these bits are stored backwards
	from their more natural integer increment ordering, and so when the
	decoding tables are built in the large loop below, the integer codes
	are incremented backwards.
	
	This routine assumes, but does not check, that all of the entries in
	lens[] are in the range 0..MAXBITS.  The caller must assure this.
	1..MAXBITS is interpreted as that code length.  zero means that that
	symbol does not occur in this code.
	
	The codes are sorted by computing a count of codes for each length,
	creating from that a table of starting indices for each length in the
	sorted table, and then entering the symbols in order in the sorted
	table.  The sorted table is work[], with that space being provided by
	the caller.
	
	The length counts are used for other purposes as well, i.e. finding
	the minimum and maximum length codes, determining if there are any
	codes at all, checking for a valid set of lengths, and looking ahead
	at length counts to determine sub-table sizes when building the
	decoding tables.
	*/
	/* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
	for (len = 0; len <= 15; len++) {
		count[len] = 0;
	}
	for (sym = 0; sym < codes; sym++) {
		count[lens[lens_index + sym]]++;
	}
	/* bound code lengths, force root to be within code lengths */
	root = bits;
	for (max = 15; max >= 1; max--) {
		if (count[max] !== 0) {
			break;
		}
	}
	if (root > max) {
		root = max;
	}
	if (max === 0) {
		//table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
		//table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
		//table.val[opts.table_index++] = 0;   //here.val = (var short)0;
		table[table_index++, 0] = 1 << 24 | 64 << 16 | 0;
		//table.op[opts.table_index] = 64;
		//table.bits[opts.table_index] = 1;
		//table.val[opts.table_index++] = 0;
		table[table_index++] = 1 << 24 | 64 << 16 | 0;
		opts.bits = 1;
		return 0;
	}
	for (min = 1; min < max; min++) {
		if (count[min] !== 0) {
			break;
		}
	}
	if (root < min) {
		root = min;
	}
	/* check for an over-subscribed or incomplete set of lengths */
	left = 1;
	for (len = 1; len <= 15; len++) {
		left <<= 1;
		left -= count[len];
		if (left < 0) {
			return -1;
		}
	}
	if (left > 0 && (type === 0 || max !== 1)) {
		return -1;
	}
	/* generate offsets into symbol table for each length for sorting */
	offs[1] = 0;
	for (len = 1; len < 15; len++) {
		offs[len + 1] = offs[len] + count[len];
	}
	/* sort symbols by length, by symbol order within each length */
	for (sym = 0; sym < codes; sym++) {
		if (lens[lens_index + sym] !== 0) {
			work[offs[lens[lens_index + sym]]++] = sym;
		}
	}
	/*
	Create and fill in decoding tables.  In this loop, the table being
	filled is at next and has curr index bits.  The code being used is huff
	with length len.  That code is converted to an index by dropping drop
	bits off of the bottom.  For codes where len is less than drop + curr,
	those top drop + curr - len bits are incremented through all values to
	fill the table with replicated entries.
	
	root is the number of index bits for the root table.  When len exceeds
	root, sub-tables are created pointed to by the root entry with an index
	of the low root bits of huff.  This is saved in low to check for when a
	new sub-table should be started.  drop is zero when the root table is
	being filled, and drop is root when sub-tables are being filled.
	
	When a new sub-table is needed, it is necessary to look ahead in the
	code lengths to determine what size sub-table is needed.  The length
	counts are used for this, and so count[] is decremented as codes are
	entered in the tables.
	
	used keeps track of how many table entries have been allocated from the
	provided *table space.  It is checked for LENS and DIST tables against
	the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
	the initial root table size constants.  See the comments in inftrees.h
	for more information.
	
	sym increments through all symbols, and the loop terminates when
	all codes of length max, i.e. all codes, have been processed.  This
	routine permits incomplete codes, so another loop after this one fills
	in the rest of the decoding tables with invalid code markers.
	*/
	/* set up for code type */
	// poor man optimization - use if-else instead of switch,
	// to avoid deopts in old v8
	if (type === 0) {
		base = extra = work;
		end = 19;
	} else if (type === 1) {
		base = lbase;
		base_index -= 257;
		extra = lext;
		extra_index -= 257;
		end = 256;
	} else {
		base = dbase;
		extra = dext;
		end = -1;
	}
	/* initialize opts for loop */
	huff = 0;
	sym = 0;
	len = min;
	next = table_index;
	curr = root;
	drop = 0;
	low = -1;
	used = 1 << root;
	mask = used - 1;
	/* check available table space */
	if (type === 1 && used > 852 || type === 2 && used > 592) {
		return 1;
	}
	/* process all codes and make table entries */
	for (;;) {
		/* create table entry */
		here_bits = len - drop;
		if (work[sym] < end) {
			here_op = 0;
			here_val = work[sym];
		} else if (work[sym] > end) {
			here_op = extra[extra_index + work[sym]];
			here_val = base[base_index + work[sym]];
		} else {
			here_op = 96;
			here_val = 0;
		}
		/* replicate for those indices with low len bits equal to huff */
		incr = 1 << len - drop;
		fill = 1 << curr;
		min = fill;
		do {
			fill -= incr;
			table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
		} while (fill !== 0);
		/* backwards increment the len-bit code huff */
		incr = 1 << len - 1;
		while (huff & incr) {
			incr >>= 1;
		}
		if (incr !== 0) {
			huff &= incr - 1;
			huff += incr;
		} else {
			huff = 0;
		}
		/* go to next symbol, update count, len */
		sym++;
		if (--count[len] === 0) {
			if (len === max) {
				break;
			}
			len = lens[lens_index + work[sym]];
		}
		/* create new sub-table if needed */
		if (len > root && (huff & mask) !== low) {
			/* if first time, transition to sub-tables */
			if (drop === 0) {
				drop = root;
			}
			/* increment past last table */
			next += min;
			/* determine length of next table */
			curr = len - drop;
			left = 1 << curr;
			while (curr + drop < max) {
				left -= count[curr + drop];
				if (left <= 0) {
					break;
				}
				curr++;
				left <<= 1;
			}
			/* check for enough space */
			used += 1 << curr;
			if (type === 1 && used > 852 || type === 2 && used > 592) {
				return 1;
			}
			/* point entry in root table to sub-table */
			low = huff & mask;
			/*table.op[low] = curr;
			table.bits[low] = root;
			table.val[low] = next - opts.table_index;*/
			table[low] = root << 24 | curr << 16 | next - table_index | 0;
		}
	}
	/* fill in remaining table entry if code is incomplete (guaranteed to have
	at most one remaining entry, since if the code is incomplete, the
	maximum code length that was allowed to get this far is one bit) */
	if (huff !== 0) {
		//table.op[next + huff] = 64;            /* invalid code marker */
		//table.bits[next + huff] = len - drop;
		//table.val[next + huff] = 0;
		table[next + huff] = len - drop << 24 | 64 << 16 | 0;
	}
	/* set return parameters */
	//opts.table_index += used;
	opts.bits = root;
	return 0;
}
function zswap32(q) {
	return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
}
function InflateState() {
	this.flags = 0;
	this.check = 0;
	/* for string and stored block copying */
	this.length = 0;
	this.offset = 0;
	/* for table and code decoding */
	this.extra = 0;
	this.lenbits = 0;
	this.distbits = 0;
	/* dynamic table building */
	this.ncode = 0;
	this.nlen = 0;
	this.ndist = 0;
	this.have = 0;
	this.next = null;
	this.lens = new Buf16(320);
	this.work = new Buf16(288);
	this.was = 0;
}
function inflateResetKeep(strm) {
	var state;
	if (!strm || !strm.state) {
		return;
	}
	state = strm.state;
	strm.total_in = (strm.total_out = state.total = 0, 0);
	strm.msg = "";
	if (state.wrap) {
		strm.adler = state.wrap & 1;
	}
	state.mode = 1;
	state.last = 0;
	state.havedict = 0;
	state.dmax = 32768;
	state.head = null;
	state.hold = 0;
	state.bits = 0;
	//state.lencode = state.distcode = state.next = state.codes;
	state.lencode = state.lendyn = new Buf32(852);
	state.distcode = state.distdyn = new Buf32(592);
	state.sane = 1;
	state.back = -1;
	//Tracev((stderr, "inflate: reset\n"));
	return;
}
function inflateReset(strm) {
	var state;
	if (!strm || !strm.state) {
		return;
	}
	state = strm.state;
	state.wsize = 0;
	state.whave = 0;
	state.wnext = 0;
	return inflateResetKeep(strm);
}
function inflateReset2(strm) {
	var state;
	state = strm.state;
	/* update state and reset the rest of it */
	state.wrap = 1;
	state.wbits = 15;
	return inflateReset(strm);
}
function inflateInit2(strm) {
	var state;
	//strm.msg = Z_NULL;                 /* in case we return an error */
	state = new InflateState();
	//if (state === Z_NULL) return Z_MEM_ERROR;
	//Tracev((stderr, "inflate: allocated\n"));
	strm.state = state;
	state.window = null;
	inflateReset2(strm);
	return;
}
function inflateInit(strm) {
	return inflateInit2(strm);
}
/*
Return state with length and distance decoding tables and index sizes set to
fixed code decoding.  Normally this returns fixed tables from inffixed.h.
If BUILDFIXED is defined, then instead this routine builds the tables the
first time it's called, and returns those tables the first time and
thereafter.  This reduces the size of the code by about 2K bytes, in
exchange for a little execution time.  However, BUILDFIXED should not be
used for threaded applications, since the rewriting of the tables and virgin
may not be thread-safe.
*/
var virgin = true;
var lenfix, distfix;
function fixedtables(state) {
	/* build fixed huffman tables if first call (may not be thread safe) */
	if (virgin) {
		var sym;
		lenfix = new Buf32(512);
		distfix = new Buf32(32);
		/* literal/length table */
		sym = 0;
		while (sym < 144) {
			state.lens[sym++] = 8;
		}
		while (sym < 256) {
			state.lens[sym++] = 9;
		}
		while (sym < 280) {
			state.lens[sym++] = 7;
		}
		while (sym < 288) {
			state.lens[sym++] = 8;
		}
		inflate_table(1, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
		/* distance table */
		sym = 0;
		while (sym < 32) {
			state.lens[sym++] = 5;
		}
		inflate_table(2, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
		/* do this just once */
		virgin = false;
	}
	state.lencode = lenfix;
	state.lenbits = 9;
	state.distcode = distfix;
	state.distbits = 5;
}
/*
Update the window with the last wsize (normally 32K) bytes written before
returning.  If window does not exist yet, create it.  This is only called
when a window is already in use, or when output has been written during this
inflate call, but the end of the deflate stream has not been reached yet.
It is also called to create a window for dictionary data when a dictionary
is loaded.

Providing output buffers larger than 32K to inflate() should provide a speed
advantage, since only the last 32K of output is copied to the sliding window
upon return from inflate(), and since all distances after the first 32K of
output will fall in the output data, making match copies simpler and faster.
The advantage may be dependent on the size of the processor's data caches.
*/
function updatewindow(strm, src, end, copy) {
	var dist;
	var state = strm.state;
	/* if it hasn't been done already, allocate space for the window */
	if (state.window === null) {
		state.wsize = 1 << state.wbits;
		state.wnext = 0;
		state.whave = 0;
		state.window = new Buf8(state.wsize);
	}
	/* copy state->wsize or less output bytes into the circular window */
	if (copy >= state.wsize) {
		arraySet(state.window, src, end - state.wsize, state.wsize, 0);
		state.wnext = 0;
		state.whave = state.wsize;
	} else {
		dist = state.wsize - state.wnext;
		if (dist > copy) {
			dist = copy;
		}
		//zmemcpy(state->window + state->wnext, end - copy, dist);
		arraySet(state.window, src, end - copy, dist, state.wnext);
		copy -= dist;
		if (copy) {
			//zmemcpy(state->window, end - copy, copy);
			arraySet(state.window, src, end - copy, copy, 0);
			state.wnext = copy;
			state.whave = state.wsize;
		} else {
			state.wnext += dist;
			if (state.wnext === state.wsize) {
				state.wnext = 0;
			}
			if (state.whave < state.wsize) {
				state.whave += dist;
			}
		}
	}
	return;
}
function inflate(strm) {
	var state;
	var input, output;
	var next;
	var put;
	var have, left;
	var hold;
	var bits;
	var _in, _out;
	var copy;
	var from;
	var from_source;
	var here = 0;
	var here_bits, here_op, here_val;
	//var last;                   /* parent table entry */
	var last_bits, last_op, last_val;
	var len;
	var ret;
	var hbuf = new Buf8(4);
	var opts;
	var n;
	var order = [
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	];
	if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
		return -2;
	}
	state = strm.state;
	if (state.mode === 12) {
		state.mode = 13;
	}
	//--- LOAD() ---
	put = strm.next_out;
	output = strm.output;
	left = strm.avail_out;
	next = strm.next_in;
	input = strm.input;
	have = strm.avail_in;
	hold = state.hold;
	bits = state.bits;
	//---
	_in = have;
	_out = left;
	ret = 0;
	inf_leave: for (;;) {
		switch (state.mode) {
			case 1:
				if (state.wrap === 0) {
					state.mode = 13;
					break;
				}
				//=== NEEDBITS(16);
				while (bits < 16) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				if (state.wrap & 2 && hold === 35615) {
					state.check = 0;
					//=== CRC2(state.check, hold);
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = makeTable();
					//===//
					//=== INITBITS();
					hold = 0;
					bits = 0;
					//===//
					state.mode = 2;
					break;
				}
				state.flags = 0;
				if (state.head) {
					state.head.done = false;
				}
				if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
					strm.msg = "incorrect header check";
					state.mode = 30;
					break;
				}
				if ((hold & 15) !== 8) {
					strm.msg = "unknown compression method";
					state.mode = 30;
					break;
				}
				//--- DROPBITS(4) ---//
				hold >>>= 4;
				bits -= 4;
				//---//
				len = (hold & 15) + 8;
				if (state.wbits === 0) {
					state.wbits = len;
				} else if (len > state.wbits) {
					strm.msg = "invalid window size";
					state.mode = 30;
					break;
				}
				state.dmax = 1 << len;
				//Tracev((stderr, "inflate:   zlib header ok\n"));
				strm.adler = state.check = 1;
				state.mode = hold & 512 ? 10 : 12;
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				break;
			case 2:
				//=== NEEDBITS(16); */
				while (bits < 16) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				state.flags = hold;
				if ((state.flags & 255) !== 8) {
					strm.msg = "unknown compression method";
					state.mode = 30;
					break;
				}
				if (state.flags & 57344) {
					strm.msg = "unknown header flags set";
					state.mode = 30;
					break;
				}
				if (state.head) {
					state.head.text = hold >> 8 & 1;
				}
				if (state.flags & 512) {
					//=== CRC2(state.check, hold);
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = makeTable();
				}
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				state.mode = 3;
			case 3:
				//=== NEEDBITS(32); */
				while (bits < 32) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				if (state.head) {
					state.head.time = hold;
				}
				if (state.flags & 512) {
					//=== CRC4(state.check, hold)
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					hbuf[2] = hold >>> 16 & 255;
					hbuf[3] = hold >>> 24 & 255;
					state.check = makeTable();
				}
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				state.mode = 4;
			case 4:
				//=== NEEDBITS(16); */
				while (bits < 16) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				if (state.head) {
					state.head.xflags = hold & 255;
					state.head.os = hold >> 8;
				}
				if (state.flags & 512) {
					//=== CRC2(state.check, hold);
					hbuf[0] = hold & 255;
					hbuf[1] = hold >>> 8 & 255;
					state.check = makeTable();
				}
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				state.mode = 5;
			case 5:
				if (state.flags & 1024) {
					//=== NEEDBITS(16); */
					while (bits < 16) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					state.length = hold;
					if (state.head) {
						state.head.extra_len = hold;
					}
					if (state.flags & 512) {
						//=== CRC2(state.check, hold);
						hbuf[0] = hold & 255;
						hbuf[1] = hold >>> 8 & 255;
						state.check = makeTable();
					}
					//=== INITBITS();
					hold = 0;
					bits = 0;
				} else if (state.head) {
					state.head.extra = null;
				}
				state.mode = 6;
			case 6:
				if (state.flags & 1024) {
					copy = state.length;
					if (copy > have) {
						copy = have;
					}
					if (copy) {
						if (state.head) {
							len = state.head.extra_len - state.length;
							if (!state.head.extra) {
								// Use untyped array for more conveniend processing later
								state.head.extra = new Array(state.head.extra_len);
							}
							arraySet(
								state.head.extra,
								input,
								next,
								// extra field is limited to 65536 bytes
								// - no need for additional size check
								copy,
								/*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
								len
							);
						}
						if (state.flags & 512) {
							state.check = makeTable();
						}
						have -= copy;
						next += copy;
						state.length -= copy;
					}
					if (state.length) {
						break inf_leave;
					}
				}
				state.length = 0;
				state.mode = 7;
			case 7:
				if (state.flags & 2048) {
					if (have === 0) {
						break inf_leave;
					}
					copy = 0;
					do {
						// TODO: 2 or 1 bytes?
						len = input[next + copy++];
						/* use constant limit because in js we should not preallocate memory */
						if (state.head && len && state.length < 65536) {
							state.head.name += String.fromCharCode(len);
						}
					} while (len && copy < have);
					if (state.flags & 512) {
						state.check = makeTable();
					}
					have -= copy;
					next += copy;
					if (len) {
						break inf_leave;
					}
				} else if (state.head) {
					state.head.name = null;
				}
				state.length = 0;
				state.mode = 8;
			case 8:
				if (state.flags & 4096) {
					if (have === 0) {
						break inf_leave;
					}
					copy = 0;
					do {
						len = input[next + copy++];
						/* use constant limit because in js we should not preallocate memory */
						if (state.head && len && state.length < 65536) {
							state.head.comment += String.fromCharCode(len);
						}
					} while (len && copy < have);
					if (state.flags & 512) {
						state.check = makeTable();
					}
					have -= copy;
					next += copy;
					if (len) {
						break inf_leave;
					}
				} else if (state.head) {
					state.head.comment = null;
				}
				state.mode = 9;
			case 9:
				if (state.flags & 512) {
					//=== NEEDBITS(16); */
					while (bits < 16) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					if (hold !== (state.check & 65535)) {
						strm.msg = "header crc mismatch";
						state.mode = 30;
						break;
					}
					//=== INITBITS();
					hold = 0;
					bits = 0;
				}
				if (state.head) {
					state.head.hcrc = state.flags >> 9 & 1;
					state.head.done = true;
				}
				strm.adler = state.check = 0;
				state.mode = 12;
				break;
			case 10:
				//=== NEEDBITS(32); */
				while (bits < 32) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				strm.adler = state.check = zswap32(hold);
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				state.mode = 11;
			case 11:
				if (state.havedict === 0) {
					//--- RESTORE() ---
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					//---
					return 2;
				}
				strm.adler = state.check = 1;
				state.mode = 12;
			case 12:
			case 13:
				if (state.last) {
					//--- BYTEBITS() ---//
					hold >>>= bits & 7;
					bits -= bits & 7;
					//---//
					state.mode = 27;
					break;
				}
				//=== NEEDBITS(3); */
				while (bits < 3) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				state.last = hold & 1;
				//--- DROPBITS(1) ---//
				hold >>>= 1;
				bits -= 1;
				//---//
				switch (hold & 3) {
					case 0:
						//Tracev((stderr, "inflate:     stored block%s\n",
						//        state.last ? " (last)" : ""));
						state.mode = 14;
						break;
					case 1:
						fixedtables(state);
						//Tracev((stderr, "inflate:     fixed codes block%s\n",
						//        state.last ? " (last)" : ""));
						state.mode = 20;
						break;
					case 2:
						//Tracev((stderr, "inflate:     dynamic codes block%s\n",
						//        state.last ? " (last)" : ""));
						state.mode = 17;
						break;
					case 3:
						strm.msg = "invalid block type";
						state.mode = 30;
				}
				//--- DROPBITS(2) ---//
				hold >>>= 2;
				bits -= 2;
				//---//
				break;
			case 14:
				//--- BYTEBITS() ---// /* go to byte boundary */
				hold >>>= bits & 7;
				bits -= bits & 7;
				//---//
				//=== NEEDBITS(32); */
				while (bits < 32) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
					strm.msg = "invalid stored block lengths";
					state.mode = 30;
					break;
				}
				state.length = hold & 65535;
				//Tracev((stderr, "inflate:       stored length %u\n",
				//        state.length));
				//=== INITBITS();
				hold = 0;
				bits = 0;
				//===//
				state.mode = 15;
			case 15: state.mode = 16;
			case 16:
				copy = state.length;
				if (copy) {
					if (copy > have) {
						copy = have;
					}
					if (copy > left) {
						copy = left;
					}
					if (copy === 0) {
						break inf_leave;
					}
					//--- zmemcpy(put, next, copy); ---
					arraySet(output, input, next, copy, put);
					//---//
					have -= copy;
					next += copy;
					left -= copy;
					put += copy;
					state.length -= copy;
					break;
				}
				//Tracev((stderr, "inflate:       stored end\n"));
				state.mode = 12;
				break;
			case 17:
				//=== NEEDBITS(14); */
				while (bits < 14) {
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				//===//
				state.nlen = (hold & 31) + 257;
				//--- DROPBITS(5) ---//
				hold >>>= 5;
				bits -= 5;
				//---//
				state.ndist = (hold & 31) + 1;
				//--- DROPBITS(5) ---//
				hold >>>= 5;
				bits -= 5;
				//---//
				state.ncode = (hold & 15) + 4;
				//--- DROPBITS(4) ---//
				hold >>>= 4;
				bits -= 4;
				//---//
				//#ifndef PKZIP_BUG_WORKAROUND
				if (state.nlen > 286 || state.ndist > 30) {
					strm.msg = "too many length or distance symbols";
					state.mode = 30;
					break;
				}
				//#endif
				//Tracev((stderr, "inflate:       table sizes ok\n"));
				state.have = 0;
				state.mode = 18;
			case 18:
				while (state.have < state.ncode) {
					//=== NEEDBITS(3);
					while (bits < 3) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					state.lens[order[state.have++]] = hold & 7;
					//--- DROPBITS(3) ---//
					hold >>>= 3;
					bits -= 3;
				}
				while (state.have < 19) {
					state.lens[order[state.have++]] = 0;
				}
				// We have separate tables & no pointers. 2 commented lines below not needed.
				//state.next = state.codes;
				//state.lencode = state.next;
				// Switch to use dynamic table
				state.lencode = state.lendyn;
				state.lenbits = 7;
				opts = { bits: state.lenbits };
				ret = inflate_table(0, state.lens, 0, 19, state.lencode, 0, state.work, opts);
				state.lenbits = opts.bits;
				if (ret) {
					strm.msg = "invalid code lengths set";
					state.mode = 30;
					break;
				}
				//Tracev((stderr, "inflate:       code lengths ok\n"));
				state.have = 0;
				state.mode = 19;
			case 19:
				while (state.have < state.nlen + state.ndist) {
					for (;;) {
						here = state.lencode[hold & (1 << state.lenbits) - 1];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (here_bits <= bits) {
							break;
						}
						//--- PULLBYTE() ---//
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					if (here_val < 16) {
						//--- DROPBITS(here.bits) ---//
						hold >>>= here_bits;
						bits -= here_bits;
						//---//
						state.lens[state.have++] = here_val;
					} else {
						if (here_val === 16) {
							//=== NEEDBITS(here.bits + 2);
							n = here_bits + 2;
							while (bits < n) {
								if (have === 0) {
									break inf_leave;
								}
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							//===//
							//--- DROPBITS(here.bits) ---//
							hold >>>= here_bits;
							bits -= here_bits;
							//---//
							if (state.have === 0) {
								strm.msg = "invalid bit length repeat";
								state.mode = 30;
								break;
							}
							len = state.lens[state.have - 1];
							copy = 3 + (hold & 3);
							//--- DROPBITS(2) ---//
							hold >>>= 2;
							bits -= 2;
						} else if (here_val === 17) {
							//=== NEEDBITS(here.bits + 3);
							n = here_bits + 3;
							while (bits < n) {
								if (have === 0) {
									break inf_leave;
								}
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							//===//
							//--- DROPBITS(here.bits) ---//
							hold >>>= here_bits;
							bits -= here_bits;
							//---//
							len = 0;
							copy = 3 + (hold & 7);
							//--- DROPBITS(3) ---//
							hold >>>= 3;
							bits -= 3;
						} else {
							//=== NEEDBITS(here.bits + 7);
							n = here_bits + 7;
							while (bits < n) {
								if (have === 0) {
									break inf_leave;
								}
								have--;
								hold += input[next++] << bits;
								bits += 8;
							}
							//===//
							//--- DROPBITS(here.bits) ---//
							hold >>>= here_bits;
							bits -= here_bits;
							//---//
							len = 0;
							copy = 11 + (hold & 127);
							//--- DROPBITS(7) ---//
							hold >>>= 7;
							bits -= 7;
						}
						if (state.have + copy > state.nlen + state.ndist) {
							strm.msg = "invalid bit length repeat";
							state.mode = 30;
							break;
						}
						while (copy--) {
							state.lens[state.have++] = len;
						}
					}
				}
				/* handle error breaks in while */
				if (state.mode === 30) {
					break;
				}
				/* check for end-of-block code (better have one) */
				if (state.lens[256] === 0) {
					strm.msg = "invalid code -- missing end-of-block";
					state.mode = 30;
					break;
				}
				/* build code tables -- note: do not change the lenbits or distbits
				values here (9 and 6) without reading the comments in inftrees.h
				concerning the ENOUGH constants, which depend on those values */
				state.lenbits = 9;
				opts = { bits: state.lenbits };
				ret = inflate_table(1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
				// We have separate tables & no pointers. 2 commented lines below not needed.
				// state.next_index = opts.table_index;
				state.lenbits = opts.bits;
				// state.lencode = state.next;
				if (ret) {
					strm.msg = "invalid literal/lengths set";
					state.mode = 30;
					break;
				}
				state.distbits = 6;
				//state.distcode.copy(state.codes);
				// Switch to use dynamic table
				state.distcode = state.distdyn;
				opts = { bits: state.distbits };
				ret = inflate_table(2, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
				// We have separate tables & no pointers. 2 commented lines below not needed.
				// state.next_index = opts.table_index;
				state.distbits = opts.bits;
				// state.distcode = state.next;
				if (ret) {
					strm.msg = "invalid distances set";
					state.mode = 30;
					break;
				}
				//Tracev((stderr, 'inflate:       codes ok\n'));
				state.mode = 20;
			case 20: state.mode = 21;
			case 21:
				if (have >= 6 && left >= 258) {
					//--- RESTORE() ---
					strm.next_out = put;
					strm.avail_out = left;
					strm.next_in = next;
					strm.avail_in = have;
					state.hold = hold;
					state.bits = bits;
					//---
					inflate_fast(strm, _out);
					//--- LOAD() ---
					put = strm.next_out;
					output = strm.output;
					left = strm.avail_out;
					next = strm.next_in;
					input = strm.input;
					have = strm.avail_in;
					hold = state.hold;
					bits = state.bits;
					//---
					if (state.mode === 12) {
						state.back = -1;
					}
					break;
				}
				state.back = 0;
				for (;;) {
					here = state.lencode[hold & (1 << state.lenbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) {
						break;
					}
					//--- PULLBYTE() ---//
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if (here_op && (here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) {
							break;
						}
						//--- PULLBYTE() ---//
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//--- DROPBITS(last.bits) ---//
					hold >>>= last_bits;
					bits -= last_bits;
					//---//
					state.back += last_bits;
				}
				//--- DROPBITS(here.bits) ---//
				hold >>>= here_bits;
				bits -= here_bits;
				//---//
				state.back += here_bits;
				state.length = here_val;
				if (here_op === 0) {
					//Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
					//        "inflate:         literal '%c'\n" :
					//        "inflate:         literal 0x%02x\n", here.val));
					state.mode = 26;
					break;
				}
				if (here_op & 32) {
					//Tracevv((stderr, "inflate:         end of block\n"));
					state.back = -1;
					state.mode = 12;
					break;
				}
				if (here_op & 64) {
					strm.msg = "invalid literal/length code";
					state.mode = 30;
					break;
				}
				state.extra = here_op & 15;
				state.mode = 22;
			case 22:
				if (state.extra) {
					//=== NEEDBITS(state.extra);
					n = state.extra;
					while (bits < n) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					state.length += hold & (1 << state.extra) - 1;
					//--- DROPBITS(state.extra) ---//
					hold >>>= state.extra;
					bits -= state.extra;
					//---//
					state.back += state.extra;
				}
				//Tracevv((stderr, "inflate:         length %u\n", state.length));
				state.was = state.length;
				state.mode = 23;
			case 23:
				for (;;) {
					here = state.distcode[hold & (1 << state.distbits) - 1];
					here_bits = here >>> 24;
					here_op = here >>> 16 & 255;
					here_val = here & 65535;
					if (here_bits <= bits) {
						break;
					}
					//--- PULLBYTE() ---//
					if (have === 0) {
						break inf_leave;
					}
					have--;
					hold += input[next++] << bits;
					bits += 8;
				}
				if ((here_op & 240) === 0) {
					last_bits = here_bits;
					last_op = here_op;
					last_val = here_val;
					for (;;) {
						here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
						here_bits = here >>> 24;
						here_op = here >>> 16 & 255;
						here_val = here & 65535;
						if (last_bits + here_bits <= bits) {
							break;
						}
						//--- PULLBYTE() ---//
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//--- DROPBITS(last.bits) ---//
					hold >>>= last_bits;
					bits -= last_bits;
					//---//
					state.back += last_bits;
				}
				//--- DROPBITS(here.bits) ---//
				hold >>>= here_bits;
				bits -= here_bits;
				//---//
				state.back += here_bits;
				if (here_op & 64) {
					strm.msg = "invalid distance code";
					state.mode = 30;
					break;
				}
				state.offset = here_val;
				state.extra = here_op & 15;
				state.mode = 24;
			case 24:
				if (state.extra) {
					//=== NEEDBITS(state.extra);
					n = state.extra;
					while (bits < n) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					state.offset += hold & (1 << state.extra) - 1;
					//--- DROPBITS(state.extra) ---//
					hold >>>= state.extra;
					bits -= state.extra;
					//---//
					state.back += state.extra;
				}
				//#ifdef INFLATE_STRICT
				if (state.offset > state.dmax) {
					strm.msg = "invalid distance too far back";
					state.mode = 30;
					break;
				}
				//#endif
				//Tracevv((stderr, "inflate:         distance %u\n", state.offset));
				state.mode = 25;
			case 25:
				if (left === 0) {
					break inf_leave;
				}
				copy = _out - left;
				if (state.offset > copy) {
					copy = state.offset - copy;
					if (copy > state.whave) {
						if (state.sane) {
							strm.msg = "invalid distance too far back";
							state.mode = 30;
							break;
						}
					}
					if (copy > state.wnext) {
						copy -= state.wnext;
						from = state.wsize - copy;
					} else {
						from = state.wnext - copy;
					}
					if (copy > state.length) {
						copy = state.length;
					}
					from_source = state.window;
				} else {
					from_source = output;
					from = put - state.offset;
					copy = state.length;
				}
				if (copy > left) {
					copy = left;
				}
				left -= copy;
				state.length -= copy;
				do {
					output[put++] = from_source[from++];
				} while (--copy);
				if (state.length === 0) {
					state.mode = 21;
				}
				break;
			case 26:
				if (left === 0) {
					break inf_leave;
				}
				output[put++] = state.length;
				left--;
				state.mode = 21;
				break;
			case 27:
				if (state.wrap) {
					//=== NEEDBITS(32);
					while (bits < 32) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						// Use '|' insdead of '+' to make sure that result is signed
						hold |= input[next++] << bits;
						bits += 8;
					}
					//===//
					_out -= left;
					strm.total_out += _out;
					state.total += _out;
					if (_out) {
						strm.adler = state.check = state.flags ? makeTable() : adler32(state.check, output, _out, put - _out);
					}
					_out = left;
					// NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
					if ((state.flags ? hold : zswap32(hold)) !== state.check) {
						strm.msg = "incorrect data check";
						state.mode = 30;
						break;
					}
					//=== INITBITS();
					hold = 0;
					bits = 0;
				}
				state.mode = 28;
			case 28:
				if (state.wrap && state.flags) {
					//=== NEEDBITS(32);
					while (bits < 32) {
						if (have === 0) {
							break inf_leave;
						}
						have--;
						hold += input[next++] << bits;
						bits += 8;
					}
					//===//
					if (hold !== (state.total & 4294967295)) {
						strm.msg = "incorrect length check";
						state.mode = 30;
						break;
					}
					//=== INITBITS();
					hold = 0;
					bits = 0;
				}
				state.mode = 29;
			case 29:
				ret = 1;
				break inf_leave;
			case 30:
				ret = -3;
				break inf_leave;
			case 31: return -4;
			case 32:
			default: return -2;
		}
	}
	// inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
	/*
	Return from inflate(), updating the total counts and the check value.
	If there was no progress during the inflate() call, return a buffer
	error.  Call updatewindow() to create and/or update the window state.
	Note: a memory error from inflate() is non-recoverable.
	*/
	//--- RESTORE() ---
	strm.next_out = put;
	strm.avail_out = left;
	strm.next_in = next;
	strm.avail_in = have;
	state.hold = hold;
	state.bits = bits;
	//---
	if (state.wsize || _out !== strm.avail_out && state.mode < 30 && (state.mode < 27 || true)) {
		{
			updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out);
		}
	}
	_in -= strm.avail_in;
	_out -= strm.avail_out;
	strm.total_in += _in;
	strm.total_out += _out;
	state.total += _out;
	if (state.wrap && _out) {
		strm.adler = state.check = state.flags ? makeTable() : adler32(state.check, output, _out, strm.next_out - _out);
	}
	strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === 12 ? 128 : 0) + (state.mode === 20 || state.mode === 15 ? 256 : 0);
	if ((_in === 0 && _out === 0 || false) && ret === 0) {
		ret = -5;
	}
	return ret;
}
/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/
function ZStream() {
	/* next input byte */
	this.input = null;
	this.next_in = 0;
	/* number of bytes available at input */
	this.avail_in = 0;
	this.next_out = 0;
	/* remaining free space at output */
	this.avail_out = 0;
	/* last error message, NULL if no error */
	this.msg = "";
	/* best guess about the data type: binary or text */
	this.data_type = 2;
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2020 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
class Inflate {
	constructor() {
		this.strm = new ZStream();
		this.chunkSize = 102400;
		this.strm.output = new Uint8Array(102400);
		inflateInit(this.strm);
	}
	setInput(data) {
		if (!data) {
			//FIXME: flush remaining data.
			/* eslint-disable camelcase */
			this.strm.input = null;
			this.strm.avail_in = 0;
			this.strm.next_in = 0;
		} else {
			this.strm.input = data;
			this.strm.avail_in = this.strm.input.length;
			this.strm.next_in = 0;
		}
	}
	inflate(expected) {
		// resize our output buffer if it's too small
		// (we could just use multiple chunks, but that would cause an extra
		// allocation each time to flatten the chunks)
		if (expected > this.chunkSize) {
			this.chunkSize = expected;
			this.strm.output = new Uint8Array(this.chunkSize);
		}
		/* eslint-disable camelcase */
		this.strm.next_out = 0;
		this.strm.avail_out = expected;
		/* eslint-enable camelcase */
		let ret = inflate(this.strm);
		if (ret < 0) {
			throw new Error("zlib inflate failed");
		}
		if (this.strm.next_out != expected) {
			throw new Error("Incomplete zlib block");
		}
		return new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
	}
	reset() {
		inflateReset(this.strm);
	}
}
/*============================================================================*/
function zero$1(buf) {
	var len = buf.length;
	while (--len >= 0) {
		buf[len] = 0;
	}
}
/* repeat a zero length 11-138 times  (7 bits of repeat count) */
/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits = [
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
];
var extra_dbits = [
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
];
var extra_blbits = [
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
];
var bl_order = [
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
];
// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree = new Array(576);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
* need for the L_CODES extra codes used during heap construction. However
* The codes 286 and 287 are needed to build a canonical tree (see _tr_init
* below).
*/
var static_dtree = new Array(60);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
* 5 bits.)
*/
var _dist_code = new Array(512);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
* 3 .. 258, the last 256 values correspond to the top 8 bits of
* the 15 bit distances.
*/
var _length_code = new Array(256);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */
var base_length = new Array(29);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */
var base_dist = new Array(30);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
	this.static_tree = static_tree;
	this.extra_bits = extra_bits;
	this.extra_base = extra_base;
	this.elems = elems;
	this.max_length = max_length;
	// show if `static_tree` has data or dummy - needed for monomorphic objects
	this.has_stree = static_tree && static_tree.length;
}
var static_l_desc;
var static_d_desc;
var static_bl_desc;
function TreeDesc(dyn_tree, stat_desc) {
	this.dyn_tree = dyn_tree;
	this.max_code = 0;
	this.stat_desc = stat_desc;
}
function d_code(dist) {
	return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}
/* ===========================================================================
* Output a short LSB first on the stream.
* IN assertion: there is enough room in pendingBuf.
*/
function put_short(s, w) {
	//    put_byte(s, (uch)((w) & 0xff));
	//    put_byte(s, (uch)((ush)(w) >> 8));
	s.pending_buf[s.pending++] = w & 255;
	s.pending_buf[s.pending++] = w >>> 8 & 255;
}
/* ===========================================================================
* Send a value on a given number of bits.
* IN assertion: length <= 16 and value fits in length bits.
*/
function send_bits(s, value, length) {
	if (s.bi_valid > 16 - length) {
		s.bi_buf |= value << s.bi_valid & 65535;
		put_short(s, s.bi_buf);
		s.bi_buf = value >> 16 - s.bi_valid;
		s.bi_valid += length - 16;
	} else {
		s.bi_buf |= value << s.bi_valid & 65535;
		s.bi_valid += length;
	}
}
function send_code(s, c, tree) {
	send_bits(
		s,
		tree[c * 2],
		tree[c * 2 + 1]
		/*.Len*/
	);
}
/* ===========================================================================
* Reverse the first len bits of a code, using straightforward code (a faster
* method would use a table)
* IN assertion: 1 <= len <= 15
*/
function bi_reverse(code, len) {
	var res = 0;
	do {
		res |= code & 1;
		code >>>= 1;
		res <<= 1;
	} while (--len > 0);
	return res >>> 1;
}
/* ===========================================================================
* Compute the optimal bit lengths for a tree and update the total bit length
* for the current block.
* IN assertion: the fields freq and dad are set, heap[heap_max] and
*    above are the tree nodes sorted by increasing frequency.
* OUT assertions: the field len is set to the optimal bit length, the
*     array bl_count contains the frequencies for each bit length.
*     The length opt_len is updated; static_len is also updated if stree is
*     not null.
*/
function gen_bitlen(s, desc) {
	var tree = desc.dyn_tree;
	var max_code = desc.max_code;
	var stree = desc.stat_desc.static_tree;
	var has_stree = desc.stat_desc.has_stree;
	var extra = desc.stat_desc.extra_bits;
	var base = desc.stat_desc.extra_base;
	var max_length = desc.stat_desc.max_length;
	var h;
	var n, m;
	var bits;
	var xbits;
	var f;
	var overflow = 0;
	for (bits = 0; bits <= 15; bits++) {
		s.bl_count[bits] = 0;
	}
	/* In a first pass, compute the optimal bit lengths (which may
	* overflow in the case of the bit length tree).
	*/
	tree[s.heap[s.heap_max] * 2 + 1] = 0;
	for (h = s.heap_max + 1; h < 573; h++) {
		n = s.heap[h];
		bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
		if (bits > max_length) {
			bits = max_length;
			overflow++;
		}
		tree[n * 2 + 1] = bits;
		/* We overwrite tree[n].Dad which is no longer needed */
		if (n > max_code) {
			continue;
		}
		s.bl_count[bits]++;
		xbits = 0;
		if (n >= base) {
			xbits = extra[n - base];
		}
		f = tree[n * 2];
		s.opt_len += f * (bits + xbits);
		if (has_stree) {
			s.static_len += f * (stree[n * 2 + 1] + xbits);
		}
	}
	if (overflow === 0) {
		return;
	}
	// Trace((stderr,"\nbit length overflow\n"));
	/* This happens for example on obj2 and pic of the Calgary corpus */
	/* Find the first bit length which could increase: */
	do {
		bits = max_length - 1;
		while (s.bl_count[bits] === 0) {
			bits--;
		}
		s.bl_count[bits]--;
		s.bl_count[bits + 1] += 2;
		s.bl_count[max_length]--;
		/* The brother of the overflow item also moves one step up,
		* but this does not affect bl_count[max_length]
		*/
		overflow -= 2;
	} while (overflow > 0);
	/* Now recompute all bit lengths, scanning in increasing frequency.
	* h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
	* lengths instead of fixing only the wrong ones. This idea is taken
	* from 'ar' written by Haruhiko Okumura.)
	*/
	for (bits = max_length; bits !== 0; bits--) {
		n = s.bl_count[bits];
		while (n !== 0) {
			m = s.heap[--h];
			if (m > max_code) {
				continue;
			}
			if (tree[m * 2 + 1] !== bits) {
				// Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
				s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
				tree[m * 2 + 1] = bits;
			}
			n--;
		}
	}
}
/* ===========================================================================
* Generate the codes for a given tree and bit counts (which need not be
* optimal).
* IN assertion: the array bl_count contains the bit length statistics for
* the given tree and the field len is set for all tree elements.
* OUT assertion: the field code is set for all tree elements of non
*     zero code length.
*/
function gen_codes(tree, max_code, bl_count) {
	var next_code = new Array(16);
	var code = 0;
	var bits;
	var n;
	/* The distribution counts are first used to generate the code values
	* without bit reversal.
	*/
	for (bits = 1; bits <= 15; bits++) {
		next_code[bits] = code = code + bl_count[bits - 1] << 1;
	}
	/* Check that the bit counts in bl_count are consistent. The last code
	* must be all ones.
	*/
	//Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
	//        "inconsistent bit counts");
	//Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
	for (n = 0; n <= max_code; n++) {
		var len = tree[n * 2 + 1];
		if (len === 0) {
			continue;
		}
		/* Now reverse the bits */
		tree[n * 2] = bi_reverse(next_code[len]++, len);
	}
}
/* ===========================================================================
* Initialize the various 'constant' tables.
*/
function tr_static_init() {
	var n;
	var bits;
	var length;
	var code;
	var dist;
	var bl_count = new Array(16);
	/* number of codes at each bit length for an optimal tree */
	// do check in _tr_init()
	//if (static_init_done) return;
	/* For some embedded targets, global variables are not initialized: */
	/*#ifdef NO_INIT_GLOBAL_POINTERS
	static_l_desc.static_tree = static_ltree;
	static_l_desc.extra_bits = extra_lbits;
	static_d_desc.static_tree = static_dtree;
	static_d_desc.extra_bits = extra_dbits;
	static_bl_desc.extra_bits = extra_blbits;
	#endif*/
	/* Initialize the mapping length (0..255) -> length code (0..28) */
	length = 0;
	for (code = 0; code < 28; code++) {
		base_length[code] = length;
		for (n = 0; n < 1 << extra_lbits[code]; n++) {
			_length_code[length++] = code;
		}
	}
	//Assert (length == 256, "tr_static_init: length != 256");
	/* Note that the length 255 (match length 258) can be represented
	* in two different ways: code 284 + 5 bits or code 285, so we
	* overwrite length_code[255] to use the best encoding:
	*/
	_length_code[length - 1] = code;
	/* Initialize the mapping dist (0..32K) -> dist code (0..29) */
	dist = 0;
	for (code = 0; code < 16; code++) {
		base_dist[code] = dist;
		for (n = 0; n < 1 << extra_dbits[code]; n++) {
			_dist_code[dist++] = code;
		}
	}
	//Assert (dist == 256, "tr_static_init: dist != 256");
	dist >>= 7;
	for (; code < 30; code++) {
		base_dist[code] = dist << 7;
		for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
			_dist_code[256 + dist++] = code;
		}
	}
	//Assert (dist == 256, "tr_static_init: 256+dist != 512");
	/* Construct the codes of the static literal tree */
	for (bits = 0; bits <= 15; bits++) {
		bl_count[bits] = 0;
	}
	n = 0;
	while (n <= 143) {
		static_ltree[n * 2 + 1] = 8;
		n++;
		bl_count[8]++;
	}
	while (n <= 255) {
		static_ltree[n * 2 + 1] = 9;
		n++;
		bl_count[9]++;
	}
	while (n <= 279) {
		static_ltree[n * 2 + 1] = 7;
		n++;
		bl_count[7]++;
	}
	while (n <= 287) {
		static_ltree[n * 2 + 1] = 8;
		n++;
		bl_count[8]++;
	}
	/* Codes 286 and 287 do not exist, but we must include them in the
	* tree construction to get a canonical Huffman tree (longest code
	* all ones)
	*/
	gen_codes(static_ltree, 287, bl_count);
	/* The static distance tree is trivial: */
	for (n = 0; n < 30; n++) {
		static_dtree[n * 2 + 1] = 5;
		static_dtree[n * 2] = bi_reverse(n, 5);
	}
	// Now data ready and we can init static trees
	static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, 286, 15);
	static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, 30, 15);
	static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, 19, 7);
	//static_init_done = true;
}
/* ===========================================================================
* Initialize a new block.
*/
function init_block(s) {
	var n;
	/* Initialize the trees. */
	for (n = 0; n < 286; n++) {
		s.dyn_ltree[n * 2] = 0;
	}
	for (n = 0; n < 30; n++) {
		s.dyn_dtree[n * 2] = 0;
	}
	for (n = 0; n < 19; n++) {
		s.bl_tree[n * 2] = 0;
	}
	s.dyn_ltree[512] = 1;
	s.opt_len = s.static_len = 0;
	s.last_lit = s.matches = 0;
}
/* ===========================================================================
* Flush the bit buffer and align the output on a byte boundary
*/
function bi_windup(s) {
	if (s.bi_valid > 8) {
		put_short(s, s.bi_buf);
	} else if (s.bi_valid > 0) {
		//put_byte(s, (Byte)s->bi_buf);
		s.pending_buf[s.pending++] = s.bi_buf;
	}
	s.bi_buf = 0;
	s.bi_valid = 0;
}
/* ===========================================================================
* Copy a stored block, storing first the length and its
* one's complement if requested.
*/
function copy_block(s, buf, len) {
	bi_windup(s);
	{
		put_short(s, len);
		put_short(s, ~len);
	}
	//  while (len--) {
	//    put_byte(s, *buf++);
	//  }
	arraySet(s.pending_buf, s.window, buf, len, s.pending);
	s.pending += len;
}
/* ===========================================================================
* Compares to subtrees, using the tree depth as tie breaker when
* the subtrees have equal frequency. This minimizes the worst case length.
*/
function smaller(tree, n, m, depth) {
	var _n2 = n * 2;
	var _m2 = m * 2;
	return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
}
/* ===========================================================================
* Restore the heap property by moving down the tree starting at node k,
* exchanging a node with the smallest of its two sons if necessary, stopping
* when the heap property is re-established (each father smaller than its
* two sons).
*/
function pqdownheap(s, tree, k) {
	var v = s.heap[k];
	var j = k << 1;
	while (j <= s.heap_len) {
		/* Set j to the smallest of the two sons: */
		if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
			j++;
		}
		/* Exit if v is smaller than both sons */
		if (smaller(tree, v, s.heap[j], s.depth)) {
			break;
		}
		/* Exchange v with the smallest son */
		s.heap[k] = s.heap[j];
		k = j;
		/* And continue down the tree, setting j to the left son of k */
		j <<= 1;
	}
	s.heap[k] = v;
}
// inlined manually
// var SMALLEST = 1;
/* ===========================================================================
* Send the block data compressed using the given Huffman trees
*/
function compress_block(s, ltree, dtree) {
	var dist;
	var lc;
	var lx = 0;
	var code;
	var extra;
	if (s.last_lit !== 0) {
		do {
			dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
			lc = s.pending_buf[s.l_buf + lx];
			lx++;
			if (dist === 0) {
				send_code(s, lc, ltree);
			} else {
				/* Here, lc is the match length - MIN_MATCH */
				code = _length_code[lc];
				send_code(s, code + 256 + 1, ltree);
				extra = extra_lbits[code];
				if (extra !== 0) {
					lc -= base_length[code];
					send_bits(s, lc, extra);
				}
				dist--;
				code = d_code(dist);
				//Assert (code < D_CODES, "bad d_code");
				send_code(s, code, dtree);
				extra = extra_dbits[code];
				if (extra !== 0) {
					dist -= base_dist[code];
					send_bits(s, dist, extra);
				}
			}
		} while (lx < s.last_lit);
	}
	send_code(s, 256, ltree);
}
/* ===========================================================================
* Construct one Huffman tree and assigns the code bit strings and lengths.
* Update the total bit length for the current block.
* IN assertion: the field freq is set for all tree elements.
* OUT assertions: the fields len and code are set to the optimal bit length
*     and corresponding code. The length opt_len is updated; static_len is
*     also updated if stree is not null. The field max_code is set.
*/
function build_tree(s, desc) {
	var tree = desc.dyn_tree;
	var stree = desc.stat_desc.static_tree;
	var has_stree = desc.stat_desc.has_stree;
	var elems = desc.stat_desc.elems;
	var n, m;
	var max_code = -1;
	var node;
	/* Construct the initial heap, with least frequent element in
	* heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
	* heap[0] is not used.
	*/
	s.heap_len = 0;
	s.heap_max = 573;
	for (n = 0; n < elems; n++) {
		if (tree[n * 2] !== 0) {
			s.heap[++s.heap_len] = max_code = n;
			s.depth[n] = 0;
		} else {
			tree[n * 2 + 1] = 0;
		}
	}
	/* The pkzip format requires that at least one distance code exists,
	* and that at least one bit should be sent even if there is only one
	* possible code. So to avoid special checks later on we force at least
	* two codes of non zero frequency.
	*/
	while (s.heap_len < 2) {
		node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
		tree[node * 2] = 1;
		s.depth[node] = 0;
		s.opt_len--;
		if (has_stree) {
			s.static_len -= stree[node * 2 + 1];
		}
	}
	desc.max_code = max_code;
	/* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
	* establish sub-heaps of increasing lengths:
	*/
	for (n = s.heap_len >> 1; n >= 1; n--) {
		pqdownheap(s, tree, n);
	}
	/* Construct the Huffman tree by repeatedly combining the least two
	* frequent nodes.
	*/
	node = elems;
	do {
		//pqremove(s, tree, n);  /* n = node of least frequency */
		/*** pqremove ***/
		n = s.heap[1];
		s.heap[1] = s.heap[s.heap_len--];
		pqdownheap(
			s,
			tree,
			1
			/*SMALLEST*/
		);
		/***/
		m = s.heap[1];
		s.heap[--s.heap_max] = n;
		s.heap[--s.heap_max] = m;
		/* Create a new node father of n and m */
		tree[node * 2] = tree[n * 2] + tree[m * 2];
		s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
		tree[n * 2 + 1] = tree[m * 2 + 1] = node;
		/* and insert the new node in the heap */
		s.heap[1] = node++;
		pqdownheap(
			s,
			tree,
			1
			/*SMALLEST*/
		);
	} while (s.heap_len >= 2);
	s.heap[--s.heap_max] = s.heap[1];
	/* At this point, the fields freq and dad are set. We can now
	* generate the bit lengths.
	*/
	gen_bitlen(s, desc);
	/* The field len is now set, we can generate the bit codes */
	gen_codes(tree, max_code, s.bl_count);
}
/* ===========================================================================
* Scan a literal or distance tree to determine the frequencies of the codes
* in the bit length tree.
*/
function scan_tree(s, tree, max_code) {
	var n;
	var prevlen = -1;
	var curlen;
	var nextlen = tree[1];
	var count = 0;
	var max_count = 7;
	var min_count = 4;
	if (nextlen === 0) {
		max_count = 138;
		min_count = 3;
	}
	tree[(max_code + 1) * 2 + 1] = 65535;
	for (n = 0; n <= max_code; n++) {
		curlen = nextlen;
		nextlen = tree[(n + 1) * 2 + 1];
		if (++count < max_count && curlen === nextlen) {
			continue;
		} else if (count < min_count) {
			s.bl_tree[curlen * 2] += count;
		} else if (curlen !== 0) {
			if (curlen !== prevlen) {
				s.bl_tree[curlen * 2]++;
			}
			s.bl_tree[32]++;
		} else if (count <= 10) {
			s.bl_tree[34]++;
		} else {
			s.bl_tree[36]++;
		}
		count = 0;
		prevlen = curlen;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		} else if (curlen === nextlen) {
			max_count = 6;
			min_count = 3;
		} else {
			max_count = 7;
			min_count = 4;
		}
	}
}
/* ===========================================================================
* Send a literal or distance tree in compressed form, using the codes in
* bl_tree.
*/
function send_tree(s, tree, max_code) {
	var n;
	var prevlen = -1;
	var curlen;
	var nextlen = tree[1];
	var count = 0;
	var max_count = 7;
	var min_count = 4;
	/* tree[max_code+1].Len = -1; */
	/* guard already set */
	if (nextlen === 0) {
		max_count = 138;
		min_count = 3;
	}
	for (n = 0; n <= max_code; n++) {
		curlen = nextlen;
		nextlen = tree[(n + 1) * 2 + 1];
		if (++count < max_count && curlen === nextlen) {
			continue;
		} else if (count < min_count) {
			do {
				send_code(s, curlen, s.bl_tree);
			} while (--count !== 0);
		} else if (curlen !== 0) {
			if (curlen !== prevlen) {
				send_code(s, curlen, s.bl_tree);
				count--;
			}
			//Assert(count >= 3 && count <= 6, " 3_6?");
			send_code(s, 16, s.bl_tree);
			send_bits(s, count - 3, 2);
		} else if (count <= 10) {
			send_code(s, 17, s.bl_tree);
			send_bits(s, count - 3, 3);
		} else {
			send_code(s, 18, s.bl_tree);
			send_bits(s, count - 11, 7);
		}
		count = 0;
		prevlen = curlen;
		if (nextlen === 0) {
			max_count = 138;
			min_count = 3;
		} else if (curlen === nextlen) {
			max_count = 6;
			min_count = 3;
		} else {
			max_count = 7;
			min_count = 4;
		}
	}
}
/* ===========================================================================
* Construct the Huffman tree for the bit lengths and return the index in
* bl_order of the last bit length code to send.
*/
function build_bl_tree(s) {
	var max_blindex;
	/* Determine the bit length frequencies for literal and distance trees */
	scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
	scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
	/* Build the bit length tree: */
	build_tree(s, s.bl_desc);
	/* opt_len now includes the length of the tree representations, except
	* the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
	*/
	/* Determine the number of bit length codes to send. The pkzip format
	* requires that at least 4 bit length codes be sent. (appnote.txt says
	* 3 but the actual value used is 4.)
	*/
	for (max_blindex = 18; max_blindex >= 3; max_blindex--) {
		if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
			break;
		}
	}
	/* Update opt_len to include the bit length tree and counts */
	s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
	//Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
	//        s->opt_len, s->static_len));
	return max_blindex;
}
/* ===========================================================================
* Send the header for a block using dynamic Huffman trees: the counts, the
* lengths of the bit length codes, the literal tree and the distance tree.
* IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
*/
function send_all_trees(s, lcodes, dcodes, blcodes) {
	var rank;
	//Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
	//Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
	//        "too many codes");
	//Tracev((stderr, "\nbl counts: "));
	send_bits(s, lcodes - 257, 5);
	send_bits(s, dcodes - 1, 5);
	send_bits(s, blcodes - 4, 4);
	for (rank = 0; rank < blcodes; rank++) {
		//Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
		send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
	}
	//Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
	send_tree(s, s.dyn_ltree, lcodes - 1);
	//Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
	send_tree(s, s.dyn_dtree, dcodes - 1);
	//Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}
/* ===========================================================================
* Check if the data type is TEXT or BINARY, using the following algorithm:
* - TEXT if the two conditions below are satisfied:
*    a) There are no non-portable control characters belonging to the
*       "black list" (0..6, 14..25, 28..31).
*    b) There is at least one printable character belonging to the
*       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
* - BINARY otherwise.
* - The following partially-portable control characters form a
*   "gray list" that is ignored in this detection algorithm:
*   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
* IN assertion: the fields Freq of dyn_ltree are set.
*/
function detect_data_type(s) {
	/* black_mask is the bit mask of black-listed bytes
	* set bits 0..6, 14..25, and 28..31
	* 0xf3ffc07f = binary 11110011111111111100000001111111
	*/
	var black_mask = 4093624447;
	var n;
	/* Check for non-textual ("black-listed") bytes. */
	for (n = 0; n <= 31; n++, black_mask >>>= 1) {
		if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
			return 0;
		}
	}
	/* Check for textual ("white-listed") bytes. */
	if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) {
		return 1;
	}
	for (n = 32; n < 256; n++) {
		if (s.dyn_ltree[n * 2] !== 0) {
			return 1;
		}
	}
	/* There are no "black-listed" or "white-listed" bytes:
	* this stream either is empty or has tolerated ("gray-listed") bytes only.
	*/
	return 0;
}
var static_init_done = false;
/* ===========================================================================
* Initialize the tree data structures for a new zlib stream.
*/
function _tr_init(s) {
	if (!static_init_done) {
		tr_static_init();
		static_init_done = true;
	}
	s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
	s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
	s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
	s.bi_buf = 0;
	s.bi_valid = 0;
	/* Initialize the first block of the first file: */
	init_block(s);
}
/* ===========================================================================
* Send a stored block
*/
function _tr_stored_block(s, buf, stored_len, last) {
	send_bits(s, 0 + (last ? 1 : 0), 3);
	copy_block(s, buf, stored_len);
}
/* ===========================================================================
* Determine the best encoding for the current block: dynamic trees, static
* trees or store, and output the encoded block to the zip file.
*/
function _tr_flush_block(s, buf, stored_len, last) {
	var opt_lenb, static_lenb;
	var max_blindex = 0;
	/* Build the Huffman trees unless a stored block is forced */
	if (s.level > 0) {
		/* Check if the file is binary or text */
		if (s.strm.data_type === 2) {
			s.strm.data_type = detect_data_type(s);
		}
		/* Construct the literal and distance trees */
		build_tree(s, s.l_desc);
		// Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
		//        s->static_len));
		build_tree(s, s.d_desc);
		// Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
		//        s->static_len));
		/* At this point, opt_len and static_len are the total bit lengths of
		* the compressed block data, excluding the tree representations.
		*/
		/* Build the bit length tree for the above two trees, and get the index
		* in bl_order of the last bit length code to send.
		*/
		max_blindex = build_bl_tree(s);
		/* Determine the best encoding. Compute the block lengths in bytes. */
		opt_lenb = s.opt_len + 3 + 7 >>> 3;
		static_lenb = s.static_len + 3 + 7 >>> 3;
		// Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
		//        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
		//        s->last_lit));
		if (static_lenb <= opt_lenb) {
			opt_lenb = static_lenb;
		}
	} else {
		// Assert(buf != (char*)0, "lost buf");
		opt_lenb = static_lenb = stored_len + 5;
	}
	if (stored_len + 4 <= opt_lenb && buf !== -1) {
		/* 4: two words for the lengths */
		/* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
		* Otherwise we can't have processed more than WSIZE input bytes since
		* the last block flush, because compression would have been
		* successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
		* transform a block into a stored block.
		*/
		_tr_stored_block(s, buf, stored_len, last);
	} else if (s.strategy === 4 || static_lenb === opt_lenb) {
		send_bits(s, 2 + (last ? 1 : 0), 3);
		compress_block(s, static_ltree, static_dtree);
	} else {
		send_bits(s, 4 + (last ? 1 : 0), 3);
		send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
		compress_block(s, s.dyn_ltree, s.dyn_dtree);
	}
	// Assert (s->compressed_len == s->bits_sent, "bad compressed size");
	/* The above check is made mod 2^32, for files larger than 512 MB
	* and uLong implemented on 32 bits.
	*/
	init_block(s);
	if (last) {
		bi_windup(s);
	}
	// Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
	//       s->compressed_len-7*last));
}
/* ===========================================================================
* Save the match info and tally the frequency counts. Return true if
* the current block must be flushed.
*/
function _tr_tally(s, dist, lc) {
	//var out_length, in_length, dcode;
	s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
	s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
	s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
	s.last_lit++;
	if (dist === 0) {
		/* lc is the unmatched char */
		s.dyn_ltree[lc * 2]++;
	} else {
		s.matches++;
		/* Here, lc is the match length - MIN_MATCH */
		dist--;
		//Assert((ush)dist < (ush)MAX_DIST(s) &&
		//       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
		//       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
		s.dyn_ltree[(_length_code[lc] + 256 + 1) * 2]++;
		s.dyn_dtree[d_code(dist) * 2]++;
	}
	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	//#ifdef TRUNCATE_BLOCK
	//  /* Try to guess if it is profitable to stop the current block here */
	//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
	//    /* Compute an upper bound for the compressed length */
	//    out_length = s.last_lit*8;
	//    in_length = s.strstart - s.block_start;
	//
	//    for (dcode = 0; dcode < D_CODES; dcode++) {
	//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
	//    }
	//    out_length >>>= 3;
	//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
	//    //       s->last_lit, in_length, out_length,
	//    //       100L - out_length*100L/in_length));
	//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
	//      return true;
	//    }
	//  }
	//#endif
	return s.last_lit === s.lit_bufsize - 1;
	/* We avoid equality with lit_bufsize because of wraparound at 64K
	* on 16 bit machines and because stored blocks are restricted to
	* 64K-1 bytes.
	*/
}
var msg = {
	"-2": "stream error",
	"-5": "buffer error"
};
function err(strm, errorCode) {
	strm.msg = msg[errorCode];
	return errorCode;
}
function rank(f) {
	return (f << 1) - (f > 4 ? 9 : 0);
}
function zero(buf) {
	var len = buf.length;
	while (--len >= 0) {
		buf[len] = 0;
	}
}
/* =========================================================================
* Flush as much pending output as possible. All deflate() output goes
* through this function so some applications may wish to modify it
* to avoid allocating a large strm->output buffer and copying into it.
* (See also read_buf()).
*/
//! @__NO_SHAKE__
function flush_pending(strm) {
	var s = strm.state;
	//_tr_flush_bits(s);
	var len = s.pending;
	if (len > strm.avail_out) {
		len = strm.avail_out;
	}
	if (len === 0) {
		return;
	}
	arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
	strm.next_out += len;
	s.pending_out += len;
	strm.total_out += len;
	strm.avail_out -= len;
	s.pending -= len;
	if (s.pending === 0) {
		s.pending_out = 0;
	}
}
function flush_block_only(s, last) {
	_tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
	s.block_start = s.strstart;
	flush_pending(s.strm);
}
function put_byte(s, b) {
	s.pending_buf[s.pending++] = b;
}
/* =========================================================================
* Put a short in the pending buffer. The 16-bit value is put in MSB order.
* IN assertion: the stream state is correct and there is enough room in
* pending_buf.
*/
function putShortMSB(s, b) {
	//  put_byte(s, (Byte)(b >> 8));
	//  put_byte(s, (Byte)(b & 0xff));
	s.pending_buf[s.pending++] = b >>> 8 & 255;
	s.pending_buf[s.pending++] = b & 255;
}
/* ===========================================================================
* Read a new buffer from the current input stream, update the adler32
* and total number of bytes read.  All deflate() input goes through
* this function so some applications may wish to modify it to avoid
* allocating a large strm->input buffer and copying from it.
* (See also flush_pending()).
*/
function read_buf(strm, buf, start, size) {
	var len = strm.avail_in;
	if (len > size) {
		len = size;
	}
	if (len === 0) {
		return 0;
	}
	strm.avail_in -= len;
	// zmemcpy(buf, strm->next_in, len);
	arraySet(buf, strm.input, strm.next_in, len, start);
	if (strm.state.wrap === 1) {
		strm.adler = adler32(strm.adler, buf, len, start);
	} else if (strm.state.wrap === 2) {
		strm.adler = makeTable();
	}
	strm.next_in += len;
	strm.total_in += len;
	return len;
}
/* ===========================================================================
* Set match_start to the longest match starting at the given string and
* return its length. Matches shorter or equal to prev_length are discarded,
* in which case the result is equal to prev_length and match_start is
* garbage.
* IN assertions: cur_match is the head of the hash chain for the current
*   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
* OUT assertion: the match length is not greater than s->lookahead.
*/
function longest_match(s, cur_match) {
	var chain_length = s.max_chain_length;
	var scan = s.strstart;
	var match;
	var len;
	var best_len = s.prev_length;
	var nice_match = s.nice_match;
	var limit = s.strstart > s.w_size - 262 ? s.strstart - (s.w_size - 262) : 0;
	var _win = s.window;
	var wmask = s.w_mask;
	var prev = s.prev;
	/* Stop when cur_match becomes <= limit. To simplify the code,
	* we prevent matches with the string of window index 0.
	*/
	var strend = s.strstart + 258;
	var scan_end1 = _win[scan + best_len - 1];
	var scan_end = _win[scan + best_len];
	/* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
	* It is easy to get rid of this optimization if necessary.
	*/
	// Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");
	/* Do not waste too much time if we already have a good match: */
	if (s.prev_length >= s.good_match) {
		chain_length >>= 2;
	}
	/* Do not look for matches beyond the end of the input. This is necessary
	* to make deflate deterministic.
	*/
	if (nice_match > s.lookahead) {
		nice_match = s.lookahead;
	}
	// Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
	do {
		// Assert(cur_match < s->strstart, "no future");
		match = cur_match;
		/* Skip to next match if the match length cannot increase
		* or if the match length is less than 2.  Note that the checks below
		* for insufficient lookahead only occur occasionally for performance
		* reasons.  Therefore uninitialized memory will be accessed, and
		* conditional jumps will be made that depend on those values.
		* However the length of the match is limited to the lookahead, so
		* the output of deflate is not affected by the uninitialized values.
		*/
		if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
			continue;
		}
		/* The check at best_len-1 can be removed because it will be made
		* again later. (This heuristic is not always a win.)
		* It is not necessary to compare scan[2] and match[2] since they
		* are always equal when the other bytes match, given that
		* the hash keys are equal and that HASH_BITS >= 8.
		*/
		scan += 2;
		match++;
		// Assert(*scan == *match, "match[2]?");
		/* We check for insufficient lookahead only every 8th comparison;
		* the 256th check will be made at strstart+258.
		*/
		do		;
while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
		// Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
		len = 258 - (strend - scan);
		scan = strend - 258;
		if (len > best_len) {
			s.match_start = cur_match;
			best_len = len;
			if (len >= nice_match) {
				break;
			}
			scan_end1 = _win[scan + best_len - 1];
			scan_end = _win[scan + best_len];
		}
	} while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
	if (best_len <= s.lookahead) {
		return best_len;
	}
	return s.lookahead;
}
/* ===========================================================================
* Fill the window when the lookahead becomes insufficient.
* Updates strstart and lookahead.
*
* IN assertion: lookahead < MIN_LOOKAHEAD
* OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
*    At least one byte has been read, or avail_in == 0; reads are
*    performed for at least two bytes (required for the zip translate_eol
*    option -- not supported here).
*/
function fill_window(s) {
	var _w_size = s.w_size;
	var p, n, m, more, str;
	//Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
	do {
		more = s.window_size - s.lookahead - s.strstart;
		// JS ints have 32 bit, block below not needed
		/* Deal with !@#$% 64K limit: */
		//if (sizeof(int) <= 2) {
		//    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
		//        more = wsize;
		//
		//  } else if (more == (unsigned)(-1)) {
		//        /* Very unlikely, but possible on 16 bit machine if
		//         * strstart == 0 && lookahead == 1 (input done a byte at time)
		//         */
		//        more--;
		//    }
		//}
		/* If the window is almost full and there is insufficient lookahead,
		* move the upper half to the lower one to make room in the upper half.
		*/
		if (s.strstart >= _w_size + (_w_size - 262)) {
			arraySet(s.window, s.window, _w_size, _w_size, 0);
			s.match_start -= _w_size;
			s.strstart -= _w_size;
			/* we now have strstart >= MAX_DIST */
			s.block_start -= _w_size;
			/* Slide the hash table (could be avoided with 32 bit values
			at the expense of memory usage). We slide even when level == 0
			to keep the hash table consistent if we switch back to level > 0
			later. (Using level 0 permanently is not an optimal usage of
			zlib, so we don't care about this pathological case.)
			*/
			n = s.hash_size;
			p = n;
			do {
				m = s.head[--p];
				s.head[p] = m >= _w_size ? m - _w_size : 0;
			} while (--n);
			n = _w_size;
			p = n;
			do {
				m = s.prev[--p];
				s.prev[p] = m >= _w_size ? m - _w_size : 0;
			} while (--n);
			more += _w_size;
		}
		if (s.strm.avail_in === 0) {
			break;
		}
		/* If there was no sliding:
		*    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
		*    more == window_size - lookahead - strstart
		* => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
		* => more >= window_size - 2*WSIZE + 2
		* In the BIG_MEM or MMAP case (not yet supported),
		*   window_size == input_size + MIN_LOOKAHEAD  &&
		*   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
		* Otherwise, window_size == 2*WSIZE so more >= 2.
		* If there was sliding, more >= WSIZE. So in all cases, more >= 2.
		*/
		//Assert(more >= 2, "more < 2");
		n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
		s.lookahead += n;
		/* Initialize the hash value now that we have some input: */
		if (s.lookahead + s.insert >= 3) {
			str = s.strstart - s.insert;
			s.ins_h = s.window[str];
			/* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
			s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
			//#if MIN_MATCH != 3
			//        Call update_hash() MIN_MATCH-3 more times
			//#endif
			while (s.insert) {
				/* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 3 - 1]) & s.hash_mask;
				s.prev[str & s.w_mask] = s.head[s.ins_h];
				s.head[s.ins_h] = str;
				str++;
				s.insert--;
				if (s.lookahead + s.insert < 3) {
					break;
				}
			}
		}
	} while (s.lookahead < 262 && s.strm.avail_in !== 0);
	/* If the WIN_INIT bytes after the end of the current data have never been
	* written, then zero those bytes in order to avoid memory check reports of
	* the use of uninitialized (or uninitialised as Julian writes) bytes by
	* the longest match routines.  Update the high water mark for the next
	* time through here.  WIN_INIT is set to MAX_MATCH since the longest match
	* routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
	*/
	//  if (s.high_water < s.window_size) {
	//    var curr = s.strstart + s.lookahead;
	//    var init = 0;
	//
	//    if (s.high_water < curr) {
	//      /* Previous high water mark below current data -- zero WIN_INIT
	//       * bytes or up to end of window, whichever is less.
	//       */
	//      init = s.window_size - curr;
	//      if (init > WIN_INIT)
	//        init = WIN_INIT;
	//      zmemzero(s->window + curr, (unsigned)init);
	//      s->high_water = curr + init;
	//    }
	//    else if (s->high_water < (ulg)curr + WIN_INIT) {
	//      /* High water mark at or above current data, but below current data
	//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
	//       * to end of window, whichever is less.
	//       */
	//      init = (ulg)curr + WIN_INIT - s->high_water;
	//      if (init > s->window_size - s->high_water)
	//        init = s->window_size - s->high_water;
	//      zmemzero(s->window + s->high_water, (unsigned)init);
	//      s->high_water += init;
	//    }
	//  }
	//
	//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
	//    "not enough room for search");
}
/* ===========================================================================
* Copy without compression as much as possible from the input stream, return
* the current block state.
* This function does not insert new strings in the dictionary since
* uncompressible data is probably not useful. This function is used
* only for the level=0 compression option.
* NOTE: this function should be optimized to avoid extra copying from
* window to pending_buf.
*/
function deflate_stored(s, flush) {
	/* Stored blocks are limited to 0xffff bytes, pending_buf is limited
	* to pending_buf_size, and each stored block has a 5 byte header:
	*/
	var max_block_size = 65535;
	if (65535 > s.pending_buf_size - 5) {
		max_block_size = s.pending_buf_size - 5;
	}
	/* Copy as much as possible from input to output: */
	for (;;) {
		/* Fill the window as much as possible: */
		if (s.lookahead <= 1) {
			//Assert(s->strstart < s->w_size+MAX_DIST(s) ||
			//  s->block_start >= (long)s->w_size, "slide too late");
			//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
			//        s.block_start >= s.w_size)) {
			//        throw  new Error("slide too late");
			//      }
			fill_window(s);
			if (s.lookahead === 0 && flush === 0) {
				return 1;
			}
			if (s.lookahead === 0) {
				break;
			}
		}
		//Assert(s->block_start >= 0L, "block gone");
		//    if (s.block_start < 0) throw new Error("block gone");
		s.strstart += s.lookahead;
		s.lookahead = 0;
		/* Emit a stored block if pending_buf will be full: */
		var max_start = s.block_start + max_block_size;
		if (s.strstart === 0 || s.strstart >= max_start) {
			/* strstart == 0 is possible when wraparound on 16-bit machine */
			s.lookahead = s.strstart - max_start;
			s.strstart = max_start;
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) {
				return 1;
			}
		}
		/* Flush if we may have to slide, otherwise block_start may become
		* negative and the data will be gone:
		*/
		if (s.strstart - s.block_start >= s.w_size - 262) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) {
				return 1;
			}
		}
	}
	s.insert = 0;
	if (flush === 4) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) {
			return 3;
		}
		/***/
		return 4;
	}
	if (s.strstart > s.block_start) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) {
			return 1;
		}
	}
	return 1;
}
/* ===========================================================================
* Compress as much as possible from the input stream, return the current
* block state.
* This function does not perform lazy evaluation of matches and inserts
* new strings in the dictionary only for unmatched strings or for short
* matches. It is used only for the fast compression options.
*/
function deflate_fast(s, flush) {
	var hash_head;
	var bflush;
	for (;;) {
		/* Make sure that we always have enough lookahead, except
		* at the end of the input file. We need MAX_MATCH bytes
		* for the next match, plus MIN_MATCH bytes to insert the
		* string following the next match.
		*/
		if (s.lookahead < 262) {
			fill_window(s);
			if (s.lookahead < 262 && flush === 0) {
				return 1;
			}
			if (s.lookahead === 0) {
				break;
			}
		}
		/* Insert the string window[strstart .. strstart+2] in the
		* dictionary, and set hash_head to the head of the hash chain:
		*/
		hash_head = 0;
		if (s.lookahead >= 3) {
			/*** INSERT_STRING(s, s.strstart, hash_head); ***/
			s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 3 - 1]) & s.hash_mask;
			hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
			s.head[s.ins_h] = s.strstart;
		}
		/* Find the longest match, discarding those <= prev_length.
		* At this point we have always match_length < MIN_MATCH
		*/
		if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - 262) {
			/* To simplify the code, we prevent matches with the string
			* of window index 0 (in particular we have to avoid a match
			* of the string with itself at the start of the input file).
			*/
			s.match_length = longest_match(s, hash_head);
		}
		if (s.match_length >= 3) {
			// check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
			/*** _tr_tally_dist(s, s.strstart - s.match_start,
			s.match_length - MIN_MATCH, bflush); ***/
			bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - 3);
			s.lookahead -= s.match_length;
			/* Insert new strings in the hash table only if the match length
			* is not too large. This saves time but degrades compression.
			*/
			if (s.match_length <= s.max_lazy_match && s.lookahead >= 3) {
				s.match_length--;
				do {
					s.strstart++;
					/*** INSERT_STRING(s, s.strstart, hash_head); ***/
					s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 3 - 1]) & s.hash_mask;
					hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
					s.head[s.ins_h] = s.strstart;
				} while (--s.match_length !== 0);
				s.strstart++;
			} else {
				s.strstart += s.match_length;
				s.match_length = 0;
				s.ins_h = s.window[s.strstart];
				/* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
				s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
			}
		} else {
			/* No match, output a literal byte */
			//Tracevv((stderr,"%c", s.window[s.strstart]));
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
		}
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) {
				return 1;
			}
		}
	}
	s.insert = s.strstart < 2 ? s.strstart : 2;
	if (flush === 4) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) {
			return 3;
		}
		/***/
		return 4;
	}
	if (s.last_lit) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) {
			return 1;
		}
	}
	return 2;
}
/* ===========================================================================
* Same as above, but achieves better compression. We use a lazy
* evaluation for matches: a match is finally adopted only if there is
* no better match at the next window position.
*/
function deflate_slow(s, flush) {
	var hash_head;
	var bflush;
	var max_insert;
	/* Process the input block. */
	for (;;) {
		/* Make sure that we always have enough lookahead, except
		* at the end of the input file. We need MAX_MATCH bytes
		* for the next match, plus MIN_MATCH bytes to insert the
		* string following the next match.
		*/
		if (s.lookahead < 262) {
			fill_window(s);
			if (s.lookahead < 262 && flush === 0) {
				return 1;
			}
			if (s.lookahead === 0) {
				break;
			}
		}
		/* Insert the string window[strstart .. strstart+2] in the
		* dictionary, and set hash_head to the head of the hash chain:
		*/
		hash_head = 0;
		if (s.lookahead >= 3) {
			/*** INSERT_STRING(s, s.strstart, hash_head); ***/
			s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 3 - 1]) & s.hash_mask;
			hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
			s.head[s.ins_h] = s.strstart;
		}
		/* Find the longest match, discarding those <= prev_length.
		*/
		s.prev_length = s.match_length;
		s.prev_match = s.match_start;
		s.match_length = 2;
		if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - 262) {
			/* To simplify the code, we prevent matches with the string
			* of window index 0 (in particular we have to avoid a match
			* of the string with itself at the start of the input file).
			*/
			s.match_length = longest_match(s, hash_head);
			/* longest_match() sets match_start */
			if (s.match_length <= 5 && (s.strategy === 1 || s.match_length === 3 && s.strstart - s.match_start > 4096)) {
				/* If prev_match is also MIN_MATCH, match_start is garbage
				* but we will ignore the current match anyway.
				*/
				s.match_length = 2;
			}
		}
		/* If there was a match at the previous step and the current
		* match is not better, output the previous match:
		*/
		if (s.prev_length >= 3 && s.match_length <= s.prev_length) {
			max_insert = s.strstart + s.lookahead - 3;
			/* Do not insert strings in hash table beyond this. */
			//check_match(s, s.strstart-1, s.prev_match, s.prev_length);
			/***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
			s.prev_length - MIN_MATCH, bflush);***/
			bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - 3);
			/* Insert in hash table all strings up to the end of the match.
			* strstart-1 and strstart are already inserted. If there is not
			* enough lookahead, the last two strings are not inserted in
			* the hash table.
			*/
			s.lookahead -= s.prev_length - 1;
			s.prev_length -= 2;
			do {
				if (++s.strstart <= max_insert) {
					/*** INSERT_STRING(s, s.strstart, hash_head); ***/
					s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 3 - 1]) & s.hash_mask;
					hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
					s.head[s.ins_h] = s.strstart;
				}
			} while (--s.prev_length !== 0);
			s.match_available = 0;
			s.match_length = 2;
			s.strstart++;
			if (bflush) {
				/*** FLUSH_BLOCK(s, 0); ***/
				flush_block_only(s, false);
				if (s.strm.avail_out === 0) {
					return 1;
				}
			}
		} else if (s.match_available) {
			/* If there was no match at the previous position, output a
			* single literal. If there was a match but the current match
			* is longer, truncate the previous match to a single literal.
			*/
			//Tracevv((stderr,"%c", s->window[s->strstart-1]));
			/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
			if (bflush) {
				/*** FLUSH_BLOCK_ONLY(s, 0) ***/
				flush_block_only(s, false);
			}
			s.strstart++;
			s.lookahead--;
			if (s.strm.avail_out === 0) {
				return 1;
			}
		} else {
			/* There is no previous match to compare with, wait for
			* the next step to decide.
			*/
			s.match_available = 1;
			s.strstart++;
			s.lookahead--;
		}
	}
	//Assert (flush != Z_NO_FLUSH, "no flush?");
	if (s.match_available) {
		//Tracevv((stderr,"%c", s->window[s->strstart-1]));
		/*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
		bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
		s.match_available = 0;
	}
	s.insert = s.strstart < 2 ? s.strstart : 2;
	if (flush === 4) {
		/*** FLUSH_BLOCK(s, 1); ***/
		flush_block_only(s, true);
		if (s.strm.avail_out === 0) {
			return 3;
		}
		/***/
		return 4;
	}
	if (s.last_lit) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) {
			return 1;
		}
	}
	return 2;
}
/* ===========================================================================
* For Z_RLE, simply look for runs of bytes, generate matches only of distance
* one.  Do not maintain a hash table.  (It will be regenerated if this run of
* deflate switches away from Z_RLE.)
*/
function deflate_rle(s) {
	var bflush;
	var prev;
	var scan, strend;
	var _win = s.window;
	for (;;) {
		/* Make sure that we always have enough lookahead, except
		* at the end of the input file. We need MAX_MATCH bytes
		* for the longest run, plus one for the unrolled loop.
		*/
		if (s.lookahead <= 258) {
			fill_window(s);
			if (s.lookahead === 0) {
				break;
			}
		}
		/* See how many times the previous byte repeats */
		s.match_length = 0;
		if (s.lookahead >= 3 && s.strstart > 0) {
			scan = s.strstart - 1;
			prev = _win[scan];
			if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
				strend = s.strstart + 258;
				do				;
while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
				s.match_length = 258 - (strend - scan);
				if (s.match_length > s.lookahead) {
					s.match_length = s.lookahead;
				}
			}
		}
		/* Emit match if have run of MIN_MATCH or longer, else emit literal */
		if (s.match_length >= 3) {
			//check_match(s, s.strstart, s.strstart - 1, s.match_length);
			/*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
			bflush = _tr_tally(s, 1, s.match_length - 3);
			s.lookahead -= s.match_length;
			s.strstart += s.match_length;
			s.match_length = 0;
		} else {
			/* No match, output a literal byte */
			//Tracevv((stderr,"%c", s->window[s->strstart]));
			/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
			bflush = _tr_tally(s, 0, s.window[s.strstart]);
			s.lookahead--;
			s.strstart++;
		}
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) {
				return 1;
			}
		}
	}
	s.insert = 0;
	if (s.last_lit) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) {
			return 1;
		}
	}
	return 2;
}
/* ===========================================================================
* For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
* (It will be regenerated if this run of deflate switches away from Huffman.)
*/
function deflate_huff(s) {
	var bflush;
	for (;;) {
		/* Make sure that we have a literal to write. */
		if (s.lookahead === 0) {
			fill_window(s);
			if (s.lookahead === 0) {
				break;
			}
		}
		/* Output a literal byte */
		s.match_length = 0;
		//Tracevv((stderr,"%c", s->window[s->strstart]));
		/*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
		bflush = _tr_tally(s, 0, s.window[s.strstart]);
		s.lookahead--;
		s.strstart++;
		if (bflush) {
			/*** FLUSH_BLOCK(s, 0); ***/
			flush_block_only(s, false);
			if (s.strm.avail_out === 0) {
				return 1;
			}
		}
	}
	s.insert = 0;
	if (s.last_lit) {
		/*** FLUSH_BLOCK(s, 0); ***/
		flush_block_only(s, false);
		if (s.strm.avail_out === 0) {
			return 1;
		}
	}
	return 2;
}
/* Values for max_lazy_match, good_match and max_chain_length, depending on
* the desired pack level (0..9). The values given below have been tuned to
* exclude worst case performance for pathological files. Better values may be
* found for specific files.
*/
function Config(good_length, max_lazy, nice_length, max_chain, func) {
	this.good_length = good_length;
	this.max_lazy = max_lazy;
	this.nice_length = nice_length;
	this.max_chain = max_chain;
	this.func = func;
}
var configuration_table;
configuration_table = [
	new Config(0, 0, 0, 0, deflate_stored),
	new Config(4, 4, 8, 4, deflate_fast),
	new Config(4, 5, 16, 8, deflate_fast),
	new Config(4, 6, 32, 32, deflate_fast),
	new Config(4, 4, 16, 16, deflate_slow),
	new Config(8, 16, 32, 32, deflate_slow),
	new Config(8, 16, 128, 128, deflate_slow),
	new Config(8, 32, 128, 256, deflate_slow),
	new Config(32, 128, 258, 1024, deflate_slow),
	new Config(32, 258, 258, 4096, deflate_slow)
];
/* ===========================================================================
* Initialize the "longest match" routines for a new zlib stream
*/
function lm_init(s) {
	s.window_size = 65536;
	/*** CLEAR_HASH(s); ***/
	zero(s.head);
	/* Set the default configuration parameters:
	*/
	s.max_lazy_match = configuration_table[6].max_lazy;
	s.good_match = configuration_table[6].good_length;
	s.nice_match = configuration_table[6].nice_length;
	s.max_chain_length = configuration_table[6].max_chain;
	s.strstart = 0;
	s.block_start = 0;
	s.lookahead = 0;
	s.insert = 0;
	s.match_length = s.prev_length = 2;
	s.match_available = 0;
	s.ins_h = 0;
}
function DeflateState() {
	this.gzindex = 0;
	this.prev_match = 0;
	this.match_start = 0;
	/* used by trees.c: */
	/* Didn't use ct_data typedef below to suppress compiler warning */
	// struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
	// struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
	// struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
	// Use flat array of DOUBLE size, with interleaved fata,
	// because JS does not support effective
	this.dyn_ltree = new Buf16(1146);
	this.dyn_dtree = new Buf16(122);
	this.bl_tree = new Buf16(78);
	zero(this.dyn_ltree);
	zero(this.dyn_dtree);
	zero(this.bl_tree);
	//ush bl_count[MAX_BITS+1];
	this.bl_count = new Buf16(16);
	/* number of codes at each bit length for an optimal tree */
	//int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
	this.heap = new Buf16(573);
	zero(this.heap);
	this.heap_len = 0;
	this.heap_max = 0;
	/* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
	* The same heap array is used to build all trees.
	*/
	this.depth = new Buf16(573);
	zero(this.depth);
	/* Number of valid bits in bi_buf.  All bits above the last valid bit
	* are always zero.
	*/
	// Used for window memory init. We safely ignore it for JS. That makes
	// sense only for pointers and memory check tools.
	//this.high_water = 0;
	/* High water mark offset in window for initialized bytes -- bytes above
	* this are set to zero in order to avoid memory check warnings when
	* longest match routines access bytes past the input.  This is then
	* updated to the new high water mark.
	*/
}
function deflateResetKeep(strm) {
	var s;
	strm.total_in = strm.total_out = 0;
	strm.data_type = 2;
	s = strm.state;
	s.pending = 0;
	s.pending_out = 0;
	s.status = 42;
	strm.adler = 1;
	s.last_flush = 0;
	_tr_init(s);
	return;
}
function deflateReset(strm) {
	var __unused_0E02 = deflateResetKeep(strm);
	{
		{
			lm_init(strm.state);
		}
	}
	return;
}
function deflateInit2(strm) {
	/* until 256-byte window bug fixed */
	var s = new DeflateState();
	strm.state = s;
	s.strm = strm;
	s.wrap = 1;
	s.gzhead = null;
	s.w_bits = 15;
	s.w_size = 32768;
	s.w_mask = 32767;
	s.hash_bits = 15;
	s.hash_size = 32768;
	s.hash_mask = 32767;
	s.hash_shift = 5;
	s.window = new Buf8(65536);
	s.head = new Buf16(32768);
	s.prev = new Buf16(32768);
	// Don't need mem init magic for JS.
	//s.high_water = 0;  /* nothing written to s->window yet */
	s.lit_bufsize = 16384;
	s.pending_buf_size = 65536;
	//overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
	//s->pending_buf = (uchf *) overlay;
	s.pending_buf = new Buf8(65536);
	// It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
	//s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
	s.d_buf = 16384;
	//s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
	s.l_buf = 49152;
	s.level = 6;
	s.strategy = 0;
	s.method = 8;
	return deflateReset(strm);
}
function deflateInit(strm) {
	return deflateInit2(strm);
}
function deflate(strm) {
	var old_flush, s;
	var beg, val;
	if (!strm.state || false || false) {
		return err(strm, -2), -2;
	}
	s = strm.state;
	if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === 666 && true) {
		return err(strm, strm.avail_out === 0 ? -5 : -2);
	}
	s.strm = strm;
	old_flush = s.last_flush;
	s.last_flush = 3;
	/* Write the header */
	if (s.status === 42) {
		if (s.wrap === 2) {
			strm.adler = 0;
			put_byte(s, 31);
			put_byte(s, 139);
			put_byte(s, 8);
			if (!s.gzhead) {
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, 0);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0);
				put_byte(s, 3);
				s.status = 113;
			} else {
				put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
				put_byte(s, s.gzhead.time & 255);
				put_byte(s, s.gzhead.time >> 8 & 255);
				put_byte(s, s.gzhead.time >> 16 & 255);
				put_byte(s, s.gzhead.time >> 24 & 255);
				put_byte(s, s.level === 9 ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0);
				put_byte(s, s.gzhead.os & 255);
				if (s.gzhead.extra && s.gzhead.extra.length) {
					put_byte(s, s.gzhead.extra.length & 255);
					put_byte(s, s.gzhead.extra.length >> 8 & 255);
				}
				if (s.gzhead.hcrc) {
					strm.adler = makeTable();
				}
				s.gzindex = 0;
				s.status = 69;
			}
		} else {
			var header = 8 + (s.w_bits - 8 << 4) << 8;
			var level_flags = -1;
			if (s.strategy >= 2 || s.level < 2) {
				level_flags = 0;
			} else if (s.level < 6) {
				level_flags = 1;
			} else if (s.level === 6) {
				level_flags = 2;
			} else {
				level_flags = 3;
			}
			header |= level_flags << 6;
			if (s.strstart !== 0) {
				header |= 32;
			}
			header += 31 - header % 31;
			s.status = 113;
			putShortMSB(s, header);
			/* Save the adler32 of the preset dictionary: */
			if (s.strstart !== 0) {
				putShortMSB(s, strm.adler >>> 16);
				putShortMSB(s, strm.adler & 65535);
			}
			strm.adler = 1;
		}
	}
	//#ifdef GZIP
	if (s.status === 69) {
		if (s.gzhead.extra) {
			beg = s.pending;
			while (s.gzindex < (s.gzhead.extra.length & 65535)) {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) {
						strm.adler = makeTable();
					}
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) {
						break;
					}
				}
				put_byte(s, s.gzhead.extra[s.gzindex] & 255);
				s.gzindex++;
			}
			if (s.gzhead.hcrc && s.pending > beg) {
				strm.adler = makeTable();
			}
			if (s.gzindex === s.gzhead.extra.length) {
				s.gzindex = 0;
				s.status = 73;
			}
		} else {
			s.status = 73;
		}
	}
	if (s.status === 73) {
		if (s.gzhead.name) {
			beg = s.pending;
			//int val;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) {
						strm.adler = makeTable();
					}
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) {
						val = 1;
						break;
					}
				}
				// JS specific: little magic to add zero terminator to end of string
				if (s.gzindex < s.gzhead.name.length) {
					val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
				} else {
					val = 0;
				}
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) {
				strm.adler = makeTable();
			}
			if (val === 0) {
				s.gzindex = 0;
				s.status = 91;
			}
		} else {
			s.status = 91;
		}
	}
	if (s.status === 91) {
		if (s.gzhead.comment) {
			beg = s.pending;
			//int val;
			do {
				if (s.pending === s.pending_buf_size) {
					if (s.gzhead.hcrc && s.pending > beg) {
						strm.adler = makeTable();
					}
					flush_pending(strm);
					beg = s.pending;
					if (s.pending === s.pending_buf_size) {
						val = 1;
						break;
					}
				}
				// JS specific: little magic to add zero terminator to end of string
				if (s.gzindex < s.gzhead.comment.length) {
					val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
				} else {
					val = 0;
				}
				put_byte(s, val);
			} while (val !== 0);
			if (s.gzhead.hcrc && s.pending > beg) {
				strm.adler = makeTable();
			}
			if (val === 0) {
				s.status = 103;
			}
		} else {
			s.status = 103;
		}
	}
	if (s.status === 103) {
		if (s.gzhead.hcrc) {
			if (s.pending + 2 > s.pending_buf_size) {
				flush_pending(strm);
			}
			if (s.pending + 2 <= s.pending_buf_size) {
				put_byte(s, strm.adler & 255);
				put_byte(s, strm.adler >> 8 & 255);
				strm.adler = 0;
				s.status = 113;
			}
		} else {
			s.status = 113;
		}
	}
	//#endif
	/* Flush as much pending output as possible */
	if (s.pending !== 0) {
		flush_pending(strm);
		if (strm.avail_out === 0) {
			/* Since avail_out is 0, deflate will be called again with
			* more output space, but possibly with both pending and
			* avail_in equal to zero. There won't be anything to do,
			* but this is not an error situation so make sure we
			* return OK instead of BUF_ERROR at next call of deflate:
			*/
			s.last_flush = -1;
			return 0;
		}
	} else if (strm.avail_in === 0 && 6 <= rank(old_flush) && true) {
		return err(strm, -5), -5;
	}
	/* User must not provide more input after the first FINISH: */
	if (s.status === 666 && strm.avail_in !== 0) {
		return err(strm, -5), -5;
	}
	/* Start a new block or continue the current one.
	*/
	if (strm.avail_in !== 0 || s.lookahead !== 0 || s.status !== 666) {
		var bstate = s.strategy === 2 ? deflate_huff(s) : s.strategy === 3 ? deflate_rle(s) : configuration_table[s.level].func(s, 3);
		if (bstate === 3 || bstate === 4) {
			s.status = 666;
		}
		if (bstate === 1 || bstate === 3) {
			if (strm.avail_out === 0) {
				s.last_flush = -1;
			}
			return 0;
		}
		if (bstate === 2) {
			{
				_tr_stored_block(s, 0, 0, false);
				/* For a full flush, this empty block will be recognized
				* as a special marker by inflate_sync().
				*/
				{
					/*** CLEAR_HASH(s); ***/
					/* forget history */
					zero(s.head);
					if (s.lookahead === 0) {
						s.strstart = 0;
						s.block_start = 0;
						s.insert = 0;
					}
				}
			}
			flush_pending(strm);
			if (strm.avail_out === 0) {
				s.last_flush = -1;
				return 0;
			}
		}
	}
	//Assert(strm->avail_out > 0, "bug2");
	//if (strm.avail_out <= 0) { throw new Error("bug2");}
	{
		return 0;
	}
}
/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2020 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
class Deflator {
	constructor() {
		this.a = new ZStream();
		this.c = new Uint8Array(102400);
		deflateInit(this.a);
	}
	d(inData) {
		/* eslint-disable camelcase */
		this.a.input = inData;
		this.a.avail_in = this.a.input.length;
		this.a.next_in = 0;
		this.a.output = this.c;
		this.a.avail_out = 102400;
		this.a.next_out = 0;
		/* eslint-enable camelcase */
		let lastRet = deflate(this.a);
		let outData = new Uint8Array(this.a.output.buffer, 0, this.a.next_out);
		if (lastRet < 0) {
			throw new Error("zlib deflate failed");
		}
		if (this.a.avail_in > 0) {
			// Read chunks until done
			let chunks = [outData];
			let totalLen = outData.length;
			do {
				/* eslint-disable camelcase */
				this.a.output = new Uint8Array(102400);
				this.a.next_out = 0;
				this.a.avail_out = 102400;
				/* eslint-enable camelcase */
				lastRet = deflate(this.a);
				if (lastRet < 0) {
					throw new Error("zlib deflate failed");
				}
				let chunk = new Uint8Array(this.a.output.buffer, 0, this.a.next_out);
				totalLen += chunk.length;
				chunks.push(chunk);
			} while (this.a.avail_in > 0);
			// Combine chunks into a single data
			let newData = new Uint8Array(totalLen);
			let offset = 0;
			for (let i = 0; i < chunks.length; i++) {
				newData.set(chunks[i], offset);
				offset += chunks[i].length;
			}
			outData = newData;
		}
		/* eslint-disable camelcase */
		this.a.input = null;
		this.a.avail_in = 0;
		this.a.next_in = 0;
		/* eslint-enable camelcase */
		return outData;
	}
}
class GestureHandler {
	constructor() {
		this._target = null;
		this._state = 127;
		this._tracked = [];
		this._ignored = [];
		this._waitingRelease = false;
		this._releaseStart = 0;
		this._longpressTimeoutId = null;
		this._twoTouchTimeoutId = null;
		this._boundEventHandler = this._eventHandler.bind(this);
	}
	attach(target) {
		this.detach();
		this._target = target;
		this._target.addEventListener("touchstart", this._boundEventHandler);
		this._target.addEventListener("touchmove", this._boundEventHandler);
		this._target.addEventListener("touchend", this._boundEventHandler);
		this._target.addEventListener("touchcancel", this._boundEventHandler);
	}
	detach() {
		if (!this._target) {
			return;
		}
		this._stopLongpressTimeout();
		this._stopTwoTouchTimeout();
		this._target.removeEventListener("touchstart", this._boundEventHandler);
		this._target.removeEventListener("touchmove", this._boundEventHandler);
		this._target.removeEventListener("touchend", this._boundEventHandler);
		this._target.removeEventListener("touchcancel", this._boundEventHandler);
		this._target = null;
	}
	_eventHandler(e) {
		let fn;
		e.stopPropagation();
		e.preventDefault();
		switch (e.type) {
			case "touchstart":
				fn = this._touchStart;
				break;
			case "touchmove":
				fn = this._touchMove;
				break;
			case "touchend":
			case "touchcancel":
				fn = this._touchEnd;
				break;
		}
		for (let i = 0; i < e.changedTouches.length; i++) {
			let touch = e.changedTouches[i];
			fn.call(this, touch.identifier, touch.clientX, touch.clientY);
		}
	}
	_touchStart(id, x, y) {
		// Ignore any new touches if there is already an active gesture,
		// or we're in a cleanup state
		if (this._hasDetectedGesture() || this._state === 0) {
			this._ignored.push(id);
			return;
		}
		// Did it take too long between touches that we should no longer
		// consider this a single gesture?
		if (this._tracked.length > 0 && Date.now() - this._tracked[0].started > 250) {
			this._state = 0;
			this._ignored.push(id);
			return;
		}
		// If we're waiting for fingers to release then we should no longer
		// recognize new touches
		if (this._waitingRelease) {
			this._state = 0;
			this._ignored.push(id);
			return;
		}
		this._tracked.push({
			id,
			started: Date.now(),
			active: true,
			firstX: x,
			firstY: y,
			lastX: x,
			lastY: y,
			angle: 0
		});
		switch (this._tracked.length) {
			case 1:
				this._startLongpressTimeout();
				break;
			case 2:
				this._state &= -26;
				this._stopLongpressTimeout();
				break;
			case 3:
				this._state &= -99;
				break;
			default: this._state = 0;
		}
	}
	_touchMove(id, x, y) {
		let touch = this._tracked.find((t) => t.id === id);
		// If this is an update for a touch we're not tracking, ignore it
		if (touch === void 0) {
			return;
		}
		// Update the touches last position with the event coordinates
		touch.lastX = x;
		touch.lastY = y;
		let deltaX = x - touch.firstX;
		let deltaY = y - touch.firstY;
		// Update angle when the touch has moved
		if (touch.firstX !== touch.lastX || touch.firstY !== touch.lastY) {
			touch.angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
		}
		if (!this._hasDetectedGesture()) {
			// Ignore moves smaller than the minimum threshold
			if (Math.hypot(deltaX, deltaY) < 50) {
				return;
			}
			// Can't be a tap or long press as we've seen movement
			this._state &= -24;
			this._stopLongpressTimeout();
			if (this._tracked.length !== 1) {
				this._state &= -9;
			}
			if (this._tracked.length !== 2) {
				this._state &= -97;
			}
			// We need to figure out which of our different two touch gestures
			// this might be
			if (this._tracked.length === 2) {
				// The other touch is the one where the id doesn't match
				let prevTouch = this._tracked.find((t) => t.id !== id);
				// How far the previous touch point has moved since start
				let prevDeltaMove = Math.hypot(prevTouch.firstX - prevTouch.lastX, prevTouch.firstY - prevTouch.lastY);
				// We know that the current touch moved far enough,
				// but unless both touches moved further than their
				// threshold we don't want to disqualify any gestures
				if (prevDeltaMove > 50) {
					// The angle difference between the direction of the touch points
					let deltaAngle = Math.abs(touch.angle - prevTouch.angle);
					deltaAngle = Math.abs((deltaAngle + 180) % 360 - 180);
					// PINCH or TWODRAG can be eliminated depending on the angle
					if (deltaAngle > 90) {
						this._state &= -33;
					} else {
						this._state &= -65;
					}
					if (this._isTwoTouchTimeoutRunning()) {
						this._stopTwoTouchTimeout();
					}
				} else if (!this._isTwoTouchTimeoutRunning()) {
					// We can't determine the gesture right now, let's
					// wait and see if more events are on their way
					this._startTwoTouchTimeout();
				}
			}
			if (!this._hasDetectedGesture()) {
				return;
			}
			this._pushEvent("gesturestart");
		}
		this._pushEvent("gesturemove");
	}
	_touchEnd(id) {
		// Check if this is an ignored touch
		if (this._ignored.indexOf(id) !== -1) {
			// Remove this touch from ignored
			this._ignored.splice(this._ignored.indexOf(id), 1);
			// And reset the state if there are no more touches
			if (this._ignored.length === 0 && this._tracked.length === 0) {
				this._state = 127;
				this._waitingRelease = false;
			}
			return;
		}
		// We got a touchend before the timer triggered,
		// this cannot result in a gesture anymore.
		if (!this._hasDetectedGesture() && this._isTwoTouchTimeoutRunning()) {
			this._stopTwoTouchTimeout();
			this._state = 0;
		}
		// Some gestures don't trigger until a touch is released
		if (!this._hasDetectedGesture()) {
			// Can't be a gesture that relies on movement
			this._state &= -105;
			// Or something that relies on more time
			this._state &= -17;
			this._stopLongpressTimeout();
			if (!this._waitingRelease) {
				this._releaseStart = Date.now();
				this._waitingRelease = true;
				// Can't be a tap that requires more touches than we current have
				switch (this._tracked.length) {
					case 1:
						this._state &= -7;
						break;
					case 2:
						this._state &= -6;
						break;
				}
			}
		}
		// Waiting for all touches to release? (i.e. some tap)
		if (this._waitingRelease) {
			// Were all touches released at roughly the same time?
			if (Date.now() - this._releaseStart > 250) {
				this._state = 0;
			}
			// Did too long time pass between press and release?
			if (this._tracked.some((t) => Date.now() - t.started > 1e3)) {
				this._state = 0;
			}
			let touch = this._tracked.find((t) => t.id === id);
			touch.active = false;
			// Are we still waiting for more releases?
			if (this._hasDetectedGesture()) {
				this._pushEvent("gesturestart");
			} else {
				// Have we reached a dead end?
				if (this._state !== 0) {
					return;
				}
			}
		}
		if (this._hasDetectedGesture()) {
			this._pushEvent("gestureend");
		}
		// Ignore any remaining touches until they are ended
		for (let i = 0; i < this._tracked.length; i++) {
			if (this._tracked[i].active) {
				this._ignored.push(this._tracked[i].id);
			}
		}
		this._tracked = [];
		this._state = 0;
		// Remove this touch from ignored if it's in there
		if (this._ignored.indexOf(id) !== -1) {
			this._ignored.splice(this._ignored.indexOf(id), 1);
		}
		// We reset the state if ignored is empty
		if (this._ignored.length === 0) {
			this._state = 127;
			this._waitingRelease = false;
		}
	}
	_hasDetectedGesture() {
		if (this._state === 0) {
			return false;
		}
		// Check to see if the bitmask value is a power of 2
		// (i.e. only one bit set). If it is, we have a state.
		if (this._state & this._state - 1) {
			return false;
		}
		// For taps we also need to have all touches released
		// before we've fully detected the gesture
		if (this._state & 7) {
			if (this._tracked.some((t) => t.active)) {
				return false;
			}
		}
		return true;
	}
	_startLongpressTimeout() {
		this._stopLongpressTimeout();
		this._longpressTimeoutId = setTimeout(() => this._longpressTimeout(), 1e3);
	}
	_stopLongpressTimeout() {
		clearTimeout(this._longpressTimeoutId);
		this._longpressTimeoutId = null;
	}
	_longpressTimeout() {
		if (this._hasDetectedGesture()) {
			throw new Error("A longpress gesture failed, conflict with a different gesture");
		}
		this._state = 16;
		this._pushEvent("gesturestart");
	}
	_startTwoTouchTimeout() {
		this._stopTwoTouchTimeout();
		this._twoTouchTimeoutId = setTimeout(() => this._twoTouchTimeout(), 50);
	}
	_stopTwoTouchTimeout() {
		clearTimeout(this._twoTouchTimeoutId);
		this._twoTouchTimeoutId = null;
	}
	_isTwoTouchTimeoutRunning() {
		return this._twoTouchTimeoutId !== null;
	}
	_twoTouchTimeout() {
		if (this._tracked.length === 0) {
			throw new Error("A pinch or two drag gesture failed, no tracked touches");
		}
		// How far each touch point has moved since start
		let avgM = this._getAverageMovement();
		let avgMoveH = Math.abs(avgM.x);
		let avgMoveV = Math.abs(avgM.y);
		// The difference in the distance between where
		// the touch points started and where they are now
		let avgD = this._getAverageDistance();
		let deltaTouchDistance = Math.abs(Math.hypot(avgD.first.x, avgD.first.y) - Math.hypot(avgD.last.x, avgD.last.y));
		if (avgMoveV < deltaTouchDistance && avgMoveH < deltaTouchDistance) {
			this._state = 64;
		} else {
			this._state = 32;
		}
		this._pushEvent("gesturestart");
		this._pushEvent("gesturemove");
	}
	_pushEvent(type) {
		let detail = { type: this._stateToGesture(this._state) };
		// For most gesture events the current (average) position is the
		// most useful
		let avg = this._getPosition();
		let pos = avg.last;
		// However we have a slight distance to detect gestures, so for the
		// first gesture event we want to use the first positions we saw
		if (type === "gesturestart") {
			pos = avg.first;
		}
		// For these gestures, we always want the event coordinates
		// to be where the gesture began, not the current touch location.
		switch (this._state) {
			case 32:
			case 64:
				pos = avg.first;
				break;
		}
		detail["clientX"] = pos.x;
		detail["clientY"] = pos.y;
		// FIXME: other coordinates?
		// Some gestures also have a magnitude
		if (this._state === 64) {
			let distance = this._getAverageDistance();
			if (type === "gesturestart") {
				detail["magnitudeX"] = distance.first.x;
				detail["magnitudeY"] = distance.first.y;
			} else {
				detail["magnitudeX"] = distance.last.x;
				detail["magnitudeY"] = distance.last.y;
			}
		} else if (this._state === 32) {
			if (type === "gesturestart") {
				detail["magnitudeX"] = 0;
				detail["magnitudeY"] = 0;
			} else {
				let movement = this._getAverageMovement();
				detail["magnitudeX"] = movement.x;
				detail["magnitudeY"] = movement.y;
			}
		}
		let gev = new CustomEvent(type, { detail });
		this._target.dispatchEvent(gev);
	}
	_stateToGesture(state) {
		switch (state) {
			case 1: return "onetap";
			case 2: return "twotap";
			case 4: return "threetap";
			case 8: return "drag";
			case 16: return "longpress";
			case 32: return "twodrag";
			case 64: return "pinch";
		}
		throw new Error("Unknown gesture state: " + state);
	}
	_getPosition() {
		if (this._tracked.length === 0) {
			throw new Error("Failed to get gesture position, no tracked touches");
		}
		let size = this._tracked.length;
		let fx = 0, fy = 0, lx = 0, ly = 0;
		for (let i = 0; i < this._tracked.length; i++) {
			fx += this._tracked[i].firstX;
			fy += this._tracked[i].firstY;
			lx += this._tracked[i].lastX;
			ly += this._tracked[i].lastY;
		}
		return {
			first: {
				x: fx / size,
				y: fy / size
			},
			last: {
				x: lx / size,
				y: ly / size
			}
		};
	}
	_getAverageMovement() {
		if (this._tracked.length === 0) {
			throw new Error("Failed to get gesture movement, no tracked touches");
		}
		let totalH, totalV;
		totalH = totalV = 0;
		let size = this._tracked.length;
		for (let i = 0; i < this._tracked.length; i++) {
			totalH += this._tracked[i].lastX - this._tracked[i].firstX;
			totalV += this._tracked[i].lastY - this._tracked[i].firstY;
		}
		return {
			x: totalH / size,
			y: totalV / size
		};
	}
	_getAverageDistance() {
		if (this._tracked.length === 0) {
			throw new Error("Failed to get gesture distance, no tracked touches");
		}
		// Distance between the first and last tracked touches
		let first = this._tracked[0];
		let last = this._tracked[this._tracked.length - 1];
		let fdx = Math.abs(last.firstX - first.firstX);
		let fdy = Math.abs(last.firstY - first.firstY);
		let ldx = Math.abs(last.lastX - first.lastX);
		let ldy = Math.abs(last.lastY - first.lastY);
		return {
			first: {
				x: fdx,
				y: fdy
			},
			last: {
				x: ldx,
				y: ldy
			}
		};
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*/
const useFallback = !supportsCursorURIs || isTouchDevice;
class Cursor {
	constructor() {
		this._target = null;
		this._canvas = document.createElement("canvas");
		if (useFallback) {
			this._canvas.style.position = "fixed";
			this._canvas.style.zIndex = "65535";
			this._canvas.style.pointerEvents = "none";
			// Safari on iOS can select the cursor image
			// https://bugs.webkit.org/show_bug.cgi?id=249223
			this._canvas.style.userSelect = "none";
			this._canvas.style.WebkitUserSelect = "none";
			// Can't use "display" because of Firefox bug #1445997
			this._canvas.style.visibility = "hidden";
		}
		this._position = {
			x: 0,
			y: 0
		};
		this._hotSpot = {
			x: 0,
			y: 0
		};
		this._eventHandlers = {
			"mouseover": this._handleMouseOver.bind(this),
			"mouseleave": this._handleMouseLeave.bind(this),
			"mousemove": this._handleMouseMove.bind(this),
			"mouseup": this._handleMouseUp.bind(this)
		};
	}
	attach(target) {
		if (this._target) {
			this.detach();
		}
		this._target = target;
		if (useFallback) {
			document.body.appendChild(this._canvas);
			const options = {
				capture: true,
				passive: true
			};
			this._target.addEventListener("mouseover", this._eventHandlers.mouseover, options);
			this._target.addEventListener("mouseleave", this._eventHandlers.mouseleave, options);
			this._target.addEventListener("mousemove", this._eventHandlers.mousemove, options);
			this._target.addEventListener("mouseup", this._eventHandlers.mouseup, options);
		}
		this.clear();
	}
	detach() {
		if (!this._target) {
			return;
		}
		if (useFallback) {
			const options = {
				capture: true,
				passive: true
			};
			this._target.removeEventListener("mouseover", this._eventHandlers.mouseover, options);
			this._target.removeEventListener("mouseleave", this._eventHandlers.mouseleave, options);
			this._target.removeEventListener("mousemove", this._eventHandlers.mousemove, options);
			this._target.removeEventListener("mouseup", this._eventHandlers.mouseup, options);
			if (document.contains(this._canvas)) {
				document.body.removeChild(this._canvas);
			}
		}
		this._target = null;
	}
	change(rgba, hotx, hoty, w, h) {
		if (w === 0 || h === 0) {
			this.clear();
			return;
		}
		this._position.x = this._position.x + this._hotSpot.x - hotx;
		this._position.y = this._position.y + this._hotSpot.y - hoty;
		this._hotSpot.x = hotx;
		this._hotSpot.y = hoty;
		let ctx = this._canvas.getContext("2d");
		this._canvas.width = w;
		this._canvas.height = h;
		let img = new ImageData(new Uint8ClampedArray(rgba), w, h);
		ctx.clearRect(0, 0, w, h);
		ctx.putImageData(img, 0, 0);
		if (useFallback) {
			this._updatePosition();
		} else {
			let url = this._canvas.toDataURL();
			this._target.style.cursor = "url(" + url + ")" + hotx + " " + hoty + ", default";
		}
	}
	clear() {
		this._target.style.cursor = "none";
		this._canvas.width = 0;
		this._canvas.height = 0;
		this._position.x = this._position.x + this._hotSpot.x;
		this._position.y = this._position.y + this._hotSpot.y;
		this._hotSpot.x = 0;
		this._hotSpot.y = 0;
	}
	// Mouse events might be emulated, this allows
	// moving the cursor in such cases
	move(clientX, clientY) {
		if (!useFallback) {
			return;
		}
		// clientX/clientY are relative the _visual viewport_,
		// but our position is relative the _layout viewport_,
		// so try to compensate when we can
		if (window.visualViewport) {
			this._position.x = clientX + window.visualViewport.offsetLeft;
			this._position.y = clientY + window.visualViewport.offsetTop;
		} else {
			this._position.x = clientX;
			this._position.y = clientY;
		}
		this._updatePosition();
		let target = document.elementFromPoint(clientX, clientY);
		this._updateVisibility(target);
	}
	_handleMouseOver(event) {
		// This event could be because we're entering the target, or
		// moving around amongst its sub elements. Let the move handler
		// sort things out.
		this._handleMouseMove(event);
	}
	_handleMouseLeave(event) {
		// Check if we should show the cursor on the element we are leaving to
		this._updateVisibility(event.relatedTarget);
	}
	_handleMouseMove(event) {
		this._updateVisibility(event.target);
		this._position.x = event.clientX - this._hotSpot.x;
		this._position.y = event.clientY - this._hotSpot.y;
		this._updatePosition();
	}
	_handleMouseUp(event) {
		// We might get this event because of a drag operation that
		// moved outside of the target. Check what's under the cursor
		// now and adjust visibility based on that.
		let target = document.elementFromPoint(event.clientX, event.clientY);
		this._updateVisibility(target);
		// Captures end with a mouseup but we can't know the event order of
		// mouseup vs releaseCapture.
		//
		// In the cases when releaseCapture comes first, the code above is
		// enough.
		//
		// In the cases when the mouseup comes first, we need wait for the
		// browser to flush all events and then check again if the cursor
		// should be visible.
		if (this._captureIsActive()) {
			window.setTimeout(() => {
				// We might have detached at this point
				if (!this._target) {
					return;
				}
				// Refresh the target from elementFromPoint since queued events
				// might have altered the DOM
				target = document.elementFromPoint(event.clientX, event.clientY);
				this._updateVisibility(target);
			}, 0);
		}
	}
	_showCursor() {
		if (this._canvas.style.visibility === "hidden") {
			this._canvas.style.visibility = "";
		}
	}
	_hideCursor() {
		if (this._canvas.style.visibility !== "hidden") {
			this._canvas.style.visibility = "hidden";
		}
	}
	// Should we currently display the cursor?
	// (i.e. are we over the target, or a child of the target without a
	// different cursor set)
	_shouldShowCursor(target) {
		if (!target) {
			return false;
		}
		// Easy case
		if (target === this._target) {
			return true;
		}
		// Other part of the DOM?
		if (!this._target.contains(target)) {
			return false;
		}
		// Has the child its own cursor?
		// FIXME: How can we tell that a sub element has an
		//        explicit "cursor: none;"?
		if (window.getComputedStyle(target).cursor !== "none") {
			return false;
		}
		return true;
	}
	_updateVisibility(target) {
		// When the cursor target has capture we want to show the cursor.
		// So, if a capture is active - look at the captured element instead.
		if (this._captureIsActive()) {
			target = document.captureElement;
		}
		if (this._shouldShowCursor(target)) {
			this._showCursor();
		} else {
			this._hideCursor();
		}
	}
	_updatePosition() {
		this._canvas.style.left = this._position.x + "px";
		this._canvas.style.top = this._position.y + "px";
	}
	_captureIsActive() {
		return document.captureElement && document.documentElement.contains(document.captureElement);
	}
}
/*
* Websock: high-performance buffering wrapper
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* Websock is similar to the standard WebSocket / RTCDataChannel object
* but with extra buffer handling.
*
* Websock has built-in receive queue buffering; the message event
* does not contain actual data but is simply a notification that
* there is new data available. Several rQ* methods are available to
* read binary data off of the receive queue.
*/
// this has performance issues in some versions Chromium, and
// doesn't gain a tremendous amount of performance increase in Firefox
// at the moment.  It may be valuable to turn it on in the future.
const MAX_RQ_GROW_SIZE = 40960 * 1024;
const ReadyStates = {
	a: [WebSocket.CONNECTING, "connecting"],
	b: [WebSocket.OPEN, "open"],
	c: [WebSocket.CLOSING, "closing"],
	d: [WebSocket.CLOSED, "closed"]
};
// Properties a raw channel must have, WebSocket and RTCDataChannel are two examples
const rawChannelProps = [
	"send",
	"close",
	"binaryType",
	"onerror",
	"onmessage",
	"onopen",
	"protocol",
	"readyState"
];
class Websock {
	constructor() {
		this._websocket = null;
		this._rQi = 0;
		this._rQlen = 0;
		this._rQbufferSize = 1024 * 1024 * 4;
		// called in init: this._rQ = new Uint8Array(this._rQbufferSize);
		this._rQ = null;
		this._sQbufferSize = 10240;
		// called in init: this._sQ = new Uint8Array(this._sQbufferSize);
		this._sQlen = 0;
		this._sQ = null;
		this._eventHandlers = {
			message: () => {},
			open: () => {},
			close: () => {},
			error: () => {}
		};
	}
	// Getters and setters
	get readyState() {
		let subState;
		if (this._websocket === null) {
			return "unused";
		}
		subState = this._websocket.readyState;
		if (ReadyStates.a.includes(subState)) {
			return "connecting";
		} else if (ReadyStates.b.includes(subState)) {
			return "open";
		} else if (ReadyStates.c.includes(subState)) {
			return "closing";
		} else if (ReadyStates.d.includes(subState)) {
			return "closed";
		}
		return "unknown";
	}
	// Receive queue
	rQpeek8() {
		return this._rQ[this._rQi];
	}
	rQskipBytes(bytes) {
		this._rQi += bytes;
	}
	rQshift8() {
		return this._rQshift(1);
	}
	rQshift16() {
		return this._rQshift(2);
	}
	rQshift32() {
		return this._rQshift(4);
	}
	// TODO(directxman12): test performance with these vs a DataView
	_rQshift(bytes) {
		let res = 0;
		for (let byte = bytes - 1; byte >= 0; byte--) {
			res += this._rQ[this._rQi++] << byte * 8;
		}
		return res >>> 0;
	}
	rQlen() {
		return this._rQlen - this._rQi;
	}
	rQshiftStr(len) {
		let str = "";
		// Handle large arrays in steps to avoid long strings on the stack
		for (let i = 0; i < len; i += 4096) {
			let part = this.rQshiftBytes(Math.min(4096, len - i), false);
			str += String.fromCharCode.apply(null, part);
		}
		return str;
	}
	rQshiftBytes(len, copy = true) {
		this._rQi += len;
		if (copy) {
			return this._rQ.slice(this._rQi - len, this._rQi);
		} else {
			return this._rQ.subarray(this._rQi - len, this._rQi);
		}
	}
	rQshiftTo(target, len) {
		// TODO: make this just use set with views when using a ArrayBuffer to store the rQ
		target.set(new Uint8Array(this._rQ.buffer, this._rQi, len));
		this._rQi += len;
	}
	rQpeekBytes(len, copy = true) {
		if (copy) {
			return this._rQ.slice(this._rQi, this._rQi + len);
		} else {
			return this._rQ.subarray(this._rQi, this._rQi + len);
		}
	}
	// Check to see if we must wait for 'num' bytes (default to FBU.bytes)
	// to be available in the receive queue. Return true if we need to
	// wait (and possibly print a debug message), otherwise false.
	rQwait(__unused_60A7, num, goback) {
		if (this._rQlen - this._rQi < num) {
			if (goback) {
				if (this._rQi < goback) {
					throw new Error("rQwait cannot backup " + goback + " bytes");
				}
				this._rQi -= goback;
			}
			return true;
		}
		return false;
	}
	// Send queue
	sQpush8(num) {
		this._sQensureSpace(1);
		this._sQ[this._sQlen++] = num;
	}
	sQpush16(num) {
		this._sQensureSpace(2);
		this._sQ[this._sQlen++] = num >> 8 & 255;
		this._sQ[this._sQlen++] = num >> 0 & 255;
	}
	sQpush32(num) {
		this._sQensureSpace(4);
		this._sQ[this._sQlen++] = num >> 24 & 255;
		this._sQ[this._sQlen++] = num >> 16 & 255;
		this._sQ[this._sQlen++] = num >> 8 & 255;
		this._sQ[this._sQlen++] = num >> 0 & 255;
	}
	sQpushString(str) {
		let bytes = str.split("").map((chr) => chr.charCodeAt(0));
		this.sQpushBytes(new Uint8Array(bytes));
	}
	sQpushBytes(bytes) {
		for (let offset = 0; offset < bytes.length;) {
			this._sQensureSpace(1);
			let chunkSize = this._sQbufferSize - this._sQlen;
			if (chunkSize > bytes.length - offset) {
				chunkSize = bytes.length - offset;
			}
			this._sQ.set(bytes.subarray(offset, offset + chunkSize), this._sQlen);
			this._sQlen += chunkSize;
			offset += chunkSize;
		}
	}
	flush() {
		if (this._sQlen > 0 && this.readyState === "open") {
			this._websocket.send(new Uint8Array(this._sQ.buffer, 0, this._sQlen));
			this._sQlen = 0;
		}
	}
	_sQensureSpace(bytes) {
		if (this._sQbufferSize - this._sQlen < bytes) {
			this.flush();
		}
	}
	// Event handlers
	off(evt) {
		this._eventHandlers[evt] = () => {};
	}
	on(evt, handler) {
		this._eventHandlers[evt] = handler;
	}
	_allocateBuffers() {
		this._rQ = new Uint8Array(this._rQbufferSize);
		this._sQ = new Uint8Array(this._sQbufferSize);
	}
	init() {
		this._allocateBuffers();
		this._rQi = 0;
		this._websocket = null;
	}
	open(uri, protocols) {
		this.attach(new WebSocket(uri, protocols));
	}
	attach(rawChannel) {
		this.init();
		// Must get object and class methods to be compatible with the tests.
		const channelProps = [...Object.keys(rawChannel), ...Object.getOwnPropertyNames(Object.getPrototypeOf(rawChannel))];
		for (let i = 0; i < 8; i++) {
			const prop = rawChannelProps[i];
			if (channelProps.indexOf(prop) < 0) {
				throw new Error("Raw channel missing property: " + prop);
			}
		}
		this._websocket = rawChannel;
		this._websocket.binaryType = "arraybuffer";
		this._websocket.onmessage = this._recvMessage.bind(this);
		this._websocket.onopen = () => {
			Debug(">> WebSock.onopen");
			if (this._websocket.protocol) {
				Info("Server choose sub-protocol: " + this._websocket.protocol);
			}
			this._eventHandlers.open();
			Debug("<< WebSock.onopen");
		};
		this._websocket.onclose = (e) => {
			Debug(">> WebSock.onclose");
			this._eventHandlers.close(e);
			Debug("<< WebSock.onclose");
		};
		this._websocket.onerror = (e) => {
			Debug(">> WebSock.onerror: " + e);
			this._eventHandlers.error(e);
			Debug("<< WebSock.onerror: " + e);
		};
	}
	close() {
		if (this._websocket) {
			if (this.readyState === "connecting" || this.readyState === "open") {
				Info("Closing WebSocket connection");
				this._websocket.close();
			}
			this._websocket.onmessage = () => {};
		}
	}
	// private methods
	// We want to move all the unread data to the start of the queue,
	// e.g. compacting.
	// The function also expands the receive que if needed, and for
	// performance reasons we combine these two actions to avoid
	// unnecessary copying.
	_expandCompactRQ(minFit) {
		// if we're using less than 1/8th of the buffer even with the incoming bytes, compact in place
		// instead of resizing
		const requiredBufferSize = (this._rQlen - this._rQi + minFit) * 8;
		const resizeNeeded = this._rQbufferSize < requiredBufferSize;
		if (resizeNeeded) {
			// Make sure we always *at least* double the buffer size, and have at least space for 8x
			// the current amount of data
			this._rQbufferSize = Math.max(this._rQbufferSize * 2, requiredBufferSize);
		}
		// we don't want to grow unboundedly
		if (this._rQbufferSize > MAX_RQ_GROW_SIZE) {
			this._rQbufferSize = MAX_RQ_GROW_SIZE;
			if (this._rQbufferSize - (this._rQlen - this._rQi) < minFit) {
				throw new Error("Receive queue buffer exceeded " + MAX_RQ_GROW_SIZE + " bytes, and the new message could not fit");
			}
		}
		if (resizeNeeded) {
			const oldRQbuffer = this._rQ.buffer;
			this._rQ = new Uint8Array(this._rQbufferSize);
			this._rQ.set(new Uint8Array(oldRQbuffer, this._rQi, this._rQlen - this._rQi));
		} else {
			this._rQ.copyWithin(0, this._rQi, this._rQlen);
		}
		this._rQlen = this._rQlen - this._rQi;
		this._rQi = 0;
	}
	// push arraybuffer values onto the end of the receive que
	_recvMessage(e) {
		if (this._rQlen == this._rQi) {
			// All data has now been processed, this means we
			// can reset the receive queue.
			this._rQlen = 0;
			this._rQi = 0;
		}
		const u8 = new Uint8Array(e.data);
		if (u8.length > this._rQbufferSize - this._rQlen) {
			this._expandCompactRQ(u8.length);
		}
		this._rQ.set(u8, this._rQlen);
		this._rQlen += u8.length;
		if (this._rQlen - this._rQi > 0) {
			this._eventHandlers.message();
		} else {
			Debug("Ignoring empty message");
		}
	}
}
/*
* This file is auto-generated from keymaps.csv
* Database checksum sha256(76d68c10e97d37fe2ea459e210125ae41796253fb217e900bf2983ade13a7920)
* To re-generate, run:
*   keymap-gen code-map --lang=js keymaps.csv html atset1
*/
var XtScancode = {
	"Again": 57349,
	"AltLeft": 56,
	"AltRight": 57400,
	"ArrowDown": 57424,
	"ArrowLeft": 57419,
	"ArrowRight": 57421,
	"ArrowUp": 57416,
	"AudioVolumeDown": 57390,
	"AudioVolumeMute": 57376,
	"AudioVolumeUp": 57392,
	"Backquote": 41,
	"Backslash": 43,
	"Backspace": 14,
	"BracketLeft": 26,
	"BracketRight": 27,
	"BrowserBack": 57450,
	"BrowserFavorites": 57446,
	"BrowserForward": 57449,
	"BrowserHome": 57394,
	"BrowserRefresh": 57447,
	"BrowserSearch": 57445,
	"BrowserStop": 57448,
	"CapsLock": 58,
	"Comma": 51,
	"ContextMenu": 57437,
	"ControlLeft": 29,
	"ControlRight": 57373,
	"Convert": 121,
	"Copy": 57464,
	"Cut": 57404,
	"Delete": 57427,
	"Digit0": 11,
	"Digit1": 2,
	"Digit2": 3,
	"Digit3": 4,
	"Digit4": 5,
	"Digit5": 6,
	"Digit6": 7,
	"Digit7": 8,
	"Digit8": 9,
	"Digit9": 10,
	"Eject": 57469,
	"End": 57423,
	"Enter": 28,
	"Equal": 13,
	"Escape": 1,
	"F1": 59,
	"F10": 68,
	"F11": 87,
	"F12": 88,
	"F13": 93,
	"F14": 94,
	"F15": 95,
	"F16": 85,
	"F17": 57347,
	"F18": 57463,
	"F19": 57348,
	"F2": 60,
	"F20": 90,
	"F21": 116,
	"F22": 57465,
	"F23": 109,
	"F24": 111,
	"F3": 61,
	"F4": 62,
	"F5": 63,
	"F6": 64,
	"F7": 65,
	"F8": 66,
	"F9": 67,
	"Find": 57409,
	"Help": 57461,
	"Hiragana": 119,
	"Home": 57415,
	"Insert": 57426,
	"IntlBackslash": 86,
	"IntlRo": 115,
	"IntlYen": 125,
	"KanaMode": 112,
	"Katakana": 120,
	"KeyA": 30,
	"KeyB": 48,
	"KeyC": 46,
	"KeyD": 32,
	"KeyE": 18,
	"KeyF": 33,
	"KeyG": 34,
	"KeyH": 35,
	"KeyI": 23,
	"KeyJ": 36,
	"KeyK": 37,
	"KeyL": 38,
	"KeyM": 50,
	"KeyN": 49,
	"KeyO": 24,
	"KeyP": 25,
	"KeyQ": 16,
	"KeyR": 19,
	"KeyS": 31,
	"KeyT": 20,
	"KeyU": 22,
	"KeyV": 47,
	"KeyW": 17,
	"KeyX": 45,
	"KeyY": 21,
	"KeyZ": 44,
	"Lang1": 114,
	"Lang2": 113,
	"Lang3": 120,
	"Lang4": 119,
	"Lang5": 118,
	"LaunchApp1": 57451,
	"LaunchApp2": 57377,
	"LaunchMail": 57452,
	"MediaPlayPause": 57378,
	"MediaSelect": 57453,
	"MediaStop": 57380,
	"MediaTrackNext": 57369,
	"MediaTrackPrevious": 57360,
	"MetaLeft": 57435,
	"MetaRight": 57436,
	"Minus": 12,
	"NonConvert": 123,
	"NumLock": 69,
	"Numpad0": 82,
	"Numpad1": 79,
	"Numpad2": 80,
	"Numpad3": 81,
	"Numpad4": 75,
	"Numpad5": 76,
	"Numpad6": 77,
	"Numpad7": 71,
	"Numpad8": 72,
	"Numpad9": 73,
	"NumpadAdd": 78,
	"NumpadComma": 126,
	"NumpadDecimal": 83,
	"NumpadDivide": 57397,
	"NumpadEnter": 57372,
	"NumpadEqual": 89,
	"NumpadMultiply": 55,
	"NumpadParenLeft": 57462,
	"NumpadParenRight": 57467,
	"NumpadSubtract": 74,
	"Open": 100,
	"PageDown": 57425,
	"PageUp": 57417,
	"Paste": 101,
	"Pause": 57414,
	"Period": 52,
	"Power": 57438,
	"PrintScreen": 84,
	"Props": 57350,
	"Quote": 40,
	"ScrollLock": 70,
	"Semicolon": 39,
	"ShiftLeft": 42,
	"ShiftRight": 54,
	"Slash": 53,
	"Sleep": 57439,
	"Space": 57,
	"Suspend": 57381,
	"Tab": 15,
	"Undo": 57351,
	"WakeUp": 57443
};
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
const encodings = {
	a: 1464686180,
	b: 3231835598
};
class AESECBCipher {
	constructor() {
		this._key = null;
	}
	get algorithm() {
		return { name: "AES-ECB" };
	}
	static async a(key, __unused_4442, __unused_6DC5, keyUsages) {
		const cipher = new AESECBCipher();
		await cipher._importKey(key, false, keyUsages);
		return cipher;
	}
	async _importKey(key, extractable, keyUsages) {
		this._key = await window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, extractable, keyUsages);
	}
	async encrypt(__unused_EE79, plaintext) {
		const x = new Uint8Array(plaintext);
		if (x.length % 16 !== 0 || this._key === null) {
			return null;
		}
		const n = x.length / 16;
		for (let i = 0; i < n; i++) {
			const y = new Uint8Array(await window.crypto.subtle.encrypt({
				name: "AES-CBC",
				iv: new Uint8Array(16)
			}, this._key, x.slice(i * 16, i * 16 + 16))).slice(0, 16);
			x.set(y, i * 16);
		}
		return x;
	}
}
class AESEAXCipher {
	constructor() {
		this._rawKey = null;
		this._ctrKey = null;
		this._cbcKey = null;
		this._zeroBlock = new Uint8Array(16);
		this._prefixBlock0 = this._zeroBlock;
		this._prefixBlock1 = new Uint8Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1
		]);
		this._prefixBlock2 = new Uint8Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			2
		]);
	}
	get algorithm() {
		return { name: "AES-EAX" };
	}
	async _encryptBlock(block) {
		const encrypted = await window.crypto.subtle.encrypt({
			name: "AES-CBC",
			iv: this._zeroBlock
		}, this._cbcKey, block);
		return new Uint8Array(encrypted).slice(0, 16);
	}
	async _initCMAC() {
		const k1 = await this._encryptBlock(this._zeroBlock);
		const k2 = new Uint8Array(16);
		const v = k1[0] >>> 6;
		for (let i = 0; i < 15; i++) {
			k2[i] = k1[i + 1] >> 6 | k1[i] << 2;
			k1[i] = k1[i + 1] >> 7 | k1[i] << 1;
		}
		const lut = [
			0,
			135,
			14,
			137
		];
		k2[14] ^= v >>> 1;
		k2[15] = k1[15] << 2 ^ lut[v];
		k1[15] = k1[15] << 1 ^ lut[v >> 1];
		this._k1 = k1;
		this._k2 = k2;
	}
	async _encryptCTR(data, counter) {
		const encrypted = await window.crypto.subtle.encrypt({
			name: "AES-CTR",
			counter,
			length: 128
		}, this._ctrKey, data);
		return new Uint8Array(encrypted);
	}
	async _decryptCTR(data, counter) {
		const decrypted = await window.crypto.subtle.decrypt({
			name: "AES-CTR",
			counter,
			length: 128
		}, this._ctrKey, data);
		return new Uint8Array(decrypted);
	}
	async _computeCMAC(data, prefixBlock) {
		if (prefixBlock.length !== 16) {
			return null;
		}
		const n = Math.floor(data.length / 16);
		const m = Math.ceil(data.length / 16);
		const r = data.length - n * 16;
		const cbcData = new Uint8Array((m + 1) * 16);
		cbcData.set(prefixBlock);
		cbcData.set(data, 16);
		if (r === 0) {
			for (let i = 0; i < 16; i++) {
				cbcData[n * 16 + i] ^= this._k1[i];
			}
		} else {
			cbcData[(n + 1) * 16 + r] = 128;
			for (let i = 0; i < 16; i++) {
				cbcData[(n + 1) * 16 + i] ^= this._k2[i];
			}
		}
		let cbcEncrypted = await window.crypto.subtle.encrypt({
			name: "AES-CBC",
			iv: this._zeroBlock
		}, this._cbcKey, cbcData);
		cbcEncrypted = new Uint8Array(cbcEncrypted);
		const mac = cbcEncrypted.slice(cbcEncrypted.length - 32, cbcEncrypted.length - 16);
		return mac;
	}
	static async a(key) {
		const cipher = new AESEAXCipher();
		await cipher._importKey(key);
		return cipher;
	}
	async _importKey(key) {
		this._rawKey = key;
		this._ctrKey = await window.crypto.subtle.importKey("raw", key, { name: "AES-CTR" }, false, ["encrypt", "decrypt"]);
		this._cbcKey = await window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["encrypt"]);
		await this._initCMAC();
	}
	async encrypt(algorithm, message) {
		const ad = algorithm.additionalData;
		const nonce = algorithm.iv;
		const nCMAC = await this._computeCMAC(nonce, this._prefixBlock0);
		const encrypted = await this._encryptCTR(message, nCMAC);
		const adCMAC = await this._computeCMAC(ad, this._prefixBlock1);
		const mac = await this._computeCMAC(encrypted, this._prefixBlock2);
		for (let i = 0; i < 16; i++) {
			mac[i] ^= nCMAC[i] ^ adCMAC[i];
		}
		const res = new Uint8Array(16 + encrypted.length);
		res.set(encrypted);
		res.set(mac, encrypted.length);
		return res;
	}
	async decrypt(algorithm, data) {
		const encrypted = data.slice(0, data.length - 16);
		const ad = algorithm.additionalData;
		const nonce = algorithm.iv;
		const mac = data.slice(data.length - 16);
		const nCMAC = await this._computeCMAC(nonce, this._prefixBlock0);
		const adCMAC = await this._computeCMAC(ad, this._prefixBlock1);
		const computedMac = await this._computeCMAC(encrypted, this._prefixBlock2);
		for (let i = 0; i < 16; i++) {
			computedMac[i] ^= nCMAC[i] ^ adCMAC[i];
		}
		if (computedMac.length !== mac.length) {
			return null;
		}
		for (let i = 0; i < mac.length; i++) {
			if (computedMac[i] !== mac[i]) {
				return null;
			}
		}
		const res = await this._decryptCTR(encrypted, nCMAC);
		return res;
	}
}
/*
* Ported from Flashlight VNC ActionScript implementation:
*     http://www.wizhelp.com/flashlight-vnc/
*
* Full attribution follows:
*
* -------------------------------------------------------------------------
*
* This DES class has been extracted from package Acme.Crypto for use in VNC.
* The unnecessary odd parity code has been removed.
*
* These changes are:
*  Copyright (C) 1999 AT&T Laboratories Cambridge.  All Rights Reserved.
*
* This software is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*

* DesCipher - the DES encryption method
*
* The meat of this code is by Dave Zimmerman <dzimm@widget.com>, and is:
*
* Copyright (c) 1996 Widget Workshop, Inc. All Rights Reserved.
*
* Permission to use, copy, modify, and distribute this software
* and its documentation for NON-COMMERCIAL or COMMERCIAL purposes and
* without fee is hereby granted, provided that this copyright notice is kept
* intact.
*
* WIDGET WORKSHOP MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY
* OF THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WIDGET WORKSHOP SHALL NOT BE LIABLE
* FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
* DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
* THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
* CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
* PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
* NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
* SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
* SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
* PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES").  WIDGET WORKSHOP
* SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
* HIGH RISK ACTIVITIES.
*
*
* The rest is:
*
* Copyright (C) 1996 by Jef Poskanzer <jef@acme.com>.  All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions
* are met:
* 1. Redistributions of source code must retain the above copyright
*    notice, this list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright
*    notice, this list of conditions and the following disclaimer in the
*    documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
* OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
* LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
* OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
* SUCH DAMAGE.
*
* Visit the ACME Labs Java page for up-to-date versions of this and other
* fine Java utilities: http://www.acme.com/java/
*/
/* eslint-disable comma-spacing */
// Tables, permutations, S-boxes, etc.
const PC2 = [
	13,
	16,
	10,
	23,
	0,
	4,
	2,
	27,
	14,
	5,
	20,
	9,
	22,
	18,
	11,
	3,
	25,
	7,
	15,
	6,
	26,
	19,
	12,
	1,
	40,
	51,
	30,
	36,
	46,
	54,
	29,
	39,
	50,
	44,
	32,
	47,
	43,
	48,
	38,
	55,
	33,
	52,
	45,
	41,
	49,
	35,
	28,
	31
], totrot = [
	1,
	2,
	4,
	6,
	8,
	10,
	12,
	14,
	15,
	17,
	19,
	21,
	23,
	25,
	27,
	28
];
let a, b, c;
b = 1 << 24;
c = 65536 | b;
const SP1 = [
	c | 1024,
	0,
	65536,
	c | 1028,
	c | 4,
	66564,
	4,
	65536,
	1024,
	c | 1024,
	c | 1028,
	1024,
	b | 1028,
	c | 4,
	b | 0,
	4,
	1028,
	b | 1024,
	b | 1024,
	66560,
	66560,
	c | 0,
	c | 0,
	b | 1028,
	65540,
	b | 4,
	b | 4,
	65540,
	0,
	1028,
	66564,
	b | 0,
	65536,
	c | 1028,
	4,
	c | 0,
	c | 1024,
	b | 0,
	b | 0,
	1024,
	c | 4,
	65536,
	66560,
	b | 4,
	1024,
	4,
	b | 1028,
	66564,
	c | 1028,
	65540,
	c | 0,
	b | 1028,
	b | 4,
	1028,
	66564,
	c | 1024,
	1028,
	b | 1024,
	b | 1024,
	0,
	65540,
	66560,
	0,
	c | 4
];
a = 1 << 20;
b = 1 << 31;
c = a | b;
const SP2 = [
	c | 32800,
	b | 32768,
	32768,
	a | 32800,
	a | 0,
	32,
	c | 32,
	b | 32800,
	b | 32,
	c | 32800,
	c | 32768,
	b | 0,
	b | 32768,
	a | 0,
	32,
	c | 32,
	a | 32768,
	a | 32,
	b | 32800,
	0,
	b | 0,
	32768,
	a | 32800,
	c | 0,
	a | 32,
	b | 32,
	0,
	a | 32768,
	32800,
	c | 32768,
	c | 0,
	32800,
	0,
	a | 32800,
	c | 32,
	a | 0,
	b | 32800,
	c | 0,
	c | 32768,
	32768,
	c | 0,
	b | 32768,
	32,
	c | 32800,
	a | 32800,
	32,
	32768,
	b | 0,
	32800,
	c | 32768,
	a | 0,
	b | 32,
	a | 32,
	b | 32800,
	b | 32,
	a | 32,
	a | 32768,
	0,
	b | 32768,
	32800,
	b | 0,
	c | 32,
	c | 32800,
	a | 32768
];
b = 1 << 27;
c = 131072 | b;
const SP3 = [
	520,
	c | 512,
	0,
	c | 8,
	b | 512,
	0,
	131592,
	b | 512,
	131080,
	b | 8,
	b | 8,
	131072,
	c | 520,
	131080,
	c | 0,
	520,
	b | 0,
	8,
	c | 512,
	512,
	131584,
	c | 0,
	c | 8,
	131592,
	b | 520,
	131584,
	131072,
	b | 520,
	8,
	c | 520,
	512,
	b | 0,
	c | 512,
	b | 0,
	131080,
	520,
	131072,
	c | 512,
	b | 512,
	0,
	512,
	131080,
	c | 520,
	b | 512,
	b | 8,
	512,
	0,
	c | 8,
	b | 520,
	131072,
	b | 0,
	c | 520,
	8,
	131592,
	131584,
	b | 8,
	c | 0,
	b | 520,
	520,
	c | 0,
	131592,
	8,
	c | 8,
	131584
];
b = 1 << 23;
c = 8192 | b;
const SP4 = [
	c | 1,
	8321,
	8321,
	128,
	c | 128,
	b | 129,
	b | 1,
	8193,
	0,
	c | 0,
	c | 0,
	c | 129,
	129,
	0,
	b | 128,
	b | 1,
	1,
	8192,
	b | 0,
	c | 1,
	128,
	b | 0,
	8193,
	8320,
	b | 129,
	1,
	8320,
	b | 128,
	8192,
	c | 128,
	c | 129,
	129,
	b | 128,
	b | 1,
	c | 0,
	c | 129,
	129,
	0,
	0,
	c | 0,
	8320,
	b | 128,
	b | 129,
	1,
	c | 1,
	8321,
	8321,
	128,
	c | 129,
	129,
	1,
	8192,
	b | 1,
	8193,
	c | 128,
	b | 129,
	8193,
	8320,
	b | 0,
	c | 1,
	128,
	b | 0,
	8192,
	c | 128
];
a = 1 << 25;
b = 1 << 30;
c = a | b;
const SP5 = [
	256,
	a | 524544,
	a | 524288,
	c | 256,
	524288,
	256,
	b | 0,
	a | 524288,
	b | 524544,
	524288,
	a | 256,
	b | 524544,
	c | 256,
	c | 524288,
	524544,
	b | 0,
	a | 0,
	b | 524288,
	b | 524288,
	0,
	b | 256,
	c | 524544,
	c | 524544,
	a | 256,
	c | 524288,
	b | 256,
	0,
	c | 0,
	a | 524544,
	a | 0,
	c | 0,
	524544,
	524288,
	c | 256,
	256,
	a | 0,
	b | 0,
	a | 524288,
	c | 256,
	b | 524544,
	a | 256,
	b | 0,
	c | 524288,
	a | 524544,
	b | 524544,
	256,
	a | 0,
	c | 524288,
	c | 524544,
	524544,
	c | 0,
	c | 524544,
	a | 524288,
	0,
	b | 524288,
	c | 0,
	524544,
	a | 256,
	b | 256,
	524288,
	0,
	b | 524288,
	a | 524544,
	b | 256
];
a = 1 << 22;
b = 1 << 29;
c = a | b;
const SP6 = [
	b | 16,
	c | 0,
	16384,
	c | 16400,
	c | 0,
	16,
	c | 16400,
	a | 0,
	b | 16384,
	a | 16400,
	a | 0,
	b | 16,
	a | 16,
	b | 16384,
	b | 0,
	16400,
	0,
	a | 16,
	b | 16400,
	16384,
	a | 16384,
	b | 16400,
	16,
	c | 16,
	c | 16,
	0,
	a | 16400,
	c | 16384,
	16400,
	a | 16384,
	c | 16384,
	b | 0,
	b | 16384,
	16,
	c | 16,
	a | 16384,
	c | 16400,
	a | 0,
	16400,
	b | 16,
	a | 0,
	b | 16384,
	b | 0,
	16400,
	b | 16,
	c | 16400,
	a | 16384,
	c | 0,
	a | 16400,
	c | 16384,
	0,
	c | 16,
	16,
	16384,
	c | 0,
	a | 16400,
	16384,
	a | 16,
	b | 16400,
	0,
	c | 16384,
	b | 0,
	a | 16,
	b | 16400
];
a = 1 << 21;
b = 1 << 26;
c = a | b;
const SP7 = [
	a | 0,
	c | 2,
	b | 2050,
	0,
	2048,
	b | 2050,
	a | 2050,
	c | 2048,
	c | 2050,
	a | 0,
	0,
	b | 2,
	2,
	b | 0,
	c | 2,
	2050,
	b | 2048,
	a | 2050,
	a | 2,
	b | 2048,
	b | 2,
	c | 0,
	c | 2048,
	a | 2,
	c | 0,
	2048,
	2050,
	c | 2050,
	a | 2048,
	2,
	b | 0,
	a | 2048,
	b | 0,
	a | 2048,
	a | 0,
	b | 2050,
	b | 2050,
	c | 2,
	c | 2,
	2,
	a | 2,
	b | 0,
	b | 2048,
	a | 0,
	c | 2048,
	2050,
	a | 2050,
	c | 2048,
	2050,
	b | 2,
	c | 2050,
	c | 0,
	a | 2048,
	0,
	2,
	c | 2050,
	0,
	a | 2050,
	c | 0,
	2048,
	b | 2,
	b | 2048,
	2048,
	a | 2
];
b = 1 << 28;
c = 262144 | b;
const SP8 = [
	b | 4160,
	4096,
	262144,
	c | 4160,
	b | 0,
	b | 4160,
	64,
	b | 0,
	262208,
	c | 0,
	c | 4160,
	266240,
	c | 4096,
	266304,
	4096,
	64,
	c | 0,
	b | 64,
	b | 4096,
	4160,
	266240,
	262208,
	c | 64,
	c | 4096,
	4160,
	0,
	0,
	c | 64,
	b | 64,
	b | 4096,
	266304,
	262144,
	266304,
	262144,
	c | 4096,
	4096,
	64,
	c | 64,
	4096,
	266304,
	b | 4096,
	64,
	b | 64,
	c | 0,
	c | 64,
	b | 0,
	262144,
	b | 4160,
	0,
	c | 4160,
	262208,
	b | 64,
	c | 0,
	b | 4096,
	b | 4160,
	0,
	c | 4160,
	266240,
	266240,
	4160,
	4160,
	262208,
	b | 0,
	c | 4096
];
/* eslint-enable comma-spacing */
class DES {
	constructor(password) {
		this.keys = [];
		// Set the key.
		const pc1m = [], pcr = [], kn = [];
		for (let j = 0, l = 56; j < 56; ++j, l -= 8) {
			l += l < -5 ? 65 : l < -3 ? 31 : l < -1 ? 63 : l === 27 ? 35 : 0;
			const m = l & 7;
			pc1m[j] = (password[l >>> 3] & 1 << m) !== 0 ? 1 : 0;
		}
		for (let i = 0; i < 16; ++i) {
			const m = i << 1;
			const n = m + 1;
			kn[m] = kn[n] = 0;
			for (let o = 28; o < 59; o += 28) {
				for (let j = o - 28; j < o; ++j) {
					const l = j + totrot[i];
					pcr[j] = l < o ? pc1m[l] : pc1m[l - 28];
				}
			}
			for (let j = 0; j < 24; ++j) {
				if (pcr[PC2[j]] !== 0) {
					kn[m] |= 1 << 23 - j;
				}
				if (pcr[PC2[j + 24]] !== 0) {
					kn[n] |= 1 << 23 - j;
				}
			}
		}
		// cookey
		for (let i = 0, rawi = 0, KnLi = 0; i < 16; ++i) {
			const raw0 = kn[rawi++];
			const raw1 = kn[rawi++];
			this.keys[KnLi] = (raw0 & 16515072) << 6;
			this.keys[KnLi] |= (raw0 & 4032) << 10;
			this.keys[KnLi] |= (raw1 & 16515072) >>> 10;
			this.keys[KnLi] |= (raw1 & 4032) >>> 6;
			++KnLi;
			this.keys[KnLi] = (raw0 & 258048) << 12;
			this.keys[KnLi] |= (raw0 & 63) << 16;
			this.keys[KnLi] |= (raw1 & 258048) >>> 4;
			this.keys[KnLi] |= raw1 & 63;
			++KnLi;
		}
	}
	// Encrypt 8 bytes of text
	enc8(text) {
		const b = text.slice();
		let i = 0, l, r, x;
		// Squash 8 bytes to 2 ints
		l = b[i++] << 24 | b[i++] << 16 | b[i++] << 8 | b[i++];
		r = b[i++] << 24 | b[i++] << 16 | b[i++] << 8 | b[+i];
		x = (l >>> 4 ^ r) & 252645135;
		r ^= x;
		l ^= x << 4;
		x = (l >>> 16 ^ r) & 65535;
		r ^= x;
		l ^= x << 16;
		x = (r >>> 2 ^ l) & 858993459;
		l ^= x;
		r ^= x << 2;
		x = (r >>> 8 ^ l) & 16711935;
		l ^= x;
		r ^= x << 8;
		r = r << 1 | r >>> 31 & 1;
		x = (l ^ r) & 2863311530;
		l ^= x;
		r ^= x;
		l = l << 1 | l >>> 31 & 1;
		for (let i = 0, keysi = 0; i < 8; ++i) {
			x = r << 28 | r >>> 4;
			x ^= this.keys[keysi++];
			let fval = SP7[x & 63];
			fval |= SP5[x >>> 8 & 63];
			fval |= SP3[x >>> 16 & 63];
			fval |= SP1[x >>> 24 & 63];
			x = r ^ this.keys[keysi++];
			fval |= SP8[x & 63];
			fval |= SP6[x >>> 8 & 63];
			fval |= SP4[x >>> 16 & 63];
			fval |= SP2[x >>> 24 & 63];
			l ^= fval;
			x = l << 28 | l >>> 4;
			x ^= this.keys[keysi++];
			fval = SP7[x & 63];
			fval |= SP5[x >>> 8 & 63];
			fval |= SP3[x >>> 16 & 63];
			fval |= SP1[x >>> 24 & 63];
			x = l ^ this.keys[keysi++];
			fval |= SP8[x & 63];
			fval |= SP6[x >>> 8 & 63];
			fval |= SP4[x >>> 16 & 63];
			fval |= SP2[x >>> 24 & 63];
			r ^= fval;
		}
		r = r << 31 | r >>> 1;
		x = (l ^ r) & 2863311530;
		l ^= x;
		r ^= x;
		l = l << 31 | l >>> 1;
		x = (l >>> 8 ^ r) & 16711935;
		r ^= x;
		l ^= x << 8;
		x = (l >>> 2 ^ r) & 858993459;
		r ^= x;
		l ^= x << 2;
		x = (r >>> 16 ^ l) & 65535;
		l ^= x;
		r ^= x << 16;
		x = (r >>> 4 ^ l) & 252645135;
		l ^= x;
		r ^= x << 4;
		// Spread ints to bytes
		x = [r, l];
		for (i = 0; i < 8; i++) {
			b[i] = (x[i >>> 2] >>> 8 * (3 - i % 4)) % 256;
			if (b[i] < 0) {
				b[i] += 256;
			}
		}
		return b;
	}
}
class DESECBCipher {
	get algorithm() {
		return { name: "a" };
	}
	static a(key) {
		const cipher = new DESECBCipher();
		cipher._importKey(key);
		return cipher;
	}
	_importKey(key) {
		this._cipher = new DES(key);
	}
	encrypt(__unused_EE79_0, plaintext) {
		const x = new Uint8Array(plaintext);
		if (x.length % 8 !== 0 || this._cipher === null) {
			return null;
		}
		const n = x.length / 8;
		for (let i = 0; i < n; i++) {
			x.set(this._cipher.enc8(x.slice(i * 8, i * 8 + 8)), i * 8);
		}
		return x;
	}
}
class DESCBCCipher {
	get algorithm() {
		return { name: "a" };
	}
	static a(key) {
		const cipher = new DESCBCCipher();
		cipher._importKey(key);
		return cipher;
	}
	_importKey(key) {
		this._cipher = new DES(key);
	}
	encrypt(algorithm, plaintext) {
		const x = new Uint8Array(plaintext);
		let y = new Uint8Array(algorithm.iv);
		if (x.length % 8 !== 0 || this._cipher === null) {
			return null;
		}
		const n = x.length / 8;
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < 8; j++) {
				y[j] ^= plaintext[i * 8 + j];
			}
			y = this._cipher.enc8(y);
			x.set(y, i * 8);
		}
		return x;
	}
}
function modPow(b, e, m) {
	let r = 1n;
	b = b % m;
	while (e > 0n) {
		if ((e & 1n) === 1n) {
			r = r * b % m;
		}
		e = e >> 1n;
		b = b * b % m;
	}
	return r;
}
function bigIntToU8Array(bigint, padLength = 0) {
	let hex = bigint.toString(16);
	if (padLength === 0) {
		padLength = Math.ceil(hex.length / 2);
	}
	hex = hex.padStart(padLength * 2, "0");
	const length = hex.length / 2;
	const arr = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	}
	return arr;
}
function u8ArrayToBigInt(arr) {
	let hex = "0x";
	for (let i = 0; i < arr.length; i++) {
		hex += arr[i].toString(16).padStart(2, "0");
	}
	return BigInt(hex);
}
class RSACipher {
	constructor() {
		this._keyLength = 0;
		this._keyBytes = 0;
		this._n = null;
		this._e = null;
		this._d = null;
		this._nBigInt = null;
		this._eBigInt = null;
		this._dBigInt = null;
		this._extractable = false;
	}
	get algorithm() {
		return { name: "RSA-PKCS1-v1_5" };
	}
	_base64urlDecode(data) {
		data = data.replace(/-/g, "+").replace(/_/g, "/");
		data = data.padEnd(Math.ceil(data.length / 4) * 4, "=");
		return Base64.d(data);
	}
	_padArray(arr, length) {
		const res = new Uint8Array(length);
		res.set(arr, length - arr.length);
		return res;
	}
	static async b(algorithm) {
		const cipher = new RSACipher();
		await cipher._generateKey(algorithm, true);
		return { privateKey: cipher };
	}
	async _generateKey(algorithm, extractable) {
		this._keyLength = algorithm.modulusLength;
		this._keyBytes = Math.ceil(this._keyLength / 8);
		const key = await window.crypto.subtle.generateKey({
			name: "RSA-OAEP",
			modulusLength: algorithm.modulusLength,
			publicExponent: algorithm.publicExponent,
			hash: { name: "SHA-256" }
		}, true, ["encrypt", "decrypt"]);
		const privateKey = await window.crypto.subtle.exportKey("jwk", key.privateKey);
		this._n = this._padArray(this._base64urlDecode(privateKey.n), this._keyBytes);
		this._nBigInt = u8ArrayToBigInt(this._n);
		this._e = this._padArray(this._base64urlDecode(privateKey.e), this._keyBytes);
		this._eBigInt = u8ArrayToBigInt(this._e);
		this._d = this._padArray(this._base64urlDecode(privateKey.d), this._keyBytes);
		this._dBigInt = u8ArrayToBigInt(this._d);
		this._extractable = extractable;
	}
	static async a(key) {
		const cipher = new RSACipher();
		await cipher._importKey(key, false);
		return cipher;
	}
	async _importKey(key, extractable) {
		const n = key.n;
		const e = key.e;
		if (n.length !== e.length) {
			throw new Error("the sizes of modulus and public exponent do not match");
		}
		this._keyBytes = n.length;
		this._keyLength = this._keyBytes * 8;
		this._n = new Uint8Array(this._keyBytes);
		this._e = new Uint8Array(this._keyBytes);
		this._n.set(n);
		this._e.set(e);
		this._nBigInt = u8ArrayToBigInt(this._n);
		this._eBigInt = u8ArrayToBigInt(this._e);
		this._extractable = extractable;
	}
	async encrypt(__unused_4C47, message) {
		if (message.length > this._keyBytes - 11) {
			return null;
		}
		const ps = new Uint8Array(this._keyBytes - message.length - 3);
		window.crypto.getRandomValues(ps);
		for (let i = 0; i < ps.length; i++) {
			ps[i] = Math.floor(ps[i] * 254 / 255 + 1);
		}
		const em = new Uint8Array(this._keyBytes);
		em[1] = 2;
		em.set(ps, 2);
		em.set(message, ps.length + 3);
		const emBigInt = u8ArrayToBigInt(em);
		const c = modPow(emBigInt, this._eBigInt, this._nBigInt);
		return bigIntToU8Array(c, this._keyBytes);
	}
	async decrypt(__unused_4C47_0, message) {
		if (message.length !== this._keyBytes) {
			return null;
		}
		const msgBigInt = u8ArrayToBigInt(message);
		const emBigInt = modPow(msgBigInt, this._dBigInt, this._nBigInt);
		const em = bigIntToU8Array(emBigInt, this._keyBytes);
		if (em[0] !== 0 || em[1] !== 2) {
			return null;
		}
		let i = 2;
		for (; i < em.length; i++) {
			if (em[i] === 0) {
				break;
			}
		}
		if (i === em.length) {
			return null;
		}
		return em.slice(i + 1, em.length);
	}
	async exportKey() {
		if (!this._extractable) {
			throw new Error("key is not extractable");
		}
		return {
			n: this._n,
			e: this._e,
			d: this._d
		};
	}
}
class DHPublicKey {
	constructor(key) {
		this._key = key;
	}
	get algorithm() {
		return { name: "DH" };
	}
	exportKey() {
		return this._key;
	}
}
class DHCipher {
	constructor() {
		this._g = null;
		this._p = null;
	}
	get algorithm() {
		return { name: "DH" };
	}
	static b(algorithm) {
		const cipher = new DHCipher();
		cipher._generateKey(algorithm);
		return {
			privateKey: cipher,
			publicKey: new DHPublicKey(cipher._publicKey)
		};
	}
	_generateKey(algorithm) {
		const g = algorithm.g;
		const p = algorithm.p;
		this._keyBytes = p.length;
		this._gBigInt = u8ArrayToBigInt(g);
		this._pBigInt = u8ArrayToBigInt(p);
		this._privateKey = window.crypto.getRandomValues(new Uint8Array(this._keyBytes));
		this._privateKeyBigInt = u8ArrayToBigInt(this._privateKey);
		this._publicKey = bigIntToU8Array(modPow(this._gBigInt, this._privateKeyBigInt, this._pBigInt), this._keyBytes);
	}
	deriveBits(algorithm, length) {
		const bytes = Math.ceil(length / 8);
		const pkey = new Uint8Array(algorithm.public);
		const len = bytes > this._keyBytes ? bytes : this._keyBytes;
		const secret = modPow(u8ArrayToBigInt(pkey), this._privateKeyBigInt, this._pBigInt);
		return bigIntToU8Array(secret, len).slice(0, len);
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2021 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
/*
* Performs MD5 hashing on an array of bytes, returns an array of bytes
*/
async function MD5(d) {
	let s = "";
	for (let i = 0; i < d.length; i++) {
		s += String.fromCharCode(d[i]);
	}
	return M(V(Y(X(s), 8 * s.length)));
}
function M(d) {
	let f = new Uint8Array(d.length);
	for (let i = 0; i < d.length; i++) {
		f[i] = d.charCodeAt(i);
	}
	return f;
}
function X(d) {
	let r = Array(d.length >> 2);
	for (let m = 0; m < r.length; m++) r[m] = 0;
	for (let m = 0; m < 8 * d.length; m += 8) r[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
	return r;
}
function V(d) {
	let r = "";
	for (let m = 0; m < 32 * d.length; m += 8) r += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
	return r;
}
function Y(d, g) {
	d[g >> 5] |= 128 << g % 32, d[14 + (g + 64 >>> 9 << 4)] = g;
	let m = 1732584193, f = -271733879, r = -1732584194, i = 271733878;
	for (let n = 0; n < d.length; n += 16) {
		let h = m, t = f, g = r, e = i;
		f = ii(f = ii(f = ii(f = ii(f = hh(f = hh(f = hh(f = hh(f = gg(f = gg(f = gg(f = gg(f = ff(f = ff(f = ff(f = ff(f, r = ff(r, i = ff(i, m = ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = ff(r, i = ff(i, m = ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = ff(r, i = ff(i, m = ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = ff(r, i = ff(i, m = ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = gg(r, i = gg(i, m = gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = gg(r, i = gg(i, m = gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = gg(r, i = gg(i, m = gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = gg(r, i = gg(i, m = gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = hh(r, i = hh(i, m = hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = hh(r, i = hh(i, m = hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = hh(r, i = hh(i, m = hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = hh(r, i = hh(i, m = hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = ii(r, i = ii(i, m = ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = ii(r, i = ii(i, m = ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = ii(r, i = ii(i, m = ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = ii(r, i = ii(i, m = ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = add(m, h), f = add(f, t), r = add(r, g), i = add(i, e);
	}
	return Array(m, f, r, i);
}
function cmn(d, g, m, f, r, i) {
	return add(rol(add(add(g, d), add(f, i)), r), m);
}
function ff(d, g, m, f, r, i, n) {
	return cmn(g & m | ~g & f, d, g, r, i, n);
}
function gg(d, g, m, f, r, i, n) {
	return cmn(g & f | m & ~f, d, g, r, i, n);
}
function hh(d, g, m, f, r, i, n) {
	return cmn(g ^ m ^ f, d, g, r, i, n);
}
function ii(d, g, m, f, r, i, n) {
	return cmn(m ^ (g | ~f), d, g, r, i, n);
}
function add(d, g) {
	let m = (65535 & d) + (65535 & g);
	return (d >> 16) + (g >> 16) + (m >> 16) << 16 | 65535 & m;
}
function rol(d, g) {
	return d << g | d >>> 32 - g;
}
// A single interface for the cryptographic algorithms not supported by SubtleCrypto.
// Both synchronous and asynchronous implmentations are allowed.
class LegacyCrypto {
	constructor() {
		this.a = {
			"AES-ECB": AESECBCipher,
			"AES-EAX": AESEAXCipher,
			"DES-ECB": DESECBCipher,
			"DES-CBC": DESCBCCipher,
			"RSA-PKCS1-v1_5": RSACipher,
			"DH": DHCipher,
			"MD5": MD5
		};
	}
	b(algorithm, key, data) {
		if (key.algorithm.name !== algorithm.name) {
			throw new Error("algorithm does not match");
		}
		if (typeof key.encrypt !== "function") {
			throw new Error("key does not support encryption");
		}
		return key.encrypt(algorithm, data);
	}
	c(algorithm, key, data) {
		if (key.algorithm.name !== algorithm.name) {
			throw new Error("algorithm does not match");
		}
		if (typeof key.decrypt !== "function") {
			throw new Error("key does not support encryption");
		}
		return key.decrypt(algorithm, data);
	}
	d(__unused_BD75, keyData, algorithm, __unused_6DC5_1, keyUsages) {
		const alg = this.a[algorithm.a];
		return alg.a(keyData, 0, 0, keyUsages);
	}
	e(algorithm) {
		const alg = this.a[algorithm.name];
		return alg.b(algorithm);
	}
	f(__unused_BD75_0, key) {
		if (typeof key.exportKey !== "function") {
			throw new Error("key does not support exportKey");
		}
		return key.exportKey();
	}
	g(__unused_9B39, data) {
		const alg = this.a["MD5"];
		return alg(data);
	}
	h(algorithm, key, length) {
		if (key.algorithm.name !== "DH") {
			throw new Error("algorithm does not match");
		}
		if (typeof key.deriveBits !== "function") {
			throw new Error("key does not support deriveBits");
		}
		return key.deriveBits(algorithm, length);
	}
}
var legacyCrypto = new LegacyCrypto();
class RA2Cipher {
	constructor() {
		this.a = null;
		this.b = new Uint8Array(16);
	}
	async c(key) {
		this.a = await legacyCrypto.d(0, key, { a: "AES-EAX" });
	}
	async d(message) {
		const ad = new Uint8Array([(message.length & 65280) >>> 8, message.length & 255]);
		const encrypted = await legacyCrypto.b({
			name: "AES-EAX",
			iv: this.b,
			additionalData: ad
		}, this.a, message);
		for (let i = 0; i < 16 && this.b[i]++ === 255; i++);
		const res = new Uint8Array(message.length + 2 + 16);
		res.set(ad);
		res.set(encrypted, 2);
		return res;
	}
	async e(length, encrypted) {
		const ad = new Uint8Array([0, length & 255]);
		const res = await legacyCrypto.c({
			name: "AES-EAX",
			iv: this.b,
			additionalData: ad
		}, this.a, encrypted);
		for (let i = 0; i < 16 && this.b[i]++ === 255; i++);
		return res;
	}
}
class RSAAESAuthenticationState extends EventTargetMixin {
	constructor(sock, getCredentials) {
		super();
		this._hasStarted = false;
		this._checkSock = null;
		this._checkCredentials = null;
		this._approveServerResolve = null;
		this._sockReject = null;
		this._credentialsReject = null;
		this._approveServerReject = null;
		this._sock = sock;
		this._getCredentials = getCredentials;
	}
	_waitSockAsync(len) {
		return new Promise((resolve, reject) => {
			const hasData = () => !this._sock.rQwait("RA2", len);
			if (hasData()) {
				resolve();
			} else {
				this._checkSock = () => {
					if (hasData()) {
						resolve();
						this._checkSock = null;
						this._sockReject = null;
					}
				};
				this._sockReject = reject;
			}
		});
	}
	_waitApproveKeyAsync() {
		return new Promise((resolve, reject) => {
			this._approveServerResolve = resolve;
			this._approveServerReject = reject;
		});
	}
	_waitCredentialsAsync(subtype) {
		const hasCredentials = () => {
			if (subtype === 1 && this._getCredentials().username !== void 0 && this._getCredentials().password !== void 0) {
				return true;
			} else if (subtype === 2 && this._getCredentials().password !== void 0) {
				return true;
			}
			return false;
		};
		return new Promise((resolve, reject) => {
			if (hasCredentials()) {
				resolve();
			} else {
				this._checkCredentials = () => {
					if (hasCredentials()) {
						resolve();
						this._checkCredentials = null;
						this._credentialsReject = null;
					}
				};
				this._credentialsReject = reject;
			}
		});
	}
	checkInternalEvents() {
		if (this._checkSock !== null) {
			this._checkSock();
		}
		if (this._checkCredentials !== null) {
			this._checkCredentials();
		}
	}
	approveServer() {
		if (this._approveServerResolve !== null) {
			this._approveServerResolve();
			this._approveServerResolve = null;
		}
	}
	disconnect() {
		if (this._sockReject !== null) {
			this._sockReject(new Error("disconnect normally"));
			this._sockReject = null;
		}
		if (this._credentialsReject !== null) {
			this._credentialsReject(new Error("disconnect normally"));
			this._credentialsReject = null;
		}
		if (this._approveServerReject !== null) {
			this._approveServerReject(new Error("disconnect normally"));
			this._approveServerReject = null;
		}
	}
	async negotiateRA2neAuthAsync() {
		this._hasStarted = true;
		// 1: Receive server public key
		await this._waitSockAsync(4);
		const serverKeyLengthBuffer = this._sock.rQpeekBytes(4);
		const serverKeyLength = this._sock.rQshift32();
		if (serverKeyLength < 1024) {
			throw new Error("RA2: server public key is too short: " + serverKeyLength);
		} else if (serverKeyLength > 8192) {
			throw new Error("RA2: server public key is too long: " + serverKeyLength);
		}
		const serverKeyBytes = Math.ceil(serverKeyLength / 8);
		await this._waitSockAsync(serverKeyBytes * 2);
		const serverN = this._sock.rQshiftBytes(serverKeyBytes);
		const serverE = this._sock.rQshiftBytes(serverKeyBytes);
		const serverRSACipher = await legacyCrypto.d(0, {
			n: serverN,
			e: serverE
		}, { a: "RSA-PKCS1-v1_5" });
		const serverPublickey = new Uint8Array(4 + serverKeyBytes * 2);
		serverPublickey.set(serverKeyLengthBuffer);
		serverPublickey.set(serverN, 4);
		serverPublickey.set(serverE, 4 + serverKeyBytes);
		// verify server public key
		let approveKey = this._waitApproveKeyAsync();
		this.dispatchEvent(new CustomEvent("serververification", { detail: {
			type: "RSA",
			publickey: serverPublickey
		} }));
		await approveKey;
		const clientKeyBytes = Math.ceil(256);
		const clientRSACipher = (await legacyCrypto.e({
			name: "RSA-PKCS1-v1_5",
			modulusLength: 2048,
			publicExponent: new Uint8Array([
				1,
				0,
				1
			])
		})).privateKey;
		const clientExportedRSAKey = await legacyCrypto.f(0, clientRSACipher);
		const clientN = clientExportedRSAKey.n;
		const clientE = clientExportedRSAKey.e;
		const clientPublicKey = new Uint8Array(4 + clientKeyBytes * 2);
		clientPublicKey[0] = 0;
		clientPublicKey[1] = 0;
		clientPublicKey[2] = 8;
		clientPublicKey[3] = 0;
		clientPublicKey.set(clientN, 4);
		clientPublicKey.set(clientE, 4 + clientKeyBytes);
		this._sock.sQpushBytes(clientPublicKey);
		this._sock.flush();
		// 3: Send client random
		const clientRandom = new Uint8Array(16);
		window.crypto.getRandomValues(clientRandom);
		const clientEncryptedRandom = await legacyCrypto.b({ name: "RSA-PKCS1-v1_5" }, serverRSACipher, clientRandom);
		const clientRandomMessage = new Uint8Array(2 + serverKeyBytes);
		clientRandomMessage[0] = (serverKeyBytes & 65280) >>> 8;
		clientRandomMessage[1] = serverKeyBytes & 255;
		clientRandomMessage.set(clientEncryptedRandom, 2);
		this._sock.sQpushBytes(clientRandomMessage);
		this._sock.flush();
		// 4: Receive server random
		await this._waitSockAsync(2);
		if (this._sock.rQshift16() !== clientKeyBytes) {
			throw new Error("RA2: wrong encrypted message length");
		}
		const serverEncryptedRandom = this._sock.rQshiftBytes(clientKeyBytes);
		const serverRandom = await legacyCrypto.c({ name: "RSA-PKCS1-v1_5" }, clientRSACipher, serverEncryptedRandom);
		if (serverRandom === null || serverRandom.length !== 16) {
			throw new Error("RA2: corrupted server encrypted random");
		}
		// 5: Compute session keys and set ciphers
		let clientSessionKey = new Uint8Array(32);
		let serverSessionKey = new Uint8Array(32);
		clientSessionKey.set(serverRandom);
		clientSessionKey.set(clientRandom, 16);
		serverSessionKey.set(clientRandom);
		serverSessionKey.set(serverRandom, 16);
		clientSessionKey = await window.crypto.subtle.digest("SHA-1", clientSessionKey);
		clientSessionKey = new Uint8Array(clientSessionKey).slice(0, 16);
		serverSessionKey = await window.crypto.subtle.digest("SHA-1", serverSessionKey);
		serverSessionKey = new Uint8Array(serverSessionKey).slice(0, 16);
		const clientCipher = new RA2Cipher();
		await clientCipher.c(clientSessionKey);
		const serverCipher = new RA2Cipher();
		await serverCipher.c(serverSessionKey);
		// 6: Compute and exchange hashes
		let serverHash = new Uint8Array(8 + serverKeyBytes * 2 + clientKeyBytes * 2);
		let clientHash = new Uint8Array(8 + serverKeyBytes * 2 + clientKeyBytes * 2);
		serverHash.set(serverPublickey);
		serverHash.set(clientPublicKey, 4 + serverKeyBytes * 2);
		clientHash.set(clientPublicKey);
		clientHash.set(serverPublickey, 4 + clientKeyBytes * 2);
		serverHash = await window.crypto.subtle.digest("SHA-1", serverHash);
		clientHash = await window.crypto.subtle.digest("SHA-1", clientHash);
		serverHash = new Uint8Array(serverHash);
		clientHash = new Uint8Array(clientHash);
		this._sock.sQpushBytes(await clientCipher.d(clientHash));
		this._sock.flush();
		await this._waitSockAsync(38);
		if (this._sock.rQshift16() !== 20) {
			throw new Error("RA2: wrong server hash");
		}
		const serverHashReceived = await serverCipher.e(20, this._sock.rQshiftBytes(36));
		if (serverHashReceived === null) {
			throw new Error("RA2: failed to authenticate the message");
		}
		for (let i = 0; i < 20; i++) {
			if (serverHashReceived[i] !== serverHash[i]) {
				throw new Error("RA2: wrong server hash");
			}
		}
		// 7: Receive subtype
		await this._waitSockAsync(19);
		if (this._sock.rQshift16() !== 1) {
			throw new Error("RA2: wrong subtype");
		}
		let subtype = await serverCipher.e(1, this._sock.rQshiftBytes(17));
		if (subtype === null) {
			throw new Error("RA2: failed to authenticate the message");
		}
		subtype = subtype[0];
		let waitCredentials = this._waitCredentialsAsync(subtype);
		if (subtype === 1) {
			if (this._getCredentials().username === void 0 || this._getCredentials().password === void 0) {
				this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["username", "password"] } }));
			}
		} else if (subtype === 2) {
			if (this._getCredentials().password === void 0) {
				this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["password"] } }));
			}
		} else {
			throw new Error("RA2: wrong subtype");
		}
		await waitCredentials;
		let username;
		if (subtype === 1) {
			username = encodeUTF8(this._getCredentials().username).slice(0, 255);
		} else {
			username = "";
		}
		const password = encodeUTF8(this._getCredentials().password).slice(0, 255);
		const credentials = new Uint8Array(username.length + password.length + 2);
		credentials[0] = username.length;
		credentials[username.length + 1] = password.length;
		for (let i = 0; i < username.length; i++) {
			credentials[i + 1] = username.charCodeAt(i);
		}
		for (let i = 0; i < password.length; i++) {
			credentials[username.length + 2 + i] = password.charCodeAt(i);
		}
		this._sock.sQpushBytes(await clientCipher.d(credentials));
		this._sock.flush();
	}
	get hasStarted() {
		return this._hasStarted;
	}
	set hasStarted(s) {
		this._hasStarted = s;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class RawDecoder {
	constructor() {
		this._lines = 0;
	}
	decodeRect(x, y, width, height, sock, display, depth) {
		if (width === 0 || height === 0) {
			return true;
		}
		if (this._lines === 0) {
			this._lines = height;
		}
		const pixelSize = depth == 8 ? 1 : 4;
		const bytesPerLine = width * pixelSize;
		while (this._lines > 0) {
			if (sock.rQwait("RAW", bytesPerLine)) {
				return false;
			}
			const curY = y + (height - this._lines);
			let data = sock.rQshiftBytes(bytesPerLine, false);
			// Convert data if needed
			if (depth == 8) {
				const newdata = new Uint8Array(width * 4);
				for (let i = 0; i < width; i++) {
					newdata[i * 4 + 0] = (data[i] >> 0 & 3) * 255 / 3;
					newdata[i * 4 + 1] = (data[i] >> 2 & 3) * 255 / 3;
					newdata[i * 4 + 2] = (data[i] >> 4 & 3) * 255 / 3;
					newdata[i * 4 + 3] = 255;
				}
				data = newdata;
			}
			// Max sure the image is fully opaque
			for (let i = 0; i < width; i++) {
				data[i * 4 + 3] = 255;
			}
			display.blitImage(x, curY, width, 1, data, 0);
			this._lines--;
		}
		return true;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class CopyRectDecoder {
	decodeRect(x, y, width, height, sock, display) {
		if (sock.rQwait("COPYRECT", 4)) {
			return false;
		}
		let deltaX = sock.rQshift16();
		let deltaY = sock.rQshift16();
		if (width === 0 || height === 0) {
			return true;
		}
		display.copyImage(deltaX, deltaY, x, y, width, height);
		return true;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class RREDecoder {
	constructor() {
		this._subrects = 0;
	}
	decodeRect(x, y, width, height, sock, display) {
		if (this._subrects === 0) {
			if (sock.rQwait("RRE", 8)) {
				return false;
			}
			this._subrects = sock.rQshift32();
			let color = sock.rQshiftBytes(4);
			display.fillRect(x, y, width, height, color);
		}
		while (this._subrects > 0) {
			if (sock.rQwait("RRE", 12)) {
				return false;
			}
			let color = sock.rQshiftBytes(4);
			let sx = sock.rQshift16();
			let sy = sock.rQshift16();
			let swidth = sock.rQshift16();
			let sheight = sock.rQshift16();
			display.fillRect(x + sx, y + sy, swidth, sheight, color);
			this._subrects--;
		}
		return true;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class HextileDecoder {
	constructor() {
		this._tiles = 0;
		this._lastsubencoding = 0;
		this._tileBuffer = new Uint8Array(1024);
	}
	decodeRect(x, y, width, height, sock, display) {
		if (this._tiles === 0) {
			this._tilesX = Math.ceil(width / 16);
			this._tilesY = Math.ceil(height / 16);
			this._totalTiles = this._tilesX * this._tilesY;
			this._tiles = this._totalTiles;
		}
		while (this._tiles > 0) {
			let bytes = 1;
			if (sock.rQwait("HEXTILE", 1)) {
				return false;
			}
			let subencoding = sock.rQpeek8();
			if (subencoding > 30) {
				throw new Error("Illegal hextile subencoding (subencoding: " + subencoding + ")");
			}
			const currTile = this._totalTiles - this._tiles;
			const tileX = currTile % this._tilesX;
			const tileY = Math.floor(currTile / this._tilesX);
			const tx = x + tileX * 16;
			const ty = y + tileY * 16;
			const tw = Math.min(16, x + width - tx);
			const th = Math.min(16, y + height - ty);
			// Figure out how much we are expecting
			if (subencoding & 1) {
				bytes += tw * th * 4;
			} else {
				if (subencoding & 2) {
					bytes += 4;
				}
				if (subencoding & 4) {
					bytes += 4;
				}
				if (subencoding & 8) {
					bytes++;
					if (sock.rQwait("HEXTILE", bytes)) {
						return false;
					}
					let subrects = sock.rQpeekBytes(bytes).at(-1);
					if (subencoding & 16) {
						bytes += subrects * 6;
					} else {
						bytes += subrects * 2;
					}
				}
			}
			if (sock.rQwait("HEXTILE", bytes)) {
				return false;
			}
			// We know the encoding and have a whole tile
			sock.rQshift8();
			if (subencoding === 0) {
				if (this._lastsubencoding & 1) {
					// Weird: ignore blanks are RAW
					Debug("     Ignoring blank after RAW");
				} else {
					display.fillRect(tx, ty, tw, th, this._background);
				}
			} else if (subencoding & 1) {
				let pixels = tw * th;
				let data = sock.rQshiftBytes(pixels * 4, false);
				// Max sure the image is fully opaque
				for (let i = 0; i < pixels; i++) {
					data[i * 4 + 3] = 255;
				}
				display.blitImage(tx, ty, tw, th, data, 0);
			} else {
				if (subencoding & 2) {
					this._background = new Uint8Array(sock.rQshiftBytes(4));
				}
				if (subencoding & 4) {
					this._foreground = new Uint8Array(sock.rQshiftBytes(4));
				}
				this._startTile(tx, ty, tw, th, this._background);
				if (subencoding & 8) {
					let subrects = sock.rQshift8();
					for (let s = 0; s < subrects; s++) {
						let color;
						if (subencoding & 16) {
							color = sock.rQshiftBytes(4);
						} else {
							color = this._foreground;
						}
						const xy = sock.rQshift8();
						const sx = xy >> 4;
						const sy = xy & 15;
						const wh = sock.rQshift8();
						const sw = (wh >> 4) + 1;
						const sh = (wh & 15) + 1;
						this._subTile(sx, sy, sw, sh, color);
					}
				}
				this._finishTile(display);
			}
			this._lastsubencoding = subencoding;
			this._tiles--;
		}
		return true;
	}
	// start updating a tile
	_startTile(x, y, width, height, color) {
		this._tileX = x;
		this._tileY = y;
		this._tileW = width;
		this._tileH = height;
		const red = color[0];
		const green = color[1];
		const blue = color[2];
		const data = this._tileBuffer;
		for (let i = 0; i < width * height * 4; i += 4) {
			data[i] = red;
			data[i + 1] = green;
			data[i + 2] = blue;
			data[i + 3] = 255;
		}
	}
	// update sub-rectangle of the current tile
	_subTile(x, y, w, h, color) {
		const red = color[0];
		const green = color[1];
		const blue = color[2];
		const xend = x + w;
		const yend = y + h;
		const data = this._tileBuffer;
		const width = this._tileW;
		for (let j = y; j < yend; j++) {
			for (let i = x; i < xend; i++) {
				const p = (i + j * width) * 4;
				data[p] = red;
				data[p + 1] = green;
				data[p + 2] = blue;
				data[p + 3] = 255;
			}
		}
	}
	// draw the current tile to the screen
	_finishTile(display) {
		display.blitImage(this._tileX, this._tileY, this._tileW, this._tileH, this._tileBuffer, 0);
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2024 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class ZlibDecoder {
	constructor() {
		this._zlib = new Inflate();
		this._length = 0;
	}
	decodeRect(x, y, width, height, sock, display) {
		if (width === 0 || height === 0) {
			return true;
		}
		if (this._length === 0) {
			if (sock.rQwait("ZLIB", 4)) {
				return false;
			}
			this._length = sock.rQshift32();
		}
		if (sock.rQwait("ZLIB", this._length)) {
			return false;
		}
		let data = new Uint8Array(sock.rQshiftBytes(this._length, false));
		this._length = 0;
		this._zlib.setInput(data);
		data = this._zlib.inflate(width * height * 4);
		this._zlib.setInput(null);
		// Max sure the image is fully opaque
		for (let i = 0; i < width * height; i++) {
			data[i * 4 + 3] = 255;
		}
		display.blitImage(x, y, width, height, data, 0);
		return true;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* (c) 2012 Michael Tinglof, Joe Balaz, Les Piech (Mercuri.ca)
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class TightDecoder {
	constructor() {
		this._ctl = null;
		this._filter = null;
		this._numColors = 0;
		this._palette = new Uint8Array(1024);
		this._len = 0;
		this._zlibs = [];
		for (let i = 0; i < 4; i++) {
			this._zlibs[i] = new Inflate();
		}
	}
	decodeRect(x, y, width, height, sock, display, depth) {
		if (this._ctl === null) {
			if (sock.rQwait("TIGHT compression-control", 1)) {
				return false;
			}
			this._ctl = sock.rQshift8();
			// Reset streams if the server requests it
			for (let i = 0; i < 4; i++) {
				if (this._ctl >> i & 1) {
					this._zlibs[i].reset();
					Info("Reset zlib stream " + i);
				}
			}
			// Figure out filter
			this._ctl = this._ctl >> 4;
		}
		let ret;
		if (this._ctl === 8) {
			ret = this._fillRect(x, y, width, height, sock, display, depth);
		} else if (this._ctl === 9) {
			ret = this._jpegRect(x, y, width, height, sock, display, depth);
		} else if (this._ctl === 10) {
			ret = this._pngRect(x, y, width, height, sock, display, depth);
		} else if ((this._ctl & 8) == 0) {
			ret = this._basicRect(this._ctl, x, y, width, height, sock, display, depth);
		} else {
			throw new Error("Illegal tight compression received (ctl: " + this._ctl + ")");
		}
		if (ret) {
			this._ctl = null;
		}
		return ret;
	}
	_fillRect(x, y, width, height, sock, display) {
		if (sock.rQwait("TIGHT", 3)) {
			return false;
		}
		let pixel = sock.rQshiftBytes(3);
		display.fillRect(x, y, width, height, pixel, false);
		return true;
	}
	_jpegRect(x, y, width, height, sock, display) {
		let data = this._readData(sock);
		if (data === null) {
			return false;
		}
		display.imageRect(x, y, width, height, "image/jpeg", data);
		return true;
	}
	_pngRect() {
		throw new Error("PNG received in standard Tight rect");
	}
	_basicRect(ctl, x, y, width, height, sock, display, depth) {
		if (this._filter === null) {
			if (ctl & 4) {
				if (sock.rQwait("TIGHT", 1)) {
					return false;
				}
				this._filter = sock.rQshift8();
			} else {
				// Implicit CopyFilter
				this._filter = 0;
			}
		}
		let streamId = ctl & 3;
		let ret;
		switch (this._filter) {
			case 0:
				ret = this._copyFilter(streamId, x, y, width, height, sock, display, depth);
				break;
			case 1:
				ret = this._paletteFilter(streamId, x, y, width, height, sock, display, depth);
				break;
			case 2:
				ret = this._gradientFilter(streamId, x, y, width, height, sock, display, depth);
				break;
			default: throw new Error("Illegal tight filter received (ctl: " + this._filter + ")");
		}
		if (ret) {
			this._filter = null;
		}
		return ret;
	}
	_copyFilter(streamId, x, y, width, height, sock, display) {
		const uncompressedSize = width * height * 3;
		let data;
		if (uncompressedSize === 0) {
			return true;
		}
		if (uncompressedSize < 12) {
			if (sock.rQwait("TIGHT", uncompressedSize)) {
				return false;
			}
			data = sock.rQshiftBytes(uncompressedSize);
		} else {
			data = this._readData(sock);
			if (data === null) {
				return false;
			}
			this._zlibs[streamId].setInput(data);
			data = this._zlibs[streamId].inflate(uncompressedSize);
			this._zlibs[streamId].setInput(null);
		}
		let rgbx = new Uint8Array(width * height * 4);
		for (let i = 0, j = 0; i < width * height * 4; i += 4, j += 3) {
			rgbx[i] = data[j];
			rgbx[i + 1] = data[j + 1];
			rgbx[i + 2] = data[j + 2];
			rgbx[i + 3] = 255;
		}
		display.blitImage(x, y, width, height, rgbx, 0, false);
		return true;
	}
	_paletteFilter(streamId, x, y, width, height, sock, display) {
		if (this._numColors === 0) {
			if (sock.rQwait("TIGHT palette", 1)) {
				return false;
			}
			const numColors = sock.rQpeek8() + 1;
			const paletteSize = numColors * 3;
			if (sock.rQwait("TIGHT palette", 1 + paletteSize)) {
				return false;
			}
			this._numColors = numColors;
			sock.rQskipBytes(1);
			sock.rQshiftTo(this._palette, paletteSize);
		}
		const bpp = this._numColors <= 2 ? 1 : 8;
		const rowSize = Math.floor((width * bpp + 7) / 8);
		const uncompressedSize = rowSize * height;
		let data;
		if (uncompressedSize === 0) {
			return true;
		}
		if (uncompressedSize < 12) {
			if (sock.rQwait("TIGHT", uncompressedSize)) {
				return false;
			}
			data = sock.rQshiftBytes(uncompressedSize);
		} else {
			data = this._readData(sock);
			if (data === null) {
				return false;
			}
			this._zlibs[streamId].setInput(data);
			data = this._zlibs[streamId].inflate(uncompressedSize);
			this._zlibs[streamId].setInput(null);
		}
		// Convert indexed (palette based) image data to RGB
		if (this._numColors == 2) {
			this._monoRect(x, y, width, height, data, this._palette, display);
		} else {
			this._paletteRect(x, y, width, height, data, this._palette, display);
		}
		this._numColors = 0;
		return true;
	}
	_monoRect(x, y, width, height, data, palette, display) {
		// Convert indexed (palette based) image data to RGB
		// TODO: reduce number of calculations inside loop
		const dest = this._getScratchBuffer(width * height * 4);
		const w = Math.floor((width + 7) / 8);
		const w1 = Math.floor(width / 8);
		for (let y = 0; y < height; y++) {
			let dp, sp, x;
			for (x = 0; x < w1; x++) {
				for (let b = 7; b >= 0; b--) {
					dp = (y * width + x * 8 + 7 - b) * 4;
					sp = (data[y * w + x] >> b & 1) * 3;
					dest[dp] = palette[sp];
					dest[dp + 1] = palette[sp + 1];
					dest[dp + 2] = palette[sp + 2];
					dest[dp + 3] = 255;
				}
			}
			for (let b = 7; b >= 8 - width % 8; b--) {
				dp = (y * width + x * 8 + 7 - b) * 4;
				sp = (data[y * w + x] >> b & 1) * 3;
				dest[dp] = palette[sp];
				dest[dp + 1] = palette[sp + 1];
				dest[dp + 2] = palette[sp + 2];
				dest[dp + 3] = 255;
			}
		}
		display.blitImage(x, y, width, height, dest, 0, false);
	}
	_paletteRect(x, y, width, height, data, palette, display) {
		// Convert indexed (palette based) image data to RGB
		const dest = this._getScratchBuffer(width * height * 4);
		const total = width * height * 4;
		for (let i = 0, j = 0; i < total; i += 4, j++) {
			const sp = data[j] * 3;
			dest[i] = palette[sp];
			dest[i + 1] = palette[sp + 1];
			dest[i + 2] = palette[sp + 2];
			dest[i + 3] = 255;
		}
		display.blitImage(x, y, width, height, dest, 0, false);
	}
	_gradientFilter(streamId, x, y, width, height, sock, display) {
		// assume the TPIXEL is 3 bytes long
		const uncompressedSize = width * height * 3;
		let data;
		if (uncompressedSize === 0) {
			return true;
		}
		if (uncompressedSize < 12) {
			if (sock.rQwait("TIGHT", uncompressedSize)) {
				return false;
			}
			data = sock.rQshiftBytes(uncompressedSize);
		} else {
			data = this._readData(sock);
			if (data === null) {
				return false;
			}
			this._zlibs[streamId].setInput(data);
			data = this._zlibs[streamId].inflate(uncompressedSize);
			this._zlibs[streamId].setInput(null);
		}
		let rgbx = new Uint8Array(4 * width * height);
		let rgbxIndex = 0, dataIndex = 0;
		let left = new Uint8Array(3);
		for (let x = 0; x < width; x++) {
			for (let c = 0; c < 3; c++) {
				const prediction = left[c];
				const value = data[dataIndex++] + prediction;
				rgbx[rgbxIndex++] = value;
				left[c] = value;
			}
			rgbx[rgbxIndex++] = 255;
		}
		let upperIndex = 0;
		let upper = new Uint8Array(3), upperleft = new Uint8Array(3);
		for (let y = 1; y < height; y++) {
			left.fill(0);
			upperleft.fill(0);
			for (let x = 0; x < width; x++) {
				for (let c = 0; c < 3; c++) {
					upper[c] = rgbx[upperIndex++];
					let prediction = left[c] + upper[c] - upperleft[c];
					if (prediction < 0) {
						prediction = 0;
					} else if (prediction > 255) {
						prediction = 255;
					}
					const value = data[dataIndex++] + prediction;
					rgbx[rgbxIndex++] = value;
					upperleft[c] = upper[c];
					left[c] = value;
				}
				rgbx[rgbxIndex++] = 255;
				upperIndex++;
			}
		}
		display.blitImage(x, y, width, height, rgbx, 0, false);
		return true;
	}
	_readData(sock) {
		if (this._len === 0) {
			if (sock.rQwait("TIGHT", 3)) {
				return null;
			}
			let byte;
			byte = sock.rQshift8();
			this._len = byte & 127;
			if (byte & 128) {
				byte = sock.rQshift8();
				this._len |= (byte & 127) << 7;
				if (byte & 128) {
					byte = sock.rQshift8();
					this._len |= byte << 14;
				}
			}
		}
		if (sock.rQwait("TIGHT", this._len)) {
			return null;
		}
		let data = sock.rQshiftBytes(this._len, false);
		this._len = 0;
		return data;
	}
	_getScratchBuffer(size) {
		if (!this._scratchBuffer || this._scratchBuffer.length < size) {
			this._scratchBuffer = new Uint8Array(size);
		}
		return this._scratchBuffer;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class TightPNGDecoder extends TightDecoder {
	_pngRect(x, y, width, height, sock, display) {
		let data = this._readData(sock);
		if (data === null) {
			return false;
		}
		display.imageRect(x, y, width, height, "image/png", data);
		return true;
	}
	_basicRect() {
		throw new Error("BasicCompression received in TightPNG rect");
	}
}
class ZRLEDecoder {
	constructor() {
		this._length = 0;
		this._inflator = new Inflate();
		this._pixelBuffer = new Uint8Array(16384);
		this._tileBuffer = new Uint8Array(16384);
	}
	decodeRect(x, y, width, height, sock, display) {
		if (this._length === 0) {
			if (sock.rQwait("ZLib data length", 4)) {
				return false;
			}
			this._length = sock.rQshift32();
		}
		if (sock.rQwait("Zlib data", this._length)) {
			return false;
		}
		const data = sock.rQshiftBytes(this._length, false);
		this._inflator.setInput(data);
		for (let ty = y; ty < y + height; ty += 64) {
			let th = Math.min(64, y + height - ty);
			for (let tx = x; tx < x + width; tx += 64) {
				let tw = Math.min(64, x + width - tx);
				const tileSize = tw * th;
				const subencoding = this._inflator.inflate(1)[0];
				if (subencoding === 0) {
					// raw data
					const data = this._readPixels(tileSize);
					display.blitImage(tx, ty, tw, th, data, 0, false);
				} else if (subencoding === 1) {
					// solid
					const background = this._readPixels(1);
					display.fillRect(tx, ty, tw, th, [
						background[0],
						background[1],
						background[2]
					]);
				} else if (subencoding >= 2 && subencoding <= 16) {
					const data = this._decodePaletteTile(subencoding, tileSize, tw, th);
					display.blitImage(tx, ty, tw, th, data, 0, false);
				} else if (subencoding === 128) {
					const data = this._decodeRLETile(tileSize);
					display.blitImage(tx, ty, tw, th, data, 0, false);
				} else if (subencoding >= 130 && subencoding <= 255) {
					const data = this._decodeRLEPaletteTile(subencoding - 128, tileSize);
					display.blitImage(tx, ty, tw, th, data, 0, false);
				} else {
					throw new Error("Unknown subencoding: " + subencoding);
				}
			}
		}
		this._length = 0;
		return true;
	}
	_getBitsPerPixelInPalette(paletteSize) {
		if (paletteSize <= 2) {
			return 1;
		} else if (paletteSize <= 4) {
			return 2;
		} else if (paletteSize <= 16) {
			return 4;
		}
	}
	_readPixels(pixels) {
		let data = this._pixelBuffer;
		const buffer = this._inflator.inflate(3 * pixels);
		for (let i = 0, j = 0; i < pixels * 4; i += 4, j += 3) {
			data[i] = buffer[j];
			data[i + 1] = buffer[j + 1];
			data[i + 2] = buffer[j + 2];
			data[i + 3] = 255;
		}
		return data;
	}
	_decodePaletteTile(paletteSize, __unused_8080, tilew, tileh) {
		const data = this._tileBuffer;
		const palette = this._readPixels(paletteSize);
		const bitsPerPixel = this._getBitsPerPixelInPalette(paletteSize);
		const mask = (1 << bitsPerPixel) - 1;
		let offset = 0;
		let encoded = this._inflator.inflate(1)[0];
		for (let y = 0; y < tileh; y++) {
			let shift = 8 - bitsPerPixel;
			for (let x = 0; x < tilew; x++) {
				if (shift < 0) {
					shift = 8 - bitsPerPixel;
					encoded = this._inflator.inflate(1)[0];
				}
				let indexInPalette = encoded >> shift & mask;
				data[offset] = palette[indexInPalette * 4];
				data[offset + 1] = palette[indexInPalette * 4 + 1];
				data[offset + 2] = palette[indexInPalette * 4 + 2];
				data[offset + 3] = palette[indexInPalette * 4 + 3];
				offset += 4;
				shift -= bitsPerPixel;
			}
			if (shift < 8 - bitsPerPixel && y < tileh - 1) {
				encoded = this._inflator.inflate(1)[0];
			}
		}
		return data;
	}
	_decodeRLETile(tileSize) {
		const data = this._tileBuffer;
		let i = 0;
		while (i < tileSize) {
			const pixel = this._readPixels(1);
			const length = this._readRLELength();
			for (let j = 0; j < length; j++) {
				data[i * 4] = pixel[0];
				data[i * 4 + 1] = pixel[1];
				data[i * 4 + 2] = pixel[2];
				data[i * 4 + 3] = pixel[3];
				i++;
			}
		}
		return data;
	}
	_decodeRLEPaletteTile(paletteSize, tileSize) {
		const data = this._tileBuffer;
		// palette
		const palette = this._readPixels(paletteSize);
		let offset = 0;
		while (offset < tileSize) {
			let indexInPalette = this._inflator.inflate(1)[0];
			let length = 1;
			if (indexInPalette >= 128) {
				indexInPalette -= 128;
				length = this._readRLELength();
			}
			if (indexInPalette > paletteSize) {
				throw new Error("Too big index in palette: " + indexInPalette + ", palette size: " + paletteSize);
			}
			if (offset + length > tileSize) {
				throw new Error("Too big rle length in palette mode: " + length + ", allowed length is: " + (tileSize - offset));
			}
			for (let j = 0; j < length; j++) {
				data[offset * 4] = palette[indexInPalette * 4];
				data[offset * 4 + 1] = palette[indexInPalette * 4 + 1];
				data[offset * 4 + 2] = palette[indexInPalette * 4 + 2];
				data[offset * 4 + 3] = palette[indexInPalette * 4 + 3];
				offset++;
			}
		}
		return data;
	}
	_readRLELength() {
		let length = 0;
		let current;
		do {
			current = this._inflator.inflate(1)[0];
			length += current;
		} while (current === 255);
		return length + 1;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class JPEGDecoder {
	constructor() {
		// RealVNC will reuse the quantization tables
		// and Huffman tables, so we need to cache them.
		this._cachedQuantTables = [];
		this._cachedHuffmanTables = [];
		this._segments = [];
	}
	decodeRect(x, y, width, height, sock, display) {
		// A rect of JPEG encodings is simply a JPEG file
		while (true) {
			let segment = this._readSegment(sock);
			if (segment === null) {
				return false;
			}
			this._segments.push(segment);
			// End of image?
			if (segment[1] === 217) {
				break;
			}
		}
		let huffmanTables = [];
		let quantTables = [];
		for (let segment of this._segments) {
			let type = segment[1];
			if (type === 196) {
				// Huffman tables
				huffmanTables.push(segment);
			} else if (type === 219) {
				// Quantization tables
				quantTables.push(segment);
			}
		}
		const sofIndex = this._segments.findIndex((x) => x[1] == 192 || x[1] == 194);
		if (sofIndex == -1) {
			throw new Error("Illegal JPEG image without SOF");
		}
		if (quantTables.length === 0) {
			this._segments.splice(sofIndex + 1, 0, ...this._cachedQuantTables);
		}
		if (huffmanTables.length === 0) {
			this._segments.splice(sofIndex + 1, 0, ...this._cachedHuffmanTables);
		}
		let length = 0;
		for (let segment of this._segments) {
			length += segment.length;
		}
		let data = new Uint8Array(length);
		length = 0;
		for (let segment of this._segments) {
			data.set(segment, length);
			length += segment.length;
		}
		display.imageRect(x, y, width, height, "image/jpeg", data);
		if (huffmanTables.length !== 0) {
			this._cachedHuffmanTables = huffmanTables;
		}
		if (quantTables.length !== 0) {
			this._cachedQuantTables = quantTables;
		}
		this._segments = [];
		return true;
	}
	_readSegment(sock) {
		if (sock.rQwait("JPEG", 2)) {
			return null;
		}
		let marker = sock.rQshift8();
		if (marker != 255) {
			throw new Error("Illegal JPEG marker received (byte: " + marker + ")");
		}
		let type = sock.rQshift8();
		if (type >= 208 && type <= 217 || type == 1) {
			// No length after marker
			return new Uint8Array([marker, type]);
		}
		if (sock.rQwait("JPEG", 2, 2)) {
			return null;
		}
		let length = sock.rQshift16();
		if (length < 2) {
			throw new Error("Illegal JPEG length received (length: " + length + ")");
		}
		if (sock.rQwait("JPEG", length - 2, 4)) {
			return null;
		}
		let extra = 0;
		if (type === 218) {
			// start of scan
			if (sock.rQwait("JPEG", length - 2 + 2, 4)) {
				return null;
			}
			let len = sock.rQlen();
			let data = sock.rQpeekBytes(len, false);
			while (true) {
				let idx = data.indexOf(255, length - 2 + extra);
				if (idx === -1) {
					sock.rQwait("JPEG", Infinity, 4);
					return null;
				}
				if (idx === len - 1) {
					sock.rQwait("JPEG", Infinity, 4);
					return null;
				}
				if (data.at(idx + 1) === 0 || data.at(idx + 1) >= 208 && data.at(idx + 1) <= 215) {
					extra = idx + 2 - (length - 2);
					continue;
				}
				extra = idx - (length - 2);
				break;
			}
		}
		let segment = new Uint8Array(2 + length + extra);
		segment[0] = marker;
		segment[1] = type;
		segment[2] = length >> 8;
		segment[3] = length;
		segment.set(sock.rQshiftBytes(length - 2 + extra, false), 4);
		return segment;
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2024 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*
*/
class H264Parser {
	constructor(data) {
		this.a = data;
		this.b = 0;
		this.c = null;
		this.d = null;
		this.e = null;
	}
	f(index) {
		let data = this.a;
		if (data[index + 0] == 0 && data[index + 1] == 0 && data[index + 2] == 0 && data[index + 3] == 1) {
			return 4;
		}
		if (data[index + 0] == 0 && data[index + 1] == 0 && data[index + 2] == 1) {
			return 3;
		}
		return 0;
	}
	g(index) {
		let data = this.a;
		for (let i = index; i < data.length; ++i) {
			if (this.f(i) != 0) {
				return i;
			}
		}
		return -1;
	}
	h(index) {
		this.c = this.a[index];
		this.d = this.a[index + 1];
		this.e = this.a[index + 2];
	}
	i(index) {
		const firstByte = this.a[index];
		if (firstByte & 128) {
			throw new Error("H264 parsing sanity check failed, forbidden zero bit is set");
		}
		const unitType = firstByte & 31;
		switch (unitType) {
			case 1: return { a: true };
			case 5: return {
				a: true,
				b: true
			};
			case 6: return {};
			case 7:
				this.h(index + 1);
				return {};
			case 8: return {};
			default:
				Warn("Unhandled unit type: ", unitType);
				break;
		}
		return {};
	}
	j() {
		const startIndex = this.b;
		let isKey = false;
		while (this.b < this.a.length) {
			const startSequenceLen = this.f(this.b);
			if (startSequenceLen == 0) {
				throw new Error("Invalid start sequence in bit stream");
			}
			const { a: slice, b: key } = this.i(this.b + startSequenceLen);
			let nextIndex = this.g(this.b + startSequenceLen);
			if (nextIndex == -1) {
				this.b = this.a.length;
			} else {
				this.b = nextIndex;
			}
			if (key) {
				isKey = true;
			}
			if (slice) {
				break;
			}
		}
		if (startIndex === this.b) {
			return null;
		}
		return {
			frame: this.a.subarray(startIndex, this.b),
			key: isKey
		};
	}
}
class H264Context {
	constructor(width, height) {
		this.lastUsed = 0;
		this._width = width;
		this._height = height;
		this._profileIdc = null;
		this._constraintSet = null;
		this._levelIdc = null;
		this._decoder = null;
		this._pendingFrames = [];
	}
	_handleFrame(frame) {
		let pending = this._pendingFrames.shift();
		if (pending === void 0) {
			throw new Error("Pending frame queue empty when receiving frame from decoder");
		}
		if (pending.timestamp != frame.timestamp) {
			throw new Error("Video frame timestamp mismatch. Expected " + frame.timestamp + " but but got " + pending.timestamp);
		}
		pending.frame = frame;
		pending.ready = true;
		pending.resolve();
		if (!pending.keep) {
			frame.close();
		}
	}
	_handleError(e) {
		throw new Error("Failed to decode frame: " + e.message);
	}
	_configureDecoder(profileIdc, constraintSet, levelIdc) {
		if (this._decoder === null || this._decoder.state === "closed") {
			this._decoder = new VideoDecoder({
				output: (frame) => this._handleFrame(frame),
				error: (e) => this._handleError(e)
			});
		}
		const codec = "avc1." + profileIdc.toString(16).padStart(2, "0") + constraintSet.toString(16).padStart(2, "0") + levelIdc.toString(16).padStart(2, "0");
		this._decoder.configure({
			codec,
			codedWidth: this._width,
			codedHeight: this._height,
			optimizeForLatency: true
		});
	}
	_preparePendingFrame(timestamp) {
		let pending = {
			timestamp,
			resolve: null,
			frame: null,
			ready: false,
			keep: false
		};
		pending.promise = new Promise((resolve) => {
			pending.resolve = resolve;
		});
		this._pendingFrames.push(pending);
		return pending;
	}
	decode(payload) {
		let parser = new H264Parser(payload);
		let result = null;
		// Ideally, this timestamp should come from the server, but we'll just
		// approximate it instead.
		let timestamp = Math.round(window.performance.now() * 1e3);
		while (true) {
			let encodedFrame = parser.j();
			if (encodedFrame === null) {
				break;
			}
			if (parser.c !== null) {
				self._profileIdc = parser.c;
				self._constraintSet = parser.d;
				self._levelIdc = parser.e;
			}
			if (this._decoder === null || this._decoder.state !== "configured") {
				if (!encodedFrame.key) {
					Warn("Missing key frame. Can't decode until one arrives");
					continue;
				}
				if (self._profileIdc === null) {
					Warn("Cannot config decoder. Have not received SPS and PPS yet.");
					continue;
				}
				this._configureDecoder(self._profileIdc, self._constraintSet, self._levelIdc);
			}
			result = this._preparePendingFrame(timestamp);
			const chunk = new EncodedVideoChunk({
				timestamp,
				type: encodedFrame.key ? "key" : "delta",
				data: encodedFrame.frame
			});
			try {
				this._decoder.decode(chunk);
			} catch (e) {
				Warn("Failed to decode:", e);
			}
		}
		// We only keep last frame of each payload
		if (result !== null) {
			result.keep = true;
		}
		return result;
	}
}
class H264Decoder {
	constructor() {
		this._tick = 0;
		this._contexts = {};
	}
	_contextId(x, y, width, height) {
		return [
			x,
			y,
			width,
			height
		].join(",");
	}
	_findOldestContextId() {
		let oldestTick = Number.MAX_VALUE;
		let oldestKey = void 0;
		for (const [key, value] of Object.entries(this._contexts)) {
			if (value.lastUsed < oldestTick) {
				oldestTick = value.lastUsed;
				oldestKey = key;
			}
		}
		return oldestKey;
	}
	_createContext(x, y, width, height) {
		if (Object.keys(this._contexts).length >= 64) {
			let oldestContextId = this._findOldestContextId();
			delete this._contexts[oldestContextId];
		}
		let context = new H264Context(width, height);
		this._contexts[this._contextId(x, y, width, height)] = context;
		return context;
	}
	_getContext(x, y, width, height) {
		let context = this._contexts[this._contextId(x, y, width, height)];
		return context !== void 0 ? context : this._createContext(x, y, width, height);
	}
	_resetContext(x, y, width, height) {
		delete this._contexts[this._contextId(x, y, width, height)];
	}
	_resetAllContexts() {
		this._contexts = {};
	}
	decodeRect(x, y, width, height, sock, display) {
		if (sock.rQwait("h264 header", 8)) {
			return false;
		}
		const length = sock.rQshift32();
		const flags = sock.rQshift32();
		if (sock.rQwait("h264 payload", length, 8)) {
			return false;
		}
		if (flags & 2) {
			this._resetAllContexts();
		} else if (flags & 1) {
			this._resetContext(x, y, width, height);
		}
		let context = this._getContext(x, y, width, height);
		context.lastUsed = this._tick++;
		if (length !== 0) {
			let payload = sock.rQshiftBytes(length, false);
			let frame = context.decode(payload);
			if (frame !== null) {
				display.videoFrame(x, y, width, height, frame);
			}
		}
		return true;
	}
}
const DEFAULT_BACKGROUND = "rgb(40, 40, 40)";
/*eslint-enable */
// Extended clipboard pseudo-encoding actions
const extendedClipboardActionCaps = 1 << 24;
const extendedClipboardActionRequest = 1 << 25;
const extendedClipboardActionPeek = 1 << 26;
const extendedClipboardActionNotify = 1 << 27;
const extendedClipboardActionProvide = 1 << 28;
class RFB extends EventTargetMixin {
	constructor(target, urlOrChannel, options) {
		if (!target) {
			throw new Error("Must specify target");
		}
		if (!urlOrChannel) {
			throw new Error("Must specify URL, WebSocket or RTCDataChannel");
		}
		// We rely on modern APIs which might not be available in an
		// insecure context
		if (!window.isSecureContext) {
			Error$1("noVNC requires a secure context (TLS). Expect crashes!");
		}
		super();
		this._target = target;
		if (typeof urlOrChannel === "string") {
			this._url = urlOrChannel;
		} else {
			this._url = null;
			this._rawChannel = urlOrChannel;
		}
		// Connection details
		options = options;
		this._rfbCredentials = options.credentials;
		this._shared = "shared" in options ? !!options.shared : true;
		this._repeaterID = options.repeaterID || "";
		this._wsProtocols = options.wsProtocols || [];
		// Internal state
		this._rfbConnectionState = "";
		this._rfbInitState = "";
		this._rfbAuthScheme = -1;
		this._rfbCleanDisconnect = true;
		this._rfbRSAAESAuthenticationState = null;
		// Server capabilities
		this._rfbVersion = 0;
		this._rfbMaxVersion = 3.8;
		this._rfbTightVNC = false;
		this._rfbVeNCryptState = 0;
		this._rfbXvpVer = 0;
		this._fbWidth = 0;
		this._fbHeight = 0;
		this._fbName = "";
		this._capabilities = { power: false };
		this._supportsFence = false;
		this._supportsContinuousUpdates = false;
		this._enabledContinuousUpdates = false;
		this._supportsSetDesktopSize = false;
		this._screenID = 0;
		this._screenFlags = 0;
		this._pendingRemoteResize = false;
		this._lastResize = 0;
		this._qemuExtKeyEventSupported = false;
		this._extendedPointerEventSupported = false;
		this._clipboardText = null;
		this._clipboardServerCapabilitiesActions = {};
		this._clipboardServerCapabilitiesFormats = {};
		// Internal objects
		this._sock = null;
		this._display = null;
		this._flushing = false;
		this._asyncClipboard = null;
		this._keyboard = null;
		this._gestures = null;
		this._resizeObserver = null;
		// Timers
		this._disconnTimer = null;
		this._resizeTimeout = null;
		this._mouseMoveTimer = null;
		// Decoder states
		this._decoders = {};
		this._FBU = {
			rects: 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			encoding: null
		};
		// Mouse state
		this._mousePos = {};
		this._mouseButtonMask = 0;
		this._mouseLastMoveTime = 0;
		this._viewportDragging = false;
		this._viewportDragPos = {};
		this._viewportHasMoved = false;
		this._accumulatedWheelDeltaX = 0;
		this._accumulatedWheelDeltaY = 0;
		// Gesture state
		this._gestureLastTapTime = null;
		this._gestureFirstDoubleTapEv = null;
		this._gestureLastMagnitudeX = 0;
		this._gestureLastMagnitudeY = 0;
		// Bound event handlers
		this._eventHandlers = {
			focusCanvas: this._focusCanvas.bind(this),
			handleResize: this._handleResize.bind(this),
			handleMouse: this._handleMouse.bind(this),
			handleWheel: this._handleWheel.bind(this),
			handleGesture: this._handleGesture.bind(this),
			handleRSAAESCredentialsRequired: this._handleRSAAESCredentialsRequired.bind(this),
			handleRSAAESServerVerification: this._handleRSAAESServerVerification.bind(this)
		};
		// main setup
		Debug(">> RFB.constructor");
		// Create DOM elements
		this._screen = document.createElement("div");
		this._screen.style.display = "flex";
		this._screen.style.width = "100%";
		this._screen.style.height = "100%";
		this._screen.style.overflow = "auto";
		this._screen.style.background = DEFAULT_BACKGROUND;
		this._canvas = document.createElement("canvas");
		this._canvas.style.margin = "auto";
		// Some browsers add an outline on focus
		this._canvas.style.outline = "none";
		this._canvas.width = 0;
		this._canvas.height = 0;
		this._canvas.tabIndex = -1;
		this._screen.appendChild(this._canvas);
		// Cursor
		this._cursor = new Cursor();
		// XXX: TightVNC 2.8.11 sends no cursor at all until Windows changes
		// it. Result: no cursor at all until a window border or an edit field
		// is hit blindly. But there are also VNC servers that draw the cursor
		// in the framebuffer and don't send the empty local cursor. There is
		// no way to satisfy both sides.
		//
		// The spec is unclear on this "initial cursor" issue. Many other
		// viewers (TigerVNC, RealVNC, Remmina) display an arrow as the
		// initial cursor instead.
		this._cursorImage = RFB.a.a;
		// populate decoder array with objects
		this._decoders[0] = new RawDecoder();
		this._decoders[1] = new CopyRectDecoder();
		this._decoders[2] = new RREDecoder();
		this._decoders[5] = new HextileDecoder();
		this._decoders[6] = new ZlibDecoder();
		this._decoders[7] = new TightDecoder();
		this._decoders[-260] = new TightPNGDecoder();
		this._decoders[16] = new ZRLEDecoder();
		this._decoders[21] = new JPEGDecoder();
		this._decoders[50] = new H264Decoder();
		// NB: nothing that needs explicit teardown should be done
		// before this point, since this can throw an exception
		try {
			this._display = new Display(this._canvas);
		} catch (exc) {
			Error$1("Display exception: " + exc);
			throw exc;
		}
		this._asyncClipboard = new AsyncClipboard(this._canvas);
		this._asyncClipboard.onpaste = this.clipboardPasteFrom.bind(this);
		this._keyboard = new Keyboard(this._canvas);
		this._keyboard.onkeyevent = this._handleKeyEvent.bind(this);
		this._remoteCapsLock = null;
		this._remoteNumLock = null;
		this._gestures = new GestureHandler();
		this._sock = new Websock();
		this._sock.on("open", this._socketOpen.bind(this));
		this._sock.on("close", this._socketClose.bind(this));
		this._sock.on("message", this._handleMessage.bind(this));
		this._sock.on("error", this._socketError.bind(this));
		this._expectedClientWidth = null;
		this._expectedClientHeight = null;
		this._resizeObserver = new ResizeObserver(this._eventHandlers.handleResize);
		// All prepared, kick off the connection
		this._updateConnectionState("connecting");
		Debug("<< RFB.constructor");
		// ===== PROPERTIES =====
		this.dragViewport = false;
		this.focusOnClick = true;
		this._viewOnly = false;
		this._clipViewport = false;
		this._clippingViewport = false;
		this._scaleViewport = false;
		this._resizeSession = false;
		this._showDotCursor = false;
		this._qualityLevel = 6;
		this._compressionLevel = 2;
	}
	// ===== PROPERTIES =====
	get viewOnly() {
		return this._viewOnly;
	}
	set viewOnly(viewOnly) {
		this._viewOnly = viewOnly;
		if (this._rfbConnectionState === "connecting" || this._rfbConnectionState === "connected") {
			if (viewOnly) {
				this._keyboard.ungrab();
				this._asyncClipboard.ungrab();
			} else {
				this._keyboard.grab();
				this._asyncClipboard.grab();
			}
		}
	}
	get capabilities() {
		return this._capabilities;
	}
	get clippingViewport() {
		return this._clippingViewport;
	}
	_setClippingViewport(on) {
		if (on === this._clippingViewport) {
			return;
		}
		this._clippingViewport = on;
		this.dispatchEvent(new CustomEvent("clippingviewport", { detail: this._clippingViewport }));
	}
	get touchButton() {
		return 0;
	}
	set touchButton(__unused_0BE9) {
		Warn("Using old API!");
	}
	get clipViewport() {
		return this._clipViewport;
	}
	set clipViewport(viewport) {
		this._clipViewport = viewport;
		this._updateClip();
	}
	get scaleViewport() {
		return this._scaleViewport;
	}
	set scaleViewport(scale) {
		this._scaleViewport = scale;
		// Scaling trumps clipping, so we may need to adjust
		// clipping when enabling or disabling scaling
		if (scale && this._clipViewport) {
			this._updateClip();
		}
		this._updateScale();
		if (!scale && this._clipViewport) {
			this._updateClip();
		}
	}
	get resizeSession() {
		return this._resizeSession;
	}
	set resizeSession(resize) {
		this._resizeSession = resize;
		if (resize) {
			this._requestRemoteResize();
		}
	}
	get showDotCursor() {
		return this._showDotCursor;
	}
	set showDotCursor(show) {
		this._showDotCursor = show;
		this._refreshCursor();
	}
	get background() {
		return this._screen.style.background;
	}
	set background(cssValue) {
		this._screen.style.background = cssValue;
	}
	get qualityLevel() {
		return this._qualityLevel;
	}
	set qualityLevel(qualityLevel) {
		if (!Number.isInteger(qualityLevel) || qualityLevel < 0 || qualityLevel > 9) {
			Error$1("qualityLevel must be an integer between 0 and 9");
			return;
		}
		if (this._qualityLevel === qualityLevel) {
			return;
		}
		this._qualityLevel = qualityLevel;
		if (this._rfbConnectionState === "connected") {
			this._sendEncodings();
		}
	}
	get compressionLevel() {
		return this._compressionLevel;
	}
	set compressionLevel(compressionLevel) {
		if (!Number.isInteger(compressionLevel) || compressionLevel < 0 || compressionLevel > 9) {
			Error$1("compressionLevel must be an integer between 0 and 9");
			return;
		}
		if (this._compressionLevel === compressionLevel) {
			return;
		}
		this._compressionLevel = compressionLevel;
		if (this._rfbConnectionState === "connected") {
			this._sendEncodings();
		}
	}
	// ===== PUBLIC METHODS =====
	disconnect() {
		this._updateConnectionState("disconnecting");
		this._sock.off("error");
		this._sock.off("message");
		this._sock.off("open");
		if (this._rfbRSAAESAuthenticationState !== null) {
			this._rfbRSAAESAuthenticationState.disconnect();
		}
	}
	approveServer() {
		if (this._rfbRSAAESAuthenticationState !== null) {
			this._rfbRSAAESAuthenticationState.approveServer();
		}
	}
	sendCredentials(creds) {
		this._rfbCredentials = creds;
		this._resumeAuthentication();
	}
	sendCtrlAltDel() {
		if (this._rfbConnectionState !== "connected" || this._viewOnly) {
			return;
		}
		Info("Sending Ctrl-Alt-Del");
		this.sendKey(65507, "ControlLeft", true);
		this.sendKey(65513, "AltLeft", true);
		this.sendKey(65535, "Delete", true);
		this.sendKey(65535, "Delete", false);
		this.sendKey(65513, "AltLeft", false);
		this.sendKey(65507, "ControlLeft", false);
	}
	machineShutdown() {
		this._xvpOp(1, 2);
	}
	machineReboot() {
		this._xvpOp(1, 3);
	}
	machineReset() {
		this._xvpOp(1, 4);
	}
	// Send a key press. If 'down' is not specified then send a down key
	// followed by an up key.
	sendKey(keysym, code, down) {
		if (this._rfbConnectionState !== "connected" || this._viewOnly) {
			return;
		}
		if (down === void 0) {
			this.sendKey(keysym, code, true);
			this.sendKey(keysym, code, false);
			return;
		}
		const scancode = XtScancode[code];
		if (this._qemuExtKeyEventSupported && scancode) {
			// 0 is NoSymbol
			keysym = keysym || 0;
			Info("Sending key (" + (down ? "down" : "up") + "): keysym " + keysym + ", scancode " + scancode);
			RFB.b.a(this._sock, keysym, down, scancode);
		} else {
			if (!keysym) {
				return;
			}
			Info("Sending keysym (" + (down ? "down" : "up") + "): " + keysym);
			RFB.b.b(this._sock, keysym, down ? 1 : 0);
		}
	}
	focus(options) {
		this._canvas.focus(options);
	}
	blur() {
		this._canvas.blur();
	}
	clipboardPasteFrom(text) {
		if (this._rfbConnectionState !== "connected" || this._viewOnly) {
			return;
		}
		if (this._clipboardServerCapabilitiesFormats[1] && this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]) {
			this._clipboardText = text;
			RFB.b.c(this._sock, [1]);
		} else {
			let length, i;
			let data;
			length = 0;
			// eslint-disable-next-line no-unused-vars
			for (__unused__ of text) {
				length++;
			}
			data = new Uint8Array(length);
			i = 0;
			for (let codePoint of text) {
				let code = codePoint.codePointAt(0);
				/* Only ISO 8859-1 is supported */
				if (code > 255) {
					code = 63;
				}
				data[i++] = code;
			}
			RFB.b.d(this._sock, data);
		}
	}
	getImageData() {
		return this._display.getImageData();
	}
	toDataURL(type, encoderOptions) {
		return this._display.toDataURL(type, encoderOptions);
	}
	toBlob(callback, type, quality) {
		return this._display.toBlob(callback, type, quality);
	}
	// ===== PRIVATE METHODS =====
	_connect() {
		Debug(">> RFB.connect");
		if (this._url) {
			Info(`connecting to ${this._url}`);
			this._sock.open(this._url, this._wsProtocols);
		} else {
			Info(`attaching ${this._rawChannel} to Websock`);
			this._sock.attach(this._rawChannel);
			if (this._sock.readyState === "closed") {
				throw Error("Cannot use already closed WebSocket/RTCDataChannel");
			}
			if (this._sock.readyState === "open") {
				// FIXME: _socketOpen() can in theory call _fail(), which
				//        isn't allowed this early, but I'm not sure that can
				//        happen without a bug messing up our state variables
				this._socketOpen();
			}
		}
		// Make our elements part of the page
		this._target.appendChild(this._screen);
		this._gestures.attach(this._canvas);
		this._cursor.attach(this._canvas);
		this._refreshCursor();
		// Monitor size changes of the screen element
		this._resizeObserver.observe(this._screen);
		// Always grab focus on some kind of click event
		this._canvas.addEventListener("mousedown", this._eventHandlers.focusCanvas);
		this._canvas.addEventListener("touchstart", this._eventHandlers.focusCanvas);
		// Mouse events
		this._canvas.addEventListener("mousedown", this._eventHandlers.handleMouse);
		this._canvas.addEventListener("mouseup", this._eventHandlers.handleMouse);
		this._canvas.addEventListener("mousemove", this._eventHandlers.handleMouse);
		// Prevent middle-click pasting (see handler for why we bind to document)
		this._canvas.addEventListener("click", this._eventHandlers.handleMouse);
		// preventDefault() on mousedown doesn't stop this event for some
		// reason so we have to explicitly block it
		this._canvas.addEventListener("contextmenu", this._eventHandlers.handleMouse);
		// Wheel events
		this._canvas.addEventListener("wheel", this._eventHandlers.handleWheel);
		// Gesture events
		this._canvas.addEventListener("gesturestart", this._eventHandlers.handleGesture);
		this._canvas.addEventListener("gesturemove", this._eventHandlers.handleGesture);
		this._canvas.addEventListener("gestureend", this._eventHandlers.handleGesture);
		Debug("<< RFB.connect");
	}
	_disconnect() {
		Debug(">> RFB.disconnect");
		this._cursor.detach();
		this._canvas.removeEventListener("gesturestart", this._eventHandlers.handleGesture);
		this._canvas.removeEventListener("gesturemove", this._eventHandlers.handleGesture);
		this._canvas.removeEventListener("gestureend", this._eventHandlers.handleGesture);
		this._canvas.removeEventListener("wheel", this._eventHandlers.handleWheel);
		this._canvas.removeEventListener("mousedown", this._eventHandlers.handleMouse);
		this._canvas.removeEventListener("mouseup", this._eventHandlers.handleMouse);
		this._canvas.removeEventListener("mousemove", this._eventHandlers.handleMouse);
		this._canvas.removeEventListener("click", this._eventHandlers.handleMouse);
		this._canvas.removeEventListener("contextmenu", this._eventHandlers.handleMouse);
		this._canvas.removeEventListener("mousedown", this._eventHandlers.focusCanvas);
		this._canvas.removeEventListener("touchstart", this._eventHandlers.focusCanvas);
		this._resizeObserver.disconnect();
		this._keyboard.ungrab();
		this._gestures.detach();
		this._sock.close();
		try {
			this._target.removeChild(this._screen);
		} catch (e) {
			if (!(e.name === "NotFoundError")) {
				throw e;
			}
		}
		clearTimeout(this._resizeTimeout);
		clearTimeout(this._mouseMoveTimer);
		Debug("<< RFB.disconnect");
	}
	_socketOpen() {
		if (this._rfbConnectionState === "connecting" && this._rfbInitState === "") {
			this._rfbInitState = "ProtocolVersion";
			Debug("Starting VNC handshake");
		} else {
			this._fail("Unexpected server connection while " + this._rfbConnectionState);
		}
	}
	_socketClose(e) {
		Debug("WebSocket on-close event");
		let msg = "";
		if (e.code) {
			msg = "(code: " + e.code;
			if (e.reason) {
				msg += ", reason: " + e.reason;
			}
			msg += ")";
		}
		switch (this._rfbConnectionState) {
			case "connecting":
				this._fail("Connection closed " + msg);
				break;
			case "connected":
				// Handle disconnects that were initiated server-side
				this._updateConnectionState("disconnecting");
				this._updateConnectionState("disconnected");
				break;
			case "disconnecting":
				// Normal disconnection path
				this._updateConnectionState("disconnected");
				break;
			case "disconnected":
				this._fail("Unexpected server disconnect " + "when already disconnected " + msg);
				break;
			default:
				this._fail("Unexpected server disconnect before connecting " + msg);
				break;
		}
		this._sock.off("close");
		// Delete reference to raw channel to allow cleanup.
		this._rawChannel = null;
	}
	_socketError() {
		Warn("WebSocket on-error event");
	}
	_focusCanvas() {
		if (!this.focusOnClick) {
			return;
		}
		this.focus({ preventScroll: true });
	}
	_setDesktopName(name) {
		this._fbName = name;
		this.dispatchEvent(new CustomEvent("desktopname", { detail: { name: this._fbName } }));
	}
	_saveExpectedClientSize() {
		this._expectedClientWidth = this._screen.clientWidth;
		this._expectedClientHeight = this._screen.clientHeight;
	}
	_currentClientSize() {
		return [this._screen.clientWidth, this._screen.clientHeight];
	}
	_clientHasExpectedSize() {
		const [currentWidth, currentHeight] = this._currentClientSize();
		return currentWidth == this._expectedClientWidth && currentHeight == this._expectedClientHeight;
	}
	// Handle browser window resizes
	_handleResize() {
		// Don't change anything if the client size is already as expected
		if (this._clientHasExpectedSize()) {
			return;
		}
		// If the window resized then our screen element might have
		// as well. Update the viewport dimensions.
		window.requestAnimationFrame(() => {
			this._updateClip();
			this._updateScale();
			this._saveExpectedClientSize();
		});
		// Request changing the resolution of the remote display to
		// the size of the local browser viewport.
		this._requestRemoteResize();
	}
	// Update state of clipping in Display object, and make sure the
	// configured viewport matches the current screen size
	_updateClip() {
		const curClip = this._display.clipViewport;
		let newClip = this._clipViewport;
		if (this._scaleViewport) {
			// Disable viewport clipping if we are scaling
			newClip = false;
		}
		if (curClip !== newClip) {
			this._display.clipViewport = newClip;
		}
		if (newClip) {
			// When clipping is enabled, the screen is limited to
			// the size of the container.
			const size = this._screenSize();
			this._display.viewportChangeSize(size.w, size.h);
			this._fixScrollbars();
			this._setClippingViewport(size.w < this._display.width || size.h < this._display.height);
		} else {
			this._setClippingViewport(false);
		}
		// When changing clipping we might show or hide scrollbars.
		// This causes the expected client dimensions to change.
		if (curClip !== newClip) {
			this._saveExpectedClientSize();
		}
	}
	_updateScale() {
		if (!this._scaleViewport) {
			this._display.scale = 1;
		} else {
			const size = this._screenSize();
			this._display.autoscale(size.w, size.h);
		}
		this._fixScrollbars();
	}
	// Requests a change of remote desktop size. This message is an extension
	// and may only be sent if we have received an ExtendedDesktopSize message
	_requestRemoteResize() {
		if (!this._resizeSession) {
			return;
		}
		if (this._viewOnly) {
			return;
		}
		if (!this._supportsSetDesktopSize) {
			return;
		}
		// Rate limit to one pending resize at a time
		if (this._pendingRemoteResize) {
			return;
		}
		// And no more than once every 100ms
		if (Date.now() - this._lastResize < 100) {
			clearTimeout(this._resizeTimeout);
			this._resizeTimeout = setTimeout(this._requestRemoteResize.bind(this), 100 - (Date.now() - this._lastResize));
			return;
		}
		this._resizeTimeout = null;
		const size = this._screenSize();
		// Do we actually change anything?
		if (size.w === this._fbWidth && size.h === this._fbHeight) {
			return;
		}
		this._pendingRemoteResize = true;
		this._lastResize = Date.now();
		RFB.b.e(this._sock, Math.floor(size.w), Math.floor(size.h), this._screenID, this._screenFlags);
		Debug("Requested new desktop size: " + size.w + "x" + size.h);
	}
	// Gets the the size of the available screen
	_screenSize() {
		let r = this._screen.getBoundingClientRect();
		return {
			w: r.width,
			h: r.height
		};
	}
	_fixScrollbars() {
		// This is a hack because Safari on macOS screws up the calculation
		// for when scrollbars are needed. We get scrollbars when making the
		// browser smaller, despite remote resize being enabled. So to fix it
		// we temporarily toggle them off and on.
		const orig = this._screen.style.overflow;
		this._screen.style.overflow = "hidden";
		// Force Safari to recalculate the layout by asking for
		// an element's dimensions
		this._screen.getBoundingClientRect();
		this._screen.style.overflow = orig;
	}
	/*
	* Connection states:
	*   connecting
	*   connected
	*   disconnecting
	*   disconnected - permanent state
	*/
	_updateConnectionState(state) {
		const oldstate = this._rfbConnectionState;
		if (state === oldstate) {
			Debug("Already in state '" + state + "', ignoring");
			return;
		}
		// The 'disconnected' state is permanent for each RFB object
		if (oldstate === "disconnected") {
			Error$1("Tried changing state of a disconnected RFB object");
			return;
		}
		// Ensure proper transitions before doing anything
		switch (state) {
			case "connected":
				if (oldstate !== "connecting") {
					Error$1("Bad transition to connected state, " + "previous connection state: " + oldstate);
					return;
				}
				break;
			case "disconnected":
				if (oldstate !== "disconnecting") {
					Error$1("Bad transition to disconnected state, " + "previous connection state: " + oldstate);
					return;
				}
				break;
			case "connecting":
				if (oldstate !== "") {
					Error$1("Bad transition to connecting state, " + "previous connection state: " + oldstate);
					return;
				}
				break;
			case "disconnecting":
				if (oldstate !== "connected" && oldstate !== "connecting") {
					Error$1("Bad transition to disconnecting state, " + "previous connection state: " + oldstate);
					return;
				}
				break;
			default:
				Error$1("Unknown connection state: " + state);
				return;
		}
		// State change actions
		this._rfbConnectionState = state;
		Debug("New state '" + state + "', was '" + oldstate + "'.");
		if (this._disconnTimer && state !== "disconnecting") {
			Debug("Clearing disconnect timer");
			clearTimeout(this._disconnTimer);
			this._disconnTimer = null;
			// make sure we don't get a double event
			this._sock.off("close");
		}
		switch (state) {
			case "connecting":
				this._connect();
				break;
			case "connected":
				this.dispatchEvent(new CustomEvent("connect", { detail: {} }));
				break;
			case "disconnecting":
				this._disconnect();
				this._disconnTimer = setTimeout(() => {
					Error$1("Disconnection timed out.");
					this._updateConnectionState("disconnected");
				}, 3e3);
				break;
			case "disconnected":
				this.dispatchEvent(new CustomEvent("disconnect", { detail: { clean: this._rfbCleanDisconnect } }));
				break;
		}
	}
	/* Print errors and disconnect
	*
	* The parameter 'details' is used for information that
	* should be logged but not sent to the user interface.
	*/
	_fail(details) {
		switch (this._rfbConnectionState) {
			case "disconnecting":
				Error$1("Failed when disconnecting: " + details);
				break;
			case "connected":
				Error$1("Failed while connected: " + details);
				break;
			case "connecting":
				Error$1("Failed when connecting: " + details);
				break;
			default:
				Error$1("RFB failure: " + details);
				break;
		}
		this._rfbCleanDisconnect = false;
		// Transition to disconnected without waiting for socket to close
		this._updateConnectionState("disconnecting");
		this._updateConnectionState("disconnected");
		return false;
	}
	_setCapability(cap, val) {
		this._capabilities[cap] = val;
		this.dispatchEvent(new CustomEvent("capabilities", { detail: { capabilities: this._capabilities } }));
	}
	_handleMessage() {
		if (this._sock.rQwait("message", 1)) {
			Warn("handleMessage called on an empty receive queue");
			return;
		}
		switch (this._rfbConnectionState) {
			case "disconnected":
				Error$1("Got data while disconnected");
				break;
			case "connected":
				while (true) {
					if (this._flushing) {
						break;
					}
					if (!this._normalMsg()) {
						break;
					}
					if (this._sock.rQwait("message", 1)) {
						break;
					}
				}
				break;
			case "connecting":
				while (this._rfbConnectionState === "connecting") {
					if (!this._initMsg()) {
						break;
					}
				}
				break;
			default:
				Error$1("Got data while in an invalid state");
				break;
		}
	}
	_handleKeyEvent(keysym, code, down, numlock, capslock) {
		// If remote state of capslock is known, and it doesn't match the local led state of
		// the keyboard, we send a capslock keypress first to bring it into sync.
		// If we just pressed CapsLock, or we toggled it remotely due to it being out of sync
		// we clear the remote state so that we don't send duplicate or spurious fixes,
		// since it may take some time to receive the new remote CapsLock state.
		if (code == "CapsLock" && down) {
			this._remoteCapsLock = null;
		}
		if (this._remoteCapsLock !== null && capslock !== null && this._remoteCapsLock !== capslock && down) {
			Debug("Fixing remote caps lock");
			this.sendKey(65509, "CapsLock", true);
			this.sendKey(65509, "CapsLock", false);
			// We clear the remote capsLock state when we do this to prevent issues with doing this twice
			// before we receive an update of the the remote state.
			this._remoteCapsLock = null;
		}
		// Logic for numlock is exactly the same.
		if (code == "NumLock" && down) {
			this._remoteNumLock = null;
		}
		if (this._remoteNumLock !== null && numlock !== null && this._remoteNumLock !== numlock && down) {
			Debug("Fixing remote num lock");
			this.sendKey(65407, "NumLock", true);
			this.sendKey(65407, "NumLock", false);
			this._remoteNumLock = null;
		}
		this.sendKey(keysym, code, down);
	}
	static c(buttons) {
		/* The bits in MouseEvent.buttons property correspond
		* to the following mouse buttons:
		*     0: Left
		*     1: Right
		*     2: Middle
		*     3: Back
		*     4: Forward
		*
		* These bits needs to be converted to what they are defined as
		* in the RFB protocol.
		*/
		const buttonMaskMap = {
			0: 1,
			1: 4,
			2: 2,
			3: 128,
			4: 256
		};
		let bmask = 0;
		for (let i = 0; i < 5; i++) {
			if (buttons & 1 << i) {
				bmask |= buttonMaskMap[i];
			}
		}
		return bmask;
	}
	_handleMouse(ev) {
		/*
		* We don't check connection status or viewOnly here as the
		* mouse events might be used to control the viewport
		*/
		if (ev.type === "click") {
			/*
			* Note: This is only needed for the 'click' event as it fails
			*       to fire properly for the target element so we have
			*       to listen on the document element instead.
			*/
			if (ev.target !== this._canvas) {
				return;
			}
		}
		// FIXME: if we're in view-only and not dragging,
		//        should we stop events?
		ev.stopPropagation();
		ev.preventDefault();
		if (ev.type === "click" || ev.type === "contextmenu") {
			return;
		}
		let pos = clientToElement(ev.clientX, ev.clientY, this._canvas);
		let bmask = RFB.c(ev.buttons);
		let down = ev.type == "mousedown";
		switch (ev.type) {
			case "mousedown":
			case "mouseup":
				if (this.dragViewport) {
					if (down && !this._viewportDragging) {
						this._viewportDragging = true;
						this._viewportDragPos = {
							"x": pos.a,
							"y": pos.b
						};
						this._viewportHasMoved = false;
						this._flushMouseMoveTimer(pos.a, pos.b);
						// Skip sending mouse events, instead save the current
						// mouse mask so we can send it later.
						this._mouseButtonMask = bmask;
						break;
					} else {
						this._viewportDragging = false;
						// If we actually performed a drag then we are done
						// here and should not send any mouse events
						if (this._viewportHasMoved) {
							this._mouseButtonMask = bmask;
							break;
						}
						// Otherwise we treat this as a mouse click event.
						// Send the previously saved button mask, followed
						// by the current button mask at the end of this
						// function.
						this._sendMouse(pos.a, pos.b, this._mouseButtonMask);
					}
				}
				if (down) {
					setCapture(this._canvas);
				}
				this._handleMouseButton(pos.a, pos.b, bmask);
				break;
			case "mousemove":
				if (this._viewportDragging) {
					const deltaX = this._viewportDragPos.x - pos.a;
					const deltaY = this._viewportDragPos.y - pos.b;
					if (this._viewportHasMoved || Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
						this._viewportHasMoved = true;
						this._viewportDragPos = {
							"x": pos.a,
							"y": pos.b
						};
						this._display.viewportChangePos(deltaX, deltaY);
					}
					// Skip sending mouse events
					break;
				}
				this._handleMouseMove(pos.a, pos.b);
				break;
		}
	}
	_handleMouseButton(x, y, bmask) {
		// Flush waiting move event first
		this._flushMouseMoveTimer(x, y);
		this._mouseButtonMask = bmask;
		this._sendMouse(x, y, this._mouseButtonMask);
	}
	_handleMouseMove(x, y) {
		this._mousePos = {
			"x": x,
			"y": y
		};
		// Limit many mouse move events to one every MOUSE_MOVE_DELAY ms
		if (this._mouseMoveTimer == null) {
			const timeSinceLastMove = Date.now() - this._mouseLastMoveTime;
			if (timeSinceLastMove > 17) {
				this._sendMouse(x, y, this._mouseButtonMask);
				this._mouseLastMoveTime = Date.now();
			} else {
				// Too soon since the latest move, wait the remaining time
				this._mouseMoveTimer = setTimeout(() => {
					this._handleDelayedMouseMove();
				}, 17 - timeSinceLastMove);
			}
		}
	}
	_handleDelayedMouseMove() {
		this._mouseMoveTimer = null;
		this._sendMouse(this._mousePos.x, this._mousePos.y, this._mouseButtonMask);
		this._mouseLastMoveTime = Date.now();
	}
	_sendMouse(x, y, mask) {
		if (this._rfbConnectionState !== "connected") {
			return;
		}
		if (this._viewOnly) {
			return;
		}
		// Highest bit in mask is never sent to the server
		if (mask & 32768) {
			throw new Error("Illegal mouse button mask (mask: " + mask + ")");
		}
		let extendedMouseButtons = mask & 32640;
		if (this._extendedPointerEventSupported && extendedMouseButtons) {
			RFB.b.f(this._sock, this._display.absX(x), this._display.absY(y), mask);
		} else {
			RFB.b.g(this._sock, this._display.absX(x), this._display.absY(y), mask);
		}
	}
	_handleWheel(ev) {
		if (this._rfbConnectionState !== "connected") {
			return;
		}
		if (this._viewOnly) {
			return;
		}
		ev.stopPropagation();
		ev.preventDefault();
		let pos = clientToElement(ev.clientX, ev.clientY, this._canvas);
		let bmask = RFB.c(ev.buttons);
		let dX = ev.deltaX;
		let dY = ev.deltaY;
		// Pixel units unless it's non-zero.
		// Note that if deltamode is line or page won't matter since we aren't
		// sending the mouse wheel delta to the server anyway.
		// The difference between pixel and line can be important however since
		// we have a threshold that can be smaller than the line height.
		if (ev.deltaMode !== 0) {
			dX *= 19;
			dY *= 19;
		}
		// Mouse wheel events are sent in steps over VNC. This means that the VNC
		// protocol can't handle a wheel event with specific distance or speed.
		// Therefor, if we get a lot of small mouse wheel events we combine them.
		this._accumulatedWheelDeltaX += dX;
		this._accumulatedWheelDeltaY += dY;
		// Generate a mouse wheel step event when the accumulated delta
		// for one of the axes is large enough.
		if (Math.abs(this._accumulatedWheelDeltaX) >= 50) {
			if (this._accumulatedWheelDeltaX < 0) {
				this._handleMouseButton(pos.a, pos.b, bmask | 32);
				this._handleMouseButton(pos.a, pos.b, bmask);
			} else if (this._accumulatedWheelDeltaX > 0) {
				this._handleMouseButton(pos.a, pos.b, bmask | 64);
				this._handleMouseButton(pos.a, pos.b, bmask);
			}
			this._accumulatedWheelDeltaX = 0;
		}
		if (Math.abs(this._accumulatedWheelDeltaY) >= 50) {
			if (this._accumulatedWheelDeltaY < 0) {
				this._handleMouseButton(pos.a, pos.b, bmask | 8);
				this._handleMouseButton(pos.a, pos.b, bmask);
			} else if (this._accumulatedWheelDeltaY > 0) {
				this._handleMouseButton(pos.a, pos.b, bmask | 16);
				this._handleMouseButton(pos.a, pos.b, bmask);
			}
			this._accumulatedWheelDeltaY = 0;
		}
	}
	_fakeMouseMove(ev, elementX, elementY) {
		this._handleMouseMove(elementX, elementY);
		this._cursor.move(ev.detail.clientX, ev.detail.clientY);
	}
	_handleTapEvent(ev, bmask) {
		let pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
		// If the user quickly taps multiple times we assume they meant to
		// hit the same spot, so slightly adjust coordinates
		if (this._gestureLastTapTime !== null && Date.now() - this._gestureLastTapTime < 1e3 && this._gestureFirstDoubleTapEv.detail.type === ev.detail.type) {
			let dx = this._gestureFirstDoubleTapEv.detail.clientX - ev.detail.clientX;
			let dy = this._gestureFirstDoubleTapEv.detail.clientY - ev.detail.clientY;
			let distance = Math.hypot(dx, dy);
			if (distance < 50) {
				pos = clientToElement(this._gestureFirstDoubleTapEv.detail.clientX, this._gestureFirstDoubleTapEv.detail.clientY, this._canvas);
			} else {
				this._gestureFirstDoubleTapEv = ev;
			}
		} else {
			this._gestureFirstDoubleTapEv = ev;
		}
		this._gestureLastTapTime = Date.now();
		this._fakeMouseMove(this._gestureFirstDoubleTapEv, pos.a, pos.b);
		this._handleMouseButton(pos.a, pos.b, bmask);
		this._handleMouseButton(pos.a, pos.b, 0);
	}
	_handleGesture(ev) {
		let magnitude;
		let pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
		switch (ev.type) {
			case "gesturestart":
				switch (ev.detail.type) {
					case "onetap":
						this._handleTapEvent(ev, 1);
						break;
					case "twotap":
						this._handleTapEvent(ev, 4);
						break;
					case "threetap":
						this._handleTapEvent(ev, 2);
						break;
					case "drag":
						if (this.dragViewport) {
							this._viewportHasMoved = false;
							this._viewportDragging = true;
							this._viewportDragPos = {
								"x": pos.a,
								"y": pos.b
							};
						} else {
							this._fakeMouseMove(ev, pos.a, pos.b);
							this._handleMouseButton(pos.a, pos.b, 1);
						}
						break;
					case "longpress":
						if (this.dragViewport) {
							// If dragViewport is true, we need to wait to see
							// if we have dragged outside the threshold before
							// sending any events to the server.
							this._viewportHasMoved = false;
							this._viewportDragPos = {
								"x": pos.a,
								"y": pos.b
							};
						} else {
							this._fakeMouseMove(ev, pos.a, pos.b);
							this._handleMouseButton(pos.a, pos.b, 4);
						}
						break;
					case "twodrag":
						this._gestureLastMagnitudeX = ev.detail.magnitudeX;
						this._gestureLastMagnitudeY = ev.detail.magnitudeY;
						this._fakeMouseMove(ev, pos.a, pos.b);
						break;
					case "pinch":
						this._gestureLastMagnitudeX = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY);
						this._fakeMouseMove(ev, pos.a, pos.b);
						break;
				}
				break;
			case "gesturemove":
				switch (ev.detail.type) {
					case "onetap":
					case "twotap":
					case "threetap": break;
					case "drag":
					case "longpress":
						if (this.dragViewport) {
							this._viewportDragging = true;
							const deltaX = this._viewportDragPos.x - pos.a;
							const deltaY = this._viewportDragPos.y - pos.b;
							if (this._viewportHasMoved || Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
								this._viewportHasMoved = true;
								this._viewportDragPos = {
									"x": pos.a,
									"y": pos.b
								};
								this._display.viewportChangePos(deltaX, deltaY);
							}
						} else {
							this._fakeMouseMove(ev, pos.a, pos.b);
						}
						break;
					case "twodrag":
						// Always scroll in the same position.
						// We don't know if the mouse was moved so we need to move it
						// every update.
						this._fakeMouseMove(ev, pos.a, pos.b);
						while (ev.detail.magnitudeY - this._gestureLastMagnitudeY > 50) {
							this._handleMouseButton(pos.a, pos.b, 8);
							this._handleMouseButton(pos.a, pos.b, 0);
							this._gestureLastMagnitudeY += 50;
						}
						while (ev.detail.magnitudeY - this._gestureLastMagnitudeY < -50) {
							this._handleMouseButton(pos.a, pos.b, 16);
							this._handleMouseButton(pos.a, pos.b, 0);
							this._gestureLastMagnitudeY -= 50;
						}
						while (ev.detail.magnitudeX - this._gestureLastMagnitudeX > 50) {
							this._handleMouseButton(pos.a, pos.b, 32);
							this._handleMouseButton(pos.a, pos.b, 0);
							this._gestureLastMagnitudeX += 50;
						}
						while (ev.detail.magnitudeX - this._gestureLastMagnitudeX < -50) {
							this._handleMouseButton(pos.a, pos.b, 64);
							this._handleMouseButton(pos.a, pos.b, 0);
							this._gestureLastMagnitudeX -= 50;
						}
						break;
					case "pinch":
						// Always scroll in the same position.
						// We don't know if the mouse was moved so we need to move it
						// every update.
						this._fakeMouseMove(ev, pos.a, pos.b);
						magnitude = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY);
						if (Math.abs(magnitude - this._gestureLastMagnitudeX) > 75) {
							this._handleKeyEvent(65507, "ControlLeft", true);
							while (magnitude - this._gestureLastMagnitudeX > 75) {
								this._handleMouseButton(pos.a, pos.b, 8);
								this._handleMouseButton(pos.a, pos.b, 0);
								this._gestureLastMagnitudeX += 75;
							}
							while (magnitude - this._gestureLastMagnitudeX < -75) {
								this._handleMouseButton(pos.a, pos.b, 16);
								this._handleMouseButton(pos.a, pos.b, 0);
								this._gestureLastMagnitudeX -= 75;
							}
						}
						this._handleKeyEvent(65507, "ControlLeft", false);
						break;
				}
				break;
			case "gestureend":
				switch (ev.detail.type) {
					case "onetap":
					case "twotap":
					case "threetap":
					case "pinch":
					case "twodrag": break;
					case "drag":
						if (this.dragViewport) {
							this._viewportDragging = false;
						} else {
							this._fakeMouseMove(ev, pos.a, pos.b);
							this._handleMouseButton(pos.a, pos.b, 0);
						}
						break;
					case "longpress":
						if (this._viewportHasMoved) {
							// We don't want to send any events if we have moved
							// our viewport
							break;
						}
						if (this.dragViewport && !this._viewportHasMoved) {
							this._fakeMouseMove(ev, pos.a, pos.b);
							// If dragViewport is true, we need to wait to see
							// if we have dragged outside the threshold before
							// sending any events to the server.
							this._handleMouseButton(pos.a, pos.b, 4);
							this._handleMouseButton(pos.a, pos.b, 0);
							this._viewportDragging = false;
						} else {
							this._fakeMouseMove(ev, pos.a, pos.b);
							this._handleMouseButton(pos.a, pos.b, 0);
						}
						break;
				}
				break;
		}
	}
	_flushMouseMoveTimer(x, y) {
		if (this._mouseMoveTimer !== null) {
			clearTimeout(this._mouseMoveTimer);
			this._mouseMoveTimer = null;
			this._sendMouse(x, y, this._mouseButtonMask);
		}
	}
	// Message handlers
	_negotiateProtocolVersion() {
		if (this._sock.rQwait("version", 12)) {
			return false;
		}
		const sversion = this._sock.rQshiftStr(12).substr(4, 7);
		Info("Server ProtocolVersion: " + sversion);
		let isRepeater = 0;
		switch (sversion) {
			case "000.000":
				isRepeater = 1;
				break;
			case "003.003":
			case "003.006":
				this._rfbVersion = 3.3;
				break;
			case "003.007":
				this._rfbVersion = 3.7;
				break;
			case "003.008":
			case "003.889":
			case "004.000":
			case "004.001":
			case "005.000":
				this._rfbVersion = 3.8;
				break;
			default: return this._fail("Invalid server version " + sversion);
		}
		if (isRepeater) {
			let repeaterID = "ID:" + this._repeaterID;
			while (repeaterID.length < 250) {
				repeaterID += "\0";
			}
			this._sock.sQpushString(repeaterID);
			this._sock.flush();
			return true;
		}
		if (this._rfbVersion > this._rfbMaxVersion) {
			this._rfbVersion = this._rfbMaxVersion;
		}
		const cversion = "00" + parseInt(this._rfbVersion, 10) + ".00" + this._rfbVersion * 10 % 10;
		this._sock.sQpushString("RFB " + cversion + "\n");
		this._sock.flush();
		Debug("Sent ProtocolVersion: " + cversion);
		this._rfbInitState = "Security";
	}
	_isSupportedSecurityType(type) {
		const clientTypes = [
			1,
			2,
			6,
			16,
			19,
			22,
			30,
			113,
			256
		];
		return clientTypes.includes(type);
	}
	_negotiateSecurity() {
		if (this._rfbVersion >= 3.7) {
			// Server sends supported list, client decides
			const numTypes = this._sock.rQshift8();
			if (this._sock.rQwait("security type", numTypes, 1)) {
				return false;
			}
			if (numTypes === 0) {
				this._rfbInitState = "SecurityReason";
				this._securityContext = "no security types";
				this._securityStatus = 1;
				return true;
			}
			const types = this._sock.rQshiftBytes(numTypes);
			Debug("Server security types: " + types);
			// Look for a matching security type in the order that the
			// server prefers
			this._rfbAuthScheme = -1;
			for (let type of types) {
				if (this._isSupportedSecurityType(type)) {
					this._rfbAuthScheme = type;
					break;
				}
			}
			if (this._rfbAuthScheme === -1) {
				return this._fail("Unsupported security types (types: " + types + ")");
			}
			this._sock.sQpush8(this._rfbAuthScheme);
			this._sock.flush();
		} else {
			// Server decides
			if (this._sock.rQwait("security scheme", 4)) {
				return false;
			}
			this._rfbAuthScheme = this._sock.rQshift32();
			if (this._rfbAuthScheme == 0) {
				this._rfbInitState = "SecurityReason";
				this._securityContext = "authentication scheme";
				this._securityStatus = 1;
				return true;
			}
		}
		this._rfbInitState = "Authentication";
		Debug("Authenticating using scheme: " + this._rfbAuthScheme);
		return true;
	}
	_handleSecurityReason() {
		if (this._sock.rQwait("reason length", 4)) {
			return false;
		}
		const strlen = this._sock.rQshift32();
		let reason = "";
		if (strlen > 0) {
			if (this._sock.rQwait("reason", strlen, 4)) {
				return false;
			}
			reason = this._sock.rQshiftStr(strlen);
		}
		if (reason !== "") {
			this.dispatchEvent(new CustomEvent("securityfailure", { detail: {
				status: this._securityStatus,
				reason
			} }));
			return this._fail("Security negotiation failed on " + this._securityContext + " (reason: " + reason + ")");
		} else {
			this.dispatchEvent(new CustomEvent("securityfailure", { detail: { status: this._securityStatus } }));
			return this._fail("Security negotiation failed on " + this._securityContext);
		}
	}
	// authentication
	_negotiateXvpAuth() {
		if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0 || this._rfbCredentials.target === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: [
				"username",
				"password",
				"target"
			] } }));
			return false;
		}
		this._sock.sQpush8(this._rfbCredentials.username.length);
		this._sock.sQpush8(this._rfbCredentials.target.length);
		this._sock.sQpushString(this._rfbCredentials.username);
		this._sock.sQpushString(this._rfbCredentials.target);
		this._sock.flush();
		this._rfbAuthScheme = 2;
		return this._negotiateAuthentication();
	}
	// VeNCrypt authentication, currently only supports version 0.2 and only Plain subtype
	_negotiateVeNCryptAuth() {
		// waiting for VeNCrypt version
		if (this._rfbVeNCryptState == 0) {
			if (this._sock.rQwait("vencrypt version", 2)) {
				return false;
			}
			const major = this._sock.rQshift8();
			const minor = this._sock.rQshift8();
			if (!(major == 0 && minor == 2)) {
				return this._fail("Unsupported VeNCrypt version " + major + "." + minor);
			}
			this._sock.sQpush8(0);
			this._sock.sQpush8(2);
			this._sock.flush();
			this._rfbVeNCryptState = 1;
		}
		// waiting for ACK
		if (this._rfbVeNCryptState == 1) {
			if (this._sock.rQwait("vencrypt ack", 1)) {
				return false;
			}
			const res = this._sock.rQshift8();
			if (res != 0) {
				return this._fail("VeNCrypt failure " + res);
			}
			this._rfbVeNCryptState = 2;
		}
		// must fall through here (i.e. no "else if"), beacause we may have already received
		// the subtypes length and won't be called again
		if (this._rfbVeNCryptState == 2) {
			if (this._sock.rQwait("vencrypt subtypes length", 1)) {
				return false;
			}
			const subtypesLength = this._sock.rQshift8();
			if (subtypesLength < 1) {
				return this._fail("VeNCrypt subtypes empty");
			}
			this._rfbVeNCryptSubtypesLength = subtypesLength;
			this._rfbVeNCryptState = 3;
		}
		// waiting for subtypes list
		if (this._rfbVeNCryptState == 3) {
			if (this._sock.rQwait("vencrypt subtypes", 4 * this._rfbVeNCryptSubtypesLength)) {
				return false;
			}
			const subtypes = [];
			for (let i = 0; i < this._rfbVeNCryptSubtypesLength; i++) {
				subtypes.push(this._sock.rQshift32());
			}
			// Look for a matching security type in the order that the
			// server prefers
			this._rfbAuthScheme = -1;
			for (let type of subtypes) {
				// Avoid getting in to a loop
				if (type === 19) {
					continue;
				}
				if (this._isSupportedSecurityType(type)) {
					this._rfbAuthScheme = type;
					break;
				}
			}
			if (this._rfbAuthScheme === -1) {
				return this._fail("Unsupported security types (types: " + subtypes + ")");
			}
			this._sock.sQpush32(this._rfbAuthScheme);
			this._sock.flush();
			this._rfbVeNCryptState = 4;
			return true;
		}
	}
	_negotiatePlainAuth() {
		if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["username", "password"] } }));
			return false;
		}
		const user = encodeUTF8(this._rfbCredentials.username);
		const pass = encodeUTF8(this._rfbCredentials.password);
		this._sock.sQpush32(user.length);
		this._sock.sQpush32(pass.length);
		this._sock.sQpushString(user);
		this._sock.sQpushString(pass);
		this._sock.flush();
		this._rfbInitState = "SecurityResult";
		return true;
	}
	_negotiateStdVNCAuth() {
		if (this._sock.rQwait("auth challenge", 16)) {
			return false;
		}
		if (this._rfbCredentials.password === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["password"] } }));
			return false;
		}
		// TODO(directxman12): make genDES not require an Array
		const challenge = Array.prototype.slice.call(this._sock.rQshiftBytes(16));
		const response = RFB.d(this._rfbCredentials.password, challenge);
		this._sock.sQpushBytes(response);
		this._sock.flush();
		this._rfbInitState = "SecurityResult";
		return true;
	}
	_negotiateARDAuth() {
		if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["username", "password"] } }));
			return false;
		}
		if (this._rfbCredentials.ardPublicKey != void 0 && this._rfbCredentials.ardCredentials != void 0) {
			// if the async web crypto is done return the results
			this._sock.sQpushBytes(this._rfbCredentials.ardCredentials);
			this._sock.sQpushBytes(this._rfbCredentials.ardPublicKey);
			this._sock.flush();
			this._rfbCredentials.ardCredentials = null;
			this._rfbCredentials.ardPublicKey = null;
			this._rfbInitState = "SecurityResult";
			return true;
		}
		if (this._sock.rQwait("read ard", 4)) {
			return false;
		}
		let generator = this._sock.rQshiftBytes(2);
		let keyLength = this._sock.rQshift16();
		if (this._sock.rQwait("read ard keylength", keyLength * 2, 4)) {
			return false;
		}
		// read the server values
		let prime = this._sock.rQshiftBytes(keyLength);
		let serverPublicKey = this._sock.rQshiftBytes(keyLength);
		let clientKey = legacyCrypto.e({
			name: "DH",
			g: generator,
			p: prime
		});
		this._negotiateARDAuthAsync(keyLength, serverPublicKey, clientKey);
		return false;
	}
	async _negotiateARDAuthAsync(keyLength, serverPublicKey, clientKey) {
		const clientPublicKey = legacyCrypto.f(0, clientKey.publicKey);
		const sharedKey = legacyCrypto.h({
			name: "DH",
			public: serverPublicKey
		}, clientKey.privateKey, keyLength * 8);
		const username = encodeUTF8(this._rfbCredentials.username).substring(0, 63);
		const password = encodeUTF8(this._rfbCredentials.password).substring(0, 63);
		const credentials = window.crypto.getRandomValues(new Uint8Array(128));
		for (let i = 0; i < username.length; i++) {
			credentials[i] = username.charCodeAt(i);
		}
		credentials[username.length] = 0;
		for (let i = 0; i < password.length; i++) {
			credentials[64 + i] = password.charCodeAt(i);
		}
		credentials[64 + password.length] = 0;
		const key = await legacyCrypto.g(0, sharedKey);
		const cipher = await legacyCrypto.d(0, key, { a: "AES-ECB" }, 0, ["encrypt"]);
		const encrypted = await legacyCrypto.b({ name: "AES-ECB" }, cipher, credentials);
		this._rfbCredentials.ardCredentials = encrypted;
		this._rfbCredentials.ardPublicKey = clientPublicKey;
		this._resumeAuthentication();
	}
	_negotiateTightUnixAuth() {
		if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["username", "password"] } }));
			return false;
		}
		this._sock.sQpush32(this._rfbCredentials.username.length);
		this._sock.sQpush32(this._rfbCredentials.password.length);
		this._sock.sQpushString(this._rfbCredentials.username);
		this._sock.sQpushString(this._rfbCredentials.password);
		this._sock.flush();
		this._rfbInitState = "SecurityResult";
		return true;
	}
	_negotiateTightTunnels(numTunnels) {
		const clientSupportedTunnelTypes = { 0: {
			vendor: "TGHT",
			signature: "NOTUNNEL"
		} };
		const serverSupportedTunnelTypes = {};
		// receive tunnel capabilities
		for (let i = 0; i < numTunnels; i++) {
			const capCode = this._sock.rQshift32();
			const capVendor = this._sock.rQshiftStr(4);
			const capSignature = this._sock.rQshiftStr(8);
			serverSupportedTunnelTypes[capCode] = {
				vendor: capVendor,
				signature: capSignature
			};
		}
		Debug("Server Tight tunnel types: " + serverSupportedTunnelTypes);
		// Siemens touch panels have a VNC server that supports NOTUNNEL,
		// but forgets to advertise it. Try to detect such servers by
		// looking for their custom tunnel type.
		if (serverSupportedTunnelTypes[1] && serverSupportedTunnelTypes[1].vendor === "SICR" && serverSupportedTunnelTypes[1].signature === "SCHANNEL") {
			Debug("Detected Siemens server. Assuming NOTUNNEL support.");
			serverSupportedTunnelTypes[0] = {
				vendor: "TGHT",
				signature: "NOTUNNEL"
			};
		}
		// choose the notunnel type
		if (serverSupportedTunnelTypes[0]) {
			if (serverSupportedTunnelTypes[0].vendor != "TGHT" || serverSupportedTunnelTypes[0].signature != "NOTUNNEL") {
				return this._fail("Client's tunnel type had the incorrect " + "vendor or signature");
			}
			Debug("Selected tunnel type: " + clientSupportedTunnelTypes[0]);
			this._sock.sQpush32(0);
			this._sock.flush();
			return false;
		} else {
			return this._fail("Server wanted tunnels, but doesn't support " + "the notunnel type");
		}
	}
	_negotiateTightAuth() {
		if (!this._rfbTightVNC) {
			if (this._sock.rQwait("num tunnels", 4)) {
				return false;
			}
			const numTunnels = this._sock.rQshift32();
			if (numTunnels > 0 && this._sock.rQwait("tunnel capabilities", 16 * numTunnels, 4)) {
				return false;
			}
			this._rfbTightVNC = true;
			if (numTunnels > 0) {
				this._negotiateTightTunnels(numTunnels);
				return false;
			}
		}
		// second pass, do the sub-auth negotiation
		if (this._sock.rQwait("sub auth count", 4)) {
			return false;
		}
		const subAuthCount = this._sock.rQshift32();
		if (subAuthCount === 0) {
			this._rfbInitState = "SecurityResult";
			return true;
		}
		if (this._sock.rQwait("sub auth capabilities", 16 * subAuthCount, 4)) {
			return false;
		}
		const clientSupportedTypes = {
			"STDVNOAUTH__": 1,
			"STDVVNCAUTH_": 2,
			"TGHTULGNAUTH": 129
		};
		const serverSupportedTypes = [];
		for (let i = 0; i < subAuthCount; i++) {
			this._sock.rQshift32();
			const capabilities = this._sock.rQshiftStr(12);
			serverSupportedTypes.push(capabilities);
		}
		Debug("Server Tight authentication types: " + serverSupportedTypes);
		for (let authType in clientSupportedTypes) {
			if (serverSupportedTypes.indexOf(authType) != -1) {
				this._sock.sQpush32(clientSupportedTypes[authType]);
				this._sock.flush();
				Debug("Selected authentication type: " + authType);
				switch (authType) {
					case "STDVNOAUTH__":
						this._rfbInitState = "SecurityResult";
						return true;
					case "STDVVNCAUTH_":
						this._rfbAuthScheme = 2;
						return true;
					case "TGHTULGNAUTH":
						this._rfbAuthScheme = 129;
						return true;
				}
			}
		}
		return this._fail("No supported sub-auth types!");
	}
	_handleRSAAESCredentialsRequired(event) {
		this.dispatchEvent(event);
	}
	_handleRSAAESServerVerification(event) {
		this.dispatchEvent(event);
	}
	_negotiateRA2neAuth() {
		if (this._rfbRSAAESAuthenticationState === null) {
			this._rfbRSAAESAuthenticationState = new RSAAESAuthenticationState(this._sock, () => this._rfbCredentials);
			this._rfbRSAAESAuthenticationState.addEventListener("serververification", this._eventHandlers.handleRSAAESServerVerification);
			this._rfbRSAAESAuthenticationState.addEventListener("credentialsrequired", this._eventHandlers.handleRSAAESCredentialsRequired);
		}
		this._rfbRSAAESAuthenticationState.checkInternalEvents();
		if (!this._rfbRSAAESAuthenticationState.hasStarted) {
			this._rfbRSAAESAuthenticationState.negotiateRA2neAuthAsync().catch((e) => {
				if (e.message !== "disconnect normally") {
					this._fail(e.message);
				}
			}).then(() => {
				this._rfbInitState = "SecurityResult";
				return true;
			}).finally(() => {
				this._rfbRSAAESAuthenticationState.removeEventListener("serververification", this._eventHandlers.handleRSAAESServerVerification);
				this._rfbRSAAESAuthenticationState.removeEventListener("credentialsrequired", this._eventHandlers.handleRSAAESCredentialsRequired);
				this._rfbRSAAESAuthenticationState = null;
			});
		}
		return false;
	}
	_negotiateMSLogonIIAuth() {
		if (this._sock.rQwait("mslogonii dh param", 24)) {
			return false;
		}
		if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
			this.dispatchEvent(new CustomEvent("credentialsrequired", { detail: { types: ["username", "password"] } }));
			return false;
		}
		const g = this._sock.rQshiftBytes(8);
		const p = this._sock.rQshiftBytes(8);
		const A = this._sock.rQshiftBytes(8);
		const dhKey = legacyCrypto.e({
			name: "DH",
			g,
			p
		});
		const B = legacyCrypto.f(0, dhKey.publicKey);
		const secret = legacyCrypto.h({ public: A }, dhKey.privateKey, 64);
		const key = legacyCrypto.d(0, secret, { a: "DES-CBC" });
		const username = encodeUTF8(this._rfbCredentials.username).substring(0, 255);
		const password = encodeUTF8(this._rfbCredentials.password).substring(0, 63);
		let usernameBytes = new Uint8Array(256);
		let passwordBytes = new Uint8Array(64);
		window.crypto.getRandomValues(usernameBytes);
		window.crypto.getRandomValues(passwordBytes);
		for (let i = 0; i < username.length; i++) {
			usernameBytes[i] = username.charCodeAt(i);
		}
		usernameBytes[username.length] = 0;
		for (let i = 0; i < password.length; i++) {
			passwordBytes[i] = password.charCodeAt(i);
		}
		passwordBytes[password.length] = 0;
		usernameBytes = legacyCrypto.b({
			name: "b",
			iv: secret
		}, key, usernameBytes);
		passwordBytes = legacyCrypto.b({
			name: "b",
			iv: secret
		}, key, passwordBytes);
		this._sock.sQpushBytes(B);
		this._sock.sQpushBytes(usernameBytes);
		this._sock.sQpushBytes(passwordBytes);
		this._sock.flush();
		this._rfbInitState = "SecurityResult";
		return true;
	}
	_negotiateAuthentication() {
		switch (this._rfbAuthScheme) {
			case 1:
				if (this._rfbVersion >= 3.8) {
					this._rfbInitState = "SecurityResult";
				} else {
					this._rfbInitState = "ClientInitialisation";
				}
				return true;
			case 22: return this._negotiateXvpAuth();
			case 30: return this._negotiateARDAuth();
			case 2: return this._negotiateStdVNCAuth();
			case 16: return this._negotiateTightAuth();
			case 19: return this._negotiateVeNCryptAuth();
			case 256: return this._negotiatePlainAuth();
			case 129: return this._negotiateTightUnixAuth();
			case 6: return this._negotiateRA2neAuth();
			case 113: return this._negotiateMSLogonIIAuth();
			default: return this._fail("Unsupported auth scheme (scheme: " + this._rfbAuthScheme + ")");
		}
	}
	_handleSecurityResult() {
		if (this._sock.rQwait("VNC auth response ", 4)) {
			return false;
		}
		const status = this._sock.rQshift32();
		if (status === 0) {
			this._rfbInitState = "ClientInitialisation";
			Debug("Authentication OK");
			return true;
		} else {
			if (this._rfbVersion >= 3.8) {
				this._rfbInitState = "SecurityReason";
				this._securityContext = "security result";
				this._securityStatus = status;
				return true;
			} else {
				this.dispatchEvent(new CustomEvent("securityfailure", { detail: { status } }));
				return this._fail("Security handshake failed");
			}
		}
	}
	_negotiateServerInit() {
		if (this._sock.rQwait("server initialization", 24)) {
			return false;
		}
		/* Screen size */
		const width = this._sock.rQshift16();
		const height = this._sock.rQshift16();
		/* PIXEL_FORMAT */
		const bpp = this._sock.rQshift8();
		const depth = this._sock.rQshift8();
		const bigEndian = this._sock.rQshift8();
		const trueColor = this._sock.rQshift8();
		const redMax = this._sock.rQshift16();
		const greenMax = this._sock.rQshift16();
		const blueMax = this._sock.rQshift16();
		const redShift = this._sock.rQshift8();
		const greenShift = this._sock.rQshift8();
		const blueShift = this._sock.rQshift8();
		this._sock.rQskipBytes(3);
		// NB(directxman12): we don't want to call any callbacks or print messages until
		//                   *after* we're past the point where we could backtrack
		/* Connection name/title */
		const nameLength = this._sock.rQshift32();
		if (this._sock.rQwait("server init name", nameLength, 24)) {
			return false;
		}
		let name = this._sock.rQshiftStr(nameLength);
		name = decodeUTF8(name, true);
		if (this._rfbTightVNC) {
			if (this._sock.rQwait("TightVNC extended server init header", 8, 24 + nameLength)) {
				return false;
			}
			// In TightVNC mode, ServerInit message is extended
			const numServerMessages = this._sock.rQshift16();
			const numClientMessages = this._sock.rQshift16();
			const numEncodings = this._sock.rQshift16();
			this._sock.rQskipBytes(2);
			const totalMessagesLength = (numServerMessages + numClientMessages + numEncodings) * 16;
			if (this._sock.rQwait("TightVNC extended server init header", totalMessagesLength, 32 + nameLength)) {
				return false;
			}
			// we don't actually do anything with the capability information that TIGHT sends,
			// so we just skip the all of this.
			// TIGHT server message capabilities
			this._sock.rQskipBytes(16 * numServerMessages);
			// TIGHT client message capabilities
			this._sock.rQskipBytes(16 * numClientMessages);
			// TIGHT encoding capabilities
			this._sock.rQskipBytes(16 * numEncodings);
		}
		// NB(directxman12): these are down here so that we don't run them multiple times
		//                   if we backtrack
		Info("Screen: " + width + "x" + height + ", bpp: " + bpp + ", depth: " + depth + ", bigEndian: " + bigEndian + ", trueColor: " + trueColor + ", redMax: " + redMax + ", greenMax: " + greenMax + ", blueMax: " + blueMax + ", redShift: " + redShift + ", greenShift: " + greenShift + ", blueShift: " + blueShift);
		// we're past the point where we could backtrack, so it's safe to call this
		this._setDesktopName(name);
		this._resize(width, height);
		if (!this._viewOnly) {
			this._keyboard.grab();
			this._asyncClipboard.grab();
		}
		this._fbDepth = 24;
		if (this._fbName === "Intel(r) AMT KVM") {
			Warn("Intel AMT KVM only supports 8/16 bit depths. Using low color mode.");
			this._fbDepth = 8;
		}
		RFB.b.h(this._sock, this._fbDepth);
		this._sendEncodings();
		RFB.b.i(this._sock, false, 0, 0, this._fbWidth, this._fbHeight);
		this._updateConnectionState("connected");
		return true;
	}
	_sendEncodings() {
		const encs = [];
		// In preference order
		encs.push(1);
		// Only supported with full depth support
		if (this._fbDepth == 24) {
			if (supportsWebCodecsH264Decode) {
				encs.push(50);
			}
			encs.push(7);
			encs.push(-260);
			encs.push(16);
			encs.push(21);
			encs.push(5);
			encs.push(2);
			encs.push(6);
		}
		encs.push(0);
		// Psuedo-encoding settings
		encs.push(-32 + this._qualityLevel);
		encs.push(-256 + this._compressionLevel);
		encs.push(-223);
		encs.push(-224);
		encs.push(-258);
		encs.push(-261);
		encs.push(-308);
		encs.push(-309);
		encs.push(-312);
		encs.push(-313);
		encs.push(-307);
		encs.push(encodings.b);
		encs.push(-316);
		if (this._fbDepth == 24) {
			encs.push(encodings.a);
			encs.push(-239);
		}
		RFB.b.j(this._sock, encs);
	}
	/* RFB protocol initialization states:
	*   ProtocolVersion
	*   Security
	*   Authentication
	*   SecurityResult
	*   ClientInitialization - not triggered by server message
	*   ServerInitialization
	*/
	_initMsg() {
		switch (this._rfbInitState) {
			case "ProtocolVersion": return this._negotiateProtocolVersion();
			case "Security": return this._negotiateSecurity();
			case "Authentication": return this._negotiateAuthentication();
			case "SecurityResult": return this._handleSecurityResult();
			case "SecurityReason": return this._handleSecurityReason();
			case "ClientInitialisation":
				this._sock.sQpush8(this._shared ? 1 : 0);
				this._sock.flush();
				this._rfbInitState = "ServerInitialisation";
				return true;
			case "ServerInitialisation": return this._negotiateServerInit();
			default: return this._fail("Unknown init state (state: " + this._rfbInitState + ")");
		}
	}
	// Resume authentication handshake after it was paused for some
	// reason, e.g. waiting for a password from the user
	_resumeAuthentication() {
		// We use setTimeout() so it's run in its own context, just like
		// it originally did via the WebSocket's event handler
		setTimeout(this._initMsg.bind(this), 0);
	}
	_handleSetColourMapMsg() {
		Debug("SetColorMapEntries");
		return this._fail("Unexpected SetColorMapEntries message");
	}
	_writeClipboard(text) {
		if (this._viewOnly) return;
		if (this._asyncClipboard.writeClipboard(text)) return;
		// Fallback clipboard
		this.dispatchEvent(new CustomEvent("clipboard", { detail: { text } }));
	}
	_handleServerCutText() {
		Debug("ServerCutText");
		if (this._sock.rQwait("ServerCutText header", 7, 1)) {
			return false;
		}
		this._sock.rQskipBytes(3);
		let length = this._sock.rQshift32();
		length = toSigned32bit(length);
		if (this._sock.rQwait("ServerCutText content", Math.abs(length), 8)) {
			return false;
		}
		if (length >= 0) {
			//Standard msg
			const text = this._sock.rQshiftStr(length);
			if (this._viewOnly) {
				return true;
			}
			this._writeClipboard(text);
		} else {
			//Extended msg.
			length = Math.abs(length);
			const flags = this._sock.rQshift32();
			let formats = flags & 65535;
			let actions = flags & 4278190080;
			let isCaps = !!(actions & extendedClipboardActionCaps);
			if (isCaps) {
				this._clipboardServerCapabilitiesFormats = {};
				this._clipboardServerCapabilitiesActions = {};
				// Update our server capabilities for Formats
				for (let i = 0; i <= 15; i++) {
					let index = 1 << i;
					// Check if format flag is set.
					if (formats & index) {
						this._clipboardServerCapabilitiesFormats[index] = true;
						// We don't send unsolicited clipboard, so we
						// ignore the size
						this._sock.rQshift32();
					}
				}
				// Update our server capabilities for Actions
				for (let i = 24; i <= 31; i++) {
					let index = 1 << i;
					this._clipboardServerCapabilitiesActions[index] = !!(actions & index);
				}
				/*  Caps handling done, send caps with the clients
				capabilities set as a response */
				let clientActions = [
					extendedClipboardActionCaps,
					extendedClipboardActionRequest,
					extendedClipboardActionPeek,
					extendedClipboardActionNotify,
					extendedClipboardActionProvide
				];
				RFB.b.k(this._sock, clientActions, { extendedClipboardFormatText: 0 });
			} else if (actions === extendedClipboardActionRequest) {
				if (this._viewOnly) {
					return true;
				}
				// Check if server has told us it can handle Provide and there is clipboard data to send.
				if (this._clipboardText != null && this._clipboardServerCapabilitiesActions[extendedClipboardActionProvide]) {
					if (formats & 1) {
						RFB.b.l(this._sock, [1], [this._clipboardText]);
					}
				}
			} else if (actions === extendedClipboardActionPeek) {
				if (this._viewOnly) {
					return true;
				}
				if (this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]) {
					if (this._clipboardText != null) {
						RFB.b.c(this._sock, [1]);
					} else {
						RFB.b.c(this._sock, []);
					}
				}
			} else if (actions === extendedClipboardActionNotify) {
				if (this._viewOnly) {
					return true;
				}
				if (this._clipboardServerCapabilitiesActions[extendedClipboardActionRequest]) {
					if (formats & 1) {
						RFB.b.m(this._sock, [1]);
					}
				}
			} else if (actions === extendedClipboardActionProvide) {
				if (this._viewOnly) {
					return true;
				}
				if (!(formats & 1)) {
					return true;
				}
				// Ignore what we had in our clipboard client side.
				this._clipboardText = null;
				// FIXME: Should probably verify that this data was actually requested
				let zlibStream = this._sock.rQshiftBytes(length - 4);
				let streamInflator = new Inflate();
				let textData = null;
				streamInflator.setInput(zlibStream);
				for (let i = 0; i <= 15; i++) {
					let format = 1 << i;
					if (formats & format) {
						let size = 0;
						let sizeArray = streamInflator.inflate(4);
						size |= sizeArray[0] << 24;
						size |= sizeArray[1] << 16;
						size |= sizeArray[2] << 8;
						size |= sizeArray[3];
						let chunk = streamInflator.inflate(size);
						if (format === 1) {
							textData = chunk;
						}
					}
				}
				streamInflator.setInput(null);
				if (textData !== null) {
					let tmpText = "";
					for (let i = 0; i < textData.length; i++) {
						tmpText += String.fromCharCode(textData[i]);
					}
					textData = tmpText;
					textData = decodeUTF8(textData);
					if (textData.length > 0 && "\0" === textData.charAt(textData.length - 1)) {
						textData = textData.slice(0, -1);
					}
					textData = textData.replaceAll("\r\n", "\n");
					this._writeClipboard(textData);
				}
			} else {
				return this._fail("Unexpected action in extended clipboard message: " + actions);
			}
		}
		return true;
	}
	_handleServerFenceMsg() {
		if (this._sock.rQwait("ServerFence header", 8, 1)) {
			return false;
		}
		this._sock.rQskipBytes(3);
		let flags = this._sock.rQshift32();
		let length = this._sock.rQshift8();
		if (this._sock.rQwait("ServerFence payload", length, 9)) {
			return false;
		}
		if (length > 64) {
			Warn("Bad payload length (" + length + ") in fence response");
			length = 64;
		}
		const payload = this._sock.rQshiftStr(length);
		this._supportsFence = true;
		/*
		* Fence flags
		*
		*  (1<<0)  - BlockBefore
		*  (1<<1)  - BlockAfter
		*  (1<<2)  - SyncNext
		*  (1<<31) - Request
		*/
		if (!(flags & 1 << 31)) {
			return this._fail("Unexpected fence response");
		}
		// Filter out unsupported flags
		// FIXME: support syncNext
		flags &= 3;
		// BlockBefore and BlockAfter are automatically handled by
		// the fact that we process each incoming message
		// synchronuosly.
		RFB.b.n(this._sock, flags, payload);
		return true;
	}
	_handleXvpMsg() {
		if (this._sock.rQwait("XVP version and message", 3, 1)) {
			return false;
		}
		this._sock.rQskipBytes(1);
		const xvpVer = this._sock.rQshift8();
		const xvpMsg = this._sock.rQshift8();
		switch (xvpMsg) {
			case 0:
				Error$1("XVP operation failed");
				break;
			case 1:
				this._rfbXvpVer = xvpVer;
				Info("XVP extensions enabled (version " + this._rfbXvpVer + ")");
				this._setCapability("power", true);
				break;
			default:
				this._fail("Illegal server XVP message (msg: " + xvpMsg + ")");
				break;
		}
		return true;
	}
	_normalMsg() {
		let msgType;
		if (this._FBU.rects > 0) {
			msgType = 0;
		} else {
			msgType = this._sock.rQshift8();
		}
		let first, ret;
		switch (msgType) {
			case 0:
				ret = this._framebufferUpdate();
				if (ret && !this._enabledContinuousUpdates) {
					RFB.b.i(this._sock, true, 0, 0, this._fbWidth, this._fbHeight);
				}
				return ret;
			case 1: return this._handleSetColourMapMsg();
			case 2:
				Debug("Bell");
				this.dispatchEvent(new CustomEvent("bell", { detail: {} }));
				return true;
			case 3: return this._handleServerCutText();
			case 150:
				first = !this._supportsContinuousUpdates;
				this._supportsContinuousUpdates = true;
				this._enabledContinuousUpdates = false;
				if (first) {
					this._enabledContinuousUpdates = true;
					this._updateContinuousUpdates();
					Info("Enabling continuous updates.");
				}
				return true;
			case 248: return this._handleServerFenceMsg();
			case 250: return this._handleXvpMsg();
			default:
				this._fail("Unexpected server message (type " + msgType + ")");
				Debug("sock.rQpeekBytes(30): " + this._sock.rQpeekBytes(30));
				return true;
		}
	}
	_framebufferUpdate() {
		if (this._FBU.rects === 0) {
			if (this._sock.rQwait("FBU header", 3, 1)) {
				return false;
			}
			this._sock.rQskipBytes(1);
			this._FBU.rects = this._sock.rQshift16();
			// Make sure the previous frame is fully rendered first
			// to avoid building up an excessive queue
			if (this._display.pending()) {
				this._flushing = true;
				this._display.flush().then(() => {
					this._flushing = false;
					// Resume processing
					if (!this._sock.rQwait("message", 1)) {
						this._handleMessage();
					}
				});
				return false;
			}
		}
		while (this._FBU.rects > 0) {
			if (this._FBU.encoding === null) {
				if (this._sock.rQwait("rect header", 12)) {
					return false;
				}
				/* New FramebufferUpdate */
				this._FBU.x = this._sock.rQshift16();
				this._FBU.y = this._sock.rQshift16();
				this._FBU.width = this._sock.rQshift16();
				this._FBU.height = this._sock.rQshift16();
				this._FBU.encoding = this._sock.rQshift32();
				/* Encodings are signed */
				this._FBU.encoding >>= 0;
			}
			if (!this._handleRect()) {
				return false;
			}
			this._FBU.rects--;
			this._FBU.encoding = null;
		}
		this._display.flip();
		return true;
	}
	_handleRect() {
		switch (this._FBU.encoding) {
			case -224:
				this._FBU.rects = 1;
				return true;
			case encodings.a: return this._handleVMwareCursor();
			case -239: return this._handleCursor();
			case -258:
				this._qemuExtKeyEventSupported = true;
				return true;
			case -307: return this._handleDesktopName();
			case -223:
				this._resize(this._FBU.width, this._FBU.height);
				return true;
			case -308: return this._handleExtendedDesktopSize();
			case -316:
				this._extendedPointerEventSupported = true;
				return true;
			case -261: return this._handleLedEvent();
			default: return this._handleDataRect();
		}
	}
	_handleVMwareCursor() {
		const hotx = this._FBU.x;
		const hoty = this._FBU.y;
		const w = this._FBU.width;
		const h = this._FBU.height;
		if (this._sock.rQwait("VMware cursor encoding", 1)) {
			return false;
		}
		const cursorType = this._sock.rQshift8();
		this._sock.rQshift8();
		let rgba;
		//Classic cursor
		if (cursorType == 0) {
			rgba = new Array(w * h * 4);
			if (this._sock.rQwait("VMware cursor classic encoding", w * h * 4 * 2, 2)) {
				return false;
			}
			let andMask = new Array(w * h);
			for (let pixel = 0; pixel < w * h; pixel++) {
				andMask[pixel] = this._sock.rQshift32();
			}
			let xorMask = new Array(w * h);
			for (let pixel = 0; pixel < w * h; pixel++) {
				xorMask[pixel] = this._sock.rQshift32();
			}
			for (let pixel = 0; pixel < w * h; pixel++) {
				if (andMask[pixel] == 0) {
					//Fully opaque pixel
					let bgr = xorMask[pixel];
					let r = bgr >> 8 & 255;
					let g = bgr >> 16 & 255;
					let b = bgr >> 24 & 255;
					rgba[pixel * 4] = r;
					rgba[pixel * 4 + 1] = g;
					rgba[pixel * 4 + 2] = b;
					rgba[pixel * 4 + 3] = 255;
				} else if ((andMask[pixel] & -256) == -256) {
					//Only screen value matters, no mouse colouring
					if (xorMask[pixel] == 0) {
						//Transparent pixel
						rgba[pixel * 4] = 0;
						rgba[pixel * 4 + 1] = 0;
						rgba[pixel * 4 + 2] = 0;
						rgba[pixel * 4 + 3] = 0;
					} else if ((xorMask[pixel] & -256) == -256) {
						//Inverted pixel, not supported in browsers.
						//Fully opaque instead.
						rgba[pixel * 4] = 0;
						rgba[pixel * 4 + 1] = 0;
						rgba[pixel * 4 + 2] = 0;
						rgba[pixel * 4 + 3] = 255;
					} else {
						//Unhandled xorMask
						rgba[pixel * 4] = 0;
						rgba[pixel * 4 + 1] = 0;
						rgba[pixel * 4 + 2] = 0;
						rgba[pixel * 4 + 3] = 255;
					}
				} else {
					//Unhandled andMask
					rgba[pixel * 4] = 0;
					rgba[pixel * 4 + 1] = 0;
					rgba[pixel * 4 + 2] = 0;
					rgba[pixel * 4 + 3] = 255;
				}
			}
		} else if (cursorType == 1) {
			if (this._sock.rQwait("VMware cursor alpha encoding", w * h * 4, 2)) {
				return false;
			}
			rgba = new Array(w * h * 4);
			for (let pixel = 0; pixel < w * h; pixel++) {
				let data = this._sock.rQshift32();
				rgba[pixel * 4] = data >> 24 & 255;
				rgba[pixel * 4 + 1] = data >> 16 & 255;
				rgba[pixel * 4 + 2] = data >> 8 & 255;
				rgba[pixel * 4 + 3] = data & 255;
			}
		} else {
			Warn("The given cursor type is not supported: " + cursorType + " given.");
			return false;
		}
		this._updateCursor(rgba, hotx, hoty, w, h);
		return true;
	}
	_handleCursor() {
		const hotx = this._FBU.x;
		const hoty = this._FBU.y;
		const w = this._FBU.width;
		const h = this._FBU.height;
		const pixelslength = w * h * 4;
		const masklength = Math.ceil(w / 8) * h;
		let bytes = pixelslength + masklength;
		if (this._sock.rQwait("cursor encoding", bytes)) {
			return false;
		}
		// Decode from BGRX pixels + bit mask to RGBA
		const pixels = this._sock.rQshiftBytes(pixelslength);
		const mask = this._sock.rQshiftBytes(masklength);
		let rgba = new Uint8Array(w * h * 4);
		let pixIdx = 0;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let maskIdx = y * Math.ceil(w / 8) + Math.floor(x / 8);
				let alpha = mask[maskIdx] << x % 8 & 128 ? 255 : 0;
				rgba[pixIdx] = pixels[pixIdx + 2];
				rgba[pixIdx + 1] = pixels[pixIdx + 1];
				rgba[pixIdx + 2] = pixels[pixIdx];
				rgba[pixIdx + 3] = alpha;
				pixIdx += 4;
			}
		}
		this._updateCursor(rgba, hotx, hoty, w, h);
		return true;
	}
	_handleDesktopName() {
		if (this._sock.rQwait("DesktopName", 4)) {
			return false;
		}
		let length = this._sock.rQshift32();
		if (this._sock.rQwait("DesktopName", length, 4)) {
			return false;
		}
		let name = this._sock.rQshiftStr(length);
		name = decodeUTF8(name, true);
		this._setDesktopName(name);
		return true;
	}
	_handleLedEvent() {
		if (this._sock.rQwait("LED status", 1)) {
			return false;
		}
		let data = this._sock.rQshift8();
		// ScrollLock state can be retrieved with data & 1. This is currently not needed.
		let numLock = data & 2 ? true : false;
		let capsLock = data & 4 ? true : false;
		this._remoteCapsLock = capsLock;
		this._remoteNumLock = numLock;
		return true;
	}
	_handleExtendedDesktopSize() {
		if (this._sock.rQwait("ExtendedDesktopSize", 4)) {
			return false;
		}
		const numberOfScreens = this._sock.rQpeek8();
		let bytes = 4 + numberOfScreens * 16;
		if (this._sock.rQwait("ExtendedDesktopSize", bytes)) {
			return false;
		}
		const firstUpdate = !this._supportsSetDesktopSize;
		this._supportsSetDesktopSize = true;
		this._sock.rQskipBytes(1);
		this._sock.rQskipBytes(3);
		for (let i = 0; i < numberOfScreens; i += 1) {
			// Save the id and flags of the first screen
			if (i === 0) {
				this._screenID = this._sock.rQshift32();
				this._sock.rQskipBytes(2);
				this._sock.rQskipBytes(2);
				this._sock.rQskipBytes(2);
				this._sock.rQskipBytes(2);
				this._screenFlags = this._sock.rQshift32();
			} else {
				this._sock.rQskipBytes(16);
			}
		}
		/*
		* The x-position indicates the reason for the change:
		*
		*  0 - server resized on its own
		*  1 - this client requested the resize
		*  2 - another client requested the resize
		*/
		if (this._FBU.x === 1) {
			this._pendingRemoteResize = false;
		}
		// We need to handle errors when we requested the resize.
		if (this._FBU.x === 1 && this._FBU.y !== 0) {
			let msg = "";
			// The y-position indicates the status code from the server
			switch (this._FBU.y) {
				case 1:
					msg = "Resize is administratively prohibited";
					break;
				case 2:
					msg = "Out of resources";
					break;
				case 3:
					msg = "Invalid screen layout";
					break;
				default:
					msg = "Unknown reason";
					break;
			}
			Warn("Server did not accept the resize request: " + msg);
		} else {
			this._resize(this._FBU.width, this._FBU.height);
		}
		// Normally we only apply the current resize mode after a
		// window resize event. However there is no such trigger on the
		// initial connect. And we don't know if the server supports
		// resizing until we've gotten here.
		if (firstUpdate) {
			this._requestRemoteResize();
		}
		if (this._FBU.x === 1 && this._FBU.y === 0) {
			// We might have resized again whilst waiting for the
			// previous request, so check if we are in sync
			this._requestRemoteResize();
		}
		return true;
	}
	_handleDataRect() {
		let decoder = this._decoders[this._FBU.encoding];
		if (!decoder) {
			this._fail("Unsupported encoding (encoding: " + this._FBU.encoding + ")");
			return false;
		}
		try {
			return decoder.decodeRect(this._FBU.x, this._FBU.y, this._FBU.width, this._FBU.height, this._sock, this._display, this._fbDepth);
		} catch (err) {
			this._fail("Error decoding rect: " + err);
			return false;
		}
	}
	_updateContinuousUpdates() {
		if (!this._enabledContinuousUpdates) {
			return;
		}
		RFB.b.o(this._sock, 0, 0, 0, this._fbWidth, this._fbHeight);
	}
	// Handle resize-messages from the server
	_resize(width, height) {
		this._fbWidth = width;
		this._fbHeight = height;
		this._display.resize(this._fbWidth, this._fbHeight);
		// Adjust the visible viewport based on the new dimensions
		this._updateClip();
		this._updateScale();
		this._updateContinuousUpdates();
		// Keep this size until browser client size changes
		this._saveExpectedClientSize();
	}
	_xvpOp(ver, op) {
		if (this._rfbXvpVer < ver) {
			return;
		}
		Info("Sending XVP operation " + op + " (version " + ver + ")");
		RFB.b.p(this._sock, ver, op);
	}
	_updateCursor(rgba, hotx, hoty, w, h) {
		this._cursorImage = {
			rgbaPixels: rgba,
			hotx,
			hoty,
			w,
			h
		};
		this._refreshCursor();
	}
	_shouldShowDotCursor() {
		// Called when this._cursorImage is updated
		if (!this._showDotCursor) {
			// User does not want to see the dot, so...
			return false;
		}
		// The dot should not be shown if the cursor is already visible,
		// i.e. contains at least one not-fully-transparent pixel.
		// So iterate through all alpha bytes in rgba and stop at the
		// first non-zero.
		for (let i = 3; i < this._cursorImage.rgbaPixels.length; i += 4) {
			if (this._cursorImage.rgbaPixels[i]) {
				return false;
			}
		}
		// At this point, we know that the cursor is fully transparent, and
		// the user wants to see the dot instead of this.
		return true;
	}
	_refreshCursor() {
		if (this._rfbConnectionState !== "connecting" && this._rfbConnectionState !== "connected") {
			return;
		}
		const image = this._shouldShowDotCursor() ? RFB.a.b : this._cursorImage;
		this._cursor.change(image.rgbaPixels, image.hotx, image.hoty, image.w, image.h);
	}
	static d(password, challenge) {
		const passwordChars = password.split("").map((c) => c.charCodeAt(0));
		const key = legacyCrypto.d(0, passwordChars, { a: "DES-ECB" });
		return legacyCrypto.b({ name: "b" }, key, challenge);
	}
}
// Class Methods
RFB.b = {
	b(sock, keysym, down) {
		sock.sQpush8(4);
		sock.sQpush8(down);
		sock.sQpush16(0);
		sock.sQpush32(keysym);
		sock.flush();
	},
	a(sock, keysym, down, keycode) {
		function getRFBkeycode(xtScanCode) {
			const upperByte = keycode >> 8;
			const lowerByte = keycode & 255;
			if (upperByte === 224 && lowerByte < 127) {
				return lowerByte | 128;
			}
			return xtScanCode;
		}
		sock.sQpush8(255);
		sock.sQpush8(0);
		sock.sQpush16(down);
		sock.sQpush32(keysym);
		const RFBkeycode = getRFBkeycode(keycode);
		sock.sQpush32(RFBkeycode);
		sock.flush();
	},
	g(sock, x, y, mask) {
		sock.sQpush8(5);
		// Marker bit must be set to 0, otherwise the server might
		// confuse the marker bit with the highest bit in a normal
		// PointerEvent message.
		mask = mask & 127;
		sock.sQpush8(mask);
		sock.sQpush16(x);
		sock.sQpush16(y);
		sock.flush();
	},
	f(sock, x, y, mask) {
		sock.sQpush8(5);
		let higherBits = mask >> 7 & 255;
		// Bits 2-7 are reserved
		if (higherBits & 252) {
			throw new Error("Invalid mouse button mask: " + mask);
		}
		let lowerBits = mask & 127;
		lowerBits |= 128;
		sock.sQpush8(lowerBits);
		sock.sQpush16(x);
		sock.sQpush16(y);
		sock.sQpush8(higherBits);
		sock.flush();
	},
	q(actions, formats) {
		let data = new Uint8Array(4);
		let formatFlag = 0;
		let actionFlag = 0;
		for (let i = 0; i < actions.length; i++) {
			actionFlag |= actions[i];
		}
		for (let i = 0; i < formats.length; i++) {
			formatFlag |= formats[i];
		}
		data[0] = actionFlag >> 24;
		data[1] = 0;
		data[2] = 0;
		data[3] = formatFlag;
		return data;
	},
	l(sock, formats, inData) {
		// Deflate incomming data and their sizes
		let deflator = new Deflator();
		let dataToDeflate = [];
		for (let i = 0; i < 1; i++) {
			// We only support the format Text at this time
			if (formats[i] != 1) {
				throw new Error("Unsupported extended clipboard format for Provide message.");
			}
			// Change lone \r or \n into \r\n as defined in rfbproto
			inData[i] = inData[i].replace(/\r\n|\r|\n/gm, "\r\n");
			// Check if it already has \0
			let text = encodeUTF8(inData[i] + "\0");
			dataToDeflate.push(text.length >> 24 & 255, text.length >> 16 & 255, text.length >> 8 & 255, text.length & 255);
			for (let j = 0; j < text.length; j++) {
				dataToDeflate.push(text.charCodeAt(j));
			}
		}
		let deflatedData = deflator.d(new Uint8Array(dataToDeflate));
		// Build data  to send
		let data = new Uint8Array(4 + deflatedData.length);
		data.set(RFB.b.q([extendedClipboardActionProvide], formats));
		data.set(deflatedData, 4);
		RFB.b.d(sock, data, true);
	},
	c(sock, formats) {
		let flags = RFB.b.q([extendedClipboardActionNotify], formats);
		RFB.b.d(sock, flags, true);
	},
	m(sock, formats) {
		let flags = RFB.b.q([extendedClipboardActionRequest], formats);
		RFB.b.d(sock, flags, true);
	},
	k(sock, actions, formats) {
		let formatKeys = Object.keys(formats);
		let data = new Uint8Array(4 + 4 * formatKeys.length);
		formatKeys.map((x) => parseInt(x));
		formatKeys.sort((a, b) => a - b);
		data.set(RFB.b.q(actions, []));
		let loopOffset = 4;
		for (let i = 0; i < formatKeys.length; i++) {
			data[loopOffset] = formats[formatKeys[i]] >> 24;
			data[loopOffset + 1] = formats[formatKeys[i]] >> 16;
			data[loopOffset + 2] = formats[formatKeys[i]] >> 8;
			data[loopOffset + 3] = formats[formatKeys[i]] >> 0;
			loopOffset += 4;
			data[3] |= 1 << formatKeys[i];
		}
		RFB.b.d(sock, data, true);
	},
	d(sock, data, extended = false) {
		sock.sQpush8(6);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(0);
		let length;
		if (extended) {
			length = toUnsigned32bit(-data.length);
		} else {
			length = data.length;
		}
		sock.sQpush32(length);
		sock.sQpushBytes(data);
		sock.flush();
	},
	e(sock, width, height, id, flags) {
		sock.sQpush8(251);
		sock.sQpush8(0);
		sock.sQpush16(width);
		sock.sQpush16(height);
		sock.sQpush8(1);
		sock.sQpush8(0);
		// screen array
		sock.sQpush32(id);
		sock.sQpush16(0);
		sock.sQpush16(0);
		sock.sQpush16(width);
		sock.sQpush16(height);
		sock.sQpush32(flags);
		sock.flush();
	},
	n(sock, flags, payload) {
		sock.sQpush8(248);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush32(flags);
		sock.sQpush8(payload.length);
		sock.sQpushString(payload);
		sock.flush();
	},
	o(sock, __unused_6A34, __unused_2BE2, __unused_7A43_0, width, height) {
		sock.sQpush8(150);
		sock.sQpush8(true);
		sock.sQpush16(0);
		sock.sQpush16(0);
		sock.sQpush16(width);
		sock.sQpush16(height);
		sock.flush();
	},
	h(sock, depth) {
		let bpp;
		if (depth > 16) {
			bpp = 32;
		} else if (depth > 8) {
			bpp = 16;
		} else {
			bpp = 8;
		}
		const bits = Math.floor(depth / 3);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(bpp);
		sock.sQpush8(depth);
		sock.sQpush8(0);
		sock.sQpush8(1);
		sock.sQpush16((1 << bits) - 1);
		sock.sQpush16((1 << bits) - 1);
		sock.sQpush16((1 << bits) - 1);
		sock.sQpush8(bits * 0);
		sock.sQpush8(bits * 1);
		sock.sQpush8(bits * 2);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.sQpush8(0);
		sock.flush();
	},
	j(sock, encodings) {
		sock.sQpush8(2);
		sock.sQpush8(0);
		sock.sQpush16(encodings.length);
		for (let i = 0; i < encodings.length; i++) {
			sock.sQpush32(encodings[i]);
		}
		sock.flush();
	},
	i(sock, incremental, __unused_01C5, __unused_C2DE, w, h) {
		sock.sQpush8(3);
		sock.sQpush8(incremental ? 1 : 0);
		sock.sQpush16(0);
		sock.sQpush16(0);
		sock.sQpush16(w);
		sock.sQpush16(h);
		sock.flush();
	},
	p(sock, ver, op) {
		sock.sQpush8(250);
		sock.sQpush8(0);
		sock.sQpush8(ver);
		sock.sQpush8(op);
		sock.flush();
	}
};
RFB.a = {
	a: {
		rgbaPixels: new Uint8Array(),
		w: 0,
		h: 0,
		hotx: 0,
		hoty: 0
	},
	b: {
		rgbaPixels: new Uint8Array([
			255,
			255,
			255,
			255,
			0,
			0,
			0,
			255,
			255,
			255,
			255,
			255,
			0,
			0,
			0,
			255,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			255,
			255,
			255,
			255,
			255,
			0,
			0,
			0,
			255,
			255,
			255,
			255,
			255
		]),
		w: 3,
		h: 3,
		hotx: 1,
		hoty: 1
	}
};
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2025 The noVNC authors
* Licensed under MPL 2.0 or any later version (see LICENSE.txt)
*
* Wrapper around the `navigator.wakeLock` api that handles reacquiring the
* lock on visiblility changes.
*
* The `acquire` and `release` methods may be called any number of times. The
* most recent call dictates the desired end-state (if `acquire` was most
* recently called, then we will try to acquire and hold the wake lock).
*/
const _STATES = { a: "awaiting_visible" };
class TestOnlyWakeLockManagerStateChangeEvent extends Event {
	constructor(oldState, newState) {
		super("testOnlyStateChange");
		this.oldState = oldState;
		this.newState = newState;
	}
}
class WakeLockManager extends EventTarget {
	constructor() {
		super();
		this._state = "released";
		this._wakelock = null;
		this._eventHandlers = {
			wakelockAcquired: this._wakelockAcquired.bind(this),
			wakelockReleased: this._wakelockReleased.bind(this),
			documentVisibilityChange: this._documentVisibilityChange.bind(this)
		};
	}
	acquire() {
		switch (this._state) {
			case "releasing":
				// We are currently waiting to acquire the wakelock. While
				// waiting, `release()` was called. By transitioning back to
				// ACQUIRING, we will keep the lock after we receive it.
				this._transitionTo("acquiring");
				break;
			case _STATES.a:
			case "acquiring":
			case "acquired": break;
			case "error":
			case "released":
				if (document.hidden) {
					// We can not acquire the wakelock while the document is
					// hidden (eg, not the active tab). Wait until it is
					// visible, then acquire the wakelock.
					this._awaitVisible();
					break;
				}
				this._acquireWakelockNow();
				break;
		}
	}
	release() {
		switch (this._state) {
			case "error":
			case "released":
			case "releasing": break;
			case "acquiring":
				// We are have requested (but not yet received) the wakelock.
				// Give it up as soon as we acquire it.
				this._transitionTo("releasing");
				break;
			case "acquired":
				// We remove the event listener first, as we don't want to be
				// notified about this release (it is expected).
				this._wakelock.removeEventListener("release", this._eventHandlers.wakelockReleased);
				this._wakelock.release();
				this._wakelock = null;
				this._transitionTo("released");
				break;
			case _STATES.a:
				// We don't currently have the lock, but are waiting for the
				// document to become visible. By removing the event listener,
				// we will not attempt to get the wakelock in the future.
				document.removeEventListener("visibilitychange", this._eventHandlers.documentVisibilityChange);
				this._transitionTo("released");
				break;
		}
	}
	_transitionTo(newState) {
		let oldState = this._state;
		Debug(`WakelockManager transitioning ${oldState} -> ${newState}`);
		this._state = newState;
		this.dispatchEvent(new TestOnlyWakeLockManagerStateChangeEvent(oldState, newState));
	}
	_awaitVisible() {
		document.addEventListener("visibilitychange", this._eventHandlers.documentVisibilityChange);
		this._transitionTo(_STATES.a);
	}
	_acquireWakelockNow() {
		if (!("wakeLock" in navigator)) {
			Warn("Unable to request wakeLock, Browser does not have wakeLock api");
			this._transitionTo("error");
			this._transitionTo("released");
			return;
		}
		navigator.wakeLock.request("screen").then(this._eventHandlers.wakelockAcquired).catch((err) => {
			Warn("Error occurred while acquiring wakelock: " + err);
			this._transitionTo("error");
			this._transitionTo("released");
		});
		this._transitionTo("acquiring");
	}
	_wakelockAcquired(wakelock) {
		if (this._state === "releasing") {
			// We were requested to release the wakelock while we were trying to
			// acquire it. Now that we have acquired it, immediately release it.
			wakelock.release();
			this._transitionTo("released");
			return;
		}
		this._wakelock = wakelock;
		this._wakelock.addEventListener("release", this._eventHandlers.wakelockReleased);
		this._transitionTo("acquired");
	}
	_wakelockReleased() {
		this._wakelock = null;
		if (document.visibilityState === "visible") {
			Warn("Lost wakelock, but document is still visible. Not reacquiring");
			this._transitionTo("released");
			return;
		}
		this._awaitVisible();
	}
	_documentVisibilityChange() {
		if (document.visibilityState !== "visible") {
			return;
		}
		document.removeEventListener("visibilitychange", this._eventHandlers.documentVisibilityChange);
		this._acquireWakelockNow();
	}
}
/*
* noVNC: HTML5 VNC client
* Copyright (C) 2019 The noVNC authors
* Licensed under MPL 2.0 (see LICENSE.txt)
*
* See README.md for usage and integration instructions.
*/
// init log level reading the logging HTTP param
function initLogging(level) {
	if (typeof level !== "undefined") {
		initLogging$1(level);
	} else {
		const param = document.location.href.match(/logging=([A-Za-z0-9._-]*)/);
		initLogging$1(param || void 0);
	}
}
// Read a query string variable
// A URL with a query parameter can look like this (But will most probably get logged on the http server):
// https://www.example.com?myqueryparam=myvalue
//
// For privacy (Using a hastag #, the parameters will not be sent to the server)
// the url can be requested in the following way:
// https://www.example.com#myqueryparam=myvalue&password=secretvalue
//
// Even mixing public and non public parameters will work:
// https://www.example.com?nonsecretparam=example.com#password=secretvalue
function getQueryVar(name) {
	const re = new RegExp(".*[?&]" + name + "=([^&#]*)"), match = document.location.href.match(re);
	if (match) {
		return decodeURIComponent(match[1]);
	}
	return null;
}
// Read a hash fragment variable
function getHashVar(name) {
	const re = new RegExp(".*[&#]" + name + "=([^&]*)"), match = document.location.hash.match(re);
	if (match) {
		return decodeURIComponent(match[1]);
	}
	return null;
}
// Read a variable from the fragment or the query string
// Fragment takes precedence
function getConfigVar(name) {
	const val = getHashVar(name);
	if (val === null) {
		return getQueryVar(name);
	}
	return val;
}
/*
* Setting handling.
*/
let settings = {};
function initSettings() {
	if (!window.chrome || !window.chrome.storage) {
		settings = {};
		return Promise.resolve();
	}
	return new Promise((resolve) => window.chrome.storage.sync.get(resolve)).then((cfg) => {
		settings = cfg;
	});
}
// Update the settings cache, but do not write to permanent storage
function setSetting(name, value) {
	settings[name] = value;
}
// No days means only for this browser session
function writeSetting(name, value) {
	if (settings[name] === value) return;
	settings[name] = value;
	if (window.chrome && window.chrome.storage) {
		window.chrome.storage.sync.set(settings);
	} else {
		localStorageSet(name, value);
	}
}
function readSetting(name, defaultValue) {
	let value;
	if (name in settings || window.chrome && window.chrome.storage) {
		value = settings[name];
	} else {
		value = localStorageGet(name);
		settings[name] = value;
	}
	if (typeof value === "undefined") {
		value = null;
	}
	if (value === null && typeof defaultValue !== "undefined") {
		return defaultValue;
	}
	return value;
}
let loggedMsgs = [];
function logOnce(msg, level = "warn") {
	if (!loggedMsgs.includes(msg)) {
		switch (level) {
			case "warn":
				Warn(msg);
				break;
			case "debug":
				Debug(msg);
				break;
		}
		loggedMsgs.push(msg);
	}
}
let cookiesMsg = "Couldn't access noVNC settings, are cookies disabled?";
function localStorageGet(name) {
	let r;
	try {
		r = localStorage.getItem(name);
	} catch (e) {
		if (e instanceof DOMException) {
			logOnce(cookiesMsg);
			logOnce("'localStorage.getItem(" + name + ")' failed: " + e, "debug");
		} else {
			throw e;
		}
	}
	return r;
}
function localStorageSet(name, value) {
	try {
		localStorage.setItem(name, value);
	} catch (e) {
		if (e instanceof DOMException) {
			logOnce(cookiesMsg);
			logOnce("'localStorage.setItem(" + name + "," + value + ")' failed: " + e, "debug");
		} else {
			throw e;
		}
	}
}
const LINGUAS = [
	"cs",
	"de",
	"el",
	"es",
	"fr",
	"hr",
	"hu",
	"it",
	"ja",
	"ko",
	"nl",
	"pl",
	"pt_BR",
	"ru",
	"sv",
	"tr",
	"uk",
	"zh_CN",
	"zh_TW"
];
const UI = {
	a: {},
	b: false,
	c: "",
	d: null,
	e: null,
	f: null,
	g: false,
	h: false,
	i: 0,
	j: 0,
	k: null,
	l: true,
	m: null,
	n: null,
	o: new WakeLockManager(),
	async H(options) {
		UI.a = options.a;
		if (UI.a.defaults === void 0) {
			UI.a.defaults = {};
		}
		if (UI.a.mandatory === void 0) {
			UI.a.mandatory = {};
		}
		// Set up translations
		try {
			await l10n.setup(LINGUAS, "app/locale/");
		} catch (err) {
			Error$1("Failed to load translations: " + err);
		}
		// Initialize setting storage
		await initSettings();
		// Wait for the page to load
		if (document.readyState !== "interactive" && document.readyState !== "complete") {
			await new Promise((resolve) => {
				document.addEventListener("DOMContentLoaded", resolve);
			});
		}
		UI.p();
		// Translate the DOM
		l10n.translateDOM();
		// We rely on modern APIs which might not be available in an
		// insecure context
		if (!window.isSecureContext) {
			// FIXME: This gets hidden when connecting
			UI.q(_("Running without HTTPS is not recommended, crashes or other issues are likely."), "error");
		}
		// Try to fetch version number
		try {
			let response = await fetch("./package.json");
			if (!response.ok) {
				throw Error("" + response.status + " " + response.statusText);
			}
			let packageInfo = await response.json();
			Array.from(document.getElementsByClassName("noVNC_version")).forEach((el) => el.innerText = packageInfo.version);
		} catch (err) {
			Error$1("Couldn't fetch package.json: " + err);
			Array.from(document.getElementsByClassName("noVNC_version_wrapper")).concat(Array.from(document.getElementsByClassName("noVNC_version_separator"))).forEach((el) => el.style.display = "none");
		}
		// Adapt the interface for touch screen devices
		if (isTouchDevice) {
			// Remove the address bar
			setTimeout(() => window.scrollTo(0, 1), 100);
		}
		// Restore control bar position
		if (readSetting("controlbar_pos") === "right") {
			UI.r();
		}
		UI.s();
		// Setup event handlers
		UI.t();
		UI.u();
		UI.v();
		UI.w();
		UI.x();
		UI.y();
		UI.z();
		document.getElementById("noVNC_status").addEventListener("click", UI.A);
		// Bootstrap fallback input handler
		UI.B();
		UI.C();
		UI.D("a");
		document.documentElement.classList.remove("noVNC_loading");
		let autoconnect = UI.E("autoconnect");
		if (autoconnect === "true" || autoconnect == "1") {
			UI.F();
		} else {
			// Show the connect panel on first load unless autoconnecting
			UI.G();
		}
	},
	s() {
		// Only show the button if fullscreen is properly supported
		// * Safari doesn't support alphanumerical input while in fullscreen
		if (!isSafari() && (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.body.msRequestFullscreen)) {
			document.getElementById("noVNC_fullscreen_button").classList.remove("noVNC_hidden");
			UI.I();
		}
	},
	p() {
		// Logging selection dropdown
		const llevels = [
			"error",
			"warn",
			"info",
			"debug"
		];
		for (let i = 0; i < 4; i += 1) {
			UI.J(document.getElementById("noVNC_setting_logging"), llevels[i], llevels[i]);
		}
		// Settings with immediate effects
		UI.K("logging", "warn");
		UI.L();
		UI.M();
		/* Populate the controls if defaults are provided in the URL */
		UI.K("host", "");
		UI.K("port", 0);
		UI.K("encrypt", window.location.protocol === "https:");
		UI.K("password");
		UI.K("autoconnect", false);
		UI.K("view_clip", false);
		UI.K("resize", "off");
		UI.K("quality", 6);
		UI.K("compression", 2);
		UI.K("shared", true);
		UI.K("bell", "on");
		UI.K("view_only", false);
		UI.K("show_dot", false);
		UI.K("path", "websockify");
		UI.K("repeaterID", "");
		UI.K("reconnect", false);
		UI.K("reconnect_delay", 5e3);
		UI.K("keep_device_awake", false);
	},
	M() {
		const labels = document.getElementsByTagName("LABEL");
		for (let i = 0; i < labels.length; i++) {
			const htmlFor = labels[i].htmlFor;
			if (htmlFor != "") {
				const elem = document.getElementById(htmlFor);
				if (elem) elem.label = labels[i];
			} else {
				// If 'for' isn't set, use the first input element child
				const children = labels[i].children;
				for (let j = 0; j < children.length; j++) {
					if (children[j].form !== void 0) {
						children[j].label = labels[i];
						break;
					}
				}
			}
		}
	},
	t() {
		document.getElementById("noVNC_control_bar").addEventListener("mousemove", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("mouseup", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("mousedown", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("keydown", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("mousedown", UI.O);
		document.getElementById("noVNC_control_bar").addEventListener("keydown", UI.O);
		document.getElementById("noVNC_view_drag_button").addEventListener("click", UI.P);
		document.getElementById("noVNC_control_bar_handle").addEventListener("mousedown", UI.Q);
		document.getElementById("noVNC_control_bar_handle").addEventListener("mouseup", UI.R);
		document.getElementById("noVNC_control_bar_handle").addEventListener("mousemove", UI.S);
		// resize events aren't available for elements
		window.addEventListener("resize", UI.T);
		const exps = document.getElementsByClassName("noVNC_expander");
		for (let i = 0; i < exps.length; i++) {
			exps[i].addEventListener("click", UI.U);
		}
	},
	u() {
		document.getElementById("noVNC_keyboard_button").addEventListener("click", UI.V);
		UI.W = new Keyboard(document.getElementById("noVNC_keyboardinput"));
		UI.W.onkeyevent = UI.X;
		UI.W.grab();
		document.getElementById("noVNC_keyboardinput").addEventListener("input", UI.Y);
		document.getElementById("noVNC_keyboardinput").addEventListener("focus", UI.Z);
		document.getElementById("noVNC_keyboardinput").addEventListener("blur", UI.$);
		document.getElementById("noVNC_keyboardinput").addEventListener("submit", () => false);
		document.documentElement.addEventListener("mousedown", UI._, true);
		document.getElementById("noVNC_control_bar").addEventListener("touchstart", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("touchmove", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("touchend", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("input", UI.N);
		document.getElementById("noVNC_control_bar").addEventListener("touchstart", UI.O);
		document.getElementById("noVNC_control_bar").addEventListener("input", UI.O);
		document.getElementById("noVNC_control_bar_handle").addEventListener("touchstart", UI.Q);
		document.getElementById("noVNC_control_bar_handle").addEventListener("touchend", UI.R);
		document.getElementById("noVNC_control_bar_handle").addEventListener("touchmove", UI.S);
	},
	v() {
		document.getElementById("noVNC_toggle_extra_keys_button").addEventListener("click", UI.aa);
		document.getElementById("noVNC_toggle_ctrl_button").addEventListener("click", UI.ba);
		document.getElementById("noVNC_toggle_windows_button").addEventListener("click", UI.ca);
		document.getElementById("noVNC_toggle_alt_button").addEventListener("click", UI.da);
		document.getElementById("noVNC_send_tab_button").addEventListener("click", UI.ea);
		document.getElementById("noVNC_send_esc_button").addEventListener("click", UI.fa);
		document.getElementById("noVNC_send_ctrl_alt_del_button").addEventListener("click", UI.ga);
	},
	w() {
		document.getElementById("noVNC_shutdown_button").addEventListener("click", () => UI.ha.machineShutdown());
		document.getElementById("noVNC_reboot_button").addEventListener("click", () => UI.ha.machineReboot());
		document.getElementById("noVNC_reset_button").addEventListener("click", () => UI.ha.machineReset());
		document.getElementById("noVNC_power_button").addEventListener("click", UI.ia);
	},
	x() {
		document.getElementById("noVNC_disconnect_button").addEventListener("click", UI.ja);
		document.getElementById("noVNC_connect_button").addEventListener("click", UI.F);
		document.getElementById("noVNC_cancel_reconnect_button").addEventListener("click", UI.ka);
		document.getElementById("noVNC_approve_server_button").addEventListener("click", UI.la);
		document.getElementById("noVNC_reject_server_button").addEventListener("click", UI.ma);
		document.getElementById("noVNC_credentials_button").addEventListener("click", UI.na);
	},
	y() {
		document.getElementById("noVNC_clipboard_button").addEventListener("click", UI.oa);
		document.getElementById("noVNC_clipboard_text").addEventListener("change", UI.pa);
	},
	ra(name, changeFunc) {
		const settingElem = document.getElementById("noVNC_setting_" + name);
		if (changeFunc === void 0) {
			changeFunc = () => UI.qa(name);
		}
		settingElem.addEventListener("change", changeFunc);
	},
	z() {
		document.getElementById("noVNC_settings_button").addEventListener("click", UI.sa);
		UI.ra("encrypt");
		UI.ra("resize");
		UI.ra("resize", UI.ta);
		UI.ra("resize", UI.ua);
		UI.ra("quality");
		UI.ra("quality", UI.va);
		UI.ra("compression");
		UI.ra("compression", UI.wa);
		UI.ra("view_clip");
		UI.ra("view_clip", UI.ua);
		UI.ra("shared");
		UI.ra("view_only");
		UI.ra("view_only", UI.xa);
		UI.ra("show_dot");
		UI.ra("show_dot", UI.ya);
		UI.ra("keep_device_awake");
		UI.ra("keep_device_awake", UI.za);
		UI.ra("host");
		UI.ra("port");
		UI.ra("path");
		UI.ra("repeaterID");
		UI.ra("logging");
		UI.ra("logging", UI.L);
		UI.ra("reconnect");
		UI.ra("reconnect_delay");
	},
	I() {
		document.getElementById("noVNC_fullscreen_button").addEventListener("click", UI.Aa);
		window.addEventListener("fullscreenchange", UI.Ba);
		window.addEventListener("mozfullscreenchange", UI.Ba);
		window.addEventListener("webkitfullscreenchange", UI.Ba);
		window.addEventListener("msfullscreenchange", UI.Ba);
	},
	D(state) {
		document.documentElement.classList.remove("noVNC_connecting");
		document.documentElement.classList.remove("noVNC_connected");
		document.documentElement.classList.remove("noVNC_disconnecting");
		document.documentElement.classList.remove("noVNC_reconnecting");
		const transitionElem = document.getElementById("noVNC_transition_text");
		switch (state) {
			case "a": break;
			case "b":
				transitionElem.textContent = _("Connecting...");
				document.documentElement.classList.add("noVNC_connecting");
				break;
			case "c":
				document.documentElement.classList.add("noVNC_connected");
				break;
			case "d":
				transitionElem.textContent = _("Disconnecting...");
				document.documentElement.classList.add("noVNC_disconnecting");
				break;
			case "e": break;
			case "f":
				transitionElem.textContent = _("Reconnecting...");
				document.documentElement.classList.add("noVNC_reconnecting");
				break;
		}
		if (UI.b) {
			UI.ua();
			UI.Ca("encrypt");
			UI.Ca("shared");
			UI.Ca("host");
			UI.Ca("port");
			UI.Ca("path");
			UI.Ca("repeaterID");
			// Hide the controlbar after 2 seconds
			UI.f = setTimeout(UI.Da, 2e3);
		} else {
			UI.Ea("encrypt");
			UI.Ea("shared");
			UI.Ea("host");
			UI.Ea("port");
			UI.Ea("path");
			UI.Ea("repeaterID");
			UI.Fa();
			UI.O();
		}
		// State change closes dialogs as they may not be relevant
		// anymore
		UI.Ga();
		document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
		document.getElementById("noVNC_credentials_dlg").classList.remove("noVNC_open");
	},
	q(text, statusType) {
		const statusElem = document.getElementById("noVNC_status");
		if (typeof statusType === "undefined") {
			statusType = "normal";
		}
		// Don't overwrite more severe visible statuses and never
		// errors. Only shows the first error.
		if (statusElem.classList.contains("noVNC_open")) {
			if (statusElem.classList.contains("noVNC_status_error")) {
				return;
			}
			if (statusElem.classList.contains("noVNC_status_warn") && statusType === "normal") {
				return;
			}
		}
		clearTimeout(UI.d);
		switch (statusType) {
			case "error":
				statusElem.classList.remove("noVNC_status_warn");
				statusElem.classList.remove("noVNC_status_normal");
				statusElem.classList.add("noVNC_status_error");
				break;
			case "warning":
				statusElem.classList.remove("noVNC_status_error");
				statusElem.classList.remove("noVNC_status_normal");
				statusElem.classList.add("noVNC_status_warn");
				break;
			case "normal":
		}
		statusElem.textContent = text;
		statusElem.classList.add("noVNC_open");
		// Error messages do not timeout
		if (statusType !== "error") {
			UI.d = window.setTimeout(UI.A, 1500);
		}
	},
	A() {
		clearTimeout(UI.d);
		document.getElementById("noVNC_status").classList.remove("noVNC_open");
	},
	N() {
		clearTimeout(UI.e);
		// We manipulate the anchor instead of the actual control
		// bar in order to avoid creating new a stacking group
		document.getElementById("noVNC_control_bar_anchor").classList.remove("noVNC_idle");
		UI.e = window.setTimeout(UI.Ha, 2e3);
	},
	Ha() {
		// Don't fade if a child of the control bar has focus
		if (document.getElementById("noVNC_control_bar").contains(document.activeElement) && document.hasFocus()) {
			UI.N();
			return;
		}
		document.getElementById("noVNC_control_bar_anchor").classList.add("noVNC_idle");
	},
	O() {
		clearTimeout(UI.f);
	},
	C() {
		document.getElementById("noVNC_control_bar").classList.add("noVNC_open");
	},
	Da() {
		UI.Ga();
		document.getElementById("noVNC_control_bar").classList.remove("noVNC_open");
		UI.ha.focus();
	},
	Ia() {
		if (document.getElementById("noVNC_control_bar").classList.contains("noVNC_open")) {
			UI.Da();
		} else {
			UI.C();
		}
	},
	r() {
		// Temporarily disable animation, if bar is displayed, to avoid weird
		// movement. The transitionend-event will not fire when display=none.
		const bar = document.getElementById("noVNC_control_bar");
		const barDisplayStyle = window.getComputedStyle(bar).display;
		if (barDisplayStyle !== "none") {
			bar.style.transitionDuration = "0s";
			bar.addEventListener("transitionend", () => bar.style.transitionDuration = "");
		}
		const anchor = document.getElementById("noVNC_control_bar_anchor");
		if (anchor.classList.contains("noVNC_right")) {
			writeSetting("controlbar_pos", "left");
			anchor.classList.remove("noVNC_right");
		} else {
			writeSetting("controlbar_pos", "right");
			anchor.classList.add("noVNC_right");
		}
		// Consider this a movement of the handle
		UI.h = true;
		// The user has "followed" hint, let's hide it until the next drag
		UI.Ja(false, false);
	},
	Ja(show, animate = true) {
		const hint = document.getElementById("noVNC_control_bar_hint");
		if (animate) {
			hint.classList.remove("noVNC_notransition");
		} else {
			hint.classList.add("noVNC_notransition");
		}
		if (show) {
			hint.classList.add("noVNC_active");
		} else {
			hint.classList.remove("noVNC_active");
		}
	},
	S(e) {
		if (!UI.g) return;
		const ptr = getPointerEvent(e);
		const anchor = document.getElementById("noVNC_control_bar_anchor");
		if (ptr.clientX < window.innerWidth * .1) {
			if (anchor.classList.contains("noVNC_right")) {
				UI.r();
			}
		} else if (ptr.clientX > window.innerWidth * .9) {
			if (!anchor.classList.contains("noVNC_right")) {
				UI.r();
			}
		}
		if (!UI.h) {
			const dragDistance = Math.abs(ptr.clientY - UI.i);
			if (dragDistance < dragThreshold) return;
			UI.h = true;
		}
		const eventY = ptr.clientY - UI.j;
		UI.Ka(eventY);
		e.preventDefault();
		e.stopPropagation();
		UI.O();
		UI.N();
	},
	Ka(viewportRelativeY) {
		const handle = document.getElementById("noVNC_control_bar_handle");
		const handleHeight = handle.getBoundingClientRect().height;
		const controlbarBounds = document.getElementById("noVNC_control_bar").getBoundingClientRect();
		// These heights need to be non-zero for the below logic to work
		if (handleHeight === 0 || controlbarBounds.height === 0) {
			return;
		}
		let newY = viewportRelativeY;
		// Check if the coordinates are outside the control bar
		if (newY < controlbarBounds.top + 10) {
			// Force coordinates to be below the top of the control bar
			newY = controlbarBounds.top + 10;
		} else if (newY > controlbarBounds.top + controlbarBounds.height - handleHeight - 10) {
			// Force coordinates to be above the bottom of the control bar
			newY = controlbarBounds.top + controlbarBounds.height - handleHeight - 10;
		}
		// Corner case: control bar too small for stable position
		if (controlbarBounds.height < handleHeight + 20) {
			newY = controlbarBounds.top + (controlbarBounds.height - handleHeight) / 2;
		}
		// The transform needs coordinates that are relative to the parent
		const parentRelativeY = newY - controlbarBounds.top;
		handle.style.transform = "translateY(" + parentRelativeY + "px)";
	},
	T() {
		// Since the control bar is fixed on the viewport and not the page,
		// the move function expects coordinates relative the the viewport.
		const handle = document.getElementById("noVNC_control_bar_handle");
		const handleBounds = handle.getBoundingClientRect();
		UI.Ka(handleBounds.top);
	},
	R(e) {
		if (e.type == "mouseup" && e.button != 0) return;
		// mouseup and mousedown on the same place toggles the controlbar
		if (UI.g && !UI.h) {
			UI.Ia();
			e.preventDefault();
			e.stopPropagation();
			UI.O();
			UI.N();
		}
		UI.g = false;
		UI.Ja(false);
	},
	Q(e) {
		if (e.type == "mousedown" && e.button != 0) return;
		const ptr = getPointerEvent(e);
		const handle = document.getElementById("noVNC_control_bar_handle");
		const bounds = handle.getBoundingClientRect();
		// Touch events have implicit capture
		if (e.type === "mousedown") {
			setCapture(handle);
		}
		UI.g = true;
		UI.h = false;
		UI.Ja(true);
		UI.i = ptr.clientY;
		UI.j = ptr.clientY - bounds.top;
		e.preventDefault();
		e.stopPropagation();
		UI.O();
		UI.N();
	},
	U() {
		if (this.classList.contains("noVNC_open")) {
			this.classList.remove("noVNC_open");
		} else {
			this.classList.add("noVNC_open");
		}
	},
	K(name, defVal) {
		// Has the user overridden the default value?
		if (name in UI.a.defaults) {
			defVal = UI.a.defaults[name];
		}
		// Check Query string followed by cookie
		let val = getConfigVar(name);
		if (val === null) {
			val = readSetting(name, defVal);
		}
		setSetting(name, val);
		UI.La(name);
		// Has the user forced a value?
		if (name in UI.a.mandatory) {
			val = UI.a.mandatory[name];
			UI.Ma(name, val);
		}
		return;
	},
	Ma(name, val) {
		setSetting(name, val);
		UI.La(name);
		UI.Ca(name);
	},
	La(name) {
		// Update the settings control
		let value = UI.E(name);
		const ctrl = document.getElementById("noVNC_setting_" + name);
		if (ctrl === null) {
			return;
		}
		if (ctrl.type === "checkbox") {
			ctrl.checked = value;
		} else if (typeof ctrl.options !== "undefined") {
			for (let i = 0; i < ctrl.options.length; i += 1) {
				if (ctrl.options[i].value === value) {
					ctrl.selectedIndex = i;
					break;
				}
			}
		} else {
			ctrl.value = value;
		}
	},
	qa(name) {
		const ctrl = document.getElementById("noVNC_setting_" + name);
		let val;
		if (ctrl.type === "checkbox") {
			val = ctrl.checked;
		} else if (typeof ctrl.options !== "undefined") {
			val = ctrl.options[ctrl.selectedIndex].value;
		} else {
			val = ctrl.value;
		}
		writeSetting(name, val);
		//Log.Debug("Setting saved '" + name + "=" + val + "'");
		return val;
	},
	E(name) {
		const ctrl = document.getElementById("noVNC_setting_" + name);
		let val = readSetting(name);
		if (typeof val !== "undefined" && val !== null && ctrl !== null && ctrl.type === "checkbox") {
			if (val.toString().toLowerCase() in {
				"0": 1,
				"no": 1,
				"false": 1
			}) {
				val = false;
			} else {
				val = true;
			}
		}
		return val;
	},
	Ca(name) {
		const ctrl = document.getElementById("noVNC_setting_" + name);
		if (ctrl !== null) {
			ctrl.disabled = true;
			if (ctrl.label !== void 0) {
				ctrl.label.classList.add("noVNC_disabled");
			}
		}
	},
	Ea(name) {
		const ctrl = document.getElementById("noVNC_setting_" + name);
		if (ctrl !== null) {
			ctrl.disabled = false;
			if (ctrl.label !== void 0) {
				ctrl.label.classList.remove("noVNC_disabled");
			}
		}
	},
	Ga() {
		UI.Na();
		UI.Oa();
		UI.Pa();
		UI.Qa();
	},
	Ra() {
		UI.Ga();
		UI.C();
		// Refresh UI elements from saved cookies
		UI.La("encrypt");
		UI.La("view_clip");
		UI.La("resize");
		UI.La("quality");
		UI.La("compression");
		UI.La("shared");
		UI.La("view_only");
		UI.La("path");
		UI.La("repeaterID");
		UI.La("logging");
		UI.La("reconnect");
		UI.La("reconnect_delay");
		document.getElementById("noVNC_settings").classList.add("noVNC_open");
		document.getElementById("noVNC_settings_button").classList.add("noVNC_selected");
	},
	Na() {
		document.getElementById("noVNC_settings").classList.remove("noVNC_open");
		document.getElementById("noVNC_settings_button").classList.remove("noVNC_selected");
	},
	sa() {
		if (document.getElementById("noVNC_settings").classList.contains("noVNC_open")) {
			UI.Na();
		} else {
			UI.Ra();
		}
	},
	Sa() {
		UI.Ga();
		UI.C();
		document.getElementById("noVNC_power").classList.add("noVNC_open");
		document.getElementById("noVNC_power_button").classList.add("noVNC_selected");
	},
	Oa() {
		document.getElementById("noVNC_power").classList.remove("noVNC_open");
		document.getElementById("noVNC_power_button").classList.remove("noVNC_selected");
	},
	ia() {
		if (document.getElementById("noVNC_power").classList.contains("noVNC_open")) {
			UI.Oa();
		} else {
			UI.Sa();
		}
	},
	Fa() {
		if (UI.b && UI.ha.capabilities.power && !UI.ha.viewOnly) {
			document.getElementById("noVNC_power_button").classList.remove("noVNC_hidden");
		} else {
			document.getElementById("noVNC_power_button").classList.add("noVNC_hidden");
			// Close power panel if open
			UI.Oa();
		}
	},
	Ta() {
		UI.Ga();
		UI.C();
		document.getElementById("noVNC_clipboard").classList.add("noVNC_open");
		document.getElementById("noVNC_clipboard_button").classList.add("noVNC_selected");
	},
	Pa() {
		document.getElementById("noVNC_clipboard").classList.remove("noVNC_open");
		document.getElementById("noVNC_clipboard_button").classList.remove("noVNC_selected");
	},
	oa() {
		if (document.getElementById("noVNC_clipboard").classList.contains("noVNC_open")) {
			UI.Pa();
		} else {
			UI.Ta();
		}
	},
	Ua(e) {
		Debug(">> UI.clipboardReceive: " + e.detail.text.substr(0, 40) + "...");
		document.getElementById("noVNC_clipboard_text").value = e.detail.text;
		Debug("<< UI.clipboardReceive");
	},
	pa() {
		const text = document.getElementById("noVNC_clipboard_text").value;
		Debug(">> UI.clipboardSend: " + text.substr(0, 40) + "...");
		UI.ha.clipboardPasteFrom(text);
		Debug("<< UI.clipboardSend");
	},
	G() {
		document.getElementById("noVNC_connect_dlg").classList.add("noVNC_open");
	},
	Va() {
		document.getElementById("noVNC_connect_dlg").classList.remove("noVNC_open");
	},
	F(__unused_87A8, password) {
		// Ignore when rfb already exists
		if (typeof UI.ha !== "undefined") {
			return;
		}
		const host = UI.E("host");
		const port = UI.E("port");
		const path = UI.E("path");
		if (typeof password === "undefined") {
			password = UI.E("password");
			UI.n = password;
		}
		if (password === null) {
			password = void 0;
		}
		UI.A();
		UI.Va();
		UI.D("b");
		let url;
		if (host) {
			url = new URL("https://" + host);
			url.protocol = UI.E("encrypt") ? "wss:" : "ws:";
			if (port) {
				url.port = port;
			}
			// "./" is needed to force URL() to interpret the path-variable as
			// a path and not as an URL. This is relevant if for example path
			// starts with more than one "/", in which case it would be
			// interpreted as a host name instead.
			url = new URL("./" + path, url);
		} else {
			// Current (May 2024) browsers support relative WebSocket
			// URLs natively, but we need to support older browsers for
			// some time.
			url = new URL(path, location.href);
			url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		}
		if (UI.E("keep_device_awake")) {
			UI.o.acquire();
		}
		try {
			UI.ha = new RFB(document.getElementById("noVNC_container"), url.href, {
				shared: UI.E("shared"),
				repeaterID: UI.E("repeaterID"),
				credentials: { password }
			});
		} catch (exc) {
			Error$1("Failed to connect to server: " + exc);
			UI.D("e");
			UI.q(_("Failed to connect to server: ") + exc, "error");
			return;
		}
		UI.ha.addEventListener("connect", UI.Wa);
		UI.ha.addEventListener("disconnect", UI.Xa);
		UI.ha.addEventListener("serververification", UI.Ya);
		UI.ha.addEventListener("credentialsrequired", UI.Za);
		UI.ha.addEventListener("securityfailure", UI.$a);
		UI.ha.addEventListener("clippingviewport", UI._a);
		UI.ha.addEventListener("capabilities", UI.Fa);
		UI.ha.addEventListener("clipboard", UI.Ua);
		UI.ha.addEventListener("bell", UI.ab);
		UI.ha.addEventListener("desktopname", UI.bb);
		UI.ha.clipViewport = UI.E("view_clip");
		UI.ha.scaleViewport = UI.E("resize") === "scale";
		UI.ha.resizeSession = UI.E("resize") === "remote";
		UI.ha.qualityLevel = parseInt(UI.E("quality"));
		UI.ha.compressionLevel = parseInt(UI.E("compression"));
		UI.ha.showDotCursor = UI.E("show_dot");
		UI.xa();
		UI.cb();
	},
	ja() {
		UI.ha.disconnect();
		UI.b = false;
		// Disable automatic reconnecting
		UI.l = true;
		UI.D("d");
		// Don't display the connection settings until we're actually disconnected
	},
	db() {
		UI.m = null;
		// if reconnect has been disabled in the meantime, do nothing.
		if (UI.l) {
			return;
		}
		UI.F(null, UI.n);
	},
	ka() {
		if (UI.m !== null) {
			clearTimeout(UI.m);
			UI.m = null;
		}
		UI.D("e");
		UI.C();
		UI.G();
	},
	Wa() {
		UI.b = true;
		UI.l = false;
		let msg;
		if (UI.E("encrypt")) {
			msg = _("Connected (encrypted) to ") + UI.c;
		} else {
			msg = _("Connected (unencrypted) to ") + UI.c;
		}
		UI.q(msg);
		UI.D("c");
		UI.eb();
		// Do this last because it can only be used on rendered elements
		UI.ha.focus();
	},
	Xa(e) {
		const wasConnected = UI.b;
		// This variable is ideally set when disconnection starts, but
		// when the disconnection isn't clean or if it is initiated by
		// the server, we need to do it here as well since
		// UI.disconnect() won't be used in those cases.
		UI.b = false;
		UI.ha = void 0;
		UI.o.release();
		if (!e.detail.clean) {
			UI.D("e");
			if (wasConnected) {
				UI.q(_("Something went wrong, connection is closed"), "error");
			} else {
				UI.q(_("Failed to connect to server"), "error");
			}
		}
		// If reconnecting is allowed process it now
		if (UI.E("reconnect") === true && !UI.l) {
			UI.D("f");
			const delay = parseInt(UI.E("reconnect_delay"));
			UI.m = setTimeout(UI.db, delay);
			return;
		} else {
			UI.D("e");
			UI.q(_("Disconnected"), "normal");
		}
		UI.eb();
		document.title = "noVNC";
		UI.C();
		UI.G();
	},
	$a(e) {
		let msg = "";
		// On security failures we might get a string with a reason
		// directly from the server. Note that we can't control if
		// this string is translated or not.
		if ("reason" in e.detail) {
			msg = _("New connection has been rejected with reason: ") + e.detail.reason;
		} else {
			msg = _("New connection has been rejected");
		}
		UI.q(msg, "error");
	},
	fb(e) {
		// Trigger a "Leave site?" warning prompt before closing the
		// page. Modern browsers (Oct 2025) accept either (or both)
		// preventDefault() or a nonempty returnValue, though the latter is
		// considered legacy. The custom string is ignored by modern browsers,
		// which display a native message, but older browsers will show it.
		e.preventDefault();
		e.returnValue = _("Are you sure you want to disconnect the session?");
	},
	eb() {
		// Remove first to avoid adding duplicates
		window.removeEventListener("beforeunload", UI.fb);
		if (!UI.ha?.viewOnly && UI.b) {
			window.addEventListener("beforeunload", UI.fb);
		}
	},
	async Ya(e) {
		const type = e.detail.type;
		if (type === "RSA") {
			const publickey = e.detail.publickey;
			let fingerprint = await window.crypto.subtle.digest("SHA-1", publickey);
			// The same fingerprint format as RealVNC
			fingerprint = Array.from(new Uint8Array(fingerprint).slice(0, 8)).map((x) => x.toString(16).padStart(2, "0")).join("-");
			document.getElementById("noVNC_verify_server_dlg").classList.add("noVNC_open");
			document.getElementById("noVNC_fingerprint").innerHTML = fingerprint;
		}
	},
	la(e) {
		e.preventDefault();
		document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
		UI.ha.approveServer();
	},
	ma(e) {
		e.preventDefault();
		document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
		UI.ja();
	},
	Za(e) {
		// FIXME: handle more types
		document.getElementById("noVNC_username_block").classList.remove("noVNC_hidden");
		document.getElementById("noVNC_password_block").classList.remove("noVNC_hidden");
		let inputFocus = "none";
		if (e.detail.types.indexOf("username") === -1) {
			document.getElementById("noVNC_username_block").classList.add("noVNC_hidden");
		} else {
			inputFocus = "noVNC_username_input";
		}
		if (e.detail.types.indexOf("password") === -1) {
			document.getElementById("noVNC_password_block").classList.add("noVNC_hidden");
		} else {
			inputFocus = inputFocus === "none" ? "noVNC_password_input" : inputFocus;
		}
		document.getElementById("noVNC_credentials_dlg").classList.add("noVNC_open");
		setTimeout(() => document.getElementById(inputFocus).focus(), 100);
		Warn("Server asked for credentials");
		UI.q(_("Credentials are required"), "warning");
	},
	na(e) {
		// Prevent actually submitting the form
		e.preventDefault();
		let inputElemUsername = document.getElementById("noVNC_username_input");
		const username = inputElemUsername.value;
		let inputElemPassword = document.getElementById("noVNC_password_input");
		const password = inputElemPassword.value;
		// Clear the input after reading the password
		inputElemPassword.value = "";
		UI.ha.sendCredentials({
			username,
			password
		});
		UI.n = password;
		document.getElementById("noVNC_credentials_dlg").classList.remove("noVNC_open");
	},
	Aa() {
		if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		} else {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (document.body.msRequestFullscreen) {
				document.body.msRequestFullscreen();
			}
		}
		UI.Ba();
	},
	Ba() {
		if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
			document.getElementById("noVNC_fullscreen_button").classList.add("noVNC_selected");
		} else {
			document.getElementById("noVNC_fullscreen_button").classList.remove("noVNC_selected");
		}
	},
	ta() {
		if (!UI.ha) return;
		UI.ha.scaleViewport = UI.E("resize") === "scale";
		UI.ha.resizeSession = UI.E("resize") === "remote";
	},
	ua() {
		if (!UI.ha) return;
		const scaling = UI.E("resize") === "scale";
		// Some platforms have overlay scrollbars that are difficult
		// to use in our case, which means we have to force panning
		// FIXME: Working scrollbars can still be annoying to use with
		//        touch, so we should ideally be able to have both
		//        panning and scrollbars at the same time
		let brokenScrollbars = false;
		if (!hasScrollbarGutter) {
			if (isIOS() || isAndroid() || isMac() || isChromeOS()) {
				brokenScrollbars = true;
			}
		}
		if (scaling) {
			// Can't be clipping if viewport is scaled to fit
			UI.Ma("view_clip", false);
			UI.ha.clipViewport = false;
		} else if (brokenScrollbars) {
			UI.Ma("view_clip", true);
			UI.ha.clipViewport = true;
		} else {
			UI.Ea("view_clip");
			UI.ha.clipViewport = UI.E("view_clip");
		}
		// Changing the viewport may change the state of
		// the dragging button
		UI._a();
	},
	P() {
		if (!UI.ha) return;
		UI.ha.dragViewport = !UI.ha.dragViewport;
		UI._a();
	},
	_a() {
		if (!UI.b) return;
		const viewDragButton = document.getElementById("noVNC_view_drag_button");
		if ((!UI.ha.clipViewport || !UI.ha.clippingViewport) && UI.ha.dragViewport) {
			// We are no longer clipping the viewport. Make sure
			// viewport drag isn't active when it can't be used.
			UI.ha.dragViewport = false;
		}
		if (UI.ha.dragViewport) {
			viewDragButton.classList.add("noVNC_selected");
		} else {
			viewDragButton.classList.remove("noVNC_selected");
		}
		if (UI.ha.clipViewport) {
			viewDragButton.classList.remove("noVNC_hidden");
		} else {
			viewDragButton.classList.add("noVNC_hidden");
		}
		viewDragButton.disabled = !UI.ha.clippingViewport;
	},
	va() {
		if (!UI.ha) return;
		UI.ha.qualityLevel = parseInt(UI.E("quality"));
	},
	wa() {
		if (!UI.ha) return;
		UI.ha.compressionLevel = parseInt(UI.E("compression"));
	},
	gb() {
		if (!isTouchDevice) return;
		const input = document.getElementById("noVNC_keyboardinput");
		if (document.activeElement == input) return;
		input.focus();
		try {
			const l = input.value.length;
			// Move the caret to the end
			input.setSelectionRange(l, l);
		} catch {}
	},
	hb() {
		if (!isTouchDevice) return;
		const input = document.getElementById("noVNC_keyboardinput");
		if (document.activeElement != input) return;
		input.blur();
	},
	V() {
		if (document.getElementById("noVNC_keyboard_button").classList.contains("noVNC_selected")) {
			UI.hb();
		} else {
			UI.gb();
		}
	},
	Z() {
		document.getElementById("noVNC_keyboard_button").classList.add("noVNC_selected");
		if (UI.ha) {
			UI.ha.focusOnClick = false;
		}
	},
	$() {
		document.getElementById("noVNC_keyboard_button").classList.remove("noVNC_selected");
		if (UI.ha) {
			UI.ha.focusOnClick = true;
		}
	},
	_(event) {
		const input = document.getElementById("noVNC_keyboardinput");
		// Only prevent focus change if the virtual keyboard is active
		if (document.activeElement != input) {
			return;
		}
		// Only allow focus to move to other elements that need
		// focus to function properly
		if (event.target.form !== void 0) {
			switch (event.target.type) {
				case "text":
				case "email":
				case "search":
				case "password":
				case "tel":
				case "url":
				case "textarea":
				case "select-one":
				case "select-multiple": return;
			}
		}
		event.preventDefault();
	},
	B() {
		const kbi = document.getElementById("noVNC_keyboardinput");
		kbi.value = new Array(100).join("_");
		UI.k = kbi.value;
	},
	X(keysym, code, down) {
		if (!UI.ha) return;
		UI.ha.sendKey(keysym, code, down);
	},
	Y(event) {
		if (!UI.ha) return;
		const newValue = event.target.value;
		if (!UI.k) {
			UI.B();
		}
		const oldValue = UI.k;
		let newLen;
		try {
			// Try to check caret position since whitespace at the end
			// will not be considered by value.length in some browsers
			newLen = Math.max(event.target.selectionStart, newValue.length);
		} catch {
			// selectionStart is undefined in Google Chrome
			newLen = newValue.length;
		}
		const oldLen = oldValue.length;
		let inputs = newLen - oldLen;
		let backspaces = inputs < 0 ? -inputs : 0;
		// Compare the old string with the new to account for
		// text-corrections or other input that modify existing text
		for (let i = 0; i < Math.min(oldLen, newLen); i++) {
			if (newValue.charAt(i) != oldValue.charAt(i)) {
				inputs = newLen - i;
				backspaces = oldLen - i;
				break;
			}
		}
		// Send the key events
		for (let i = 0; i < backspaces; i++) {
			UI.ha.sendKey(65288, "Backspace");
		}
		for (let i = newLen - inputs; i < newLen; i++) {
			UI.ha.sendKey(keysyms.a(newValue.charCodeAt(i)));
		}
		// Control the text content length in the keyboardinput element
		if (newLen > 200) {
			UI.B();
		} else if (newLen < 1) {
			// There always have to be some text in the keyboardinput
			// element with which backspace can interact.
			UI.B();
			// This sometimes causes the keyboard to disappear for a second
			// but it is required for the android keyboard to recognize that
			// text has been added to the field
			event.target.blur();
			// This has to be ran outside of the input handler in order to work
			setTimeout(event.target.focus.bind(event.target), 0);
		} else {
			UI.k = newValue;
		}
	},
	ib() {
		UI.Ga();
		UI.C();
		document.getElementById("noVNC_modifiers").classList.add("noVNC_open");
		document.getElementById("noVNC_toggle_extra_keys_button").classList.add("noVNC_selected");
	},
	Qa() {
		document.getElementById("noVNC_modifiers").classList.remove("noVNC_open");
		document.getElementById("noVNC_toggle_extra_keys_button").classList.remove("noVNC_selected");
	},
	aa() {
		if (document.getElementById("noVNC_modifiers").classList.contains("noVNC_open")) {
			UI.Qa();
		} else {
			UI.ib();
		}
	},
	fa() {
		UI.jb(65307, "Escape");
	},
	ea() {
		UI.jb(65289, "Tab");
	},
	ba() {
		const btn = document.getElementById("noVNC_toggle_ctrl_button");
		if (btn.classList.contains("noVNC_selected")) {
			UI.jb(65507, "ControlLeft", false);
			btn.classList.remove("noVNC_selected");
		} else {
			UI.jb(65507, "ControlLeft", true);
			btn.classList.add("noVNC_selected");
		}
	},
	ca() {
		const btn = document.getElementById("noVNC_toggle_windows_button");
		if (btn.classList.contains("noVNC_selected")) {
			UI.jb(65515, "MetaLeft", false);
			btn.classList.remove("noVNC_selected");
		} else {
			UI.jb(65515, "MetaLeft", true);
			btn.classList.add("noVNC_selected");
		}
	},
	da() {
		const btn = document.getElementById("noVNC_toggle_alt_button");
		if (btn.classList.contains("noVNC_selected")) {
			UI.jb(65513, "AltLeft", false);
			btn.classList.remove("noVNC_selected");
		} else {
			UI.jb(65513, "AltLeft", true);
			btn.classList.add("noVNC_selected");
		}
	},
	ga() {
		UI.ha.sendCtrlAltDel();
		// See below
		UI.ha.focus();
		UI.Ha();
	},
	jb(keysym, code, down) {
		UI.ha.sendKey(keysym, code, down);
		// Move focus to the screen in order to be able to use the
		// keyboard right after these extra keys.
		// The exception is when a virtual keyboard is used, because
		// if we focus the screen the virtual keyboard would be closed.
		// In this case we focus our special virtual keyboard input
		// element instead.
		if (document.getElementById("noVNC_keyboard_button").classList.contains("noVNC_selected")) {
			document.getElementById("noVNC_keyboardinput").focus();
		} else {
			UI.ha.focus();
		}
		// fade out the controlbar to highlight that
		// the focus has been moved to the screen
		UI.Ha();
	},
	xa() {
		if (!UI.ha) return;
		UI.ha.viewOnly = UI.E("view_only");
		UI.eb();
		// Hide input related buttons in view only mode
		if (UI.ha.viewOnly) {
			document.getElementById("noVNC_keyboard_button").classList.add("noVNC_hidden");
			document.getElementById("noVNC_toggle_extra_keys_button").classList.add("noVNC_hidden");
			document.getElementById("noVNC_clipboard_button").classList.add("noVNC_hidden");
		} else {
			document.getElementById("noVNC_keyboard_button").classList.remove("noVNC_hidden");
			document.getElementById("noVNC_toggle_extra_keys_button").classList.remove("noVNC_hidden");
			document.getElementById("noVNC_clipboard_button").classList.remove("noVNC_hidden");
		}
	},
	cb() {
		browserAsyncClipboardSupport().then((support) => {
			if (support === "unsupported") {
				// Use fallback clipboard panel
				return;
			}
			if (support === "denied" || support === "available") {
				UI.Pa();
				document.getElementById("noVNC_clipboard_button").classList.add("noVNC_hidden");
				document.getElementById("noVNC_clipboard_button").removeEventListener("click", UI.oa);
				document.getElementById("noVNC_clipboard_text").removeEventListener("change", UI.pa);
				if (UI.ha) {
					UI.ha.removeEventListener("clipboard", UI.Ua);
				}
			}
		}).catch(() => {
			// Treat as unsupported
		});
	},
	ya() {
		if (!UI.ha) return;
		UI.ha.showDotCursor = UI.E("show_dot");
	},
	L() {
		initLogging(UI.E("logging"));
	},
	bb(e) {
		UI.c = e.detail.name;
		// Display the desktop name in the document title
		document.title = e.detail.name + " - " + "noVNC";
	},
	za() {
		if (!UI.ha) return;
		if (UI.E("keep_device_awake")) {
			UI.o.acquire();
		} else {
			UI.o.release();
		}
	},
	ab() {
		if (UI.E("bell") === "on") {
			const promise = document.getElementById("noVNC_bell").play();
			// The standards disagree on the return value here
			if (promise) {
				promise.catch((e) => {
					if (!(e.name === "NotAllowedError")) {
						Error$1("Unable to play bell: " + e);
					}
				});
			}
		}
	},
	J(selectbox, text, value) {
		const optn = document.createElement("OPTION");
		optn.text = text;
		optn.value = value;
		selectbox.options.add(optn);
	}
};
UI.H({ a: {
	defaults: {},
	mandatory: {}
} });
var __unused__;
