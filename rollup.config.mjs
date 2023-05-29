import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import sass from "sass";
import replace from "@rollup/plugin-replace";

const isProd = process.env.BUILD === "production";
console.log(`Building ${isProd ? 'production' : 'development'}`);

export default {
	input: "src/main.ts",
	output: {
		dir: ".",
		sourcemap: "inline",
		sourcemapExcludeSources: isProd,
		format: "cjs",
		exports: "default",
		name: "Awesome CSV File Editor (Production)",
	},
	external: ["obsidian"],
	plugins: [
		typescript(),
		nodeResolve({ browser: true }),
		commonjs(),
		scss({
			fileName: "styles.css",
			sass: sass,
		}),
		replace({
			"process.env.NODE_ENV": JSON.stringify(
				isProd ? "production" : "development"
			),
			preventAssignment: true,
		}),
	],
};
