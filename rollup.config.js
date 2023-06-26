import vue from "rollup-plugin-vue";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss'

export default [
  {
    input: "src/main.js",
    output: [
      { file: "dist/e-pages.js", format: "esm" },
      {
        file: "dist/e-pages.esm.js",
        format: "esm",
        plugins: [terser({ output: { ecma: 6 } })],
      },
    ],
    plugins: [
      postcss({
        minimize: true,
        modules: true,
        use: {
            sass: null,
            stylus: null,
            less: { javascriptEnabled: true }
        }, 
        extract: true
      }),
      vue(),
      resolve({ extensions: [".js", ".vue"] }),
      commonjs(),
      babel({
        presets: [[
          "@babel/preset-env",
        ]],
        exclude: "node_modules/**",
        plugins: [
          "@babel/external-helpers",
          // 双问号
          '@babel/plugin-proposal-nullish-coalescing-operator',
          // 可选链
          '@babel/plugin-proposal-optional-chaining'
        ],
      }),
    ],
    external: ["vue"],
  },
];
