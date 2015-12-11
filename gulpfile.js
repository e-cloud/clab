/**
 * Created by scott on 2015/12/8.
 */
'use strict'

/* -----------------------------------------------------------
 * plugins or custom libraries
 * ----------------------------------------------------------- */
require('./gulp/util')
let gulp = require("gulp")
let gUtil = require("gulp-util")
let webpack = require("webpack")
let WebpackDevServer = require("webpack-dev-server")
let gulpPlugins = require('gulp-load-plugins')()
let runSequence = require('run-sequence')

/* -----------------------------------------------------------
 * user data load from outside
 * ----------------------------------------------------------- */
const webpackConfig = require("./webpack.config.js")

/* -----------------------------------------------------------
 * custom data
 * ----------------------------------------------------------- */
let Debug = true
let distDir = './dist/'
let miscPattern = '/**/*.{css,map,gif,jpg,png,ico,bmp,woff,woff2,xsd,wsdl,svg,mp3,wav}'
let libPath = './bower_components'

// modify some webpack config options
let myDevConfig = Object.create(webpackConfig)
myDevConfig.plugins = myDevConfig.plugins.concat([
    new webpack.DefinePlugin({
        __DEV__: 'true'
    })]
)// create a single instance of the compiler to allow caching
let devCompiler = webpack(myDevConfig)


/* -----------------------------------------------------------
 * tasks definition
 * ----------------------------------------------------------- */
let atomicTasks = {
    'webpack:build': function (callback) {
        // modify some webpack config options
        let myConfig = Object.create(webpackConfig)
        myConfig.plugins = myConfig.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
            new webpack.DefinePlugin({
                //JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
                __DEV__: 'false'
            })]
        )

        // run webpack
        webpack(myConfig, function (err, stats) {
            if (err) throw new gUtil.PluginError("webpack:build", err)
            gUtil.log("[webpack:build]", stats.toString({
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
        dep: ['static:copy', 'build:style'],
        runner: function (callback) {
            // run webpack
            devCompiler.run(function (err, stats) {
                if (err) throw new gUtil.PluginError("webpack:build-dev", err)

                callback()
            })
        }
    },
    'webpack-dev-server': function () {
        // modify some webpack config options
        //let myDevConfig = Object.create(webpackConfig)

        // Start a webpack-dev-server
        new WebpackDevServer(webpack(myDevConfig), {
            contentBase: distDir,
            publicPath: distDir,
            stats: {
                assets: false,
                colors: true,
                version: false,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false
            }
        }).listen(8080, "localhost", function (err) {
            if (err) throw new gUtil.PluginError("webpack-dev-server", err)
            gUtil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html")
        })
    },
    'static:copy': function () {
        gulp.src([libPath + miscPattern], {base: '.'})
            .pipe(gulp.dest(distDir))

        return gulp.src(['./src/*.*', './src/lib/*.css'], {base: './src'})
            .pipe(gulp.dest(distDir))
    },
    'scss:build': function () {
        let styleConfig = Debug ? {
            errLogToConsole: true,
            outputStyle: 'compact',
            sourceComments: true,
            sourceMap: true,
            outFile: './'
        } : {
            outputStyle: 'compressed',
            sourceComments: false
        }

        return gulp.src('src/**/*.scss', {base: 'src'})
            .pipe(gulpPlugins.sass(styleConfig))
            .pipe(gulp.dest(distDir))
    },
    'css:autoPrefix': function () {
        return gulp.src(distDir + '/**/*.css', {base: distDir})
            .pipe(gulpPlugins.autoprefixer('last 10 version', '> 1%', 'ie 9'))
            .pipe(gulp.dest(distDir))
    },
    'css:minify': function () {
        if (Debug) {
            return
        }

        return gulp.src(distDir + '/**/*.css', {base: distDir})
            .pipe(gulpPlugins.minifyCss({
                // root: distDir,
                sourceMap: Debug,
                compatibility: 'ie9'
            }))
            .pipe(gulp.dest(distDir))
    }
}

let composedTasks = {
    // The development server (the recommended option for development)
    'default': function (cb) {
        runSequence('build-dev', 'webpack-dev-server', cb)
    },
    // Production build
    'build': {
        dep: ['static:copy', 'build:style', "webpack:build"]
    },
    'build:style': function (cb) {
        runSequence('scss:build', 'css:autoPrefix', 'css:minify', cb)
    },

    // Build and watch cycle (another option for development)
    // Advantage: No server required, can run app from filesystem
    // Disadvantage: Requests are not blocked until bundle is available,
    //               can serve an old app on refresh
    'build-dev': {
        dep: ["webpack:build-dev"],
        runner: function () {
            gulp.watch(["src/**/*"], ['webpack:build-dev'])
        }
    }
}

/* -----------------------------------------------------------
 * tasks registration
 * ----------------------------------------------------------- */
gulp.createTasks(atomicTasks)
gulp.createTasks(composedTasks)

