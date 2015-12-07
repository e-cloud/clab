'use strict';
var webpack = require('webpack');
var path = require('path');
var BowerWebpackPlugin = require('bower-webpack-plugin');

// Builds bundle usable inside <script>.
module.exports = {
    context: __dirname,
    entry: {
        'app': './src/app/app.js'
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "app"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        new BowerWebpackPlugin({excludes: /.*\.less/})
    ],
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    }
};
