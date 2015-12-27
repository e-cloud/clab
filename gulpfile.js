/**
 * Created by scott on 2015/12/8.
 */
'use strict'

/* -----------------------------------------------------------
 * plugins or custom libraries
 * ----------------------------------------------------------- */
require('./gulp/util')
const gulp = require('gulp')
const gUtil = require('gulp-util')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const gulpPlugins = require('gulp-load-plugins')()
const runSequence = require('run-sequence')
const del = require('del')

/* -----------------------------------------------------------
 * user data load from outside
 * ----------------------------------------------------------- */
const WEBPACK_CONFIG = require('./webpack.config.js')
const PROJECT_CONFIG = require('./project.conf.js')

/* -----------------------------------------------------------
 * custom data
 * ----------------------------------------------------------- */
const DIST_DIR = './dist/'
const MISC_PATTERN = '/**/*.{css,map,gif,jpg,png,ico,bmp,woff,woff2,xsd,wsdl,svg,mp3,wav}'
const BOWER_PATH = './bower_components'


/*
 * create a webpack's dev compiler
 */
// modify some webpack config options
let devConfig = Object.create(WEBPACK_CONFIG)
devConfig.plugins = devConfig.plugins.concat(new webpack.HotModuleReplacementPlugin())
// create a single instance of the compiler to allow caching
let devCompiler = webpack(devConfig)


/* -----------------------------------------------------------
 * tasks definition
 * ----------------------------------------------------------- */
let atomicTasks = {
    'webpack:build': function (callback) {
        // modify some webpack config options
        let buildConfig = Object.create(WEBPACK_CONFIG)
        buildConfig.plugins = buildConfig.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
        ])
        // run webpack
        webpack(buildConfig, function (err, stats) {
            if (err) throw new gUtil.PluginError('webpack:build', err)
            gUtil.log('[webpack:build]', stats.toString({
                assets: true,
                colors: true,
                version: true,
                hash: true,
                timings: true,
                chunks: false
            }))
            callback()
        })
    },
    'webpack:build-dev': {
        dep: ['build:style'],
        runner: function (callback) {
            // run webpack
            devCompiler.run(function (err, stats) {
                if (err) throw new gUtil.PluginError('webpack:build-dev', err)

                callback()
            })
        }
    },
    'webpack-dev-server': function () {
        // modify some webpack config options
        // let myDevConfig = Object.create(webpackConfig)

        // Start a webpack-dev-server
        new WebpackDevServer(devCompiler, {
            contentBase: DIST_DIR,
            //publicPath: '/',
            hot: true,
            stats: {
                assets: false,
                colors: true,
                version: false,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false
            }
        }).listen(PROJECT_CONFIG.port, 'localhost', function (err) {
            if (err) throw new gUtil.PluginError('webpack-dev-server', err)
            gUtil.log('[webpack-dev-server]', `http://localhost:${PROJECT_CONFIG.port}}/webpack-dev-server/index.html`)
        })
    },
    'static:copy': function () {
        gulp.src([BOWER_PATH + MISC_PATTERN], {base: '.'})
            .pipe(gulp.dest(DIST_DIR))

        return gulp.src(['./src/*.*', './src/**/index.html', './src/lib/*.css', './src/asset/**/*.{svg,jpg,jpeg,png,gif,mp3,mp4}'], {base: './src'})
            .pipe(gulp.dest(DIST_DIR))
    },
    'scss:build': function () {
        let styleConfig = PROJECT_CONFIG.debug ? {
            errLogToConsole: true,
            outputStyle: 'expanded'
        } : {
            outputStyle: 'compressed'
        }

        return gulp.src('src/**/*.scss', {base: 'src'})
            .pipe(gulpPlugins.sourcemaps.init())
            .pipe(gulpPlugins.sass(styleConfig))
            .pipe(gulpPlugins.sourcemaps.write('./'))
            .pipe(gulp.dest(DIST_DIR))
    },
    'css:autoPrefix': function () {
        return gulp.src(DIST_DIR + '/**/*.css', {base: DIST_DIR})
            .pipe(gulpPlugins.autoprefixer('last 10 version', '> 1%', 'ie 9'))
            .pipe(gulp.dest(DIST_DIR))
    },
    'css:minify': function () {
        return gulp.src(DIST_DIR + '/**/*.css', {base: DIST_DIR})
            .pipe(gulpPlugins.minifyCss({
                // root: distDir,
                compatibility: 'ie9'
            }))
            /*.pipe(gulpPlugins.rename({
             suffix: '.min'
             }))*/
            .pipe(gulp.dest(DIST_DIR))
    },
    // this may be deprecated cause minify has the same functionality
    'css:shorthandify': function () {
        return gulp.src('src/index.css')
            .pipe(shorthand())
            .pipe(gulp.dest('dest'))
    },
    'css:lint': function () {
        return gulp.src('client/css/*.css')
            .pipe(gulpPlugins.csslint())
            .pipe(gulpPlugins.csslint.reporter())
    },
    'image:optimize': function () {
        return gulp.src('src/images/*')
            .pipe(gulpPlugins.imagemin({
                progressive: true, // jpg
                interlaced: true, // gif
                svgoPlugins: [{removeViewBox: false}]
            }))
            .pipe(gulp.dest('dist/images'))
    },
    'build-dir:clean': function (cb) {
        del.sync([DIST_DIR + '**'])
        cb()
    },
    'version:bump': function () {
        return gulp.src('./*.json')
            .pipe(bump({type: 'minor'}))
            .pipe(gulp.dest('./'))
    },
    'complexity:check': function () {
        return gulp.src('*.js')
            .pipe(gulpPlugins.complexity({breakOnErrors: true}))
    },
    'browser:sync': function (cb) {
        PROJECT_CONFIG.browserSyncPlugin.browserSync.reload('*.css')
        cb()
    }
}

let composedTasks = {
    // The development server (the recommended option for development)
    'default': function (cb) {
        PROJECT_CONFIG.debug = true
        runSequence('webpack:build-dev', 'webpack-dev-server', 'style:watch', cb)
    },
    // Production build
    'build': function (cb) {
        PROJECT_CONFIG.debug = false
        runSequence('build-dir:clean', ['webpack:build', 'build:style'], 'css:minify', cb)
    },
    'build:style': {
        dep: ['static:copy'],
        runner: function (cb) {
            runSequence('scss:build', 'css:autoPrefix', cb)
        }
    },
    'style:watch': function () {
        return gulp.watch(['src/**/*.{scss,css}'], {
            debounceDelay: 500
        }, function () {
            runSequence('build:style', 'browser:sync')
        })
    }
}

/* -----------------------------------------------------------
 * tasks registration
 * ----------------------------------------------------------- */
gulp.createTasks(atomicTasks)
gulp.createTasks(composedTasks)

