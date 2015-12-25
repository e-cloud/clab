'use strict';
let webpack = require('webpack')
let path = require('path')
let BrowserSyncPlugin = require('browser-sync-webpack-plugin')
//var BowerWebpackPlugin = require('bower-webpack-plugin')

// Builds bundle usable inside <script>.
module.exports = {
    context: __dirname,
    entry: {
        main: [
            'babel-polyfill',
            './src/app/app.js'
        ],
        'admin/main': [
            'babel-polyfill',
            './src/admin/app.js'
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd"
    },
    debug: false,
    devtool: 'source-map',
    devServer: {
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loaders: ['ng-annotate', 'babel-loader', 'eslint-loader']
            }, {
                test: /\.html/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader: 'raw!html-minify'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            // Automatically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        }),
        //new BowerWebpackPlugin({excludes: /.*\.less/})
        new BrowserSyncPlugin({
            proxy: 'localhost:9001',
            //server: { baseDir: ['dist'] }
        })
    ],
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    'html-minify-loader': {
        empty: true,        // KEEP empty attributes
        cdata: false,        // KEEP CDATA from scripts
        comments: false     // KEEP comments
    }
}
