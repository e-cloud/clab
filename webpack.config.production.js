'use strict';
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SplitByPathPlugin = require('webpack-split-by-path');

const extractCSS = new ExtractTextPlugin('[contentHash:8].css', {
    disable: false,
    allChunks: true
})

const extractSASS = new ExtractTextPlugin('[contentHash:8].css', {
    disable: false,
    allChunks: true
})


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: [
            'babel-polyfill',
            './app/app.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        pathinfo: true,
        filename: '[name]_[chunkHash:10].js',
        chunkFilename: "[id]-[chunkHash:10].js",
        //libraryTarget: 'global'
    },
    debug: false,
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
                loader: extractCSS.extract(['css?' + JSON.stringify({
                    sourceMap: true,
                    minimize: true,
                    autoprefixer: {
                        browsers: [
                            'last 2 versions',
                            '> 1%',
                            'not ie <= 8'
                        ],
                        add: true
                    },
                    normalizeCharset: true
                })])
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: extractSASS.extract(['css?sourceMap&autoprefixer&normalizeCharset', 'resolve-url', 'sass?sourceMap'])
            },
            {
                test: /index\.html$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loader: 'html?attrs=link:href img:src use:xlink:href'
            }, {
                test: /\.html$/,
                exclude: /index\.html$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                // ng-cache can be reference later
                // ngtemplate?relativeTo=${path.resolve(__dirname, 'src/')}!  inconvenient for direct usage for require
                // run on use
                loader: `html?attrs=link:href img:src use:xlink:href`
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loaders: [
                    'file?hash=sha512&digest=hex&name=[name]_[hash:8].[ext]',
                    'image-webpack?' + JSON.stringify({
                        progressive: true, // for jpg
                        optimizationLevel: 7, // for png
                        interlaced: false, // for git
                        svgo: {
                            plugins: [
                                {
                                    cleanupIDs: false,
                                }
                            ],


                        }, // for svg
                        //bypassOnDebug: true, // turn off optimization on debug
                        pngquant: { quality: '65-90', speed: 4 }
                    })
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
            //JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
            __DEV__: false
        }),
        extractCSS,
        extractSASS,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: [/node_modules/]
        }),
        new CopyWebpackPlugin([{ from: 'static' }]),
        new SplitByPathPlugin([
            {
                name: 'vendor',
                path: path.join(__dirname, 'node_modules'),
                ignore: [
                    path.join(__dirname, '/node_modules/css-loader'),
                    path.join(__dirname, '/node_modules/style-loader'),
                    /\.s?css/
                ]
            }
        ]),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
        alias: {
            'blueimp-load-image': 'blueimp-load-image/js/load-image.js'
        }
    },
    'html-minify-loader': {
        empty: true,        // KEEP empty attributes
        cdata: false,        // KEEP CDATA from scripts
        comments: false     // KEEP comments
    },
    eslint: {
        emitError: false,
        emitWarning: false,
        quiet: false,
        failOnWarning: false,
        failOnError: false
    },
    node: {
        __dirname: true
    }
}
