'use strict';
var webpack = require('webpack');
var path = require('path');
//var BowerWebpackPlugin = require('bower-webpack-plugin');

// Builds bundle usable inside <script>.
module.exports = {
    context: __dirname,
    entry: [
        'babel-polyfill',
        './src/app/bootstrap.js'
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd"
    },
    debug: false,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loaders: ['ng-annotate', 'babel-loader']
            }, {
                test: /\.html/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: 'raw'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        })
        //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        //new BowerWebpackPlugin({excludes: /.*\.less/})
    ],
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    }
};
