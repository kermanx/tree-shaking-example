import { defineConfig } from "vite";

const libName = process.env.LIB;

export default  defineConfig({
	build: {
		rollupOptions: {
			treeshake:true
		},
		minify: true,
		lib: {
			entry: `src/${libName}.js`,
			name: libName,
			fileName: libName,
			formats: ["es"],
		},
		emptyOutDir: false,
	},
	esbuild: {
		minifyIdentifiers: false,
	}
})

// export default [
// 	{
// 		input: `src/${libName}.js`,
// 		treeshake: true,
// 		lib: [
// 			resolve({
// 				browser: true
// 			}),
// 			commonjs({
// 			}),
// 			terser({
// 				compress: {
// 					global_defs: {
// 						"process.env.NODE_ENV": "production",
// 					},
// 				},
// 				toplevel: true,
// 			}),
// 		],
// 		output: [{ file: `rollup/${libName}.js`, format: "esm" }],
// 	},
// ];
