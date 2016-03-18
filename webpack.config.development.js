'use strict';
const webpack = require('webpack')
const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SplitByPathPlugin = require('webpack-split-by-path');

const extractCSS = new ExtractTextPlugin('static.css', {
    disable: false,
    allChunks: true
})

const extractSASS = new ExtractTextPlugin('app.css', {
    disable: false,
    allChunks: true
})

const webpackServerURL = 'http://localhost:8080';


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: [
            'babel-polyfill',
            'webpack-dev-server/client?' + webpackServerURL + '/',
            // Enable hot module reloading (HMR) for this entry point
            'webpack/hot/only-dev-server',
            './app/app.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        //pathinfo: true,
        filename: '[name].js',
        devtoolModuleFilenameTemplate: function(info){
            return "file:///"+info.absoluteResourcePath;
        }
        // chunkFilename: "[id]-[chunkHash:10].js",
        //libraryTarget: 'global'
    },
    debug: true,
    devtool: 'source-map',
    devServer: {
        // Tell the webpack dev server from where to find the files to serve.
        contentBase: path.join(__dirname, 'dist'),
        colors: true,
        publicPath: '/',
        host: '127.0.0.1',
        port: 8080,
        hot: true
    },
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
                loaders:  ['style','css?' + JSON.stringify({
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
                })]
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loaders:  ['style','css?sourceMap&autoprefixer&normalizeCharset', 'resolve-url', 'sass?sourceMap']
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
                    'file?name=[name].[ext]',
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
            __DEV__: true
        }),
        //extractCSS,
        //extractSASS,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: [/node_modules/]
        }),
        //new CopyWebpackPlugin([{ from: 'static' }]),
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
        new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                proxy: webpackServerURL
            },
            {
                reload: false
            }),
        new webpack.HotModuleReplacementPlugin()
        //new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
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
