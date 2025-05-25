const { existsSync, statSync } = require("fs");
const { remove } = require("rambdax");
require("console.table");

const moduleProto = require('module').prototype;
const originalRequire = moduleProto.require;
let allowedToRequire;

// Forbid the generated code from using require(). We are using these tools as
// bundlers, and they must bundle their dependencies.
//
// Note that Parcel fails this test when importing "lodash" with experimental
// scope hoisting enabled: https://github.com/parcel-bundler/parcel/issues/4410.
// The workaround is to disable experimental scope hoisting for that benchmark.
moduleProto.require = name => {
	if (name === allowedToRequire || name === "process") return originalRequire(name);
	throw new Error(`Attempted to require "${name}"`);
};

const expected = {
	'lodash-es': '2,4,6,8',
	'lodash': '2,4,6,8',
	'rxjs':
		'2,6,10,14,18,22,26,30,34,38,42,46,50,54,58,62,66,70,74,78,82,86,90,94,9' +
		'8,102,106,110,114,118,122,126,130,134,138,142,146,150,154,158,162,166,1' +
		'70,174,178,182,186,190,194,198,202,206,210,214,218,222,226,230,234,238,' +
		'242,246,250,254,258,262,266,270,274,278,282,286,290,294,298,302,306,310' +
		',314,318,322,326,330,334,338,342,346,350,354,358,362,366,370,374,378,38' +
		'2,386,390,394,398',
	'react-icons':
		'FaBeerM368 96h-48V56c0-13.255-10.745-24-24-24H24C10.745 32 0 42.745 0 5' +
		'6v400c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24v-42.11l80.6' +
		'06-35.977C429.396 365.063 448 336.388 448 304.86V176c0-44.112-35.888-80' +
		'-80-80zm16 208.86a16.018 16.018 0 0 1-9.479 14.611L320 343.805V160h48c8' +
		'.822 0 16 7.178 16 16v128.86zM208 384c-8.836 0-16-7.164-16-16V144c0-8.8' +
		'36 7.164-16 16-16s16 7.164 16 16v224c0 8.836-7.164 16-16 16zm-96 0c-8.8' +
		'36 0-16-7.164-16-16V144c0-8.836 7.164-16 16-16s16 7.164 16 16v224c0 8.8' +
		'36-7.164 16-16 16z',
	'remeda': '2,4,6,8',
	'ramda': '2,4,6,8',
	'ramdaBabel': '2,4,6,8',
	'rambda': '2,4,6,8',
	'rambdax': '2,4,6,8',
	'material-ui': '<div class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded">Hello</div>',
	'sentry': true
};

const bundlers = [
	'esbuild',
	'parcel',
	'rollup',
	'webpack',
	'jsshaker',
];

const sizes = [];

for (const xx in expected) {
	// Add a space between libraries
	if (sizes.length > 0) {
		sizes.push({ file: "", size: "", error: "" });
	}

	// Measure the output size from each bundler
	const xxSizes = [];
	for (const bundler of bundlers) {
		const x = `${__dirname}/${bundler}/${xx}.js`;
		const file = remove([`${__dirname}/`, ".js"], x);
		try {
			if (!existsSync(x)) throw new Error(`Missing file: ${xx}.js`);
			const { size } = statSync(x);

			// Validate that the output is actually correct
			allowedToRequire = x;
			const actual = require(x).answer;
			if (actual === expected[xx]) {
				xxSizes.push({ file, size, error: '' });
			} else {
				xxSizes.push({ file, size: Infinity, error: 'Invalid output' });
			}
		} catch (e) {
			xxSizes.push({ file, size: Infinity, error: (e && e.message || e) + '' });
		}
	}

	// Sort by output size for easier comparison
	xxSizes.sort((a, b) => a.size - b.size || (a.file > b.file) - (a.file < b.file));
	for (const { file, size, error } of xxSizes) {
		const width = 8;
		sizes.push({
			file,
			size: size === Infinity
				? '!'.repeat(width)
				: `${(size / 1024).toFixed(1)}kb`.padStart(width),
			error,
		});
	}
}

console.table(sizes);
