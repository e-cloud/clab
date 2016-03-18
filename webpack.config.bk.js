'use strict';
const webpack = require('webpack')
const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
//var BowerWebpackPlugin = require('bower-webpack-plugin')

const PROJECT_CONFIG = require('./project.conf.js')

PROJECT_CONFIG.browserSyncPlugin = new BrowserSyncPlugin({
    proxy: `localhost:${PROJECT_CONFIG.port}`
    // server: { baseDir: ['dist'] }
})

// Builds bundle usable inside <script>.
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        main: [
            'babel-polyfill',
            './app/app.js'
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "[name]_[chunkHash:10].js",
        //libraryTarget: "global"
    },
    debug: true,
    devtool: 'source-map',
    devServer: {
        contentBase: 'dist/',
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
                    path.resolve(__dirname, "./src")
                ],
                loaders: ['ng-annotate-loader', 'babel-loader', 'eslint-loader']
            }, {
                test: /\.html/,
                include: [
                    path.resolve(__dirname, "./src")
                ],
                loader: 'raw!html-minify'
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                include: [
                    path.resolve(__dirname, "./src")
                ],
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash:12].[ext]',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
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
        PROJECT_CONFIG.browserSyncPlugin
    ],
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"],
        alias: {
            'blueimp-load-image': 'blueimp-load-image/js/load-image.js'
        }
    },
    'html-minify-loader': {
        empty: true,        // KEEP empty attributes
        cdata: false,        // KEEP CDATA from scripts
        comments: false     // KEEP comments
    },
    node: {
        __dirname: true
    }
}
