'use strict';
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const IndexHtmlPlugin = require('indexhtml-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')

let extractCSS = new ExtractTextPlugin('[contentHash:8].css')

let extractSASS = new ExtractTextPlugin('[contentHash:8].css', {
    disable: false,
    allChunks: true
})


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: [
            'babel-polyfill',
            './app/app.a.js'
        ],
        'index.html': './index.a.html'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        pathinfo: true,
        filename: '[name]_[chunkHash:10].js',
        chunkFilename: "[id]-[chunkHash:10].js",
    },
    debug: true,
    devtool: 'source-map',
    profile: true,
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loaders: ['ng-annotate-loader', 'babel-loader'/*, 'eslint-loader'*/]
            },
            {
                test: /\.css$/,
                loader: extractCSS.extract('style', 'css?sourceMap', 'postcss')
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: extractSASS.extract('style', ['css?sourceMap', 'postcss', 'resolve-url', 'sass?sourceMap'])
            },
            {
                test: /index\.html$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'html?attrs=link:href img:src use:xlink:href script:src'
            },
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                exclude: /index\.html$/,
                loader: 'html?attrs=link:href img:src use:xlink:href'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loaders: [
                    'file?hash=sha512&digest=hex&name=[name]_[hash:8].[ext]'
                ]
            },
            {
                test: /\.ico$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'file?name=[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        extractSASS,
        extractCSS,
        new IndexHtmlPlugin('index.html', 'index.html'),
        new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: [/node_modules/]
        })
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
        alias: {
            'blueimp-load-image': 'blueimp-load-image/js/load-image.js'
        }
    },
    node: {
        __dirname: true
    },
    eslint: {
        emitError: false,
        emitWarning: false,
        quiet: false,
        failOnWarning: false,
        failOnError: false
    },
    postcss: function () {
        return [
            require('autoprefixer')({
                browsers: [
                    'last 2 versions',
                    '> 1%',
                    'not ie <= 8'
                ],
                add: true
            }),
            require('postcss-normalize-charset')
        ]
    }
}
