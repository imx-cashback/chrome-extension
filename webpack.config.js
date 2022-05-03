const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = (env, {mode}) => ({
    mode,
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './index.js',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    devServer: {
        port: 5001,
    },
    plugins: [
        new NodePolyfillPlugin()
    ],
})