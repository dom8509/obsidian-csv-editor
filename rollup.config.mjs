import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import sass from "sass";

export default {
	input: "src/main.ts",
	output: {
		dir: ".",
		sourcemap: "inline",
		format: "cjs",
		exports: "default",
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
	],
};
