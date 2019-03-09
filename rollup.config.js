import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: [{
    file: './dist/index.cjs.js',
    format: 'cjs'
  }, {
    file: './dist/index.esm.js',
    format: 'esm'
  }, {
    file: './easydog.js',
    format: 'umd',
    name: 'easydog'
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
