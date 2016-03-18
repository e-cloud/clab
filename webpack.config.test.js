/**
 * Created by scott on 16-3-18.
 */
'use strict'

/*global require module __dirname*/
var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var autoprefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var precss = require('precss');

var buildPath = 'build';
var webpackServerURL = 'http://localhost:8080';

var config = {
    // The entry point for your src code.
    entry: [
        // Tell the webpack dev server about this entry point.
        'webpack-dev-server/client?' + webpackServerURL + '/',
        // Enable hot module reloading (HMR) for this entry point
        'webpack/hot/only-dev-server',
        // The location of the initial JS file.
        path.join(__dirname, 'src/app/app.js')
    ],
    // The location where your built code will be served from, either:
    // - Development: in memory from the webpack-dev-server,
    // - Build: output in the file system by webpack.
    output: {
        // The path to write the files to.
        path: path.resolve(__dirname, buildPath),
        filename: 'index.js',
    },
    // Configuration options for the Webpack Dev Server
    devServer: {
        // Tell the webpack dev server from where to find the files to serve.
        contentBase: buildPath + '/',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&modules&importLoaders=1!postcss-loader')
            },{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&modules&importLoaders=1!postcss-loader?parser=postcss-scss')
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
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, './src')
                ],
                loaders: ['ng-annotate-loader', 'babel-loader'/*, 'eslint-loader'*/]
            },{
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
        ]
    },
    postcss: function(webpack) {
        return [
            require('postcss-easy-import')({ addDependencyTo: webpack,
            extensions:['.css', '.scss', '.sass']}),
            precss,
            autoprefixer
        ];
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
        alias: {
            'blueimp-load-image': 'blueimp-load-image/js/load-image.js'
        }
    },
    plugins: [
        new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                proxy: webpackServerURL
            },
            {
                reload: false
            }),
        // Output the CSS as a single CSS file and set its name.
        new ExtractTextPlugin('styles.css', { allChunks: true }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new webpack.DefinePlugin({
            //JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
            __DEV__: true
        }),
    ]
};

module.exports = config;
